const express = require("express");
const router = express.Router();
const controller = require("../controllers/doctorController");
const auth = require("../middleware/auth");

router.post("/", controller.createDoctor);
router.get("/", controller.getDoctors);

// NEW
router.get("/me", auth, controller.getMyProfile);
router.put("/me", auth, controller.updateProfile);

router.post("/availability", auth, controller.addAvailability);

router.get("/:id/availability", controller.getDoctorAvailability);
router.get("/:id", controller.getDoctorById);

router.patch("/book-slot", controller.bookSlot);
router.patch("/free-slot", controller.freeSlot);

router.delete("/availability", auth, controller.deleteAvailability);
router.patch("/availability/update", auth, controller.updateAvailability);

module.exports = router;