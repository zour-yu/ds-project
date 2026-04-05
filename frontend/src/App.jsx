import { BrowserRouter, Routes, Route } from "react-router-dom";
import Doctors from "./doctor/pages/Doctors";
import DoctorProfile from "./doctor/pages/DoctorProfile";
import DoctorAppointments from "./doctor/pages/DoctorAppointments";
import DoctorProfileEdit from "./doctor/pages/DoctorProfileEdit";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Doctors />} />
        <Route path="/doctor/:id" element={<DoctorProfile />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path="/doctor/edit" element={<DoctorProfileEdit />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;