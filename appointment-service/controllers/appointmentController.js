const Appointment = require("../models/Appointment");
const axios = require("axios");

const DOCTOR_SERVICE_URL = process.env.DOCTOR_SERVICE_URL || "http://localhost:5002/api/doctors";
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || "http://localhost:5004/api/notifications";

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

    // 🔹 Get Doctor Details
    let doctorEmail = null;
    let doctorPhone = null;
    let doctorName = null;
    try {
      const docRes = await axios.get(`${DOCTOR_SERVICE_URL}/${doctorId}`);
      if (docRes.data) {
        doctorEmail = docRes.data.email;
        doctorPhone = docRes.data.phone;
        doctorName = docRes.data.name;
      }
    } catch (docErr) {
      console.error("Error fetching doctor details:", docErr.message);
    }

    // 🔹 Save appointment
    const appointment = new Appointment({
      doctorId,
      patientId: req.user?.firebaseId || "patient123",
      date,
      time,
      name,
      age,
      symptoms,
      report,
      status: "PENDING_PAYMENT"
    });

    await appointment.save();

    // 🔹 Send notification (async - don't break main flow)
    try {
      await axios.post(`${NOTIFICATION_SERVICE_URL}/appointment-created`, {
        email,
        phone,
        name,
        doctorId,
        doctorEmail,
        doctorPhone,
        doctorName,
        date,
        time
      });
    } catch (notifyErr) {
      console.error("Notification error:", notifyErr.message);
    }

    res.json(appointment);

  } catch (err) {
    const statusCode = err.response?.status || 500;
    const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message;
    console.error("ERROR:", errorMessage);
    res.status(statusCode).json({ error: errorMessage });
  }
};

// ✅ Get doctor appointments
exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    const appointments = await Appointment.find({ doctorId });

    res.json(appointments);

  } catch (err) {
    const statusCode = err.response?.status || 500;
    const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message;
    res.status(statusCode).json({ error: errorMessage });
  }
};

// ✅ Update appointment status
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, email, phone } = req.body;

    const statusMap = {
      approved: "CONFIRMED",
      confirmed: "CONFIRMED",
      rejected: "REJECTED"
    };

    const normalizedStatus = statusMap[String(status || "").toLowerCase()] || status;

    if (!["PENDING_PAYMENT", "CONFIRMED", "REJECTED"].includes(normalizedStatus)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: "Not found" });
    }

    // 🔥 If rejected → free slot
    if (normalizedStatus === "REJECTED") {
      await axios.patch(`${DOCTOR_SERVICE_URL}/free-slot`, {
        doctorId: appointment.doctorId,
        date: appointment.date,
        time: appointment.time
      });
    }

    appointment.status = normalizedStatus;
    await appointment.save();

    // 🔹 Send notification
    try {
      await axios.post(`${NOTIFICATION_SERVICE_URL}/appointment-status`, {
        email,
        phone,
        name: appointment.name,
        status: normalizedStatus
      });
    } catch (notifyErr) {
      console.error("Notification error:", notifyErr.message);
    }

    res.json(appointment);

  } catch (err) {
    const statusCode = err.response?.status || 500;
    const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message;
    res.status(statusCode).json({ error: errorMessage });
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

// Get logged-in patient appointments
exports.getPatientAppointments = async (req, res) => {
  try {
    const patientId = req.user?.firebaseId;

    if (!patientId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const appointments = await Appointment.find({ patientId }).sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    const statusCode = err.response?.status || 500;
    const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message;
    res.status(statusCode).json({ error: errorMessage });
  }
};