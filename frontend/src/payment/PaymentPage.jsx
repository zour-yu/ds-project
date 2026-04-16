import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createPayment, confirmPayment } from "./paymentService";

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { appointmentId, amount } = location.state || {};

    const [paymentId, setPaymentId] = useState(null);
    const [loading, setLoading] = useState(false);

    // 🔹 Create payment when page loads
    useEffect(() => {
        const initPayment = async () => {
            try {
                const res = await createPayment({
                    appointmentId,
                    patientId: "patient123",
                    amount,
                });

                setPaymentId(res.paymentId);
            } catch (err) {
                console.error(err);
            }
        };

        if (appointmentId) initPayment();
    }, [appointmentId, amount]);

    // 🔹 Handle payment confirm
    const handlePayment = async () => {
        try {
            setLoading(true);

            await confirmPayment({ paymentId });

            alert("Payment Successful!");

            navigate("/payment-success");
        } catch (err) {
            console.error(err);
            alert("Payment Failed");
        } finally {
            setLoading(false);
        }
    };

    if (!appointmentId) {
        return <h2>No appointment data</h2>;
    }

    return (
        <div style={{ padding: "30px" }}>
            <h2>Payment Page</h2>

            <p><strong>Appointment ID:</strong> {appointmentId}</p>
            <p><strong>Amount:</strong> LKR {amount}</p>

            <button onClick={handlePayment} disabled={loading}>
                {loading ? "Processing..." : "Pay Now"}
            </button>
        </div>
    );
};

export default PaymentPage;