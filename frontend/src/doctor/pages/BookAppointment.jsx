import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function BookAppointment() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { doctorId, date, time } = state || {};

  const [form, setForm] = useState({
    name: "",
    age: "",
    symptoms: "",
    file: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setForm({ ...form, file: e.target.files[0] });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const data = new FormData();
      data.append("doctorId", doctorId);
      data.append("date", date);
      data.append("time", time);
      data.append("name", form.name);
      data.append("age", form.age);
      data.append("symptoms", form.symptoms);

      if (form.file) {
        data.append("file", form.file);
      }

      await axios.post(
        "http://localhost:5002/api/appointments",
        data
      );

      alert("✅ Appointment booked successfully!");

      navigate("/");

    } catch (err) {
      console.error(err);
      alert("❌ Error booking appointment");
    } finally {
      setLoading(false);
    }
  };

  if (!state) {
    return <p className="p-6">Invalid access</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">

        {/* 🔹 Booking Summary */}
        <div className="bg-white p-6 rounded-2xl shadow mb-6">
          <h2 className="text-xl font-bold mb-2">Appointment Details</h2>

          <div className="text-gray-600 space-y-1">
            <p>📅 Date: <span className="font-medium">{date}</span></p>
            <p>⏰ Time: <span className="font-medium">{time}</span></p>
          </div>
        </div>

        {/* 🔹 Form */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">Patient Information</h2>

          {/* Name */}
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full border rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Age */}
          <input
            name="age"
            type="number"
            placeholder="Age"
            onChange={handleChange}
            className="w-full border rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Symptoms */}
          <textarea
            name="symptoms"
            placeholder="Describe your symptoms..."
            onChange={handleChange}
            rows={4}
            className="w-full border rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* File Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Upload Medical Report (optional)
            </label>

            <input
              type="file"
              onChange={handleFile}
              className="w-full border p-2 rounded-lg bg-gray-50"
            />
          </div>

          {/* Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition
              ${
                loading
                  ? "bg-gray-400"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>

          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="w-full mt-3 text-sm text-gray-500 hover:underline"
          >
            ← Go Back
          </button>
        </div>

      </div>
    </div>
  );
}

export default BookAppointment;