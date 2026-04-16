const express = require("express");
const router = express.Router();
const controller = require("../controllers/appointmentController");
const upload = require("../middleware/upload");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, upload.single("file"), controller.createAppointment);

router.get("/patient/me", verifyToken, controller.getPatientAppointments);

router.get("/doctor/:doctorId", controller.getDoctorAppointments);

router.patch("/:id/status", controller.updateStatus);
router.patch("/:id/prescription", controller.addPrescription);

module.exports = router;