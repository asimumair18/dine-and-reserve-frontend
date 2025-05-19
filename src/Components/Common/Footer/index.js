import React from "react";
import "./style.css";
import CouSync from "../../../Assets/Icons/cousync.jpeg";
import { useTranslation } from "react-i18next";
import { IoLogoInstagram } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="footer">
      <hr />
      <div className="body">
        <div className="left">
          <div>
            <div className="title-container">
              <p className="title">Better Lady HK</p>
              <div
                className="shop-info"
                onClick={() =>
                  window.open(
                    "https://www.instagram.com/betterladyhk/",
                    "_blank"
                  )
                }
              >
                <IoLogoInstagram color="purple" className="social-icon" />
              </div>
            </div>

            <p>{t("ultimateBeautyGuide2024")}</p>
          </div>
          <div
            className="link"
            onClick={() => window.open("https://www.cousync.com", "_blank")}
          >
            <p>{t("poweredBy")} </p>
            <img src={CouSync} alt="CouSync.com" />
          </div>
        </div>
        <div className="right">
          <p className="clickable-option" onClick={() => navigate("/about-us")}>
            {t("aboutUs")}
          </p>
          <p className="clickable-option" onClick={() => navigate("/faq")}>
            {t("faq")}
          </p>
          <p
            className="clickable-option"
            onClick={() => navigate("/privacy-policy")}
          >
            {t("privacyPolicy")}
          </p>
          <p
            className="clickable-option"
            onClick={() => navigate("/terms&conditions")}
          >
            {t("terms&Conditions")}
          </p>
          <p
            className="clickable-option"
            onClick={() => navigate("/contact-us")}
          >
            {t("contactUs")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
