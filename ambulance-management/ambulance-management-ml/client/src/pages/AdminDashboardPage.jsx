import { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import Table from "../components/Table";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import { adminService } from "../services/api";

function AdminOverview({ requests, drivers }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card title="Total Requests">
        <p className="text-2xl font-bold text-medical-700">{requests.length}</p>
      </Card>
      <Card title="Pending Requests">
        <p className="text-2xl font-bold text-yellow-700">
          {requests.filter((request) => request.status === "Pending").length}
        </p>
      </Card>
      <Card title="Available Drivers">
        <p className="text-2xl font-bold text-green-700">{drivers.length}</p>
      </Card>
    </div>
  );
}

function AdminRequests({ requests }) {
  const columns = [
    { key: "patientName", label: "Patient" },
    { key: "callerName", label: "Caller" },
    { key: "callerPhone", label: "Phone" },
    { key: "injuryType", label: "Type" },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];
  return <Table columns={columns} data={requests} />;
}

function AdminDrivers({ drivers }) {
  const columns = [
    { key: "name", label: "Driver Name" },
    { key: "phone", label: "Phone" },
    { key: "ambulanceNumber", label: "Ambulance Number" },
    { key: "ambulanceType", label: "Ambulance Type" },
    {
      key: "availabilityStatus",
      label: "Availability",
      render: (row) => <StatusBadge status={row.availabilityStatus} />,
    },
  ];
  return <Table columns={columns} data={drivers} />;
}

function AdminAssignments({ requests, drivers, onAssign }) {
  const pendingRequests = requests.filter((request) => request.status === "Pending");

  const columns = [
    { key: "patientName", label: "Patient" },
    { key: "callerName", label: "Caller" },
    { key: "injuryType", label: "Required Type" },
    {
      key: "matchedDriverCount",
      label: "Matching Drivers",
      render: (row) =>
        drivers.filter((driver) => driver.ambulanceType === row.injuryType).length,
    },
  ];

  return (
    <Table
      columns={columns}
      data={pendingRequests}
      renderActions={(row) => {
        const matchedDrivers = drivers.filter(
          (driver) => driver.ambulanceType === row.injuryType
        );
        if (matchedDrivers.length === 0) {
          return <span className="text-xs text-gray-500">No matching driver</span>;
        }
        return (
          <div className="flex flex-wrap gap-2">
            {matchedDrivers.map((driver) => (
              <Button
                key={driver._id}
                className="px-2 py-1 text-xs"
                onClick={() => onAssign(row._id, driver._id)}
              >
                Assign {driver.name}
              </Button>
            ))}
          </div>
        );
      }}
    />
  );
}

function AdminDashboardPage() {
  const [requests, setRequests] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const sidebarItems = useMemo(
    () => [
      { label: "Overview", path: "/admin-dashboard" },
      { label: "Requests", path: "/admin-dashboard/requests" },
      { label: "Available Drivers", path: "/admin-dashboard/drivers" },
      { label: "Assign Driver", path: "/admin-dashboard/assignments" },
    ],
    []
  );

  const loadData = async () => {
    try {
      setLoading(true);
      const [requestResponse, driverResponse] = await Promise.all([
        adminService.getRequests(),
        adminService.getAvailableDrivers(),
      ]);
      setRequests(requestResponse.data);
      setDrivers(driverResponse.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to load admin dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssign = async (requestId, driverId) => {
    try {
      await adminService.assignDriver({ requestId, driverId });
      toast.success("Driver assigned successfully.");
      await loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Assignment failed.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminSession");
    navigate("/admin-login");
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Link to="/admin-dashboard/assignments">
            <Button variant="secondary">Go to Assignments</Button>
          </Link>
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
      {loading ? (
        <Card>
          <LoadingSpinner text="Loading dashboard data..." />
        </Card>
      ) : (
        <Routes>
          <Route index element={<AdminOverview requests={requests} drivers={drivers} />} />
          <Route path="requests" element={<AdminRequests requests={requests} />} />
          <Route path="drivers" element={<AdminDrivers drivers={drivers} />} />
          <Route
            path="assignments"
            element={<AdminAssignments requests={requests} drivers={drivers} onAssign={handleAssign} />}
          />
        </Routes>
      )}
    </DashboardLayout>
  );
}

export default AdminDashboardPage;
