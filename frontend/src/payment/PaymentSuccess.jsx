import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: "30px" }}>
            <h2>✅ Payment Successful!</h2>
            <p>Your appointment is confirmed.</p>

            <button onClick={() => navigate("/")}>
                Go Home
            </button>
        </div>
    );
};

export default PaymentSuccess;