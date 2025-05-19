import { Button, Modal } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import MyMap from "./map";
import "./style.css";

const LocationModal = ({ open, setOpen, location, setLocation }) => {
  const { t } = useTranslation();
  const [locationValue, setLocationValue] = useState(location);
  const handleLocationConfirm = () => {
    setLocation(locationValue);
    setOpen(false);
  };

  return (
    <Modal open={open} onCancel={() => setOpen(false)} footer={null}>
      <MyMap locationValue={location} setLocationValue={setLocationValue} />
      <Button className="button2" onClick={() => handleLocationConfirm()}>
        {t("select")}
      </Button>
    </Modal>
  );
};

export default LocationModal;
