import React, { useState } from "react";
import "./style.css";
import Logo from "../../../../Assets/logo-dark.png";
import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    console.log("Reset Password:", values);
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
        <p className="heading">Please enter your new password</p>
        <Form
          style={{ width: 350, marginTop: "40px" }}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="New Password"
            name="password"
            style={{ marginBottom: "5px" }}
            rules={[{ required: true, message: "Please enter a password" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirm-password"
            style={{ marginBottom: "5px" }}
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <div className="message-container">
              <Button
                type="primary"
                htmlType="submit"
                className="submit-button"
                loading={loading}
              >
                Reset Password
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
