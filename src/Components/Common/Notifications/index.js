import { Badge, Dropdown, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CiMail } from "react-icons/ci";
import {
  getNotifications,
  markAsRead,
  notificationURL,
} from "../../../API/notification";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./style.css";
import { calculateTimeAgo } from "../../../Utils/Helper/timeDifference";

const Notifications = () => {
  const [notificationsList, setNotificationsList] = useState([]);
  const [notifications, setNotifications] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getNotifications();
        setNotifications(res?.data);
        setNotificationsList(res?.data?.results?.notifications || []);
        setHasMore(!!res?.data?.next);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [location.pathname]);

  const handleMarkAsRead = async (e, item, itemIndex) => {
    e.stopPropagation();
    const res = await markAsRead(item?.notification_id);
    if (Math.floor(res.status / 100) === 2) {
      setNotificationsList(
        notificationsList?.map((item, index) =>
          index === itemIndex ? { ...item, read: true } : item
        )
      );
      setNotifications({
        ...notifications,
        results: {
          ...notifications?.results,
          unread_count: notifications?.results?.unread_count - 1,
        },
      });
    }
  };

  const loadMoreNotifications = async () => {
    if (!notifications?.next || loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await notificationURL(notifications.next);
      setNotifications(res?.data);
      setNotificationsList((prev) => [
        ...prev,
        ...(res?.data?.results?.notifications || []),
      ]);
      setHasMore(!!res?.data?.next);
    } catch (error) {
      console.error("Error loading more notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = async (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      await loadMoreNotifications();
    }
  };

  const menuItems = notificationsList.map((item, index) => ({
    key: index,
    label: (
      <div className={`${item?.read ? "read" : "unread"} list-item`}>
        <div className={`${item?.read ? "read" : "unread"}-list-icon`}>
          <IoIosNotificationsOutline
            style={{
              height: "30px",
              width: "30px",
              color: item?.read ? "#4d4854" : "black",
            }}
          />
        </div>

        <div>
          <p style={{ margin: 0 }}>{item.details}</p>
          <p className="notification-date">{calculateTimeAgo(item?.date)}</p>
        </div>
        {!item?.read && (
          <div
            className="mark-as-read"
            onClick={(e) => handleMarkAsRead(e, item, index)}
          >
            <Tooltip title={t("markAsRead")}>
              <CiMail />
            </Tooltip>
          </div>
        )}
      </div>
    ),
    onClick: async () => {
      await markAsRead(item?.notification_id);
      navigate("/forum/" + item?.forum_id);
    },
  }));

  if (loading && hasMore) {
    menuItems.push({
      key: "load-more",
      label: <div style={{ textAlign: "center" }}>{t("loadingMore")}</div>,
    });
  }

  return (
    <div className="navbar">
      <Dropdown
        menu={{
          items: menuItems,
        }}
        trigger={["click"]}
        placement="bottomLeft"
        dropdownRender={(menu) => (
          <div
            style={{
              maxHeight: 400,
              overflowY: "auto",
              boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
              borderRadius: "2px",
              marginLeft: "15px",
            }}
            className="dropdown-list"
            onScroll={handleScroll}
          >
            {menu}
          </div>
        )}
      >
        <div className="notification-icon-container">
          <Badge count={notifications?.results?.unread_count} size={"small"}>
            <IoIosNotificationsOutline
              style={{
                height: "27px",
                width: "27px",
                cursor: "pointer",
              }}
            />
          </Badge>
        </div>
      </Dropdown>
    </div>
  );
};

export default Notifications;
