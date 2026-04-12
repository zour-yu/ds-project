const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));



module.exports = app;