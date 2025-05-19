import React from "react";
import "./style.css";
import Right from "../../../../Assets/Icons/right.svg";
import LikeButton from "../../../../Components/Common/LikeButton/index";
import RestaurantImg from "../../../../Assets/restaurant-display-img.png";
import { useNavigate } from "react-router-dom";

const RestaurantsList = ({ title }) => {
  const navigate = useNavigate();

  const dummyRestaurants = Array(6).fill({
    name: "Villa - The Grand Buffet",
    location: "Johar Town",
    rating: "4.9",
    liked: false,
    image: RestaurantImg,
  });

  return (
    <div className="restaurant-list">
      <div className="heading">{title}</div>
      <div className="list-container">
        <div className="list">
          {dummyRestaurants.map((restaurant, index) => (
            <div key={index} className="item">
              <div className="actions-menu-container">
                <div className="actions-menu">
                  <div className="rating-container">
                    <div className="rating">{restaurant.rating}</div>
                  </div>
                  <div className="like-container">
                    <LikeButton selectedInitialState={restaurant.liked} id={index} />
                  </div>
                </div>
                <img
                  src={restaurant.image}
                  width="220px"
                  height="220px"
                  alt={restaurant.name}
                  style={{ mixBlendMode: "multiply" }}
                />
              </div>
              <div className="restaurant-info">
                <p className="restaurant-name">{restaurant.name}</p>
                <p className="restaurant-subheading">{restaurant.location}</p>
                <div
                  className="view-restaurant"
                  onClick={() => {
                    navigate("/restaurant/" + index);
                  }}
                >
                  <p>View Restaurant</p>
                  <div className="arrow">
                    <img src={Right} alt="right" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantsList;