const Payment = require("../models/paymentModel");
const { createPaymentIntent } = require("../services/stripeService");
const axios = require("axios");

const APPOINTMENT_SERVICE_URL = process.env.APPOINTMENT_SERVICE_URL || "http://localhost:5003/api/appointments";

exports.createPayment = async (req, res) => {
    try {
        const { appointmentId, patientId, amount } = req.body;

        const paymentIntent = await createPaymentIntent(amount);

        const payment = await Payment.create({
            appointmentId,
            patientId,
            amount,
            transactionId: paymentIntent.id
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentId: payment._id
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 🔥 VERY IMPORTANT
exports.confirmPayment = async (req, res) => {
    try {
        const { paymentId } = req.body;

        const payment = await Payment.findById(paymentId);
        payment.status = "SUCCESS";
        await payment.save();

        // 🔥 UPDATE APPOINTMENT STATUS
        await axios.patch(
            `${APPOINTMENT_SERVICE_URL}/${payment.appointmentId}/status`,
            { status: "CONFIRMED" }
        );

        res.json({ message: "Payment successful & appointment confirmed" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};