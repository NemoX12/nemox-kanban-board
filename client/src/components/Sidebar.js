import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ProfileAvatar from "./ProfileAvatar";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const { logout, userData } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-user">
        <ProfileAvatar photoUrl={userData.photoUrl} className="sidebar-avatar" />
        {(userData.first_name || userData.last_name) && (
          <p>
            {userData.first_name} {userData.last_name}
          </p>
        )}
      </div>
      <button className="sidebar-logout" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
