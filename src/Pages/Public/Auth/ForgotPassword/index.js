import React, { useState } from "react";
import "./style.css";
import Logo from "../../../../Assets/logo-dark.png";
import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    console.log("Forgot Password Request:", values);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="signin">
      <div className="container">
        <img
          src={Logo}
          alt="dine&reserve"
          onClick={() => navigate("/")}
        />
        <p className="heading">Please enter your email</p>
        <Form
          style={{ width: 350, marginTop: "40px" }}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Email address"
            name="email"
            style={{ marginBottom: "5px" }}
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <div className="message-container">
              <Button
                type="primary"
                htmlType="submit"
                className="submit-button"
                loading={loading}
              >
                Verify Email
              </Button>
            </div>
            <div className="message-container">
              <Button className="back-button" onClick={() => navigate(-1)}>
                Go Back
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;
