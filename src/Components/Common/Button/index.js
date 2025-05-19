import React from "react";
import { Button as BUTTON } from "antd";
import "./style.css";

const Button = ({
  icon,
  htmlType,
  children,
  type,
  onClick,
  disabled,
  loading,
}) => {
  // const buttonStyles = {
  //   primary: {
  //     color: colors.white,
  //     backgroundColor: colors.primaryBlue,
  //     border: "",
  //   },
  //   secondary: {
  //     color: colors.black,
  //     backgroundColor: colors.grey,
  //     border: "",
  //   },
  //   cancel: {
  //     color: colors.white,
  //     backgroundColor: colors.red,
  //     border: "",
  //   },
  //   white: {
  //     color: colors.primaryBlue,
  //     backgroundColor: colors.white,
  //     border: "",
  //     className: "!bg-red",
  //   },
  //   logout: {
  //     color: "#FF3750",
  //     backgroundColor: "",
  //     className: "",
  //     border: "1px solid #FF3750",
  //   },
  //   browseImage: {
  //     color: colors.primaryBlue,
  //     backgroundColor: "transparent",
  //     border: "1.486px solid #4A83FD",
  //   },
  // };

  return (
    // <div className="button-container">
    <BUTTON
      className={`${type}`}
      disabled={disabled}
      loading={loading}
      onClick={onClick}
      htmlType={htmlType}
    >
      {icon ? <img src={icon} alt={children} /> : ""}
      {children}
    </BUTTON>
    // </div>
  );
};

export default Button;
