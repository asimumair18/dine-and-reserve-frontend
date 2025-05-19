import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import LogoDark from "../../Assets/logo-dark.png"; 
import "./style.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Restaurant Details", path: "/restaurant/settings/restaurant-details" },
    { label: "Dietary & Serving Info", path: "/restaurant/settings/dietary-info" },
    { label: "Timings", path: "/restaurant/settings/timings" },
  ];

  const handleLogout = () => {
    navigate("/login"); // Replace with logout logic if needed
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

export default Sidebar;
