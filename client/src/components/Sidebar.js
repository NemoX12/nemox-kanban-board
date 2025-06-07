import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ProfileAvatar from "./ProfileAvatar";
import "../styles/Sidebar.css";
import { RiArrowLeftDoubleLine, RiArrowRightDoubleLine } from "react-icons/ri";

const Sidebar = ({ isSidebarActive, setIsSidebarActive }) => {
  const { logout, userData } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className={`sidebar${isSidebarActive ? "" : " sidebar-collapsed"}`}>
      <div className="sidebar-user">
        <ProfileAvatar photoUrl={userData.photoUrl} className="sidebar-avatar" />
        {isSidebarActive && (userData.first_name || userData.last_name) && (
          <p>
            {userData.first_name} {userData.last_name}
          </p>
        )}
      </div>
      <div className="sidebar-buttons">
        {isSidebarActive && (
          <button className="sidebar-buttons-logout" onClick={handleLogout}>
            Logout
          </button>
        )}
        <button
          className="sidebar-buttons-sidebar"
          onClick={() => setIsSidebarActive((prev) => !prev)}
        >
          {isSidebarActive ? <RiArrowLeftDoubleLine /> : <RiArrowRightDoubleLine />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
