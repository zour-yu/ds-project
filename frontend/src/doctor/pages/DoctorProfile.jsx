import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDoctorById, getDoctorAvailability } from "../services/api";
import { createAppointment } from "../services/api";

function DoctorProfile() {
  const { id } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [availability, setAvailability] = useState([]);

  const handleBook = async (time, date) => {
  try {
    await createAppointment({
      doctorId: id,
      date,
      time
    });

    alert("Appointment booked!");
  } catch (err) {
    alert("Error booking appointment");
  }
};

  useEffect(() => {
    getDoctorById(id).then((res) => setDoctor(res.data));
    getDoctorAvailability(id).then((res) =>
      setAvailability(res.data.availability)
    );
  }, [id]);

  if (!doctor) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{doctor.name}</h1>
      <p>{doctor.specialty}</p>
      <p>{doctor.hospital}</p>
      <p>{doctor.bio}</p>


      <h2 className="text-xl mt-6 font-bold">Available Slots</h2>

{availability.map((day, index) => (
  <div key={index} className="mt-4">
    <p className="font-semibold text-lg">{day.date}</p>

    <div className="flex gap-2 flex-wrap mt-2">
      {day.slots.length > 0 ? (
        day.slots.map((slot, i) => (
          <button
            key={i}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => handleBook(slot.time, day.date)}
          >
            {slot.time}
          </button>
        ))
      ) : (
        <p className="text-gray-500">No slots available</p>
      )}
    </div>
  </div>
))}
    </div>
  );
}

export default DoctorProfile;