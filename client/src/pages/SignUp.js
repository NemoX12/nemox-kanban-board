import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import VerifyCode from "./VerifyCode";
import { ReactComponent as GoogleIcon } from "../assets/google_icon.svg";
import "../styles/AuthForm.css";
import Loader from "../components/Loader";
import backendLink from "../utils/backendLink";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isValidPassword(password) {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
}

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const [showVerify, setShowVerify] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setMsgType("");
    if (!isValidEmail(username)) {
      setMsg("Please enter a valid email address.");
      setMsgType("error");
      return;
    }
    if (!isValidPassword(password)) {
      setMsg("Password must be at least 8 characters, include a letter and a number.");
      setMsgType("error");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${backendLink()}/auth/request-signup`, {
        username,
        password,
        firstName,
        lastName,
      });
      setShowVerify(true);
    } catch (err) {
      setMsg(err.response?.data?.error || "Sign up failed");
      setMsgType("error");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  if (showVerify) {
    return <VerifyCode email={username} />;
  }

  return (
    <div className="auth-form-outer" style={{ position: "relative" }}>
      {loading && <Loader />}
      <form className="auth-form-container" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <input
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          Sign Up
        </button>
        <div
          className={
            "form-message " +
            (msgType === "success"
              ? "msg-success"
              : msgType === "error"
              ? "msg-error"
              : "")
          }
        >
          {msg}
        </div>

        <div>
          <button
            className="gsi-material-button google-auth-btn"
            onClick={() => (window.location.href = `${backendLink()}/auth/google`)}
          >
            <div className="gsi-material-button-state"></div>
            <div className="gsi-material-button-content-wrapper">
              <div className="gsi-material-button-icon">
                <GoogleIcon />
              </div>
              <span className="gsi-material-button-contents">Continue with Google</span>
              <span style={{ display: "none" }}>Continue with Google</span>
            </div>
          </button>
        </div>
        <p>
          Already have an account?
          <button type="button" onClick={() => navigate("/login")}>
            Sign In
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
