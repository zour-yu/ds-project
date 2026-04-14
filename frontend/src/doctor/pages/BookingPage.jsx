import { useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import API from "../services/doctorApi";

export default function BookingPage() {
  const { id } = useParams();
  const { state } = useLocation();

  const [form, setForm] = useState({
    name: "",
    age: "",
    symptoms: ""
  });

  const [file, setFile] = useState(null);

  const handleSubmit = async () => {
    const data = new FormData();

    data.append("doctorId", id);
    data.append("date", state.date);
    data.append("time", state.time);
    data.append("name", form.name);
    data.append("age", form.age);
    data.append("symptoms", form.symptoms);

    if (file) data.append("file", file);

    await API.post(`${import.meta.env.VITE_APPOINTMENT_API}/appointments`, data);

    alert("Appointment booked!");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        Booking for {state.date} at {state.time}
      </h2>

      <input placeholder="Name"
        className="block border p-2 my-2"
        onChange={e => setForm({...form, name: e.target.value})}
      />

      <input placeholder="Age"
        className="block border p-2 my-2"
        onChange={e => setForm({...form, age: e.target.value})}
      />

      <textarea placeholder="Symptoms"
        className="block border p-2 my-2"
        onChange={e => setForm({...form, symptoms: e.target.value})}
      />

      <input type="file"
        className="my-2"
        onChange={e => setFile(e.target.files[0])}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Book Appointment
      </button>
    </div>
  );
}