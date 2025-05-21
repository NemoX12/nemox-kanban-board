import React from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AvatarPlaceholder from "../assets/avatar_placeholder.jpg";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const { logout, userData } = useContext(AuthContext);
  const navigate = useNavigate();

  // Log user data to the console
  console.log("Sidebar userData:", userData);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-user">
        <img
          referrerPolicy="no-referrer"
          src={
            userData.photoUrl && userData.photoUrl.trim() !== ""
              ? userData.photoUrl
              : AvatarPlaceholder
          }
          alt="profile"
          className="sidebar-avatar"
        />
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
