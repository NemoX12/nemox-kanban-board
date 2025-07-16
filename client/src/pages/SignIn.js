import { useState, useContext } from "react";
import axios from "axios";
import { ReactComponent as GoogleIcon } from "../assets/google_icon.svg";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/AuthForm.css";
import Loader from "../components/Loader";
import backendLink from "../utils/backendLink";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setMsgType("");
    setLoading(true);
    try {
      await axios.post(
        `${backendLink()}/auth/signin`,
        { username, password },
        { withCredentials: true }
      );
      await login();
      setMsgType("success");
      setMsg("Sign in successful");
    } catch (err) {
      setMsgType("error");
      setMsg(err.response?.data?.error || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-outer" style={{ position: "relative" }}>
      {loading && <Loader />}
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
        <button type="submit" disabled={loading}>
          Sign In
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
        <p>
          <button
            type="button"
            className="link-button"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </button>
        </p>
        <p>
          Don't have an account?
          <button type="button" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
