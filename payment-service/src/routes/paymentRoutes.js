const express = require("express");
const router = express.Router();
const controller = require("../controllers/paymentController");

router.post("/create", controller.createPayment);
router.post("/confirm", controller.confirmPayment);

module.exports = router;