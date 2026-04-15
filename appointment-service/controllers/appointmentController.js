const Appointment = require("../models/Appointment");
const axios = require("axios");

const DOCTOR_SERVICE_URL = "http://localhost:5001/api/doctors";
const NOTIFICATION_SERVICE_URL = "http://localhost:5004/api/notifications";

// ✅ Create appointment
exports.createAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      date,
      time,
      name,
      age,
      symptoms,
      email,   // 👈 add this from frontend
      phone    // 👈 add this from frontend
    } = req.body;

    const report = req.file ? req.file.filename : null;

    // 🔹 Book doctor slot
    await axios.patch(`${DOCTOR_SERVICE_URL}/book-slot`, {
      doctorId,
      date,
      time
    });

    // 🔹 Save appointment
    const appointment = new Appointment({
      doctorId,
      patientId: "patient123", // later replace with auth user
      date,
      time,
      name,
      age,
      symptoms,
      report
    });

    await appointment.save();

    // 🔹 Send notification (async - don't break main flow)
    try {
      await axios.post(`${NOTIFICATION_SERVICE_URL}/appointment-created`, {
        email,
        phone,
        name,
        doctorId,
        date,
        time
      });
    } catch (notifyErr) {
      console.error("Notification error:", notifyErr.message);
    }

    res.json(appointment);

  } catch (err) {
    console.error("ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get doctor appointments
exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    const appointments = await Appointment.find({ doctorId });

    res.json(appointments);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update appointment status
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, email, phone } = req.body;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: "Not found" });
    }

    // 🔥 If rejected → free slot
    if (status === "rejected") {
      await axios.patch(`${DOCTOR_SERVICE_URL}/free-slot`, {
        doctorId: appointment.doctorId,
        date: appointment.date,
        time: appointment.time
      });
    }

    appointment.status = status;
    await appointment.save();

    // 🔹 Send notification
    try {
      await axios.post(`${NOTIFICATION_SERVICE_URL}/appointment-status`, {
        email,
        phone,
        name: appointment.name,
        status
      });
    } catch (notifyErr) {
      console.error("Notification error:", notifyErr.message);
    }

    res.json(appointment);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Add prescription
exports.addPrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { prescription, email, phone } = req.body;

    const appt = await Appointment.findByIdAndUpdate(
      id,
      { prescription },
      { new: true }
    );

    if (!appt) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // 🔹 Send notification
    try {
      await axios.post(`${NOTIFICATION_SERVICE_URL}/prescription`, {
        email,
        phone,
        name: appt.name
      });
    } catch (notifyErr) {
      console.error("Notification error:", notifyErr.message);
    }

    res.json(appt);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};