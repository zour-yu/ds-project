import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function DoctorDashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}