import React, { useState, useEffect } from "react";
import styles from "./Tournament.module.css";
import { useNavigate, useLocation } from "react-router-dom";

function Tournament() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sportData } = location.state || {};
  const tournaments = sportData.tournaments;
  const matches = sportData.matches;
  const [isOpen, setIsOpen] = useState({});
  const [activeTab, setActiveTab] = useState(null); // начальное значение зависит от текущей страницы

  const handleMatchClick = (tournament) => {
    const tournamentMatches = matches.filter(
      (match) => match.tournament_id === tournament.id
    );

    navigate("/voting", {
      state: {
        tournament: tournament,
        matches: tournamentMatches,
      },
    });
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const handleSportClick = async (sportName) => {
    try {
      const response = await fetch(`/api/tournaments/${sportName}`);
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
  const toggleOpen = (tournamentId) => {
    setIsOpen((prev) => ({
      ...prev,
      [tournamentId]: !prev[tournamentId], // Переключаем состояние конкретного турнира
    }));
  }; // const [isOpen2, setIsOpen2] = useState(false);
  const userType = localStorage.getItem("userType");

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
            onClick={() => handleSportClick("Кикбоксинг")}
          >
            <img src="/img/kickbox.png" alt="" />
            <p>Кикбоксинг</p>
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
        {tournaments.map((tournament) => (
          <div key={tournament.id}>
            <div className={styles.competitions}>
              <div className={styles.competitionsText}>
                <p>{tournament.name}</p>
              </div>
              <img
                src={isOpen[tournament.id] ? "up.png" : "down.png"}
                alt=""
                onClick={() => toggleOpen(tournament.id)}
                style={{ cursor: "pointer" }}
              />
            </div>
            {isOpen[tournament.id] && (
              <div
                onClick={() => handleMatchClick(tournament)}
                style={{ cursor: "pointer" }}
              >
                {matches
                  .filter((match) => match.tournament_id === tournament.id)
                  .map((match) => (
                    <div key={match.id} className={styles.dropdownContent}>
                      <p className={styles.name}>{match.competitor_1}</p>
                      <div className={styles.timeDate}>
                        <p>{match.match_date}</p>
                      </div>
                      <p className={styles.name}>{match.competitor_2}</p>
                    </div>
                  ))}
              </div>
            )}
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

export default Tournament;
