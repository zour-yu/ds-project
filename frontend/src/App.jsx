import { BrowserRouter, Routes, Route } from "react-router-dom";
import Doctors from "./doctor/pages/Doctors";
import DoctorProfile from "./doctor/pages/DoctorProfile";
import DoctorAppointments from "./doctor/pages/DoctorAppointments";
import DoctorProfileEdit from "./doctor/pages/DoctorProfileEdit";
import ManageAvailability from "./doctor/pages/ManageAvailability";
import BookAppointment from "./doctor/pages/BookAppointment";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Doctors />} />
        <Route path="/doctor/:id" element={<DoctorProfile />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path="/doctor/edit" element={<DoctorProfileEdit />} />
        <Route path="/doctor/manage-availability" element={<ManageAvailability />} />
        <Route path="/book" element={<BookAppointment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;