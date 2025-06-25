// src/layouts/UserSettingsLayout.js
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import UserSidebar from "../Components/UserSidebar";
import { Outlet } from "react-router-dom";
import "./settingStyle.css";

export default function UserSettingsLayout() {
  return (
    <>
      <Navbar title="Settings" style={{ paddingTop: "0px", paddingBottom: "0px", height: "auto" }} />

      <div className="settings-page">
        <UserSidebar />
        <div className="main-content">
          <Outlet />
        </div>
      </div>

      <Footer />
    </>
  );
}
