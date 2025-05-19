// src/layouts/UserSettingsLayout.js
import Navbar from "../Components/Navbar";
import UserSidebar from "../Components/UserSidebar";
import { Outlet } from "react-router-dom";
import "./settingStyle.css";

export default function UserSettingsLayout() {
  return (
    <>
      <Navbar />
      <div className="settings-page">
        <UserSidebar />
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </>
  );
}
