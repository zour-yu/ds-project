const { sendEmail } = require("../services/emailService");
const { sendSMS } = require("../services/smsService");

// Appointment Created
exports.appointmentCreated = async (req, res) => {
  const { email, phone, name, doctorId, date, time } = req.body;

  const message = `Hi ${name}, your appointment is booked on ${date} at ${time}`;

  await sendEmail(email, "Appointment Confirmation", message);
  await sendSMS(phone, message);

  res.json({ message: "Notification sent" });
};

// Status Update
exports.appointmentStatus = async (req, res) => {
  const { email, phone, name, status } = req.body;

  const message = `Hi ${name}, your appointment is ${status}`;

  await sendEmail(email, "Appointment Status Update", message);
  await sendSMS(phone, message);

  res.json({ message: "Notification sent" });
};

// Prescription Added
exports.prescriptionAdded = async (req, res) => {
  const { email, phone, name } = req.body;

  const message = `Hi ${name}, your prescription is ready`;

  await sendEmail(email, "Prescription Update", message);
  await sendSMS(phone, message);

  res.json({ message: "Notification sent" });
};