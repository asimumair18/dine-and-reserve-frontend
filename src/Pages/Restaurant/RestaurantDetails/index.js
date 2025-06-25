import React, { useState, useEffect } from "react";
import {
    Button,
    Form,
    Input,
    InputNumber,
    ConfigProvider,
    Upload,
    Modal,
} from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PlusOutlined } from "@ant-design/icons";
import "./style.css";
import ImageUpload from "../../../Components/Common/ImageUpload";

const { Dragger } = Upload;

const RestaurantDetails = () => {
    const [detailsForm] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [displayFiles, setDisplayFiles] = useState([[], [], [], [], []]);
    const [initialImages, setInitialImages] = useState([]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:5000/api/restaurant/profile", {
                    headers: { Authorization: "Bearer " + token },
                });

                if (!res.ok) throw new Error("Failed to fetch profile");
                const data = await res.json();

                // Set form values
                detailsForm.setFieldsValue({
                    restaurantName: data.restaurantName || data.fullName,
                    email: data.email,
                    phone: data.phone,
                    instagram: data.instagram,
                    address: data.restaurantAddress,
                    description: data.description,
                });

                // Set initial images
                const images = [];
                if (data.mainImage) images[0] = data.mainImage;
                if (data.displayImages) {
                    data.displayImages.forEach((img, idx) => {
                        if (idx < 4) images[idx + 1] = img;
                    });
                }
                setInitialImages(images);

            } catch (err) {
                toast.error(err.message);
            }
        };

        fetchProfile();
    }, []);


    const onFinishDetails = async (vals) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/restaurant/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify(vals),
            });

            if (res.ok) {
                toast.success("Details updated successfully");
            } else {
                toast.error("Failed to update details");
            }
        } catch (err) {
            toast.error("Error updating details");
        }
    };

    const onFinishPassword = async (vals) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/user/change-password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify(vals),
            });

            if (res.ok) {
                toast.success("Password changed successfully");
                passwordForm.resetFields();
            } else {
                toast.error("Failed to change password");
            }
        } catch (err) {
            toast.error("Error changing password");
        }
    };

    const handleImageUpload = async () => {
        try {
            const token = localStorage.getItem("token");
            const imageUrls = await Promise.all(
                displayFiles.map(async (fileList, idx) => {
                    if (fileList.length > 0) {
                        const formData = new FormData();
                        formData.append("file", fileList[0].originFileObj);

                        const res = await fetch("http://localhost:5000/api/user/upload", {
                            method: "POST",
                            headers: { Authorization: "Bearer " + token },
                            body: formData,
                        });

                        const data = await res.json();
                        return data.url;
                    }
                    return null;
                })
            );

            // Send URLs to backend
            await fetch("http://localhost:5000/api/restaurant/images", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    mainImage: imageUrls[0],
                    displayImages: imageUrls.slice(1).filter(url => url !== null)
                }),
            });

            toast.success("Images uploaded successfully");
            setDisplayFiles([[], [], [], [], []]);
        } catch (err) {
            toast.error("Error uploading images");
        }
    };

    // helper to render each of the five slots
    const renderDragger = (idx) => {
        const file = displayFiles[idx][0];
        const initialImg = initialImages[idx];

        return (
            <div className="custom-upload-wrapper">
                <Dragger
                    listType="picture-card"
                    fileList={[]}
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={({ fileList }) => {
                        const next = [...displayFiles];
                        next[idx] = fileList.slice(-1);
                        setDisplayFiles(next);
                    }}
                >
                    {file ? (
                        <img
                            src={URL.createObjectURL(file.originFileObj)}
                            alt="preview"
                            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 5 }}
                        />
                    ) : initialImg ? (
                        <img
                            src={`http://localhost:5000${initialImg}`}
                            alt="preview"
                            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 5 }}
                        />
                    ) : (
                        <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                            {idx === 0 && <div className="main-image-label">Main Image</div>}
                        </div>
                    )}
                </Dragger>
            </div>
        );
    };
    return (
        <div className="restaurant-account-settings">
            {/* Restaurant Details */}
            <div className="account-details">
                <div className="left-container">
                    <div className="section-title">Restaurant Details</div>
                    <div className="section-info">
                        Update your restaurant details and keep your profile information current.
                    </div>
                </div>
                <div className="right-container">
                    <div className="form-container">
                        <div className="form-title">Edit Details</div>
                        <Form
                            form={detailsForm}
                            layout="vertical"
                            onFinish={onFinishDetails}
                            initialValues={{
                                restaurantName: "",
                                email: "",
                                phone: "",
                                instagram: "",
                                address: "",
                                description: "",
                            }}
                        >
                            <Form.Item
                                label="Restaurant Name"
                                name="restaurantName"
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </Form.Item>
                            <div className="form-row">
                                <Form.Item
                                    label="Email Address"
                                    name="email"
                                    rules={[{ required: true, type: "email" }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="Phone Number"
                                    name="phone"
                                    rules={[{ required: true }]}
                                >
                                    <Input />
                                </Form.Item>
                            </div>
                            <div className="form-row">
                                <Form.Item label="Instagram ID" name="instagram">
                                    <Input />
                                </Form.Item>
                                <Form.Item label="—" style={{ visibility: "hidden" }}>
                                    <Input disabled />
                                </Form.Item>
                            </div>
                            <Form.Item
                                label="Address"
                                name="address"
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Restaurant Description"
                                name="description"
                                rules={[{ required: true }]}
                            >
                                <Input.TextArea rows={3} />
                            </Form.Item>
                            <Form.Item>
                                <div className="form-footer">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="submit-button"
                                    >
                                        Confirm
                                    </Button>
                                </div>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>

            <hr className="divider-line" />

            {/* Password & Security */}
            <div className="password-and-security">
                <div className="left-container">
                    <div className="section-title">Password & Security</div>
                    <div className="section-info">
                        Ensure your account stays secure with password management and security
                        settings.
                    </div>
                </div>
                <div className="right-container">
                    <div className="form-container-passwords">
                        <div className="form-title">Change your Password</div>
                        <Form
                            form={passwordForm}
                            layout="vertical"
                            onFinish={onFinishPassword}
                        >
                            <Form.Item
                                label="Current Password"
                                name="currentPassword"
                                rules={[{ required: true }]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                label="New Password"
                                name="newPassword"
                                rules={[{ required: true }]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item>
                                <div className="form-footer">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="submit-button"
                                    >
                                        Confirm
                                    </Button>
                                </div>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>

            <hr className="divider-line" />

            {/* Display Images */}
            <div className="display-images-section">
                <div className="left-container">
                    <div className="section-title">Display Images</div>
                    <div className="section-info">
                        Upload your main display image and four additional images.
                    </div>
                </div>
                <div className="right-container">
                    <div className="display-upload-grid">
                        {renderDragger(0) /* main image slot */}
                        {renderDragger(1)}
                        {renderDragger(2)}
                        {renderDragger(3)}
                        {renderDragger(4)}
                    </div>
                    <div className="form-footer">
                        <Button
                            type="primary"
                            className="submit-button"
                            onClick={handleImageUpload}
                        >
                            Confirm
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantDetails;
