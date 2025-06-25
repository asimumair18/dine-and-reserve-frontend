import React, { useState, useEffect } from "react";
import "./style.css";
import Right from "../../../Assets/Icons/right.svg";
import { useNavigate } from "react-router-dom";
import LikeButton from "../../../Components/Common/LikeButton/index";
import { toast } from "react-toastify";
import DefaultRestaurantImage from "../../../Assets/restaurant-display-img.png";

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/user/favorites", {
        headers: { Authorization: "Bearer " + token },
      });

      if (!res.ok) throw new Error("Failed to fetch favorites");
      const data = await res.json();
      setFavorites(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (restaurantId, isFavorite) => {
    console.log("Toggling favorite:", restaurantId, isFavorite);
    try {
      const token = localStorage.getItem("token");
      const method = isFavorite ? "DELETE" : "POST";

      const res = await fetch(
        `http://localhost:5000/api/user/favorites/${restaurantId}`,
        {
          method,
          headers: { Authorization: "Bearer " + token },
        }
      );

      if (!res.ok) throw new Error(`Failed to ${isFavorite ? "remove" : "add"} favorite`);

      // Remove from UI if deleted
      if (isFavorite) {
        setFavorites((prev) => prev.filter((r) => r._id !== restaurantId));
      } else {
        await fetchFavorites(); // fallback for adding
      }

      toast.success(`Restaurant ${isFavorite ? "removed from" : "added to"} favorites`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="loading-state">Loading...</div>;

  return (
    <div className="favourites-container">
      <div className="favourites">
        <div className="text-section">
          <p className="heading">Liked Restaurants</p>
          <p className="text">Browse through the restaurants you've chosen as favorites</p>
        </div>
        <div className="selection">
          <p className="subheading">Favorites</p>
          <div className="favorites-grid">
            {favorites.length ? (
              favorites.map((restaurant) => {
                let imageSrc = DefaultRestaurantImage;
                if (restaurant.mainImage) {
                  imageSrc = `http://localhost:5000${restaurant.mainImage}`;
                } else if (restaurant.displayImages?.[0]) {
                  imageSrc = `http://localhost:5000${restaurant.displayImages[0]}`;
                }

                return (
                  <div key={restaurant._id} className="item">
                    <div className="actions-menu-container">
                      <div className="actions-menu">
                        <div className="rating-container">
                          <div className="rating">
                            {restaurant.averageRating?.toFixed(1) || 4.5}
                          </div>
                        </div>
                        <div className="like-container">
                          <LikeButton
                            isFavorite={true}
                            onToggle={() => handleToggleFavorite(restaurant._id, true)}
                          />
                        </div>
                      </div>
                      <img
                        src={imageSrc}
                        className="favorite-img"
                        alt={restaurant.fullName}
                        onError={(e) => {
                          e.target.src = DefaultRestaurantImage;
                        }}
                      />
                    </div>
                    <div className="restaurant-info">
                      <p className="restaurant-name">{restaurant.fullName}</p>
                      <p className="restaurant-subheading">{restaurant.restaurantAddress}</p>
                      <div
                        className="view-restaurant"
                        onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                      >
                        <p>View Restaurant</p>
                        <div className="arrow">
                          <img src={Right} alt="right" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-data">
                <p>No favorites yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <hr />
    </div>
  );
};

export default Favorites;
