import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/users/register/", {
        username,
        email,
        password,
      });
      setMsg("✅ Signup successful, you can now login.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setMsg("❌ Signup failed");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Signup</h2>
      {msg && <div className="alert alert-info">{msg}</div>}
      <form onSubmit={handleSignup}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            className="form-control"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            className="form-control"
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            className="form-control"
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-success">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
