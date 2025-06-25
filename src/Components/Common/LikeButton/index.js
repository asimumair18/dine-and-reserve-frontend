import { HeartFilled } from "@ant-design/icons";
import { useState } from "react";
import "./style.css";

const LikeButton = ({
  isFavorite = false,
  onToggle,
  disabled = false,
}) => {
  const [selected, setSelected] = useState(isFavorite);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (disabled || loading) return;
    console.log("LikeButton clicked");

    setLoading(true);
    try {
      if (typeof onToggle === "function") {
        await onToggle();
        setSelected((prev) => !prev); // Toggle heart icon state
      }
    } catch (err) {
      console.error("Favorite toggle failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="like" onClick={handleClick}>
      <HeartFilled
        className={`${selected ? "selected-" : ""}like-button`}
        spin={loading}
      />
    </div>
  );
};

export default LikeButton;
