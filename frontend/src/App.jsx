import { BrowserRouter, Routes, Route } from "react-router-dom";
import DoctorDashboard from "./doctor/pages/DoctorDashboard";
import ProfilePage from "./doctor/pages/ProfilePage";
import AvailabilityPage from "./doctor/pages/AvailabilityPage";
import DoctorList from "./doctor/pages/DoctorList";
import DoctorDetails from "./doctor/pages/DoctorDetails";
import BookingPage from "./doctor/pages/BookingPage";
import DoctorAppointments from "./doctor/pages/DoctorAppointments";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<DoctorList />} />
        <Route path="/doctor/:id" element={<DoctorDetails />} />

        {/* DOCTOR DASHBOARD */}
        <Route path="/dashboard" element={<DoctorDashboard />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="availability" element={<AvailabilityPage />} />
          <Route path="appointments" element={<DoctorAppointments />} />

        </Route>

        <Route path="/book/:id" element={<BookingPage />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;