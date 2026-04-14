import { useEffect, useState } from "react";
import API from "../services/doctorApi";
import { useNavigate } from "react-router-dom";

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/doctors").then(res => setDoctors(res.data));
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {doctors.map(doc => (
        <div
          key={doc._id}
          onClick={() => navigate(`/doctor/${doc._id}`)}
          className="bg-white shadow-lg rounded-2xl p-5 cursor-pointer hover:scale-105 transition"
        >
          <img
            src={doc.profilePicture || "https://via.placeholder.com/150"}
            className="w-24 h-24 rounded-full mx-auto"
          />

          <h3 className="text-xl font-bold text-center mt-3">
            {doc.name}
          </h3>

          <p className="text-center text-gray-500">
            {doc.specialty}
          </p>

          <p className="text-center mt-2">
            💰 {doc.consultationFee || "N/A"}
          </p>
        </div>
      ))}
    </div>
  );
}