const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(require("./middleware/mockAuth"));
app.use("/api/doctors", require("./routes/doctorRoutes"));



module.exports = app;