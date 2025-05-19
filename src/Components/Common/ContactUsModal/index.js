import { Button, Checkbox, Form, Input, Modal, notification } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { review } from "../../../API/rating";
import { contact } from "../../../API/user";
import "./style.css";

const ContactUsModal = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const { t } = useTranslation();

  const handleClose = () => {
    setOpen(false);
  };

  const onFinish = async (values) => {
    setLoading(true);
    values.news = values.news ? true : false;
    const res = await contact(values);
    if (Math.floor(res?.status / 100) === 2) {
    } else {
      api["error"]({
        message: t("fetchingFailed"),
        description: res?.response?.data?.detail,
      });
    }
    setOpen(false);
    setLoading(false);
  };

  const onFinishFailed = (values) => {
    console.error(values);
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        onCancel={handleClose}
        onOk={handleClose}
        footer={false}
        className="review-modal"
      >
        <Form
          style={{
            width: 350,
            marginTop: "40px",
          }}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div>
            <p>{t("name")}</p>
          </div>
          <div className="double-items">
            <Form.Item
              label={t("firstName")}
              name="first_name"
              style={{ marginBottom: "5px" }}
              rules={[
                {
                  required: true,
                  message: t("selectWarning"),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={t("lastName")}
              name="last_name"
              style={{ marginBottom: "5px" }}
              rules={[
                {
                  required: true,
                  message: t("selectWarning"),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </div>

          <Form.Item
            label={t("email")}
            name="email"
            rules={[
              {
                required: true,
                message: t("selectWarning"),
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="news" style={{ marginBottom: "5px" }}>
            <div className="gap-items">
              <Checkbox />
              <span>{t("signupForNews")}</span>
            </div>
          </Form.Item>

          <Form.Item
            label={t("message")}
            name="message"
            style={{ marginBottom: "5px" }}
            rules={[
              {
                required: true,
                message: t("selectWarning"),
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="submit-button"
              disabled={loading}
              loading={loading}
            >
              {t("submit")}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ContactUsModal;
