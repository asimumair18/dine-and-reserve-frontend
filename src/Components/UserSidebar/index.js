// src/Components/UserSidebar/index.js
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import LogoDark from "../../Assets/logo-dark.png"; 
import "./style.css";

const UserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Account Details", path: "/user/settings/account-details" },
    { label: "Preferences", path: "/user/settings/preferences" },
    { label: "Favorites", path: "/user/settings/favorites" },
  ];

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="custom-sidebar">
      <div className="sidebar-logo">
        <img src={LogoDark} alt="Dine&Reserve" className="logo-icon" />
      </div>

      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <div
            key={item.label}
            className={`sidebar-item ${
              location.pathname === item.path ? "active" : ""
            }`}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </div>
        ))}
      </div>

      <button className="logout-button" onClick={handleLogout}>
        <UserOutlined />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default UserSidebar;
