const express = require("express");
const router = express.Router();
const controller = require("../controllers/appointmentController");

router.post("/", controller.createAppointment);

router.get("/doctor/:doctorId", controller.getDoctorAppointments);

router.patch("/:id/status", controller.updateStatus);

module.exports = router;