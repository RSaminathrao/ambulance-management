import { useEffect, useMemo, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import InputField from "../components/InputField";
import StatusBadge from "../components/StatusBadge";
import Table from "../components/Table";
import LoadingSpinner from "../components/LoadingSpinner";
import { driverService } from "../services/api";

function DriverOverview({ driver, earnings }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card title="Driver">
        <p className="font-semibold text-gray-800">{driver.name}</p>
        <p className="text-sm text-gray-500">{driver.ambulanceNumber}</p>
      </Card>
      <Card title="Availability">
        <StatusBadge status={driver.availabilityStatus} />
      </Card>
      <Card title="Total Earnings">
        <p className="text-2xl font-bold text-medical-700">Rs. {earnings.totalEarnings || 0}</p>
      </Card>
    </div>
  );
}

function DriverAssignedRequests({ requests }) {
  const columns = [
    { key: "patientName", label: "Patient" },
    { key: "callerName", label: "Caller" },
    { key: "callerPhone", label: "Phone" },
    { key: "injuryType", label: "Type" },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ];
  return <Table columns={columns} data={requests} />;
}

function DriverTrips({ trips, dateFilter, setDateFilter, onFilter }) {
  const columns = [
    { key: "date", label: "Date", render: (row) => new Date(row.date).toLocaleDateString() },
    { key: "ambulanceType", label: "Type" },
    { key: "earnings", label: "Earnings", render: (row) => `Rs. ${row.earnings}` },
  ];
  return (
    <div className="space-y-4">
      <Card title="Filter Trips">
        <form className="grid gap-3 md:grid-cols-3" onSubmit={onFilter}>
          <InputField
            label="Start Date"
            name="startDate"
            type="date"
            value={dateFilter.startDate}
            onChange={(event) =>
              setDateFilter((prev) => ({ ...prev, startDate: event.target.value }))
            }
          />
          <InputField
            label="End Date"
            name="endDate"
            type="date"
            value={dateFilter.endDate}
            onChange={(event) =>
              setDateFilter((prev) => ({ ...prev, endDate: event.target.value }))
            }
          />
          <div className="flex items-end">
            <Button type="submit">Apply Filter</Button>
          </div>
        </form>
      </Card>
      <Table columns={columns} data={trips} />
    </div>
  );
}

function DriverEarnings({ earnings }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card title="Total Earnings">
        <p className="text-2xl font-bold text-medical-700">Rs. {earnings.totalEarnings || 0}</p>
      </Card>
      <Card title="Total Trips">
        <p className="text-2xl font-bold text-gray-800">{earnings.totalTrips || 0}</p>
      </Card>
      <Card title="BLS">
        <p className="text-lg font-semibold text-gray-700">Rs. {earnings.pricing?.["Basic Life Support"] || 500}</p>
      </Card>
      <Card title="ALS / Non Emergency">
        <p className="text-sm text-gray-700">
          ALS: Rs. {earnings.pricing?.["Advanced Life Support"] || 1000}
          <br />
          Non Emergency: Rs. {earnings.pricing?.["Non Emergency"] || 200}
        </p>
      </Card>
    </div>
  );
}

function DriverDashboardPage() {
  const [driver, setDriver] = useState(() => JSON.parse(localStorage.getItem("driverSession") || "{}"));
  const [requests, setRequests] = useState([]);
  const [trips, setTrips] = useState([]);
  const [earnings, setEarnings] = useState({});
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" });
  const navigate = useNavigate();

  const sidebarItems = useMemo(
    () => [
      { label: "Overview", path: "/driver-dashboard" },
      { label: "Assigned Requests", path: "/driver-dashboard/requests" },
      { label: "Trip History", path: "/driver-dashboard/trips" },
      { label: "Earnings", path: "/driver-dashboard/earnings" },
    ],
    []
  );

  const loadDashboard = async (filter = {}) => {
    try {
      setLoading(true);
      const params = { driverId: driver._id, ...filter };
      const [requestResponse, tripResponse, earningResponse] = await Promise.all([
        driverService.getAssignedRequests(driver._id),
        driverService.getTrips(params),
        driverService.getEarnings(params),
      ]);
      setRequests(requestResponse.data);
      setTrips(tripResponse.data);
      setEarnings(earningResponse.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to load driver dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!driver?._id) {
      navigate("/driver-login");
      return;
    }
    loadDashboard();
  }, [driver?._id]);

  const handleToggleAvailability = async () => {
    const nextStatus = driver.availabilityStatus === "Available" ? "Offline" : "Available";
    try {
      await driverService.updateAvailability({ driverId: driver._id, availabilityStatus: nextStatus });
      const updated = { ...driver, availabilityStatus: nextStatus };
      setDriver(updated);
      localStorage.setItem("driverSession", JSON.stringify(updated));
      toast.success(`Status changed to ${nextStatus}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to update status.");
    }
  };

  const handleFilterTrips = async (event) => {
    event.preventDefault();
    await loadDashboard(dateFilter);
  };

  const handleLogout = () => {
    localStorage.removeItem("driverSession");
    navigate("/driver-login");
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Driver Dashboard</h1>
        <div className="flex gap-2">
          <Button onClick={handleToggleAvailability}>
            {driver.availabilityStatus === "Available" ? "Set Offline" : "Set Available"}
          </Button>
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {loading ? (
        <Card>
          <LoadingSpinner text="Loading driver data..." />
        </Card>
      ) : (
        <Routes>
          <Route index element={<DriverOverview driver={driver} earnings={earnings} />} />
          <Route path="requests" element={<DriverAssignedRequests requests={requests} />} />
          <Route
            path="trips"
            element={
              <DriverTrips
                trips={trips}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                onFilter={handleFilterTrips}
              />
            }
          />
          <Route path="earnings" element={<DriverEarnings earnings={earnings} />} />
        </Routes>
      )}
    </DashboardLayout>
  );
}

export default DriverDashboardPage;
