import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 text-center py-4 mt-10 text-sm text-gray-500">

      <p>© 2026 HealthCare System</p>

        <button onClick={() => navigate("/doctor/login")}>Login</button>
            <button onClick={() => navigate("/doctor/register")}>Register</button>

    </div>
  );
}

export default Footer;