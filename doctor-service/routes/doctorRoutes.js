const express = require("express");
const router = express.Router();
const controller = require("../controllers/doctorController");

router.post("/", controller.createDoctor);
router.get("/", controller.getDoctors);

// NEW
router.get("/me", controller.getMyProfile);
router.put("/me", controller.updateProfile);

router.post("/availability", controller.addAvailability);

router.get("/:id/availability", controller.getDoctorAvailability);
router.get("/:id", controller.getDoctorById);

module.exports = router;