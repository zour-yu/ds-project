const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  doctorId: String,
  patientId: String,

  date: String,
  time: String,

  status: {
    type: String,
    default: "pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);