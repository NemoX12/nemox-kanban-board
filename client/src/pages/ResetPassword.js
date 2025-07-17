import { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../styles/AuthForm.css";
import backendLink from "../utils/backendLink";
import * as z from "zod";
import resetPassword from "../types/resetPassword";

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
    const result = z.safeParse(resetPassword, {
      password: password,
    });
    if (result.error) {
      setMsgType("error");
      setMsg(result.error.issues[0].message);
      return;
    }
    try {
      await axios.post(`${backendLink()}/auth/reset-password`, {
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
