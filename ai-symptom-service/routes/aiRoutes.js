const express = require("express");
const controller = require("../controllers/aiController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/analyze", verifyToken, controller.analyzeSymptoms);
router.get("/history", verifyToken, controller.getHistory);

module.exports = router;
