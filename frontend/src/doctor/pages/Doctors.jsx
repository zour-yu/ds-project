import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/doctors")
      .then((res) => setDoctors(res.data));
  }, []);

  // 🔍 Filter doctors
  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* 🔹 Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Find a Doctor</h1>
          <p className="text-gray-500 mt-1">
            Book appointments with trusted healthcare professionals
          </p>
        </div>

        {/* 🔹 Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* 🔹 Doctors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc._id}
              onClick={() => navigate(`/doctor/${doc._id}`)}
              className="bg-white p-5 rounded-2xl shadow hover:shadow-xl transition cursor-pointer"
            >
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-600">
                  {doc.name?.charAt(0)}
                </div>

                <div>
                  <h2 className="font-semibold text-lg">{doc.name}</h2>
                  <p className="text-sm text-gray-500">
                    {doc.specialty}
                  </p>
                </div>
              </div>

              {/* Info */}
              <div className="mt-4 text-sm text-gray-600 space-y-1">
                <p>🏥 {doc.hospital}</p>
                <p>💼 {doc.experience} years experience</p>
              </div>

              {/* Fee */}
              <div className="mt-4 flex justify-between items-center">
                <p className="font-semibold text-blue-600 text-lg">
                  Rs. {doc.consultationFee}
                </p>

                <button className="text-sm bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 🔹 Empty State */}
        {filteredDoctors.length === 0 && (
          <div className="text-center mt-10 text-gray-500">
            No doctors found
          </div>
        )}

      </div>
    </div>
  );
}

export default Doctors;