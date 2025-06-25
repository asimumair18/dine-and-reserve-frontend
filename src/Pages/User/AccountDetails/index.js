import "./style.css";
import { Button, Form, Input, ConfigProvider } from "antd";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ImageUpload from "../../../Components/Common/ImageUpload/index";

const AccountDetails = () => {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [imageData, setImageData] = useState(null);
  const [imageObj, setImageObj] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/user/profile", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setUserData(data.user);

        // Set form and image after successful fetch
        form.setFieldsValue({
          fullName: data.user.fullName,
          phone: data.user.phone,
          email: data.user.email,
        });
        setImageData(data.user.profilePhoto);
      } catch (err) {
        console.error("Failed to fetch user profile:", err.message);
        toast.error("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);


  const onFinish = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const payload = { ...values };

      if (imageObj) {
        const imageForm = new FormData();
        imageForm.append("file", imageObj);

        const imageRes = await fetch("http://localhost:5000/api/user/upload", {
          method: "POST",
          headers: { Authorization: "Bearer " + token },
          body: imageForm,
        });

        const imageData = await imageRes.json();
        payload.profilePhoto = imageData.url;
      }

      const res = await fetch("http://localhost:5000/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Update error:", err.message);
      toast.error("Failed to update profile: " + err.message);
    }
  };


  const onFinishPassword = async (values) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/user/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Password changed successfully");
      form2.resetFields();
    } catch (err) {
      console.error("Password change error:", err.message);
      toast.error("Failed to change password: " + err.message);
    }
  };

  if (loading) return <div className="loading-state">Loading...</div>;

  return (
    <div className="user-account-settings">
      <div className="account-details">
        <div className="left-container">
          <div className="section-title">Account Details</div>
          <div className="section-info">
            Update your profile details and keep your profile information current.
          </div>
        </div>
        <div className="right-container">
          <div className="form-container">
            <div className="form-title">Edit Details</div>
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item label="Profile Picture" name="profilePhoto">
                <ImageUpload
                  imageData={imageData}
                  setImageData={setImageData}
                  setImageObj={setImageObj}
                />
              </Form.Item>
              <div className="form-row">
                <Form.Item label="Full Name" name="fullName">
                  <Input />
                </Form.Item>
                <Form.Item label="Phone Number" name="phone">
                  <Input />
                </Form.Item>
              </div>
              <Form.Item label="Email Address" name="email">
                <Input />
              </Form.Item>
              <Form.Item>
                <div className="form-footer">
                  <Button type="primary" htmlType="submit" className="submit-button">
                    Confirm
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>

      <hr style={{ height: "2px", backgroundColor: "grey", border: "none" }} />

      <div className="password-and-security">
        <div className="left-container">
          <div className="section-title">Password & Security</div>
          <div className="section-info">
            Ensure your account stays secure with password management and security settings.
          </div>
        </div>
        <div className="right-container">
          <div className="form-container-passwords">
            <div className="form-title">Change your Password</div>
            <Form form={form2} layout="vertical" onFinish={onFinishPassword}>
              <Form.Item label="Current Password" name="oldPassword">
                <Input.Password />
              </Form.Item>
              <Form.Item label="New Password" name="newPassword">
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <div className="form-footer">
                  <Button type="primary" htmlType="submit" className="submit-button">
                    Confirm
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
