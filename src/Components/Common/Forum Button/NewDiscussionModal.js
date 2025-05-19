import { Button, Form, Input, Modal, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  createForum,
  getCategories,
  updateComment,
  updateForum,
} from "../../../API/forum";
import "./style.css";

const NewDiscussionModal = ({
  setIsModalOpen,
  isModalOpen,
  handleRefresh,
  editData,
  type = "add",
}) => {
  const { t } = useTranslation();
  const { Option, OptGroup } = Select;
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [form] = useForm();

  useEffect(() => {
    const fetchData = async () => {
      setLoadingCategories(true);
      const res = await getCategories();
      setCategories(res?.data);
      setLoadingCategories(false);
    };
    fetchData();
  }, []);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values) => {
    setLoadingData(true);
    let res;
    if (type === "add") {
      res = await createForum(values);
    } else if (type === "edit") {
      res = await updateForum(values, editData?.forum_id);
    } else if (type === "comment") {
      res = await updateComment(
        { ...values, text: values?.comment },
        editData?.comment_id
      );
    }

    if (Math.floor(res?.status / 100) === 2) {
      await handleRefresh();
      setIsModalOpen(false);
    } else {
      // api["error"]({
      //   message: t(""),
      //   description: res?.response?.data?.detail,
      // });
    }
    setLoadingData(false);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Modal
      title={t("startNewDiscussion")}
      open={isModalOpen}
      onCancel={handleCancel}
      okButtonProps={{
        className: "ok-button",
      }}
      cancelButtonProps={{
        className: "cancel-button",
      }}
      cancelText={t("cancel")}
      okText={t("post")}
      footer={null}
      className="post-modal"
    >
      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        form={form}
        style={{
          marginBottom: "none",
        }}
        layout="vertical"
        autoComplete="off"
        initialValues={editData}
      >
        {type !== "comment" && (
          <Form.Item
            label={t("category")}
            name={"category"}
            rules={[
              {
                required: true,
                message: t("categoryWarning"),
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              loading={loadingCategories}
              placeholder={t("selectSuboptions")}
            >
              <OptGroup label={t("careerCorner")}>
                {categories?.career_corner?.map((item) => (
                  <Option value={item?.value} key={item?.value}>
                    {item?.label}
                  </Option>
                ))}
              </OptGroup>
              <OptGroup label={t("chatAndChatterCorner")}>
                {categories?.chat_chatter?.map((item) => (
                  <Option value={item?.value} key={item?.value}>
                    {item?.label}
                  </Option>
                ))}
              </OptGroup>
              <OptGroup label={t("promotionsAndOffers")}>
                {categories?.promotion_offer?.map((item) => (
                  <Option value={item?.value} key={item?.value}>
                    {item?.label}
                  </Option>
                ))}
              </OptGroup>
            </Select>
          </Form.Item>
        )}
        {type !== "comment" && (
          <Form.Item
            label={t("topic")}
            name={"topic"}
            rules={[
              {
                required: true,
                message: t("topicWarning"),
              },
            ]}
          >
            <Input />
          </Form.Item>
        )}
        {type !== "edit" && (
          <Form.Item
            label={t("description")}
            name={"comment"}
            rules={[
              {
                required: true,
                message: t("descriptionWarning"),
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
        )}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="submit-button"
            disabled={loadingData}
            loading={loadingData}
          >
            {type.includes("edit") ? t("update") : t("upload")}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewDiscussionModal;
