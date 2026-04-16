const express = require("express");
const router = express.Router();
const controller = require("../controllers/appointmentController");
const upload = require("../middleware/upload");

router.post("/", upload.single("file"), controller.createAppointment);

router.get("/count", async (req, res) => {
    try {
        const count = await require('../models/Appointment').countDocuments();
        res.json({ count });
    } catch (err) {
        res.status(500).json({ message: 'Error' });
    }
});

router.get("/doctor/:doctorId", controller.getDoctorAppointments);

router.patch("/:id/status", controller.updateStatus);
router.patch("/:id/prescription", controller.addPrescription);

module.exports = router;