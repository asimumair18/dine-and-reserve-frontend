import React, { useState, useEffect } from "react";
import { Form, Checkbox, TimePicker, Button } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import "./style.css";

const { RangePicker } = TimePicker;

const Timings = () => {
  const [form] = Form.useForm();
  const [selectedOptions, setSelectedOptions] = useState(["high-tea", "buffet"]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/restaurant/profile", {
          headers: { Authorization: "Bearer " + token },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();

        // Parse timings
        const initialValues = {};
        if (data.timings?.highTea) {
          const [start, end] = data.timings.highTea.split("-");
          initialValues.highTeaTiming = [dayjs(start, "HH:mm"), dayjs(end, "HH:mm")];
        }

        if (data.timings?.buffet) {
          const [start, end] = data.timings.buffet.split("-");
          initialValues.buffetTiming = [dayjs(start, "HH:mm"), dayjs(end, "HH:mm")];
        }

        form.setFieldsValue(initialValues);

      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchProfile();
  }, []);

  const handleCheckboxChange = (checkedValues) => {
    setSelectedOptions(checkedValues);
  };

  const onFinish = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const highTeaTiming = values.highTeaTiming
        ? `${dayjs(values.highTeaTiming[0]).format('HH:mm')}-${dayjs(values.highTeaTiming[1]).format('HH:mm')}`
        : '';

      const buffetTiming = values.buffetTiming
        ? `${dayjs(values.buffetTiming[0]).format('HH:mm')}-${dayjs(values.buffetTiming[1]).format('HH:mm')}`
        : '';

      const res = await fetch("http://localhost:5000/api/restaurant/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          highTeaTiming,
          buffetTiming
        }),
      });

      if (res.ok) {
        toast.success("Timings updated successfully");
      } else {
        toast.error("Failed to update timings");
      }
    } catch (err) {
      toast.error("Error updating timings");
    }
  };

  return (
    <div className="restaurant-account-settings">
      <div className="timings-section">
        <div className="left-container">
          <div className="section-title">Buffet/High Tea Timings</div>
          <div className="section-info">
            Set your evening hours to ensure your guests never miss the perfect time to dine with you.
          </div>
        </div>
        <div className="right-container">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              options: ["high-tea", "buffet"],
              highTeaTiming: [],
              buffetTiming: [],
            }}
          >
            <div className="form-container">
              <Form.Item label="Timings" name="options">
                <Checkbox.Group onChange={handleCheckboxChange}>
                  <Checkbox value="high-tea">High-Tea</Checkbox>
                  <Checkbox value="buffet">Buffet</Checkbox>
                </Checkbox.Group>
              </Form.Item>

              {selectedOptions.includes("high-tea") && (
                <Form.Item label="High-Tea Timing" name="highTeaTiming">
                  <RangePicker format="HH:mm" />
                </Form.Item>
              )}

              {selectedOptions.includes("buffet") && (
                <Form.Item label="Buffet Timing" name="buffetTiming">
                  <RangePicker format="HH:mm" />
                </Form.Item>
              )}

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

export default Timings;
