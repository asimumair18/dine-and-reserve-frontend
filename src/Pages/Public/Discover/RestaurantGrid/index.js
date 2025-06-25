import React, { useEffect, useState } from "react";
import "./style.css";
import LikeButton from "../../../../Components/Common/LikeButton";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const RestaurantGrid = ({ filter, sortBy }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 8;
  const navigate = useNavigate();

  const fetchRestaurants = async (offsetToUse = 0, replace = false) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        filter,
        sortBy,
        offset: offsetToUse,
        limit,
      });

      const res = await fetch(`/api/restaurants/discover?${params}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        if (replace) {
          setRestaurants(data);
        } else {
          setRestaurants((prev) => [...prev, ...data]);
        }

        setOffset(offsetToUse + data.length);
        setHasMore(data.length === limit);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to fetch restaurants:", err);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/user/favorites", {
        headers: { Authorization: "Bearer " + token },
      });
      const data = await res.json();
      const ids = data.map((r) => r._id);
      setFavorites(ids);
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
    }
  };

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

  useEffect(() => {
    setRestaurants([]);
    setOffset(0);
    setHasMore(true);
    fetchRestaurants(0, true);
    fetchFavorites();
  }, [filter, sortBy]);

  return (
    <div className="restaurant-grid">
      <div className="grid">
        {restaurants.length === 0 && !isLoading ? (
          <div className="empty-text">No restaurants available.</div>
        ) : (
          restaurants.map((restaurant, index) => (
            <div className="card" key={restaurant._id || index}>
              <img
                src={
                  restaurant.displayImages?.[0]
                    ? restaurant.displayImages[0].startsWith("/uploads/")
                      ? restaurant.displayImages[0]
                      : `/uploads/${restaurant.displayImages[0]}`
                    : "/fallback.jpg"
                }
                alt={restaurant.fullName}
                className="image"
                onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                style={{ cursor: "pointer" }}
              />
              <div className="info">
                <p className="title">{restaurant.fullName}</p>
                <p className="subtitle">
                  {restaurant.description
                    ? restaurant.description.split(" ").slice(0, 10).join(" ").slice(0, 90) + "..."
                    : "No description available."}
                </p>
              </div>
              <div className="card-footer">
                <div className="likes">
                  <LikeButton
                    isFavorite={favorites.includes(restaurant._id)}
                    onToggle={() =>
                      handleToggleFavorite(restaurant._id, favorites.includes(restaurant._id))
                    }
                  />
                </div>
                <div className="rating">{restaurant.averageRating?.toFixed(1) || "Not Rated"}</div>
              </div>
            </div>
          ))
        )}
      </div>
      {hasMore && (
        <div className="load-more-wrapper">
          <Button
            className="load-more"
            onClick={() => fetchRestaurants(offset)}
            loading={isLoading}
          >
            Load more
          </Button>
        </div>
      )}
    </div>
  );
};

export default RestaurantGrid;
