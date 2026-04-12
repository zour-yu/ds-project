import { useEffect, useState } from "react";
import axios from "axios";
import API from "../services/api";

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctorId, setDoctorId] = useState(null);

  // 🔹 Get logged-in doctor ID (with token)
  useEffect(() => {
    API.get("/doctors/me")
      .then((res) => {
        console.log("Doctor:", res.data);
        setDoctorId(res.data._id);
      })
      .catch((err) => {
        console.error("Failed to load doctor:", err);
      });
  }, []);

  // 🔹 Fetch appointments for this doctor
  useEffect(() => {
    if (doctorId) {
      axios
        .get(`http://localhost:5002/api/appointments/doctor/${doctorId}`)
        .then((res) => {
          console.log("Appointments:", res.data);
          setAppointments(res.data);
        })
        .catch((err) => {
          console.error("Failed to load appointments:", err);
        });
    }
  }, [doctorId]);

  // 🔹 Update status
  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:5002/api/appointments/${id}/status`,
        { status }
      );

      // 🔥 Update UI without reload
      setAppointments((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, status } : a
        )
      );

    } catch (err) {
      console.error(err);
      alert("Error updating status");
    }
  };

  // 🔹 Save prescription
  const savePrescription = async (id, prescription) => {
    try {
      await axios.patch(
        `http://localhost:5002/api/appointments/${id}/prescription`,
        { prescription }
      );

      setAppointments((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, prescription } : a
        )
      );

    } catch (err) {
      console.error(err);
      alert("Error saving prescription");
    }
  };

  // 🔹 Status styling
  const getStatusStyle = (status) => {
    if (status === "approved") return "bg-green-100 text-green-600";
    if (status === "rejected") return "bg-red-100 text-red-600";
    return "bg-yellow-100 text-yellow-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">My Appointments</h1>

        {appointments.length === 0 && (
          <p className="text-gray-500">No appointments yet</p>
        )}

        <div className="space-y-5">
          {appointments.map((appt) => (
            <div
              key={appt._id}
              className="bg-white p-5 rounded-2xl shadow"
            >

              {/* 🔹 Top Row */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-lg">
                    {appt.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {appt.date} • {appt.time}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                    appt.status
                  )}`}
                >
                  {appt.status}
                </span>
              </div>

              {/* 🔹 Patient Info */}
              <div className="mt-3 text-sm text-gray-700">
                <p>Age: {appt.age}</p>
                <p className="mt-1">Symptoms: {appt.symptoms}</p>
              </div>

              {/* 🔹 Report */}
              {appt.report && (
                <a
                  href={`http://localhost:5002/uploads/${appt.report}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-3 text-blue-500 underline text-sm"
                >
                  📄 View Medical Report
                </a>
              )}

              {/* 🔹 Actions */}
              {appt.status === "pending" && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => updateStatus(appt._id, "approved")}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updateStatus(appt._id, "rejected")}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Reject
                  </button>
                </div>
              )}

              {/* 🔹 Prescription */}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">
                  Prescription
                </label>

                <textarea
                  defaultValue={appt.prescription || ""}
                  placeholder="Write prescription..."
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onBlur={(e) =>
                    savePrescription(appt._id, e.target.value)
                  }
                />
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default DoctorAppointments;