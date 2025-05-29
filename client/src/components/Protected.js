import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import backendLink from "../utils/backendLink";

const Protected = () => {
  const { token, logout } = useContext(AuthContext);
  const [msg, setMsg] = useState("");

  const fetchProtected = async () => {
    try {
      const res = await axios.get(`${backendLink()}/protected`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg(JSON.stringify(res.data));
    } catch (err) {
      setMsg("Not authorized");
    }
  };

  return (
    <div>
      <button onClick={fetchProtected}>Fetch Protected Data</button>
      <button onClick={logout}>Logout</button>
      <div>{msg}</div>
    </div>
  );
};

export default Protected;
