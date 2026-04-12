import { useState } from "react";
import { registerDoctor } from "../services/auth";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    specialty: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      await registerDoctor(form);

      alert("✅ Registration successful! Please login.");

      navigate("/doctor/login");
    } catch (err) {
      console.error(err);
      alert("❌ Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-2xl shadow w-96">

        <h2 className="text-xl font-bold mb-4">Doctor Register</h2>

        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          name="specialty"
          placeholder="Specialty"
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />

        <button
          onClick={handleRegister}
          className="w-full bg-green-500 text-white py-2 rounded"
        >
          Register
        </button>

      </div>
    </div>
  );
}

export default Register;