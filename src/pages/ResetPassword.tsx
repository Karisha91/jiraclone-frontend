import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function ResetPassword() {


  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();


  const token = searchParams.get("token");
  const navigate = useNavigate();

    console.log(token)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword: password, token }),
      },
    );
    
    if (response.ok) {
      const text = await response.text();
      setMessage(text);
      setPassword("");
    } else {
      setError("Something went wrong, please try again");
    }
  };
  
  return (
    <div>
      <h1>Reset Password page</h1>
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ResetPassword;
