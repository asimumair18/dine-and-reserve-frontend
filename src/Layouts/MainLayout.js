import Navbar from "../Components/Navbar/index";
import Footer from "../Components/Footer/index"; // corrected path
import { Outlet } from "react-router-dom";
import "./settingStyle.css"; 

export default function MainLayout() {
  return (
    <div className="layout">
      <Navbar />
      <div className="layout-content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
