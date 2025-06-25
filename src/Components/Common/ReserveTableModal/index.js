import React, { useContext, useState } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Button,
  Select,
  message,
} from "antd";
import { UserContext } from "../../../Context/UserContext";
import "./style.css";

const { RangePicker } = TimePicker;

const ReserveTableModal = ({ open, onClose, shopId, setRefresh }) => {
  const [loading, setLoading] = useState(false);
  const { userData } = useContext(UserContext);

  const onFinish = async (values) => {
    if (!userData) {
      message.error("You must be logged in to reserve a table.");
      return;
    }

    const reservation = {
      restaurantId: shopId,
      dinerId: userData._id,
      name: values.name,
      type: values.type, // <-- NEW FIELD
      people: values.people,
      date: values.date.format("YYYY-MM-DD"),
      timeSlot: values.time.map((t) => t.format("HH:mm")),
    };

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/reservations/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(reservation),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Reservation failed");
      }

      message.success("Reservation successful!");
      setRefresh?.((prev) => !prev);
      onClose();
    } catch (err) {
      message.error(err.message);
      console.error("Reservation error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Reserve Your Table"
      className="reserve-modal"
    >
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Reservation Name" name="name" required>
          <Input placeholder="Value" />
        </Form.Item>

        <Form.Item label="Reservation Type" name="type" required>
          <Select placeholder="Select type">
            <Select.Option value="high-tea">High-Tea</Select.Option>
            <Select.Option value="buffet">Buffet</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Number Of People" name="people" required>
          <Select placeholder="Value">
            {[...Array(10)].map((_, i) => (
              <Select.Option key={i + 1} value={i + 1}>
                {i + 1}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Date" name="date" required>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Time" name="time" required>
          <RangePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="confirm-button"
            loading={loading}
          >
            Confirm
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReserveTableModal;
