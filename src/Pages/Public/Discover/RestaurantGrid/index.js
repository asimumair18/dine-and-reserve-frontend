import React from "react";
import "./style.css";
import RestaurantImage from "../../../../Assets/restaurant-display-img.png";
import LikeButton from "../../../../Components/Common/LikeButton";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const dummyRestaurants = Array(8).fill({
  name: "Restaurant 1",
  description: "Offering a wide range of reservation services",
  likes: 24,
  rating: "4.9",
  image: RestaurantImage,
});

const RestaurantGrid = () => {
  const navigate = useNavigate();

  return (
    <div className="restaurant-grid">
      <div className="grid">
        {dummyRestaurants.map((restaurant, index) => (
          <div className="card" key={index}>
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="image"
              onClick={() => navigate(`/restaurant/${index + 1}`)}
              style={{ cursor: "pointer" }}
            />
            <div className="info">
              <p className="title">{restaurant.name}</p>
              <p className="subtitle">{restaurant.description}</p>
            </div>
            <div className="card-footer">
              <div className="likes">
                <LikeButton selectedInitialState={false} />
                <span>{restaurant.likes}</span>
              </div>
              <div className="rating">{restaurant.rating}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="load-more-wrapper">
        <Button className="load-more">Load more</Button>
      </div>
    </div>
  );
};

export default RestaurantGrid;