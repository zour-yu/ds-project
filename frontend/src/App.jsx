import { BrowserRouter, Routes, Route } from "react-router-dom";
import Doctors from "./doctor/pages/Doctors";
import DoctorProfile from "./doctor/pages/DoctorProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Doctors />} />
        <Route path="/doctor/:id" element={<DoctorProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;