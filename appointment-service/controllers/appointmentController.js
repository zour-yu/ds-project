const Appointment = require("../models/Appointment");
const axios = require("axios");

// Create appointment
exports.createAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      date,
      time,
      name,
      age,
      symptoms
    } = req.body;

    const report = req.file ? req.file.filename : null;

    await axios.patch("http://localhost:5001/api/doctors/book-slot", {
      doctorId,
      date,
      time
    });

    const appointment = new Appointment({
      doctorId,
      patientId: "patient123",
      date,
      time,
      name,
      age,
      symptoms,
      report
    });

    await appointment.save();

    res.json(appointment);

  }  catch (err) {
  console.error("ERROR:", err); // 👈 IMPORTANT
  res.status(500).json({ error: err.message });
}
};

exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    const appointments = await Appointment.find({ doctorId });

    res.json(appointments);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: "Not found" });
    }

    // 🔥 If cancelling → free slot
    if (status === "rejected") {
      await axios.patch("http://localhost:5001/api/doctors/free-slot", {
        doctorId: appointment.doctorId,
        date: appointment.date,
        time: appointment.time
      });
    }

    appointment.status = status;
    await appointment.save();

    res.json(appointment);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addPrescription = async (req, res) => {
  const { id } = req.params;
  const { prescription } = req.body;

  const appt = await Appointment.findByIdAndUpdate(
    id,
    { prescription },
    { new: true }
  );

  res.json(appt);
};