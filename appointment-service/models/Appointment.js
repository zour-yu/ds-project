const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({

  name: String,
  age: Number,
  symptoms: String,
  report: String,
  prescription: String,
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