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