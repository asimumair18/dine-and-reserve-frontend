import React, {useEffect} from "react";
import { Form, Select, Button } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";

const { Option } = Select;

const DietaryInfo = () => {
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:5000/api/restaurant/profile", {
                    headers: { Authorization: "Bearer " + token },
                });

                if (!res.ok) throw new Error("Failed to fetch profile");
                const data = await res.json();

                form.setFieldsValue({
                    allergens: data.allergenAlert ? "yes" : "no",
                    dietaryOptions: data.dietaryOptions || [],
                    spices: data.spices || [],
                    cuisine: data.cuisineType || [],
                    buffet: data.buffetType || [],
                });

            } catch (err) {
                toast.error(err.message);
            }
        };

        fetchProfile();
    }, []);

    const onFinish = async (values) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/restaurant/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    dietaryOptions: values.dietaryOptions,
                    spices: values.spices,
                    cuisineType: values.cuisine,
                    buffetType: values.buffet,
                    allergenAlert: values.allergens === 'yes'
                }),
            });

            if (res.ok) {
                toast.success("Preferences updated successfully");
            } else {
                toast.error("Failed to update preferences");
            }
        } catch (err) {
            toast.error("Error updating preferences");
        }
    };

    return (
        <div className="restaurant-account-settings">
            <div className="dietary-info-section">
                <div className="left-container">
                    <div className="section-title">Food Preferences</div>
                    <div className="section-info">
                        Share your food preferences to enjoy a dining experience that’s truly made for you.
                    </div>
                </div>
                <div className="right-container">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{
                            allergens: undefined,
                            dietaryOptions: [],
                            spices: [],
                            cuisine: [],
                            buffet: [],
                        }}
                    >
                        <div className="form-container">
                            <div className="form-title">Allergic Items</div>

                            <Form.Item
                                label={
                                    <span>
                                        Allergens
                                        <div className="helper-text">
                                            Includes: Nuts, Shellfish, Dairy, Gluten, Eggs, Soy, Onion, Garlic
                                        </div>
                                    </span>
                                }
                                name="allergens"
                            >
                                <Select placeholder="Yes/No" allowClear>
                                    <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item label="Dietary Options Available" name="dietaryOptions">
                                <Select
                                    mode="multiple"
                                    placeholder="Veg, Non-Veg, Dairy Free, Gluten Free"
                                    allowClear
                                    showSearch={false}
                                    filterOption={false}
                                >
                                    <Option value="veg">Veg</Option>
                                    <Option value="non-veg">Non-Veg</Option>
                                    <Option value="dairy-free">Dairy Free</Option>
                                    <Option value="gluten-free">Gluten Free</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item label="Spices" name="spices">
                                <Select
                                    mode="multiple"
                                    placeholder="Mild/Medium/Spicy/Very Spicy"
                                    allowClear
                                    showSearch={false}
                                    filterOption={false}
                                >
                                    <Option value="mild">Mild</Option>
                                    <Option value="medium">Medium</Option>
                                    <Option value="spicy">Spicy</Option>
                                    <Option value="very-spicy">Very Spicy</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item label="Cuisine Type" name="cuisine">
                                <Select
                                    mode="multiple"
                                    placeholder="Desi/Continental/Chinese/BBQ"
                                    allowClear
                                    showSearch={false}
                                    filterOption={false}
                                >
                                    <Option value="desi">Desi</Option>
                                    <Option value="continental">Continental</Option>
                                    <Option value="chinese">Chinese</Option>
                                    <Option value="bbq">BBQ</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item label="Buffet Type" name="buffet">
                                <Select
                                    mode="multiple"
                                    placeholder="Brunch/Lunch/Dinner/High Tea"
                                    allowClear
                                    showSearch={false}
                                    filterOption={false}
                                >
                                    <Option value="brunch">Brunch</Option>
                                    <Option value="lunch">Lunch</Option>
                                    <Option value="dinner">Dinner</Option>
                                    <Option value="high-tea">High Tea</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item>
                                <div className="form-footer">
                                    <Button type="primary" htmlType="submit" className="submit-button">
                                        Confirm
                                    </Button>
                                </div>
                            </Form.Item>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default DietaryInfo;
