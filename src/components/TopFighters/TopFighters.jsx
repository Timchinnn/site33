import React from "react";
import styles from "./TopFighters.module.css";
import { useNavigate, useLocation } from "react-router-dom";

function TopFighters() {
  const userType = localStorage.getItem("userType");

  const navigate = useNavigate();

  const location = useLocation();
  const { fighters, activeSection } = location.state || {};
  // console.log(activeSection);
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
        <h2>
          {activeSection === "donations" ? (
            <>Топ бойцов по сборам</>
          ) : (
            <>Топ бойцов по голосованию</>
          )}
        </h2>
        {fighters.map((fighter) => (
          <div key={fighter.id} className={styles.fighterItem}>
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
              {activeSection === "donations" ? (
                <>{fighter.donat_now} ₽</>
              ) : (
                <>{fighter.vote_fan}</>
              )}
            </p>
          </div>
        ))}
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

export default TopFighters;
