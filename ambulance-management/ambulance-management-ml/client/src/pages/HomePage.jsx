import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import Button from "../components/Button";

function HomePage() {
  return (
    <div className="page-shell">
      <Navbar />
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-2 inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-medical-700">
            Emergency Response Platform
          </p>
          <h1 className="text-4xl font-bold leading-tight text-gray-800">
            Ambulance Management System for Faster Life-Saving Dispatch
          </h1>
          <p className="mt-4 text-gray-600">
            Book emergency support, track assigned ambulances in real time, and
            streamline admin-driver coordination.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/hire-ambulance">
              <Button>Hire Ambulance</Button>
            </Link>
            <Link to="/track-ambulance">
              <Button variant="secondary">Track Ambulance</Button>
            </Link>
          </div>
        </div>
        <Card className="bg-gradient-to-br from-medical-600 to-medical-700 text-white border-0">
          <h2 className="text-2xl font-bold">Quick Access</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link to="/driver-register" className="rounded-xl bg-white/20 p-4 hover:bg-white/30">
              Driver Registration
            </Link>
            <Link to="/driver-login" className="rounded-xl bg-white/20 p-4 hover:bg-white/30">
              Driver Login
            </Link>
            <Link to="/admin-login" className="rounded-xl bg-white/20 p-4 hover:bg-white/30 sm:col-span-2">
              Admin Login
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}

export default HomePage;
