import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import InputField from "../components/InputField";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import { driverService } from "../services/api";

const initialState = {
  name: "",
  licenseNumber: "",
  phone: "",
  ambulanceNumber: "",
  ambulanceType: "",
  password: "",
};

function DriverRegistrationPage() {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Phone number must be 10 digits.");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password should be at least 6 characters.");
      return;
    }
    try {
      setLoading(true);
      await driverService.register(formData);
      toast.success("Driver registration successful.");
      setFormData(initialState);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Card title="Driver Registration">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <InputField label="Driver Name" name="name" value={formData.name} onChange={handleChange} required />
            <InputField
              label="License Number"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              required
            />
            <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
            <InputField
              label="Ambulance Number"
              name="ambulanceNumber"
              value={formData.ambulanceNumber}
              onChange={handleChange}
              required
            />
            <InputField
              label="Ambulance Type"
              name="ambulanceType"
              type="select"
              options={["Basic Life Support", "Advanced Life Support", "Non Emergency"]}
              value={formData.ambulanceType}
              onChange={handleChange}
              required
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <div className="md:col-span-2 flex items-center justify-between">
              <Link to="/driver-login" className="text-sm text-medical-700 hover:underline">
                Already registered? Login
              </Link>
              <Button type="submit" disabled={loading}>
                Register Driver
              </Button>
            </div>
            {loading && (
              <div className="md:col-span-2">
                <LoadingSpinner text="Registering driver..." />
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
}

export default DriverRegistrationPage;
