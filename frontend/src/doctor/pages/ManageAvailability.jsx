import { useEffect, useState } from "react";
import axios from "axios";

function ManageAvailability() {
  const [doctor, setDoctor] = useState(null);
  const [editData, setEditData] = useState({});
  const [newDay, setNewDay] = useState({
  date: "",
  startTime: "",
  endTime: "",
  slotDuration: 30,
});

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/doctors/me")
      .then((res) => setDoctor(res.data));
  }, []);

  const addNewDay = async () => {
  try {
    await axios.post(
      "http://localhost:5001/api/doctors/availability",
      {
        ...newDay,
      }
    );

    alert("New availability added!");

    window.location.reload();
  } catch (err) {
    console.error(err);
    alert("Error adding availability");
  }
};

  const deleteDay = async (date) => {
    await axios.delete("http://localhost:5001/api/doctors/availability", {
      data: { doctorId: doctor._id, date },
    });

    window.location.reload();
  };

  const updateDay = async (date) => {
    await axios.patch(
      "http://localhost:5001/api/doctors/availability/update",
      {
        doctorId: doctor._id,
        date,
        ...editData,
      }
    );

    window.location.reload();
  };

  if (!doctor) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* 🔹 Header */}
        <h1 className="text-3xl font-bold mb-6">
          Manage Availability
        </h1>

        {/* 🔹 Add New Availability */}
<div className="bg-white p-6 rounded-2xl shadow mb-6">
  <h2 className="text-lg font-semibold mb-4">
    ➕ Add New Availability
  </h2>

  <div className="flex flex-wrap gap-3 items-center">

    <input
      type="date"
      onChange={(e) =>
        setNewDay({ ...newDay, date: e.target.value })
      }
      className="border p-2 rounded-lg"
    />

    <input
      type="time"
      onChange={(e) =>
        setNewDay({ ...newDay, startTime: e.target.value })
      }
      className="border p-2 rounded-lg"
    />

    <input
      type="time"
      onChange={(e) =>
        setNewDay({ ...newDay, endTime: e.target.value })
      }
      className="border p-2 rounded-lg"
    />

    <input
      type="number"
      placeholder="Slot (mins)"
      defaultValue={30}
      onChange={(e) =>
        setNewDay({
          ...newDay,
          slotDuration: e.target.value,
        })
      }
      className="border p-2 rounded-lg w-28"
    />

    <button
      onClick={addNewDay}
      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
    >
      Add
    </button>
  </div>
</div>

        {doctor.availability.length === 0 && (
          <p className="text-gray-500">No availability added</p>
        )}

        <div className="space-y-6">
          {doctor.availability.map((day, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow"
            >

              {/* 🔹 Date */}
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  📅 {day.date}
                </h2>

                <button
                  onClick={() => deleteDay(day.date)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Remove Day
                </button>
              </div>

              {/* 🔹 Slots */}
              <div className="flex flex-wrap gap-2 mt-4">
                {day.slots.map((slot, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1 rounded-lg text-sm
                      ${
                        slot.isBooked
                          ? "bg-gray-300 text-gray-500"
                          : "bg-green-100 text-green-700"
                      }`}
                  >
                    {slot.time}
                  </span>
                ))}
              </div>

              {/* 🔹 Edit Section */}
              <div className="mt-5 border-t pt-4">

                <p className="text-sm font-medium mb-2">
                  Update Time Range
                </p>

                <div className="flex flex-wrap gap-3 items-center">

                  <input
                    type="time"
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        startTime: e.target.value,
                      })
                    }
                    className="border p-2 rounded-lg"
                  />

                  <input
                    type="time"
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        endTime: e.target.value,
                      })
                    }
                    className="border p-2 rounded-lg"
                  />

                  <button
                    onClick={() => updateDay(day.date)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    Update
                  </button>
                </div>

                <p className="text-xs text-gray-400 mt-2">
                  Booked slots will not be removed
                </p>

              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default ManageAvailability;