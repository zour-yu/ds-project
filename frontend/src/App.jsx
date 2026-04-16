import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { subscribeToAuthChanges, logout } from "./auth/services/authService";
import Register from "./auth/pages/Register";
import Login from "./auth/pages/Login";
import MainLayout from "./layouts/MainLayout";
import PatientManagementLayout from "./layouts/PatientManagementLayout";
import Home from "./pages/Home";
import PaymentPage from "./payment/PaymentPage";
import PaymentSuccess from "./payment/PaymentSuccess";
import PatientProfile from "./patient/pages/PatientProfile";
import PatientDashboard from "./patient/pages/PatientDashboard";
import MedicalRecords from "./patient/pages/MedicalRecords";
import Prescriptions from "./patient/pages/Prescriptions";
import DoctorDashboard from "./doctor/pages/DoctorDashboard";
import ProfilePage from "./doctor/pages/ProfilePage";
import AvailabilityPage from "./doctor/pages/AvailabilityPage";
import DoctorAppointments from "./doctor/pages/DoctorAppointments";
import DoctorList from "./doctor/pages/DoctorList";
import DoctorDetails from "./doctor/pages/DoctorDetails";
import BookingPage from "./doctor/pages/BookingPage";

import AdminManagementLayout from "./layouts/AdminManagementLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import VerifyDoctors from "./admin/pages/VerifyDoctors";
import AdminPatients from "./admin/pages/AdminPatients";

const PrivateRoute = ({ children, allowedRole }) => {
  const [userState, setUserState] = useState({ loading: true, user: null, role: null });

  useEffect(() => {
    const unsub = subscribeToAuthChanges((data) => {
      console.log("Auth State Changed:", data);
      setUserState({ 
        loading: false, 
        user: data?.user || null, 
        role: data?.role || null 
      });
    });
    return () => unsub();
  }, []);

  if (userState.loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!userState.user) return <Navigate to="/login" />;
  
  if (allowedRole && userState.role && userState.role !== allowedRole) {
    console.warn(`Role mismatch: expected ${allowedRole}, got ${userState.role}`);
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/doctors" element={<MainLayout><DoctorList /></MainLayout>} />
        <Route path="/book/:id" element={<MainLayout><BookingPage /></MainLayout>} />
        
        <Route 
          path="/patient/dashboard" 
          element={
            <PrivateRoute allowedRole="patient">
              <PatientManagementLayout>
                <PatientDashboard />
              </PatientManagementLayout>
            </PrivateRoute>
          } 
        />

        <Route 
          path="/patient/profile" 
          element={
            <PrivateRoute allowedRole="patient">
              <PatientManagementLayout>
                <PatientProfile />
              </PatientManagementLayout>
            </PrivateRoute>
          } 
        />

        <Route 
          path="/doctor/*" 
          element={
            <PrivateRoute allowedRole="doctor">
              <DoctorDashboard />
            </PrivateRoute>
          }
        >
          <Route path="profile" element={<ProfilePage />} />
          <Route path="availability" element={<AvailabilityPage />} />
          <Route path="appointments" element={<DoctorAppointments />} />
        </Route>

        <Route 
          path="/patient/records" 
          element={
            <PrivateRoute allowedRole="patient">
              <PatientManagementLayout>
                <MedicalRecords />
              </PatientManagementLayout>
            </PrivateRoute>
          } 
        />

        <Route 
          path="/patient/prescriptions" 
          element={
            <PrivateRoute allowedRole="patient">
              <PatientManagementLayout>
                <Prescriptions />
              </PatientManagementLayout>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/doctor/home" 
          element={
            <PrivateRoute allowedRole="doctor">
              <div className="p-8">Doctor Dashboard (Coming Soon)</div>
            </PrivateRoute>
          } 
        />

        <Route 
          path="/admin/dashboard" 
          element={
            <PrivateRoute allowedRole="admin">
              <AdminManagementLayout>
                <AdminDashboard />
              </AdminManagementLayout>
            </PrivateRoute>
          } 
        />

        <Route 
          path="/admin/verify-doctors" 
          element={
            <PrivateRoute allowedRole="admin">
              <AdminManagementLayout>
                <VerifyDoctors />
              </AdminManagementLayout>
            </PrivateRoute>
          } 
        />

        <Route 
          path="/admin/patients" 
          element={
            <PrivateRoute allowedRole="admin">
              <AdminManagementLayout>
                <AdminPatients />
              </AdminManagementLayout>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/doctor-dashboard/*" 
          element={
            <PrivateRoute allowedRole="doctor">
              <DoctorDashboard />
            </PrivateRoute>
          }
        >
          <Route path="profile" element={<MainLayout><ProfilePage /></MainLayout>} />
          <Route path="availability" element={<AvailabilityPage />} />
          <Route path="appointments" element={<DoctorAppointments />} />
        </Route>

          <Route path="/doctor/:id" element={<MainLayout><DoctorDetails /></MainLayout>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
