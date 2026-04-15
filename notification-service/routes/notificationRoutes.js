const express = require("express");
const router = express.Router();
const controller = require("../controllers/notificationController");

router.post("/appointment-created", controller.appointmentCreated);
router.post("/appointment-status", controller.appointmentStatus);
router.post("/prescription", controller.prescriptionAdded);

module.exports = router;