import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import Logo from "../../../Assets/logo-dark.png";
import "./style.css";

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <img src={Logo} alt="Dine&Reserve" className="error-logo" />
      <h1>403 - Access Denied</h1>
      <p>You don’t have permission to view this page.</p>
      <Button type="primary" className="submit-button" onClick={() => navigate("/")}>
        Go to Home
      </Button>
    </div>
  );
};

export default Forbidden;
