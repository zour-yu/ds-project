import { useEffect, useState } from "react";
import API from "../services/doctorApi";
import { useParams, useNavigate } from "react-router-dom";

export default function DoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    API.get(`/doctors/${id}`).then(res => setDoctor(res.data));

    API.get(`/doctors/${id}/availability`)
      .then(res => setAvailability(res.data.availability));
  }, [id]);

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* PROFILE CARD */}
      <div className="bg-white p-6 rounded-xl shadow mb-6 flex gap-6">
        
        <img
          src={doctor?.profilePicture || "https://via.placeholder.com/120"}
          className="w-32 h-32 rounded-full"
        />

        <div>
          <h2 className="text-2xl font-bold">{doctor?.name}</h2>
          <p className="text-blue-600">{doctor?.specialty}</p>

          <p className="mt-2 text-gray-600">
            {doctor?.qualifications?.join(", ")}
          </p>

          <p className="mt-1">
            🏥 {doctor?.hospital}
          </p>

          <p className="mt-1">
            ⏳ {doctor?.experience} years experience
          </p>

          <p className="mt-1 font-bold">
            💰 Rs. {doctor?.consultationFee}
          </p>
        </div>
      </div>

      {/* BIO */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-bold mb-2">About Doctor</h3>
        <p className="text-gray-600">{doctor?.bio}</p>
      </div>

      {/* AVAILABILITY */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-4">Available Slots</h3>

        {availability.map(day => (
          <div key={day.date} className="mb-4">

            <h4 className="font-semibold text-gray-700">{day.date}</h4>

            <div className="flex flex-wrap gap-2 mt-2">
              {day.slots.map(slot => (
                <button
                  key={slot.time}
                  disabled={slot.isBooked}
                  onClick={() =>
                    navigate(`/book/${id}`, {
                      state: { date: day.date, time: slot.time }
                    })
                  }
                  className={`px-3 py-1 rounded ${
                    slot.isBooked
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-green-200 hover:bg-green-300"
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
  );
}