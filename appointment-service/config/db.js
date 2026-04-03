const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/appointment-service");
    console.log("MongoDB connected (Appointment)");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;