import React, { useState } from "react";
import styles from "./AllTournaments.module.css";
import { useNavigate } from "react-router-dom";

function AllTournaments() {
  const navigate = useNavigate();

  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const userType = localStorage.getItem("userType");
  // const [selectedSport, setSelectedSport] = useState(null);

  const handleSportClick = async (sportName) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tournaments/${sportName}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        navigate("/tournament", {
          state: { sportData: data, sportName: sportName },
        });
      }
    } catch (error) {
      console.error("Error fetching tournament data:", error);
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div className={styles.backArrow}>
            <img src="arrow.png" alt="#" />
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
        <div className={styles.referralProgram}>
          <div className={styles.referralText}>
            <h2>Реферальная программа</h2>
            <p>Приглашай друзей и получай %% с каждого доната</p>
          </div>
          <img src="forward-white.png" alt="" className="forwardWhite" />
        </div>
        <h2>Турниры</h2>
        <div className={styles.sportsContainer}>
          <div className={styles.mma} onClick={() => handleSportClick("ММА")}>
            <img src="/img/mma.png" alt="" />
            <p>ММА</p>
          </div>
          <div
            className={styles.fisticuffs}
            onClick={() => handleSportClick("Кулачные бои")}
          >
            <img src="/img/Fisticuffs.png" alt="" />
            <p>Кулачные бои</p>
          </div>
          <div
            className={styles.kickbox}
            onClick={() => handleSportClick("Кикбокс")}
          >
            <img src="/img/kickbox.png" alt="" />
            <p>Кикбокс</p>
          </div>
          <div
            className={styles.muayThai}
            onClick={() => handleSportClick("Тайский бокс")}
          >
            <img src="/img/MuayThai.png" alt="" />
            <p>Тайский бокс</p>
          </div>
          <div
            className={styles.boxing}
            onClick={() => handleSportClick("Бокс")}
          >
            <img src="/img/kickbox.png" alt="" />
            <p>Бокс</p>
          </div>
          <div
            className={styles.wrestling}
            onClick={() => handleSportClick("Борьба")}
          >
            <img src="/img/mma.png" alt="" />
            <p>Борьба</p>
          </div>
        </div>
        <div className={styles.competitions}>
          <div className={styles.competitionsText}>
            <p>Бокс</p>
            <p>Международные бои</p>
          </div>
          <img
            src={isOpen1 ? "up.png" : "down.png"}
            alt=""
            onClick={() => setIsOpen1(!isOpen1)}
            style={{ cursor: "pointer" }}
          />
        </div>
        {isOpen1 && (
          <div className={styles.dropdownContent}>
            <p className={styles.name}>Андерсон А.</p>
            <div className={styles.time}>
              <p>04:15</p>
            </div>
            <p className={styles.name}>Неераж Г.</p>
          </div>
        )}

        <div className={styles.competitions}>
          <div className={styles.competitionsText}>
            <p>Бокс</p>
            <p>Международные бои</p>
          </div>
          <img
            src={isOpen2 ? "up.png" : "down.png"}
            alt=""
            onClick={() => setIsOpen2(!isOpen2)}
            style={{ cursor: "pointer" }}
          />
        </div>
        {isOpen2 && (
          <div>
            <img src="mdi_fire.png" alt="" className={styles.mdiFire} />
            <div className={styles.dropdownContent}>
              <p className={styles.name}>Андерсон А.</p>
              <div className={styles.timeDate}>
                <p>15 декабря 14:00</p>
              </div>
              <p className={styles.name}>Неераж Г.</p>
            </div>
            <div className={styles.dropdownContent}>
              <p className={styles.name}>Андерсон А.</p>
              <div className={styles.timeDate}>
                <p>15 декабря 14:00</p>
              </div>
              <p className={styles.name}>Неераж Г.</p>
            </div>
          </div>
        )}
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
        <div className={styles.catalogItem}>
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

export default AllTournaments;
