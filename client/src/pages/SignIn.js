import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/AuthForm.css";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await axios.post(
        "http://localhost:5542/auth/signin",
        { username, password },
        { withCredentials: true }
      );
      await login();
    } catch (err) {
      setMsg(err.response?.data?.error || "Sign in failed");
    }
  };

  return (
    <div className="auth-form-outer">
      <form className="auth-form-container" onSubmit={handleSubmit}>
        <h2>Sign In</h2>
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
        <button type="submit">Sign In</button>
        <div>{msg}</div>
        <p>
          <button
            type="button"
            className="link-button"
            onClick={() => navigate("/forgot-password")}
            style={{
              background: "none",
              border: "none",
              color: "#4f8cff",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Forgot password?
          </button>
        </p>
        <p>
          Don't have an account?{" "}
          <button type="button" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
