import React from "react";
import "./style.css";
import RestaurantsList from "./RestaurantsList/index";
import BuffetImg from "../../../Assets/hero-display-img.png";
import Right from "../../../Assets/Icons/right.svg";
import Left from "../../../Assets/Icons/left.svg";
import { Button } from "antd";
import { CompassOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">

      {/* <hr /> */}

      <div className="container">
        <div className="main-image-container">
          <img src={BuffetImg} alt="Buffet" width="178" className="main-image" />
          <div className="discover-section">
            <h1 className="heading">Discover High-Tea & Buffets in your City</h1>
            <p className="description">Find your perfect seating spot</p>
          </div>
        </div>
        <div className="options">
          <img src={Left} alt="left" />
          <Button
            className="purple"
            icon={<CompassOutlined />}
            onClick={() => navigate("/discover")}
          >
            Discover High-Teas
          </Button>
          <img src={Right} alt="right" />
        </div>

        <RestaurantsList title="Restaurants Nearby" />
        <RestaurantsList title="Recommended For You" />
      </div>

    </div>
  );
};

export default Home;