import { HeartFilled } from "@ant-design/icons";
import { useState } from "react";
import "./style.css";

const LikeButton = ({
  selectedInitialState,
  disabled = false,
}) => {
  const [selected, setSelected] = useState(selectedInitialState);

  const handleChange = () => {
    if (disabled) return;
    setSelected(!selected);
  };

  return (
    <div className="like" onClick={handleChange}>
      <HeartFilled className={`${selected ? "selected-" : ""}like-button`} />
    </div>
  );
};

export default LikeButton;
