const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ds-project");
    console.log(`AI Symptom Service MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`AI Symptom Service DB Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
