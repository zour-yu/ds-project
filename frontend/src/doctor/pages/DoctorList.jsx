import { useEffect, useState } from "react";
import API from "../services/doctorApi";
import { useNavigate } from "react-router-dom";

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/doctors")
      .then(res => {
        if (Array.isArray(res.data)) {
          setDoctors(res.data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      
      <h1 className="text-3xl font-bold text-center mb-8">
        Find Your Doctor
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        {doctors.map(doc => (
          <div
            key={doc._id}
            onClick={() => navigate(`/doctor/${doc._id}`)}
            className="bg-white rounded-2xl shadow-md p-6 cursor-pointer 
                       hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* Profile Image */}
            <div className="flex justify-center">
              <img
                src="https://img.freepik.com/premium-vector/user-profile-icon-circle_1256048-12499.jpg?semt=ais_hybrid&w=740&q=80"
                alt="doctor"
                className="w-24 h-24 rounded-full border-4 border-blue-100"
              />
            </div>

            {/* Info */}
            <div className="text-center mt-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {doc.name || "Doctor Name"}
              </h2>

              <p className="text-blue-500 text-sm mt-1">
                {doc.specialty || "General"}
              </p>

              <p className="text-gray-500 text-sm mt-2">
                {doc.hospital || "Hospital"}
              </p>

              <p className="text-gray-600 text-sm mt-1">
                {doc.experience || 0} years experience
              </p>

              <p className="mt-3 font-bold text-green-600">
                Rs. {doc.consultationFee || "N/A"}
              </p>
            </div>

            {/* Button */}
            <div className="mt-4">
              <button
                className="w-full bg-blue-500 text-white py-2 rounded-lg 
                           hover:bg-blue-600 transition"
              >
                View Profile
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
