const Appointment = require("../models/Appointment");
const axios = require("axios");

// Create appointment
exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;

    const patientId = "patient123";

    // 1. Call Doctor Service
    await axios.patch("http://localhost:5001/api/doctors/book-slot", {
      doctorId,
      date,
      time
    });

    // 2. Save appointment
    const appointment = new Appointment({
      doctorId,
      patientId,
      date,
      time
    });

    await appointment.save();

    res.json(appointment);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};