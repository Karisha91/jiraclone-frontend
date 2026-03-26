import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Navbar.css";    


function Navbar() {

    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }


    return (
        <div className="navbar">
        <span className="navbar-brand">Jira clone</span>
            <div className="navbar-links">         
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/projects">Projects</Link>
            
            </div>
            <button className="navbar-logout" onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Navbar;
