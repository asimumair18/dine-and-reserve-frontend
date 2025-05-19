import React from "react";
import "./style.css";

const Level = ({ backgroundColor, level }) => {
  return (
    <div
      className="level"
      style={{ backgroundColor: backgroundColor || "white" }}
    >
      {level}
    </div>
  );
};

export default Level;
