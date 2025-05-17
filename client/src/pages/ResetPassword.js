import React, { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../styles/AuthForm.css";

const ResetPassword = () => {
  const [params] = useSearchParams();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const token = params.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await axios.post("http://localhost:5542/auth/reset-password", {
        token,
        newPassword: password,
      });
      setMsg("Password reset successful. You can now sign in.");
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setMsg("Reset failed or link expired.");
    }
  };

  return (
    <div className="auth-form-outer">
      <form className="auth-form-container" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        <input
          placeholder="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Reset Password</button>
        <div>{msg}</div>
      </form>
    </div>
  );
};

export default ResetPassword;
