import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Upload,
  message
} from "antd";
import React, { useState, useContext } from "react";
import { UserContext } from "../../../Context/UserContext";
import { PlusOutlined } from "@ant-design/icons";
import "./style.css";

const { Option } = Select;

const ReviewModal = ({ open, setOpen, shopId, setRefresh }) => {
  const { userData } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleUploadChange = ({ fileList }) => {
    setUploadedPhotos(fileList);
  };

  const onFinish = async (values) => {
    setLoading(true);
    console.log("User Data from Context:", userData);

    const reviewData = {
      restaurantId: shopId,
      userId: userData?._id,
      email: userData?.username,
      userPhoto: userData?.profilePhoto || null,
      dateOfVisit: values.date_of_visit.format("YYYY-MM-DD"),
      duration: Number(values.treatment_duration),
      amountSpent: values.treatment_spending,
      remarks: values.remarks,
      service: Number(values.service),
      clean: Number(values.clean),
      hospitality: Number(values.hospitality),
      ambiance: Number(values.ambiance),
      value: Number(values.value),
      photoUrls: [],
    };
    
    console.log("Review Data:", reviewData);
    try {
      const res = await fetch("http://localhost:5000/api/reviews/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token"), // ✅ Add token
        },
        body: JSON.stringify(reviewData),
      });
      console.log("Token:", localStorage.getItem("token"));

      if (!res.ok) {
        const errRes = await res.json();
        throw new Error(errRes.message || "Failed to submit review");
      }

      message.success("Review submitted successfully!");
      setRefresh((prev) => !prev);
      setOpen(false);
    } catch (err) {
      message.error(err.message);
      console.error("Error submitting review:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={false}
      className="review-modal"
    >
      <Form
        style={{ width: 350, marginTop: "40px" }}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item label="Date of Visit" name="date_of_visit" required>
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
        </Form.Item>

        <div className="double-items">
          <Form.Item
            label="Duration (hours)"
            name="treatment_duration"
            className="double-item"
          >
            <Input suffix="hrs" />
          </Form.Item>
          <Form.Item
            label="Amount Spent (PKR)"
            name="treatment_spending"
            className="double-item"
          >
            <Input />
          </Form.Item>
        </div>

        <div className="double-items">
          <Form.Item label="Service" name="service" className="double-item" required>
            <Select>{[...Array(10)].map((_, i) => <Option key={i + 1} value={i + 1}>{i + 1}</Option>)}</Select>
          </Form.Item>
          <Form.Item label="Cleanliness" name="clean" className="double-item" required>
            <Select>{[...Array(10)].map((_, i) => <Option key={i + 1} value={i + 1}>{i + 1}</Option>)}</Select>
          </Form.Item>
        </div>

        <div className="double-items">
          <Form.Item label="Hospitality" name="hospitality" className="double-item" required>
            <Select>{[...Array(10)].map((_, i) => <Option key={i + 1} value={i + 1}>{i + 1}</Option>)}</Select>
          </Form.Item>
          <Form.Item label="Ambiance" name="ambiance" className="double-item" required>
            <Select>{[...Array(10)].map((_, i) => <Option key={i + 1} value={i + 1}>{i + 1}</Option>)}</Select>
          </Form.Item>
        </div>

        <Form.Item label="Value" name="value" required>
          <Select>{[...Array(10)].map((_, i) => <Option key={i + 1} value={i + 1}>{i + 1}</Option>)}</Select>
        </Form.Item>

        <Form.Item label="Remarks" name="remarks" required>
          <Input.TextArea placeholder="Write your experience..." />
        </Form.Item>

        <Upload
          listType="picture-card"
          multiple
          fileList={uploadedPhotos}
          onChange={handleUploadChange}
          beforeUpload={() => false}
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="submit-button"
            disabled={loading}
            loading={loading}
          >
            Submit Review
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReviewModal;