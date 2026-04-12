import { useEffect, useState } from "react";
import API from "../services/api";

function DoctorProfileEdit() {
  const [doctor, setDoctor] = useState(null);

  // 🔹 Load profile
  useEffect(() => {
    API.get("/doctors/me")
      .then((res) => setDoctor(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to load profile");
      });
  }, []);

  // 🔹 Handle input change
  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  // 🔹 Submit update
  const handleSubmit = async () => {
    try {
      await API.put("/doctors/me", doctor);

      alert("✅ Profile updated");

    } catch (err) {
      console.error(err);
      alert("❌ Failed to update profile");
    }
  };

  // 🔹 Prevent crash
  if (!doctor) {
    return <p className="p-6">Loading profile...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow">

        <h1 className="text-xl font-bold mb-4">Edit Profile</h1>

        <input
          name="name"
          value={doctor.name || ""}
          onChange={handleChange}
          placeholder="Name"
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          name="specialty"
          value={doctor.specialty || ""}
          onChange={handleChange}
          placeholder="Specialty"
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          name="hospital"
          value={doctor.hospital || ""}
          onChange={handleChange}
          placeholder="Hospital"
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          name="experience"
          value={doctor.experience || ""}
          onChange={handleChange}
          placeholder="Experience"
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          name="consultationFee"
          value={doctor.consultationFee || ""}
          onChange={handleChange}
          placeholder="Consultation Fee"
          className="w-full border p-2 mb-3 rounded"
        />

        <textarea
          name="bio"
          value={doctor.bio || ""}
          onChange={handleChange}
          placeholder="Bio"
          className="w-full border p-2 mb-3 rounded"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Save Changes
        </button>

      </div>
    </div>
  );
}

export default DoctorProfileEdit;