import React, { useState, useEffect } from "react";
import styles from "./ProfileUser.module.css";
import { useNavigate } from "react-router-dom";

function ProfileUser() {
  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [userName, setUserName] = useState("");
  // console.log(localStorage.getItem("profilePhotoUrl"))
  console.log(profilePhoto);
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      try {
        const response = await fetch(
          `/api/user/profile/${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          setProfilePhoto(data.userData.photo_url); // Предполагая, что фото приходит в этом поле
          console.log("Profile photo:", data.userData.photo_url);
          const fullPhotoUrl = `${data.userData.photo_url}`;
          setUserName(data.userData.profile_name);
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
            <img src="arrow.png" alt="#" onClick={() => navigate("/main")} />
            <h1>SportDonation</h1>
          </div>
          <div className={styles.iconsContainer}>
            <img
              src="Notification.png"
              alt=""
              className={styles.notification}
            />
            <img src="search.png" alt="" className={styles.search} />
          </div>
        </div>
        <div className={styles.nameAvatar}>
          <img
            src={
              (localStorage.getItem("profilePhotoUrl") || "").slice(-4) ===
              "null"
                ? "/Avatar.png"
                : `http://91.186.198.179/${localStorage.getItem("profilePhotoUrl")}`
            }
            onClick ={console.log(localStorage.getItem("profilePhotoUrl"))}
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
        <div className={styles.sportsContainer}>
          <img src="Frame 9261.png" alt="#" />
          <img src="Frame 9263.png" alt="#" />
          <img src="Frame 9264.png" alt="#" />
          <img src="Frame 9257.png" alt="#" />
          <img src="Frame 9257.png" alt="#" />
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
              <p>Баланс</p>
            </div>{" "}
            <p className="subscriptions-amount">1060₽ </p>
          </div>
          <div>
            <img src="lucide_tickets.png" alt="" />
            <p>Подписки</p>
          </div>
          <div>
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
        </div>
      </div>
      <div className={styles.bottomNav}>
        <div
          className={styles.catalogItem}
          onClick={() => {
            navigate("/main");
          }}
        >
          <img
            src="ui-checks-grid.png"
            alt=""
            className={styles.catalogImage}
          />
          <p className={styles.catalogText}>Каталог</p>
        </div>
        <div
          className={styles.catalogItem}
          onClick={() => {
            navigate("/alltournaments");
          }}
        >
          <img
            src="lightning-charge.png"
            alt=""
            className={styles.catalogImage}
          />
          <p className={styles.catalogText}>Турниры</p>
        </div>
        <div className={styles.catalogItem}>
          <img src="gift.png" alt="" className={styles.catalogImage} />
          <p className={styles.catalogText}>Рефералы</p>
        </div>
        <div className={styles.catalogItem}>
          <img src="person.png" alt="" className={styles.catalogImage} />
          <p className={styles.catalogText}>Профиль</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileUser;
