import React, { useEffect, useState } from "react";
import styles from "./AllAchievements.module.css";
import { useNavigate, useLocation } from "react-router-dom";

function AllAchievements() {
  const location = useLocation();
  const { totalStars } = location.state || {};
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");
  const userId = localStorage.getItem("userId");
  console.log(userId);
  const [activeTab, setActiveTab] = useState(null); // начальное значение зависит от текущей страницы
  const achievements = {
    "Дебютант ринга": {
      title: "Дебютант ринга",
      description: "Вы только вступили на путь поддерживающего фаната",
      stars: 5,
      requirement: totalStars > 0,
    },
    "Стальной секундант": {
      title: "Стальной секундант",
      description: "Вас уважают и бойцы, и фанаты, вы важный элемент комьюнити",
      stars: 10,
      requirement: totalStars >= 5,
    },
    "Золотой наставник": {
      title: "Золотой наставник",
      description: "Ваш вес в сообществе огромен, вы задаёте тон поддержки",
      stars: 20,
      requirement: totalStars >= 10,
    },
    "Платиновый авторитет": {
      title: "Платиновый авторитет",
      description:
        "Высочайший авторитет, вы основа формирования будущего спорта",
      stars: 30,
      requirement: totalStars >= 20,
    },
    "Великий покровитель арены": {
      title: "Великий покровитель арены",
      description:
        "Легендарный статус, ваше имя - символ щедрости и любви к спорту",
      stars: 31,
      requirement: totalStars >= 30,
    },
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div className={styles.backArrow}>
            <img src="arrow.png" alt="#" onClick={() => navigate(-1)} />
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
        <div className={styles.mainAchievement}>
          {Object.entries(achievements).map(([title, achievement]) => (
            <div key={title} className={styles.abotMainAchievement}>
              <h2>{achievement.title}</h2>
              <p className={styles.aboutText}>{achievement.description}</p>
              <div className={styles.starCounts}>
                <img src="Star icon.png" alt="" />
                <h2>
                  {totalStars}/{achievement.stars}
                </h2>
              </div>
            </div>
          ))}
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

export default AllAchievements;
