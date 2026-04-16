import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-blue-600 text-white p-5">
      <h2 className="text-2xl font-bold mb-6">Doctor Panel</h2>

      <nav className="flex flex-col gap-4">
        <Link to="/doctor-dashboard/profile" className="hover:underline">
          Profile
        </Link>

        <Link to="/doctor-dashboard/availability" className="hover:underline">
          Availability
        </Link>
        <Link to="/doctor-dashboard/appointments" className="hover:underline">
          Appointments
        </Link>
      </nav>
    </div>
  );
}