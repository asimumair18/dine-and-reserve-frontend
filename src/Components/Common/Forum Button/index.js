import { Button, message } from "antd";
import { t } from "i18next";
import React, { useContext, useState } from "react";
import { MdOutlineForum } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../App";
import NewDiscussionModal from "./NewDiscussionModal";
import "./style.css";

const ForumButton = ({ type, handleRefresh = null }) => {
  const navigate = useNavigate();
  const { userData, userToken } = useContext(UserContext);
  const [openDiscussionModal, setOpenDiscussionModal] = useState();

  const data = {
    forum: {
      title: t("forum"),
      action: () => {
        navigate("/forum");
      },
    },
    newPost: {
      title: t("startNewDiscussion"),
      action: () => {
        if (userData?.name && userToken?.access) {
          setOpenDiscussionModal(true);
        } else {
          navigate("/signup");
          message.warning(t("pleaseSignIn"));
        }
      },
    },
  };

  return (
    <div className="forum-container">
      <Button
        className="forum-button"
        onClick={data?.[type].action}
        icon={
          <MdOutlineForum
            className="forum-icon"
            style={{ height: "30px", width: "30px" }}
            color="#d4cddd"
          />
        }
        size={"large"}
      >
        {data?.[type].title}
      </Button>
      {openDiscussionModal && (
        <NewDiscussionModal
          setIsModalOpen={setOpenDiscussionModal}
          isModalOpen={openDiscussionModal}
          handleRefresh={handleRefresh}
        />
      )}
    </div>
  );
};

export default ForumButton;
