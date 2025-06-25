import {
  ArrowLeftOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, Dropdown } from "antd";
import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import Logo from "../../Assets/logo-dark.png";
import "./style.css";

const Navbar = ({ title = "Discover", buttons = true, style }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, setUserData, setUserToken } = useContext(UserContext);

  const items = [
    {
      key: "1",
      label: "Settings",
      icon: <SettingOutlined />,
      onClick: () => {
        if (userData?.role === "restaurant") {
          navigate("/restaurant/settings/restaurant-details");
        } else {
          navigate("/user/settings/account-details");
        }
      },
    },
    {
      key: "2",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: () => {
        setUserData(null);
        setUserToken(null);
        navigate("/");
      },
    },
  ];

  const getInitials = () =>
    userData?.name?.slice(0, 1).toUpperCase() || "U";

  const isHome = location.pathname === "/";

  return (
    <div className="navbar" style={style}>
      {isHome ? (
        <img
          src={Logo}
          alt="Dine&Reserve"
          width={150}
          className="navbar-logo"
          onClick={() => navigate("/")}
        />
      ) : (
        <div className="back-container">
          <ArrowLeftOutlined onClick={() => navigate(-1)} />
          <p>{title}</p>
        </div>
      )}

      <div className="user-info-language">
        {userData?.username ? (
          <div className="user-info-container">
            <Dropdown menu={{ items }} placement="bottomRight">
              {userData?.profile_photo ? (
                <div className="profile-photo">
                  <img
                    src={userData.profile_photo}
                    alt={userData.username}
                  />
                </div>
              ) : (
                <div className="user-initials">{getInitials()}</div>
              )}
            </Dropdown>
          </div>
        ) : (
          buttons && (
            <div className="header-buttons">
              <Button className="brown" onClick={() => navigate("/signup")}>
                Signup
              </Button>
              <Button className="yellow" onClick={() => navigate("/login")}>
                Login
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Navbar;