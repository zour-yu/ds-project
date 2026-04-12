import { BrowserRouter, Routes, Route } from "react-router-dom";
import Doctors from "./doctor/pages/Doctors";
import DoctorProfile from "./doctor/pages/DoctorProfile";
import DoctorAppointments from "./doctor/pages/DoctorAppointments";
import DoctorProfileEdit from "./doctor/pages/DoctorProfileEdit";
import ManageAvailability from "./doctor/pages/ManageAvailability";
import BookAppointment from "./doctor/pages/BookAppointment";
import ProtectedRoute from "./doctor/components/ProtectedRoute";
import Login from "./doctor/pages/Login";
import Register from "./doctor/pages/Register";
import Navbar from "./doctor/components/Navbar";
import Foot from "./doctor/components/Foot";


function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* Public */}
        <Route path="/" element={<Doctors />} />
        <Route path="/doctor/:id" element={<DoctorProfile />} />
        <Route path="/book" element={<BookAppointment />} />

        <Route path="/doctor/login" element={<Login />} />
        <Route path="/doctor/register" element={<Register />} />

        {/* Protected */}
        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoute>
              <DoctorAppointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/manage-availability"
          element={
            <ProtectedRoute>
              <ManageAvailability />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/edit"
          element={
            <ProtectedRoute>
              <DoctorProfileEdit />
            </ProtectedRoute>
          }
        />

      </Routes>
      <Foot />
    </BrowserRouter>
  );
}

export default App;