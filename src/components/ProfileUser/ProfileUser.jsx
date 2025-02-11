import React, { useState, useEffect } from "react";
import styles from "./ProfileUser.module.css";
import { useNavigate } from "react-router-dom";

function ProfileUser() {
  const userType = localStorage.getItem("userType");
  const [activeTab, setActiveTab] = useState("profile"); // начальное значение зависит от текущей страницы

  const userId = localStorage.getItem("userId");

  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [userName, setUserName] = useState("");
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    const images = [
      "ui-checks-grid-black.png",
      "ui-checks-grid.png",
      "lightning-charge-black.png",
      "lightning-charge.png",
      "gift-black.png",
      "gift.png",
      "person-black.png",
      "person.png",
    ];

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);
  console.log(profilePhoto);
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      try {
        const response = await fetch(`/api/user/profile/${userId}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setProfilePhoto(data.userData.photo_url); // Предполагая, что фото приходит в этом поле
          // console.log("Profile photo:", data.userData.photo_url);
          const fullPhotoUrl = `${data.userData.photo_url}`;
          setUserName(data.userData.profile_name);
          setBalance(data.userData.balance);
          localStorage.setItem("profilePhotoUrl", fullPhotoUrl);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);
  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div className={styles.backArrow}>
            <img src="arrow.png" alt="#" onClick={() => navigate("/")} />
            <h1>BroDonate</h1>
          </div>
          <div className={styles.iconsContainer}>
            <img
              src="Notification.png"
              alt=""
              className={styles.notification}
              onClick={() => {
                navigate("/Notifications");
              }}
            />
            <img
              src="search.png"
              alt=""
              className={styles.search}
              onClick={() => navigate("/Saerch")}
            />
          </div>
        </div>
        <div className={styles.nameAvatar}>
          <img
            src={
              (localStorage.getItem("profilePhotoUrl") || "").slice(-4) ===
              "null"
                ? "/Avatar.png"
                : localStorage.getItem("profilePhotoUrl")
            }
            alt="Profile"
          />

          <div>
            <h2>{userName}</h2>
            <p>Легендарный донатер</p>
          </div>
        </div>
        <div className={styles.achievement}>
          <h3>Достижения</h3>
          <img src="forward.png" alt="" />
        </div>
        <div
          className={styles.sportsContainer}
          onClick={() => {
            navigate("/Achievements");
          }}
        >
          <div className={styles.starCoint}>
            <p className={styles.stars}>Звезды достижений</p>
            <p className={styles.starsCount}>0</p>
          </div>
          <img src="/Frame 9411.png" alt="" />
          {/* <img src="Frame 9261.png" alt="#" />
          <img src="Frame 9263.png" alt="#" />
          <img src="Frame 9264.png" alt="#" />
          <img src="Frame 9257.png" alt="#" />
          <img src="Frame 9257.png" alt="#" /> */}
        </div>
        <div className={styles.accountSection}>
          <div>
            <img src="person (2).png" alt="" />
            <p
              onClick={() => {
                navigate("/ProfileUserAcc");
              }}
            >
              Аккаунт
            </p>
          </div>
          <div className={styles.balanceInfo}>
            <div>
              <img src="cash-stack.png" alt="" />
              <p
                onClick={() => {
                  navigate("/Balance");
                }}
              >
                Баланс
              </p>
            </div>{" "}
            <p className="subscriptions-amount">{balance}₽ </p>
          </div>
          <div
            onClick={() => {
              navigate("/Subscriptions");
            }}
          >
            <img src="lucide_tickets.png" alt="" />
            <p>Подписки</p>
          </div>
          <div
            onClick={() => {
              navigate("/Referal");
            }}
          >
            <img src="gift (1).png" alt="" />
            <p>Реферальная программа</p>
          </div>
          <div>
            <img src="ui-checks.png" alt="" />
            <p>FAQ</p>
          </div>
          <div>
            <img src="layout-text-window.png" alt="" />
            <p>Помощь</p>
          </div>
          {userId === "3" && userType === "fan" && (
            <div onClick={() => navigate("/AdminPanel")}>
              <img src="admin-icon.png" alt="" />
              <p>Админ панель</p>
            </div>
          )}
        </div>
      </div>
      <div className={styles.bottomNav}>
        <div
          className={styles.catalogItem}
          onClick={() => {
            navigate("/");
            setActiveTab("catalog");
          }}
        >
          <img
            src={
              activeTab === "catalog"
                ? "ui-checks-grid-black.png"
                : "ui-checks-grid.png"
            }
            alt=""
            className={styles.catalogImage}
          />
          <p
            className={`${styles.catalogText} ${
              activeTab === "catalog" ? styles.activeText : ""
            }`}
          >
            Главная
          </p>
        </div>

        <div
          className={styles.catalogItem}
          onClick={() => {
            navigate("/alltournaments");
            setActiveTab("tournaments");
          }}
        >
          <img
            src={
              activeTab === "tournaments"
                ? "lightning-charge-black.png"
                : "lightning-charge.png"
            }
            alt=""
            className={styles.catalogImage}
          />
          <p
            className={`${styles.catalogText} ${
              activeTab === "tournaments" ? styles.activeText : ""
            }`}
          >
            Турниры
          </p>
        </div>

        <div
          className={styles.catalogItem}
          onClick={() => {
            navigate("/Referal");
            setActiveTab("referrals");
          }}
        >
          <img
            src={activeTab === "referrals" ? "gift-black.png" : "gift.png"}
            alt=""
            className={styles.catalogImage}
          />
          <p
            className={`${styles.catalogText} ${
              activeTab === "referrals" ? styles.activeText : ""
            }`}
          >
            Рефералы
          </p>
        </div>

        <div
          className={styles.catalogItem}
          onClick={() => {
            if (userType === "fan") {
              navigate("/profileuser");
            } else {
              navigate("/profilefighter");
            }
            setActiveTab("profile");
          }}
        >
          <img
            src={activeTab === "profile" ? "person-black.png" : "person.png"}
            alt=""
            className={styles.catalogImage}
          />
          <p
            className={`${styles.catalogText} ${
              activeTab === "profile" ? styles.activeText : ""
            }`}
          >
            Профиль
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfileUser;
