import React, { useState, useEffect } from "react";
import "./style.css";
import Logo from "../../../../Assets/logo-dark.png";
import { Button, Form, Input, Select, Checkbox } from "antd";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import { toast } from "react-toastify";


const Signup = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1); // page 1 for details, page 2 for password
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(false);
    const [role, setRole] = useState(null);

    const onFinish = async (values) => {
        setLoading(true);
        const { name, email, phone, role, password, address } = values;

        try {
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: name,
                    email,
                    phone,
                    userType: role === "restaurant" ? "restaurant" : "diner",
                    restaurantAddress: address || "",
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Signup failed");
            }

            toast.success("Registration successful! Please log in.");
            navigate("/login");
        } catch (err) {
            toast.error(err.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };




    useEffect(() => {
        const currentRole = form.getFieldValue("role");
        if (currentRole) setRole(currentRole);
    }, [form]);

    return (
        <div className="signup">
            <div className="container">
                <img
                    src={Logo}
                    alt="dine&reserve"
                    onClick={() => navigate("/")}
                />
                <p className="heading">Welcome to Dine&Reserve!</p>
                <p className="description">To enjoy all our reservation services, please fill out the form below:</p>

                <Form
                    form={form}
                    style={{
                        width: 350,
                        marginBottom: "none",
                    }}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <div style={{ display: page === 1 ? "block" : "none" }}>
                        <Form.Item
                            label="Register as Diner/Restaurant"
                            name="role"
                            rules={[{ required: true, message: "Please select a role" }]}
                            style={{ marginBottom: "5px" }}
                        >
                            <Select
                                placeholder="Select your role"
                                onChange={(value) => setRole(value)}
                                options={[
                                    { value: "user", label: "Diner" },
                                    { value: "restaurant", label: "Restaurant" },
                                ]}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Full Name"
                            name="name"
                            style={{ marginBottom: "5px" }}
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your full name",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Email Address"
                            name="email"
                            style={{ marginBottom: "5px" }}
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter a valid email address",
                                },
                            ]}
                        >
                            <Input type="email" />
                        </Form.Item>

                        <Form.Item
                            label="Phone Number"
                            name="phone"
                            style={{ marginBottom: "5px" }}
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your phone number",
                                },
                            ]}
                        >
                            <PhoneInput
                                specialLabel={false}
                                className="phone-input"
                                placeholder="+852 XXXX XXXX"
                            />
                        </Form.Item>

                        {role === "restaurant" && (
                            <Form.Item
                                label="Address"
                                name="address"
                                style={{ marginBottom: "5px" }}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter your address",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        )}

                        <Button
                            type="primary"
                            onClick={() => {
                                setPage(2);
                            }}
                            className="submit-button"
                        >
                            Next
                        </Button>
                        <div className="login-redirect">
                            <span>Already have an account?</span>
                            <Button
                                type="default"
                                className="login-button"
                                onClick={() => navigate("/login")}
                            >
                                Log In
                            </Button>
                        </div>
                    </div>

                    <div style={{ display: page === 2 ? "block" : "none" }}>
                        <Form.Item
                            label="Password"
                            name="password"
                            style={{ marginBottom: "5px" }}
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter a password",
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label="Confirm Password"
                            name="confirmPassword"
                            dependencies={["password"]}
                            style={{ marginBottom: "20px" }}
                            rules={[
                                {
                                    required: true,
                                    message: "Passwords do not match",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error("The two passwords do not match"));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        {/* <div className="message-container">
                            <Checkbox
                                checked={checked}
                                onChange={(e) => setChecked(e.target.checked)}
                            />
                            <p>Agree to receive notifications</p>
                        </div> */}

                        <Form.Item>
                            <div className="message-container footer">
                                <Button onClick={() => setPage(1)}>Back</Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="submit-button margin-top0"
                                    disabled={loading}
                                    loading={loading}
                                >
                                    Sign Up
                                </Button>
                            </div>
                        </Form.Item>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Signup;
