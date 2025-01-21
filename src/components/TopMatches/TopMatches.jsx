import React, { useEffect, useState } from "react";
import styles from "./TopMatches.module.css";
import { useNavigate } from "react-router-dom";

function TopMatches() {
  const userType = localStorage.getItem("userType");
  const navigate = useNavigate();
  const [sportData, setsportData] = useState({});
  const sports = [
    "ММА",
    "Кулачные бои",
    "Кикбоксинг",
    "Тайский бокс",
    "Бокс",
    "Борьба",
  ];

  useEffect(() => {
    const fetchAllSportsData = async () => {
      try {
        for (const sportName of sports) {
          const response = await fetch(`/api/tournaments/${sportName}`);
          if (response.ok) {
            const data = await response.json();
            setsportData((prevData) => ({
              ...prevData,
              [sportName]: data,
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching tournament");
      }
    };

    fetchAllSportsData();
  }, []);

  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div className={styles.backArrow}>
            <img src="arrow.png" alt="#" onClick={() => navigate("/main")} />
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
        <div
          className={styles.catalogItem}
          onClick={() => {
            navigate("/Referal");
          }}
        >
          <img src="gift.png" alt="" className={styles.catalogImage} />
          <p className={styles.catalogText}>Рефералы</p>
        </div>
        <div
          className={styles.catalogItem}
          onClick={() => {
            if (userType === "fan") {
              navigate("/profileuser");
            } else {
              navigate("/profilefighter");
            }
          }}
        >
          <img src="person.png" alt="" className={styles.catalogImage} />
          <p className={styles.catalogText}>Профиль</p>
        </div>
      </div>
    </div>
  );
}

export default TopMatches;
