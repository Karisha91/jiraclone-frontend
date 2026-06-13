import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useNotificationContext } from "../context/NotificationContext";
import { useState, useRef, useEffect } from "react";

function Navbar() {
  const { notifications, markAsRead } = useNotificationContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      <div
        className="navbar-bell"
        ref={dropdownRef}
        onClick={() => setIsOpen(!isOpen)}
      >
        Notifications
        {notifications.filter(n => !n.isRead).length > 0 && (
          <span className="navbar-badge">{notifications.filter(n => !n.isRead).length}</span>
        )}
        {isOpen && (
          <div className="navbar-dropdown">
            {notifications.length === 0 ? (
              <p className="navbar-dropdown-empty">No notifications</p>
            ) : (
              notifications.slice().sort((a, b) => b.id - a.id).map((notification, index) => (
                <div className={notification.isRead ? "navbar-dropdown-item" : "navbar-dropdown-item unread"}
                  key={index}
                  onClick={() => {
                    markAsRead(notification.id);
                    setIsOpen(false);
                    navigate(`/issues/${notification.issueId}`);
                  }}
                >
                  {notification.message}
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <button className="navbar-logout" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Navbar;
