import React, { useState, useEffect } from "react";
import { Button, Form, Select, ConfigProvider } from "antd";
import { toast } from "react-toastify";
import "./style.css";

const Preferences = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/user/preferences", {
          headers: { Authorization: "Bearer " + token },
        });
        
        if (!res.ok) throw new Error("Failed to fetch preferences");
        const data = await res.json();
        
        // Map backend data to form fields
        form.setFieldsValue({
          dietary: data.dietary,
          cuisine: data.cuisine,
          allergies: data.allergies,
          spices: data.spices,
          buffetType: data.buffetType
        });
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const res = await fetch("http://localhost:5000/api/user/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save preferences");
      
      toast.success("Preferences saved successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-state">Loading...</div>;

  return (
    <div className="user-account-settings">
      <div className="account-details">
        <div className="left-container">
          <div className="section-title">Food Preferences</div>
          <div className="section-info">
            Share your food preferences to enjoy a dining experience that's truly made for you.
          </div>
        </div>
        <div className="right-container">
          <div className="form-container">
            <div className="form-title">Preferences</div>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              autoComplete="off"
            >
              <div className="form-row">
                <Form.Item
                  label="Dietary Preference"
                  name="dietary"
                >
                  <Select
                    mode="multiple"
                    placeholder="Veg/Non Veg/Dairy Free/Gluten Free"
                    options={[
                      { value: "Veg" },
                      { value: "Non-Veg" },
                      { value: "Dairy Free" },
                      { value: "Gluten Free" },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  label="Cuisine Preference"
                  name="cuisine"
                >
                  <Select
                    mode="multiple"
                    placeholder="Desi/Continental/Chinese/BBQ"
                    options={[
                      { value: "Desi" },
                      { value: "Continental" },
                      { value: "Chinese" },
                      { value: "BBQ" },
                    ]}
                  />
                </Form.Item>
              </div>

              <div className="form-row">
                <Form.Item
                  label="Allergies"
                  name="allergies"
                >
                  <Select
                    mode="multiple"
                    placeholder="Nuts/Shellfish/Dairy/Eggs/Gluten"
                    options={[
                      { value: "Nuts" },
                      { value: "Shellfish" },
                      { value: "Dairy" },
                      { value: "Eggs" },
                      { value: "Gluten" },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  label="Spices"
                  name="spices"
                >
                  <Select
                    placeholder="Mild/Medium/Spicy/Very Spicy"
                    options={[
                      { value: "Mild" },
                      { value: "Medium" },
                      { value: "Spicy" },
                      { value: "Very Spicy" },
                    ]}
                  />
                </Form.Item>
              </div>

              <div className="form-row">
                <Form.Item
                  label="Buffet Type"
                  name="buffetType"
                >
                  <Select
                    mode="multiple"
                    placeholder="Brunch/Lunch/Dinner/High Tea"
                    options={[
                      { value: "Brunch" },
                      { value: "Lunch" },
                      { value: "Dinner" },
                      { value: "High Tea" },
                    ]}
                  />
                </Form.Item>
              </div>

              <Form.Item>
                <div className="form-footer">
                  <ConfigProvider
                    theme={{
                      token: {
                        colorPrimary: "#FAEF7C",
                        colorPrimaryHover: "#F9E64C",
                        colorPrimaryActive: "#E6D42A",
                      },
                      components: {
                        Button: {
                          defaultActiveBg: "#FAEF7C",
                          primaryColor: "#030303",
                        },
                      },
                    }}
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="submit-button"
                      shape="round"
                      loading={loading}
                    >
                      Confirm
                    </Button>
                  </ConfigProvider>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;