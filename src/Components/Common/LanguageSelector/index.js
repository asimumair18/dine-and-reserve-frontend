import { ConfigProvider, Switch } from "antd";
import { useTranslation } from "react-i18next";
import React from "react";
import "./style.css";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const handleChange = (checked) => {
    const newLanguage = checked ? "en" : "zh";
    i18n.changeLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
  };
  const isEnglish = localStorage.getItem("language") === "en";
  return (
    <ConfigProvider
      theme={{
        token: {
          colorTextQuaternary: "#78589F",
          colorTextTertiary: "#785990",
          colorPrimary: "#a291b7",
          colorPrimaryHover: "#9582ad",
          colorTextPlaceholder: "black",
        },
      }}
    >
      <Switch
        className="switch"
        checkedChildren="English"
        unCheckedChildren="中文"
        defaultChecked={isEnglish}
        onChange={handleChange}
      />
    </ConfigProvider>
  );
};

export default LanguageSelector;
