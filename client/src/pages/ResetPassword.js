import React, { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../styles/AuthForm.css";

function isValidPassword(password) {
  return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);
}

const ResetPassword = () => {
  const [params] = useSearchParams();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const navigate = useNavigate();
  const token = params.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setMsgType("");
    if (!password.trim()) {
      setMsg("Please enter a new password.");
      setMsgType("error");
      return;
    }
    if (!isValidPassword(password)) {
      setMsg("Password must be at least 8 characters, include a letter and a number.");
      setMsgType("error");
      return;
    }
    try {
      await axios.post("https://nemox-kanban-board.onrender.com/auth/reset-password", {
        token,
        newPassword: password,
      });
      setMsg("Password reset successful. You can now sign in.");
      setMsgType("success");
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setMsg("Reset failed or link expired.");
      setMsgType("error");
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
        <div
          className={
            msgType === "success" ? "msg-success" : msgType === "error" ? "msg-error" : ""
          }
        >
          {msg}
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
