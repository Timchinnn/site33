import React, { useState } from "react";
import styles from "./TopCountries.module.css";
import { useNavigate, useLocation } from "react-router-dom";

function TopCountries() {
  const userType = localStorage.getItem("userType");

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(null); // начальное значение зависит от текущей страницы

  const location = useLocation();
  const { fighters, activeSection } = location.state || {};
  console.log(fighters);
  console.log(activeSection);
  const handleFighterClick = (fighter) => {
    navigate("/StatsFighterFan", {
      state: {
        fighterData: fighter,
      },
    });
  };
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
        <h2>Топ бойцов по сборам</h2>
        {fighters.map((fighter) => (
          <div
            key={fighter.id}
            className={styles.fighterItem}
            onClick={() => handleFighterClick(fighter)}
          >
            <div className={styles.fighterAbout}>
              <img
                src={fighter.photo_url ? `${fighter.photo_url}` : "Avatar.png"}
                alt={fighter.name}
              />
              <p>
                {fighter.name} {fighter.surname[0]}.
              </p>
            </div>

            <p className={styles.money}>{fighter.donat_now} ₽</p>
          </div>
        ))}
        <h2>Топ бойцов по голосованию</h2>
        {fightersVoted.map((fighter) => (
          <div
            key={fighter.id}
            className={styles.fighterItem}
            onClick={() => handleFighterClick(fighter)}
          >
            <div className={styles.fighterAbout}>
              <img
                src={fighter.photo_url ? `${fighter.photo_url}` : "Avatar.png"}
                alt={fighter.name}
              />
              <p>
                {fighter.name} {fighter.surname[0]}.
              </p>
            </div>

            <p className={styles.money}>
              <>{fighter.vote_fan}</>
            </p>
          </div>
        ))}
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

export default TopCountries;
