import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/doctors/${id}`)
      .then((res) => setDoctor(res.data));

    axios
      .get(`http://localhost:5001/api/doctors/${id}/availability`)
      .then((res) => setAvailability(res.data.availability));
  }, [id]);

  const handleBook = (time, date) => {
    navigate("/book", {
      state: { doctorId: id, time, date },
    });
  };

  if (!doctor) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* 🔹 Doctor Header */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row gap-6">
          
          {/* Avatar */}
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-3xl font-bold text-blue-600">
            {doctor.name?.charAt(0)}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{doctor.name}</h1>
            <p className="text-gray-500">{doctor.specialty}</p>

            <div className="mt-3 text-sm text-gray-600 space-y-1">
              <p>🏥 {doctor.hospital}</p>
              <p>💼 {doctor.experience} years experience</p>
              <p>📄 {doctor.qualifications?.join(", ")}</p>
            </div>

            <p className="mt-4 text-gray-700">{doctor.bio}</p>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-lg font-semibold text-blue-600">
                Rs. {doctor.consultationFee}
              </p>

              <button
                onClick={() => navigate("/")}
                className="text-sm text-gray-500 hover:underline"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>

        {/* 🔹 Availability Section */}
        <div className="mt-8 bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Available Slots</h2>

          {availability.length === 0 && (
            <p className="text-gray-500">No availability set</p>
          )}

          <div className="space-y-6">
            {availability.map((day, index) => (
              <div key={index}>
                
                {/* Date */}
                <p className="font-semibold text-lg text-gray-700">
                  {day.date}
                </p>

                {/* Slots */}
                <div className="flex flex-wrap gap-3 mt-3">
                  {day.slots.map((slot, i) => (
                    <button
                      key={i}
                      disabled={slot.isBooked}
                      onClick={() => handleBook(slot.time, day.date)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition
                        ${
                          slot.isBooked
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600 shadow"
                        }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default DoctorProfile;