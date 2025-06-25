import React, { useEffect, useState } from "react";
import "./style.css";
import Right from "../../../../Assets/Icons/right.svg";
import LikeButton from "../../../../Components/Common/LikeButton/index";
import { useNavigate } from "react-router-dom";

const RestaurantsList = ({ title }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  const type = title.toLowerCase().includes("recommended") ? "recommended" : "general";

  useEffect(() => {
    fetch(`/api/restaurants?type=${type}`)
      .then((res) => res.json())
      .then((data) => setRestaurants(data))
      .catch((err) => {
        console.error("Failed to fetch restaurants", err);
        setRestaurants([]);
      });

    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/user/favorites", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => setFavorites(data.map((r) => r._id)))
      .catch(console.error);
  }, [type]);

  const handleToggleFavorite = async (restaurantId, isFavorite) => {
    const token = localStorage.getItem("token");
    const method = isFavorite ? "DELETE" : "POST";

    const res = await fetch(`http://localhost:5000/api/user/favorites/${restaurantId}`, {
      method,
      headers: { Authorization: "Bearer " + token },
    });

    if (!res.ok) return;

    setFavorites((prev) =>
      isFavorite ? prev.filter((id) => id !== restaurantId) : [...prev, restaurantId]
    );
  };

  return (
    <div className="restaurant-list">
      <div className="heading">{title}</div>
      <div className="list-container">
        {restaurants.length === 0 ? (
          <div className="empty-text">No restaurants available.</div>
        ) : (
          <div className="list">
            {restaurants.map((restaurant, index) => (
              <div key={index} className="item">
                <div className="actions-menu-container">
                  <div className="actions-menu">
                    <div className="rating-container">
                      <div className="rating">{restaurant.averageRating?.toFixed(1) || "Not Rated"}</div>
                    </div>
                    <div className="like-container">
                      <LikeButton
                        isFavorite={favorites.includes(restaurant._id)}
                        onToggle={() =>
                          handleToggleFavorite(restaurant._id, favorites.includes(restaurant._id))
                        }
                      />
                    </div>
                  </div>
                  <img
                    src={
                      restaurant.displayImages?.[0]
                        ? restaurant.displayImages[0].startsWith('/uploads/')
                          ? restaurant.displayImages[0]
                          : `/uploads/${restaurant.displayImages[0]}`
                        : "/fallback.jpg"
                    }
                    width="220px"
                    height="220px"
                    alt={restaurant.fullName}
                    style={{ mixBlendMode: "multiply" }}
                  />
                </div>
                <div className="restaurant-info">
                  <p className="restaurant-name">{restaurant.fullName}</p>
                  <p className="restaurant-subheading">{restaurant.restaurantAddress}</p>
                  <div
                    className="view-restaurant"
                    onClick={() => navigate("/restaurant/" + restaurant._id)}
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
        )}
      </div>
    </div>
  );
};

export default RestaurantsList;
