import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDoctorById, getDoctorAvailability } from "../services/api";

function DoctorProfile() {
  const { id } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [availability, setAvailability] = useState([]);

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

      <h2 className="text-xl mt-6">Availability</h2>

      {availability.map((day, index) => (
        <div key={index} className="mt-2">
          <p className="font-semibold">{day.date}</p>

          <div className="flex gap-2 flex-wrap">
            {day.slots.map((slot, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-green-200 rounded"
              >
                {slot.time}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default DoctorProfile;