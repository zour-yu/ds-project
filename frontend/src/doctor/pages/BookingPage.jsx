import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../services/doctorApi";

export default function BookingPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    age: "",
    symptoms: ""
  });

  const [file, setFile] = useState(null);

  const handleSubmit = async () => {
    try {
      const data = new FormData();

      data.append("doctorId", id);
      data.append("date", state?.date);
      data.append("time", state?.time);
      data.append("name", form.name);
      data.append("age", form.age);
      data.append("symptoms", form.symptoms);

      if (file) data.append("file", file);

      // 1️⃣ Create appointment
      const res = await API.post(
        `${import.meta.env.VITE_APPOINTMENT_API}/appointments`,
        data
      );

      const appointmentId = res.data._id;

      // 2️⃣ Redirect to payment page
      navigate("/payment", {
        state: {
          appointmentId: appointmentId,
          amount: 2000
        }
      });

    } catch (err) {
      console.error(err);
      alert("Booking failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="bg-white w-full max-w-xl rounded-2xl shadow-lg p-6">

        <h2 className="text-2xl font-bold text-center mb-4">
          Book Appointment
        </h2>

        <div className="bg-blue-50 p-4 rounded-lg text-center mb-6">
          <p className="text-gray-700">
            📅 <b>{state?.date}</b>
          </p>
          <p className="text-gray-700">
            ⏰ <b>{state?.time}</b>
          </p>
        </div>

        <div className="space-y-4">

          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Enter your name"
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Age</label>
            <input
              type="number"
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Enter your age"
              onChange={e => setForm({ ...form, age: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Symptoms</label>
            <textarea
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Describe your symptoms..."
              rows={3}
              onChange={e => setForm({ ...form, symptoms: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Upload Medical Report (optional)
            </label>

            <input
              type="file"
              className="w-full mt-1"
              onChange={e => setFile(e.target.files[0])}
            />
          </div>

        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-6 bg-blue-500 text-white py-3 rounded-lg 
                     hover:bg-blue-600 transition font-semibold"
        >
          Confirm Booking
        </button>

      </div>
    </div>
  );
}