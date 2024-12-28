import React, { useEffect, useState } from "react";
import styles from "./Notifications.module.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `/api/notifications/${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [userId]);

  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div className={styles.backArrow}>
            <img src="arrow.png" alt="#" />
            <h1>SportDonation</h1>
          </div>
        </div>
        <h2>Уведомления</h2>
        <div className={styles.notificationsList}>
          {notifications.map((notification) => (
            <div key={notification.id} className={styles.notificationItem}>
              <p className={styles.message}>{notification.message_content}</p>
              <p className={styles.timestamp}>
                {new Date(notification.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
