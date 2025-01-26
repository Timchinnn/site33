import React from "react";
import styles from "./SupportFighters.module.css";
import { useNavigate, useLocation } from "react-router-dom";

function SupportFighters() {
  const userType = localStorage.getItem("userType");

  const navigate = useNavigate();

  const location = useLocation();
  const { fighters } = location.state || {};
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim()) {
      const filtered = fighters.filter(
        (fighter) =>
          fighter.name.toLowerCase().includes(query) ||
          fighter.surname.toLowerCase().includes(query)
      );
      setFilteredFighters(filtered);
    } else {
      setFilteredFighters(fighters);
    }
  };
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
        <div className={styles.passwordInputContainer}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Поиск по турниру или имени"
            className={styles.passwordinput}
          />
          <img
            src="search.png"
            alt="#"
            className={styles.eyeoff}
            style={{ cursor: "pointer", pointerEvents: "auto" }}
          />
        </div>
        {(searchQuery ? filteredFighters : fighters).map((fighter) => (
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

export default SupportFighters;
