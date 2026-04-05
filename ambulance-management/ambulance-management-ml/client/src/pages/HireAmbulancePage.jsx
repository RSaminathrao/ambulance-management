import { useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import InputField from "../components/InputField";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import { ambulanceService } from "../services/api";

const initialState = {
  patientName: "",
  callerName: "",
  callerPhone: "",
  injuryType: "",
};

function HireAmbulancePage() {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!/^\d{10}$/.test(formData.callerPhone)) {
      toast.error("Caller phone must be 10 digits.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await ambulanceService.book(formData);
      toast.success("Ambulance request submitted. Status: Pending");
      setFormData(initialState);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Card title="Hire Ambulance" subtitle="Submit emergency request details">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <InputField
              label="Patient Name"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              required
            />
            <InputField
              label="Caller Name"
              name="callerName"
              value={formData.callerName}
              onChange={handleChange}
              required
            />
            <InputField
              label="Caller Phone Number"
              name="callerPhone"
              value={formData.callerPhone}
              onChange={handleChange}
              placeholder="10 digit phone"
              required
            />
            <InputField
              label="Type of Injury"
              name="injuryType"
              type="select"
              options={[
                "Basic Life Support",
                "Advanced Life Support",
                "Non Emergency",
              ]}
              value={formData.injuryType}
              onChange={handleChange}
              required
            />
            <div className="md:col-span-2 flex items-center justify-between">
              {loading ? <LoadingSpinner text="Submitting request..." /> : <span />}
              <Button type="submit" disabled={loading}>
                Submit Request
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default HireAmbulancePage;
