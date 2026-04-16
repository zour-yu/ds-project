const express = require("express");
const cors = require("cors");

const aiRoutes = require("./routes/aiRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP", service: "ai-symptom-service" });
});

app.use("/api/ai-symptoms", aiRoutes);

module.exports = app;
