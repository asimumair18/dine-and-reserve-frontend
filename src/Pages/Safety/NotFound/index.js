import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import Logo from "../../../Assets/logo-dark.png";
import "./style.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <img src={Logo} alt="Dine&Reserve" className="error-logo" />
      <h1>404 - Page Not Found</h1>
      <p>The page you’re looking for doesn’t exist.</p>
      <Button type="primary" className="submit-button" onClick={() => navigate("/")}>
        Go to Home
      </Button>
    </div>
  );
};

export default NotFound;
