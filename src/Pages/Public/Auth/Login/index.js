import React, { useState } from "react";
import "./style.css";
import Logo from "../../../../Assets/logo-dark.png";
import { Button, Checkbox, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../../../Context/UserContext";
import profilePic from "../../../../Assets/profile-picture.png";
import { toast } from "react-toastify";


const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setUserData, setUserToken } = useContext(UserContext);


  const onFinish = async (values) => {
    const { email, password } = values;
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      setUserData({
        username: data.user.email,
        email: data.user.email,
        name: data.user.fullName,
        role: data.user.userType,
        profile_photo: data.user.profilePhoto || profilePic,
        _id: data.user._id,
      });

      setUserToken(data.token);
      localStorage.setItem("token", data.token);

      navigate(data.user.userType === "restaurant" ? "/restaurant/dashboard" : "/");
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
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

          {/* <div className="message-container j-space-between">
            <div className="message-container">
              <Checkbox />
              <p>Remember me</p>
            </div>
            <a href="/forgot-password">Forgot your password?</a>
          </div> */}

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
