import { useEffect, useState } from "react";
import API from "../services/doctorApi";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);

  const fetchData = async () => {
    try {
      // 🔥 Step 1: get logged-in doctor
      const docRes = await API.get("/me");

      const doctorId = docRes.data._id; // ✅ Mongo ID

      // 🔥 Step 2: fetch appointments
      const res = await API.get(
       `${import.meta.env.VITE_APPOINTMENT_API}/appointments/doctor/${doctorId}`
      );

      setAppointments(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.patch(
        `${import.meta.env.VITE_APPOINTMENT_API}/appointments/${id}/status`,
        { status }
      );
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || err.message || "Failed to update appointment status");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Appointments</h2>

      {appointments.length === 0 && (
        <p>No appointments yet</p>
      )}

      {appointments.map(a => (
        <div key={a._id} className="bg-white p-4 rounded shadow mb-4">

          <p><b>{a.name}</b> ({a.age})</p>
          <p>{a.date} - {a.time}</p>
          <p>{a.symptoms}</p>

          {a.report && (
            <a
              href={`${import.meta.env.VITE_APPOINTMENT_API.replace(/\/api$/, "")}/uploads/${a.report}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500"
            >
              View Report
            </a>
          )}

          <p>Status: {a.status}</p>

          <div className="mt-2">
            <button
              onClick={() => updateStatus(a._id, "CONFIRMED")}
              className="bg-green-500 text-white px-3 py-1 mr-2"
            >
              Approve
            </button>

            <button
              onClick={() => updateStatus(a._id, "REJECTED")}
              className="bg-red-500 text-white px-3 py-1"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}