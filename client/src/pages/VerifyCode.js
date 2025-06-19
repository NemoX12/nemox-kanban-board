import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AuthForm.css";
import SpamNotice from "../components/SpamNotice";
import backendLink from "../utils/backendLink";

const VerifyCode = ({ email }) => {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setMsgType("");
    try {
      await axios.post(`${backendLink()}/auth/verify-signup`, {
        username: email,
        code,
      });
      setMsg("Account created and verified! Redirecting to login...");
      setMsgType("success");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMsg(err.response?.data?.error || "Invalid code.");
      setMsgType("error");
    }
  };

  return (
    <div className="auth-form-outer">
      <form className="auth-form-container" onSubmit={handleSubmit}>
        <h2>Enter Verification Code</h2>
        <input
          placeholder="Verification Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="submit">Verify</button>
        <div
          className={
            msgType === "success" ? "msg-success" : msgType === "error" ? "msg-error" : ""
          }
        >
          {msg}
        </div>
        <SpamNotice />
      </form>
    </div>
  );
};

export default VerifyCode;
