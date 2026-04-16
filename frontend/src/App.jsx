import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { subscribeToAuthChanges, logout } from "./auth/services/authService";
import Register from "./auth/pages/Register";
import Login from "./auth/pages/Login";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import PaymentPage from "./payment/PaymentPage";
import PaymentSuccess from "./payment/PaymentSuccess";

const PrivateRoute = ({ children, allowedRole }) => {
  const [userState, setUserState] = useState({ loading: true, user: null, role: null });

  useEffect(() => {
    const unsub = subscribeToAuthChanges((data) => {
      setUserState({ loading: false, user: data?.user || null, role: data?.role || null });
    });
    return () => unsub();
  }, []);

  if (userState.loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!userState.user) return <Navigate to="/login" />;
  if (allowedRole && userState.role !== allowedRole) return <Navigate to="/login" />;

  return children;
};

const DashboardPlaceholder = ({ title }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow-lg border-t-4 border-blue-500">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          <button onClick={() => logout()} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-200">Logout</button>
        </div>
        <div className="mt-8 text-gray-600 italic font-medium border-l-4 border-orange-400 pl-4 bg-orange-50 p-2">Frontend architecture ready. Connected to Auth & Patient Microservices.</div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/patient/dashboard"
            element={
              <PrivateRoute allowedRole="patient">
                <DashboardPlaceholder title="Patient Dashboard" />
              </PrivateRoute>
            }
          />

          <Route
            path="/doctor/home"
            element={
              <PrivateRoute allowedRole="doctor">
                <DashboardPlaceholder title="Doctor Panel" />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute allowedRole="admin">
                <DashboardPlaceholder title="Admin Console" />
              </PrivateRoute>
            }
          />

          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/payment" element={<PaymentPage />} />

          <Route path="/payment-success" element={<PaymentSuccess />} />

        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;