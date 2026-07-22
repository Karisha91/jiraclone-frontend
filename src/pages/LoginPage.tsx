import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./LoginPage.css";


function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

   const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });
        if (response.ok) {
            const data = await response.json();
                localStorage.setItem("token", data.token);
                navigate("/workspace");
        } else  if (response.status === 401) {
            setError("Invalid username or password");
        } else if (response.status === 400) {
            setError("Invalid request");
        }  else if (response.status === 500) {
            setError("Server error, please try again later");
        } else if (response.status === 429) {
            setError("Too many requests, please try again later");
        } else {
            setError("Something went wrong, please try again");
        }

  };

  return (
    <div className="login-container">
      <div className="login-card">
      
      
      <h1>Welcome back</h1>
      <p className="login-subtitle">Sign in to your account</p>
      {error && <p className="login-error">{error}</p>}
      <form onSubmit={handleSubmit}>
  <div className="login-field">
    <input
      type="text"
      placeholder="Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />
  </div>
  <div className="login-field">
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
  </div>
  <button type="submit">Login</button>
</form>
      <Link to="/register">Don't have an account? <span>Register</span></Link>
      <Link to="/forgot-password">Forgot password? <span></span></Link>
      </div>
    </div>
  );
}

export default LoginPage;
