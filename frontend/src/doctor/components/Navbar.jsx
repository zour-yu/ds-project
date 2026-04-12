import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";


function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    const decoded = jwtDecode(token);
    setDoctor(decoded);
  }
}, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="bg-white shadow px-6 py-3 flex justify-between items-center">

      <h1
        onClick={() => navigate("/")}
        className="font-bold text-lg cursor-pointer"
      >
        🏥 HealthCare
      </h1>

      <div className="flex gap-4 items-center">

        {token ? (
          <>
            <button onClick={() => navigate("/doctor/appointments")}>
              Appointments
            </button>

            <button onClick={() => navigate("/doctor/manage-availability")}>
              Availability
            </button>

            {doctor && (
                <span className="text-sm text-gray-600">
                    👨‍⚕️ Doctor
                </span>
                )}

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/doctor/login")}>Login</button>
            <button onClick={() => navigate("/doctor/register")}>Register</button>
          </>
        )}

      </div>
    </div>
  );
}

export default Navbar;