import { useEffect, useState } from "react";
import { getDoctors } from "../services/api";
import { useNavigate } from "react-router-dom";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getDoctors().then((res) => setDoctors(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Doctors</h1>

      <div className="grid grid-cols-3 gap-4">
        {doctors.map((doc) => (
          <div
            key={doc._id}
            className="p-4 border rounded-lg shadow cursor-pointer"
            onClick={() => navigate(`/doctor/${doc._id}`)}
          >
            <h2 className="text-lg font-semibold">{doc.name}</h2>
            <p>{doc.specialty}</p>
            <p>Experience: {doc.experience} years</p>
            <p>Fee: Rs. {doc.consultationFee}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Doctors;