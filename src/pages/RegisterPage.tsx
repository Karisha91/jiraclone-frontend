import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./LoginPage.css";

function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("USER");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, email, role }),
    });
    if (response.ok) {
      navigate("/login");
    } else if (response.status === 400) {
      setError("Invalid registration data");
    } else if (response.status === 409) {
      setError("Username or email already exists");
    } else if (response.status === 429) {
      setError("Too many requests, please try again later");
    }
    else {
      setError("Something went wrong, please try again");
    }
    
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Create account</h1>
        <p className="login-subtitle">Join Jira Clone today</p>
        {error && <p className="login-error">{error}</p>}
        <form onSubmit={handleRegister}>
          <div className="login-field">
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="login-field">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="login-field">
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="login-field">
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="DEVELOPER">Developer</option>
            </select>
          </div>
          <button type="submit">Register</button>
        </form>
        <Link to="/login">Already have an account? <span>Login</span></Link>
      </div>
    </div>
  );
}

export default RegisterPage;