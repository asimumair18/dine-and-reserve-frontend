// src/layouts/RestaurantSettingsLayout.js
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import { Outlet } from "react-router-dom";
import "./settingStyle.css";

export default function RestaurantSettingsLayout() {
  return (
    <>
      <Navbar />
      <div className="settings-page">
        <Sidebar />
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </>
  );
}
