import React, { useEffect, useState } from "react";
import styles from "./Achievements.module.css";
import { useNavigate } from "react-router-dom";

function Achievements() {
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");
  const userId = localStorage.getItem("userId");
  console.log(userId);
  const [activeTab, setActiveTab] = useState(null); // начальное значение зависит от текущей страницы

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

        <div
          className={styles.mainAchievement}
          onClick={() => {
            navigate("/allAchievements");
          }}
        >
          <div className={styles.abotMainAchievement}>
            <h2>Золотой наставник</h2>
            <p className={styles.aboutText}>
              Ваш вес в сообществе огромен, вы задаёте тон поддержки
            </p>
          </div>
          <div className={styles.starCounts}>
            <img src="Star icon.png" alt="" />
            <h2>15/20</h2>
          </div>
        </div>
        <h2>Все достижения</h2>
        <div className={styles.allAchievements}>
          <div className={styles.Achievements}>
            <p className={styles.aboutText}>Скаут перспектив</p>
            <img
              className={styles.achievementImg}
              src="boxer-beginner (1) 1.png"
              alt=""
            />
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${(15 / 20) * 100}%`, // Example: 15 out of 20 donations
                }}
              />
            </div>
            <div className={styles.stars}>
              <img src="Star icon.png" alt="" />
              <img src="Star icon.png" alt="" />
              <img src="Star icon.png" alt="" />
            </div>
            <p className={styles.task}>Отправить 20 донатов разным бойцам</p>
          </div>
          <div className={styles.Achievements}>
            <p className={styles.aboutText}>Скаут перспектив</p>
            <img
              className={styles.achievementImg}
              src="boxer-beginner (1) 1.png"
              alt=""
            />
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${(15 / 20) * 100}%`, // Example: 15 out of 20 donations
                }}
              />
            </div>
            <div className={styles.stars}>
              <img src="Star icon.png" alt="" />
              <img src="Star icon.png" alt="" />
              <img src="Star icon.png" alt="" />
            </div>
            <p className={styles.task}>Отправить 20 донатов разным бойцам</p>
          </div>
          <div className={styles.Achievements}>
            <p className={styles.aboutText}>Скаут перспектив</p>
            <img
              className={styles.achievementImg}
              src="boxer-beginner (1) 1.png"
              alt=""
            />
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${(15 / 20) * 100}%`, // Example: 15 out of 20 donations
                }}
              />
            </div>
            <div className={styles.stars}>
              <img src="Star icon.png" alt="" />
              <img src="Star icon.png" alt="" />
              <img src="Star icon.png" alt="" />
            </div>
            <p className={styles.task}>Отправить 20 донатов разным бойцам</p>
          </div>
          <div className={styles.Achievements}>
            <p className={styles.aboutText}>Скаут перспектив</p>
            <img
              className={styles.achievementImg}
              src="boxer-beginner (1) 1.png"
              alt=""
            />
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${(15 / 20) * 100}%`, // Example: 15 out of 20 donations
                }}
              />
            </div>
            <div className={styles.stars}>
              <img src="Star icon.png" alt="" />
              <img src="Star icon.png" alt="" />
              <img src="Star icon.png" alt="" />
            </div>
            <p className={styles.task}>Отправить 20 донатов разным бойцам</p>
          </div>
          <div className={styles.Achievements}>
            <p className={styles.aboutText}>Скаут перспектив</p>
            <img
              className={styles.achievementImg}
              src="boxer-beginner (1) 1.png"
              alt=""
            />
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${(15 / 20) * 100}%`, // Example: 15 out of 20 donations
                }}
              />
            </div>
            <div className={styles.stars}>
              <img src="Star icon.png" alt="" />
              <img src="Star icon.png" alt="" />
              <img src="Star icon.png" alt="" />
            </div>
            <p className={styles.task}>Отправить 20 донатов разным бойцам</p>
          </div>
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

export default Achievements;
