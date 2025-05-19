import React, { useState } from "react";
import "./style.css";
import Logo from "../../../../Assets/logo-dark.png";
import { Button, Checkbox, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    console.log("Login Values:", values);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/"); // Simulated login
    }, 1000);
  };

  return (
    <div className="signin">
      <div className="container">
        <img
          src={Logo}
          alt="dine&reserve"
          onClick={() => navigate("/")}
        />
        <p className="heading">Welcome Back!</p>

        <Form
          style={{ width: 350, marginTop: "40px" }}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Email address"
            name="email"
            rules={[{ required: true, message: "Please enter your email" }]}
            style={{ marginBottom: "5px" }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
            style={{ marginBottom: "5px" }}
          >
            <Input.Password />
          </Form.Item>

          <div className="message-container j-space-between">
            <div className="message-container">
              <Checkbox />
              <p>Remember me</p>
            </div>
            <a href="/forgot-password">Forgot your password?</a>
          </div>

          <Form.Item>
            <div className="message-container">
              <Button
                type="primary"
                htmlType="submit"
                className="submit-button"
                disabled={loading}
                loading={loading}
              >
                Log In
              </Button>
            </div>

            <div className="message-container footer">
              <p>Don't have an account yet?</p>
              <Button className="signup-button" onClick={() => navigate("/signup")}>Sign up</Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
