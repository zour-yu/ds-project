import { useEffect, useState } from "react";
import axios from "axios";

function DoctorProfileEdit() {
  const [doctor, setDoctor] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/doctors/me")
      .then((res) => setDoctor(res.data));
  }, []);

  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await axios.put(
      "http://localhost:5001/api/doctors/me",
      doctor
    );

    alert("Profile updated");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Edit Profile</h1>

      <input
        name="name"
        value={doctor.name || ""}
        onChange={handleChange}
        className="border p-2 mt-2 w-full"
        placeholder="Name"
      />

      <input
        name="specialty"
        value={doctor.specialty || ""}
        onChange={handleChange}
        className="border p-2 mt-2 w-full"
        placeholder="Specialty"
      />

      <input
        name="consultationFee"
        value={doctor.consultationFee || ""}
        onChange={handleChange}
        className="border p-2 mt-2 w-full"
        placeholder="Fee"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
      >
        Save
      </button>
    </div>
  );
}

export default DoctorProfileEdit;