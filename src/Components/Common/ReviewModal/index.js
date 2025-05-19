import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Upload,
} from "antd";
import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import "./style.css";

const { Option } = Select;

const ReviewModal = ({ open, setOpen, shopId, setRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleUploadChange = ({ fileList }) => {
    setUploadedPhotos(fileList);
  };

  const onFinish = (values) => {
    setLoading(true);

    // Simulated review creation (no backend)
    const newReview = {
      id: Date.now(),
      user: 1,
      user_name: "You",
      date: new Date().toISOString().slice(0, 10),
      profile_photo: null,
      average_rating:
        (Number(values.service) +
          Number(values.clean) +
          Number(values.hospitality) +
          Number(values.ambiance) +
          Number(values.value)) /
        5,
      remarks: values.remarks,
      date_of_visit: values.date_of_visit.format("YYYY-MM-DD"),
      treatment_duration: values.treatment_duration,
      treatment_spending: values.treatment_spending,
      service: Number(values.service),
      clean: Number(values.clean),
      hospitality: Number(values.hospitality),
      ambiance: Number(values.ambiance),
      value: Number(values.value),
      photo_urls: uploadedPhotos.map(() => null),
    };

    // Update parent state
    setRefresh((prev) => !prev);

    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 500);
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
            <Select>{[...Array(10)].map((_, i) => <Option key={i+1} value={i+1}>{i+1}</Option>)}</Select>
          </Form.Item>
          <Form.Item label="Cleanliness" name="clean" className="double-item" required>
            <Select>{[...Array(10)].map((_, i) => <Option key={i+1} value={i+1}>{i+1}</Option>)}</Select>
          </Form.Item>
        </div>

        <div className="double-items">
          <Form.Item label="Hospitality" name="hospitality" className="double-item" required>
            <Select>{[...Array(10)].map((_, i) => <Option key={i+1} value={i+1}>{i+1}</Option>)}</Select>
          </Form.Item>
          <Form.Item label="Ambiance" name="ambiance" className="double-item" required>
            <Select>{[...Array(10)].map((_, i) => <Option key={i+1} value={i+1}>{i+1}</Option>)}</Select>
          </Form.Item>
        </div>

        <Form.Item label="Value" name="value" required>
          <Select>{[...Array(10)].map((_, i) => <Option key={i+1} value={i+1}>{i+1}</Option>)}</Select>
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