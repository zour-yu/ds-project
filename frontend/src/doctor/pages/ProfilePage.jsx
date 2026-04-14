import { useEffect, useState } from "react";
import API from "../services/doctorApi";

export default function ProfilePage() {
  const [doctor, setDoctor] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    name: "",
    specialty: "",
    qualifications: "",
    experience: "",
    hospital: "",
    bio: "",
    consultationFee: ""
  });

  useEffect(() => {
    API.get("/doctors/me")
      .then(res => {
        setDoctor(res.data);

        setForm({
          ...res.data,
          qualifications: res.data.qualifications?.join(", ") || ""
        });
      })
      .catch(() => setDoctor(null));
  }, []);

  const handleSubmit = async () => {
  try {
    const payload = {
      ...form,
      qualifications: form.qualifications
        ? form.qualifications.split(",").map(q => q.trim())
        : [],
      experience: Number(form.experience),
      consultationFee: Number(form.consultationFee)
    };

    if (doctor) {
      await API.put("/doctors/me", payload);
      alert("Updated");
    } else {
      await API.post("/doctors/profile", payload);
      alert("Created");
    }

    setEditMode(false);
    window.location.reload();

  } catch (err) {
    console.error("ERROR:", err.response?.data || err.message);
    alert("Something went wrong");
  }
};

  const Input = ({ label, value, onChange }) => (
    <div className="mb-3">
      <label className="block text-gray-600 text-sm">{label}</label>
      <input
        className="w-full border p-2 rounded"
        value={value}
        onChange={onChange}
      />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Doctor Profile</h2>

      {!editMode ? (
        <>
          <p><b>Name:</b> {doctor?.name}</p>
          <p><b>Specialty:</b> {doctor?.specialty}</p>
          <p><b>Qualifications:</b> {doctor?.qualifications?.join(", ")}</p>
          <p><b>Experience:</b> {doctor?.experience} years</p>
          <p><b>Hospital:</b> {doctor?.hospital}</p>
          <p><b>Fee:</b> Rs. {doctor?.consultationFee}</p>
          <p className="mt-2 text-gray-600">{doctor?.bio}</p>

          <button
            onClick={() => setEditMode(true)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        </>
      ) : (
        <>
          {/* EDIT MODE */}
<>
  <div className="mb-3">
    <label>Name</label>
    <input
      className="w-full border p-2 rounded"
      value={form.name || ""}
      onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
    />
  </div>

  <div className="mb-3">
    <label>Specialty</label>
    <input
      className="w-full border p-2 rounded"
      value={form.specialty || ""}
      onChange={e => setForm(prev => ({ ...prev, specialty: e.target.value }))}
    />
  </div>

  <div className="mb-3">
    <label>Qualifications</label>
    <input
      className="w-full border p-2 rounded"
      value={form.qualifications || ""}
      onChange={e => setForm(prev => ({ ...prev, qualifications: e.target.value }))}
    />
  </div>

  <div className="mb-3">
    <label>Experience</label>
    <input
      className="w-full border p-2 rounded"
      value={form.experience || ""}
      onChange={e => setForm(prev => ({ ...prev, experience: e.target.value }))}
    />
  </div>

  <div className="mb-3">
    <label>Hospital</label>
    <input
      className="w-full border p-2 rounded"
      value={form.hospital || ""}
      onChange={e => setForm(prev => ({ ...prev, hospital: e.target.value }))}
    />
  </div>

  <div className="mb-3">
    <label>Consultation Fee</label>
    <input
      className="w-full border p-2 rounded"
      value={form.consultationFee || ""}
      onChange={e => setForm(prev => ({ ...prev, consultationFee: e.target.value }))}
    />
  </div>

  <div className="mb-3">
    <label>Bio</label>
    <textarea
      className="w-full border p-2 rounded"
      value={form.bio || ""}
      onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
    />
  </div>

  <button
    onClick={handleSubmit}
    className="bg-green-500 text-white px-4 py-2 rounded"
  >
    Save Changes
  </button>
</>
        </>
      )}
    </div>
  );
}