import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../styles/AuthForm.css";
import { useNavigate } from "react-router-dom";
import SpamNotice from "../components/SpamNotice";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (cooldown > 0) {
      timerRef.current = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timerRef.current);
  }, [cooldown]);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setMsgType("");
    if (!email.trim()) {
      setMsg("Please enter your email.");
      setMsgType("error");
      return;
    }
    if (!isValidEmail(email)) {
      setMsg("Please enter a valid email address.");
      setMsgType("error");
      return;
    }
    if (cooldown > 0) return;
    try {
      await axios.post("http://localhost:5542/auth/forgot-password", { email });
      setMsg("If that email exists, a reset link has been sent.");
      setMsgType("success");
      setCooldown(60);
    } catch (err) {
      setMsg(err.response?.data?.error || "Something went wrong. Please try again.");
      setMsgType("error");
      if (err.response?.status === 429) setCooldown(60);
    }
  };

  return (
    <div className="auth-form-outer">
      <form className="auth-form-container" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={cooldown > 0}
        />
        <button type="submit" disabled={cooldown > 0}>
          {cooldown > 0 ? `Wait ${cooldown}s` : "Send Reset Link"}
        </button>
        {msg ? (
          <>
            <div
              className={
                msgType === "success"
                  ? "msg-success"
                  : msgType === "error"
                  ? "msg-error"
                  : ""
              }
            >
              {msg}
            </div>
            {msgType === "success" && <SpamNotice />}
          </>
        ) : null}
        <button type="button" onClick={() => navigate("/login")}>
          Turn back
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
