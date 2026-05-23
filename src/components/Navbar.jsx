import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useNotificationContext } from "../context/NotificationContext";

function Navbar() {
  const { notifications } = useNotificationContext();

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <span className="navbar-brand">Jira clone</span>
      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/projects">Projects</Link>
      </div>
      <div className="navbar-bell">
        🔔{" "}
        {notifications.length > 0 && (
          <span className="navbar-badge">{notifications.length}</span>
        )}
      </div>
      <button className="navbar-logout" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Navbar;
