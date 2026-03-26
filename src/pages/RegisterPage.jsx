import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./RegisterPage.css";

function RegisterPage() {

const navigate = useNavigate();

const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [email, setEmail] = useState("");
const [role, setRole] = useState("USER");
const [error, setError] = useState("");

const handleRegister = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email, role }),
    }).then((res) => {
        if (res.ok) {
            navigate("/login");
        } else {
           setError("Registration failed. Please check your details and try again.");
        }
    });
};


    return (
        <div className="register-container">
            <div className="register-card">
             <h1>Register</h1>
            
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleRegister}>
                    
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                    <option value="DEVELOPER">Developer</option>
                </select>
                <button type="submit">Register</button>
                <Link to = "/login">Have accaunt? Login</Link>
            </form>
            </div>
        </div>
    );
}

export default RegisterPage;