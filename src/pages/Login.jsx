import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const details = {
      'grant_type': 'password',
      'username': username,
      'password': password,
      'client_id': 'client'
    };

    const formBody = Object.keys(details)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key]))
      .join('&');

    try {
      const response = await fetch('http://localhost:3000/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formBody
      });

      if (response.ok) {
        const data = await response.json();
        
        
        localStorage.setItem('accessToken', data.access_token);
        localStorage.setItem('refreshToken', data.refresh_token);
        
        console.log("Login erfolgreich!");
        
        navigate("/");
      } else {
        setError("Ungültige E-Mail oder Passwort");
      }
    } catch (err) {
      console.error("Login-Fehler:", err);
      setError("Server nicht erreichbar. Hast du das Backend gestartet?");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <h2 style={{ textAlign: "center" }}>Login</h2>
      {error && (
        <p style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <label>E-Mail:</label>
        <input
          type="email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
        />

        <label>Passwort:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
        />

        <button
          type="submit"
          style={{ padding: "10px", borderRadius: "5px", border: "none", background: "#007bff", color: "white", cursor: "pointer", marginTop: "10px" }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;