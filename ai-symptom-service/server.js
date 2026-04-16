require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5007;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`AI Symptom Service running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("Failed to start AI Symptom Service:", error.message);
});
