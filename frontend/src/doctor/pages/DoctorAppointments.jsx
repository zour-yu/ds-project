import { useEffect, useState } from "react";
import axios from "axios";

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctorId, setDoctorId] = useState(null);

  // 1. get doctor profile
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/doctors/me")
      .then((res) => {
        setDoctorId(res.data._id);
      });
  }, []);

  // 2. fetch appointments AFTER doctorId is ready
  useEffect(() => {
    if (doctorId) {
      axios
        .get(`http://localhost:5002/api/appointments/doctor/${doctorId}`)
        .then((res) => setAppointments(res.data));
    }
  }, [doctorId]);

  const updateStatus = async (id, status) => {
    await axios.patch(
      `http://localhost:5002/api/appointments/${id}/status`,
      { status }
    );

    // reload
    window.location.reload();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">My Appointments</h1>

      {appointments.length === 0 && <p>No appointments yet</p>}

      {appointments.map((appt) => (
        <div key={appt._id} className="border p-4 mt-4 rounded">
          <p>Date: {appt.date}</p>
          <p>Time: {appt.time}</p>
          <p>Status: {appt.status}</p>

          {appt.status === "pending" && (
            <div className="flex gap-2 mt-2">
              <button
                className="bg-green-500 text-white px-3 py-1 rounded"
                onClick={() => updateStatus(appt._id, "approved")}
              >
                Approve
              </button>

              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => updateStatus(appt._id, "rejected")}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default DoctorAppointments;