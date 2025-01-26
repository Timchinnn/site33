import React from "react";
import styles from "./TopFan.module.css";
import { useNavigate, useLocation } from "react-router-dom";

function TopFan() {
  const userType = localStorage.getItem("userType");

  const navigate = useNavigate();

  const location = useLocation();
  const { users, activeSectionUser } = location.state || {};
  console.log(users);
  console.log(activeSectionUser);

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
          {activeSectionUser === "donat" ? (
            <>Топ бойцов по сборам</>
          ) : (
            <>Топ бойцов по голосованию</>
          )}
        </h2>
        {users.map((user) => (
          <div key={user.id} className={styles.userItem}>
            <div className={styles.userAbout}>
              <img
                src={user.photo_url ? `${user.photo_url}` : "Avatar.png"}
                alt={user.name}
              />
              <p>
                {user.name} {user.surname[0]}.
              </p>
            </div>

            <p className={styles.money}>
              {activeSectionUser === "donat" ? (
                <>{user.donat_now} ₽</>
              ) : (
                <>{user.vote_fan}</>
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
              navigate("/profileuser");
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

export default Topusers;
