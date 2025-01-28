import React, { useState, useEffect } from "react";
import styles from "./AllTournaments.module.css";
import { useNavigate } from "react-router-dom";

function AllTournaments() {
  const [activeTab, setActiveTab] = useState("tournaments"); // начальное значение зависит от текущей страницы
  const userType = localStorage.getItem("userType");
  const navigate = useNavigate();
  const [sportData, setSportData] = useState({
    tournaments: [],
    matches: [],
  });
  const handleFighterClick = async (fighterName) => {
    // Убираем последние 3 символа из имени бойца

    try {
      // Отправляем запрос на сервер
      const response = await fetch(`/api/fighter/${fighterName}`);

      if (response.ok) {
        const fighterData = await response.json();

        // Перенаправляем на страницу статистики с полученными данными
        navigate("/StatsFighterFan", {
          state: {
            fighterName: fighterName,
            fighterData: fighterData,
          },
        });
      } else {
        console.error("Failed to fetch fighter data");
      }
    } catch (error) {
      console.error("Error fetching fighter data:", error);
    }
  };
  useEffect(() => {
    const fetchAllTournaments = async () => {
      try {
        // Получаем матчи для всех дисциплин одновременно
        const responses = await Promise.all(
          [
            "ММА",
            "Кулачные бои",
            "Кикбоксинг",
            "Тайский бокс",
            "Бокс",
            "Борьба",
          ].map((sport) => fetch(`/api/tournaments/${sport}`))
        );

        const allData = await Promise.all(responses.map((r) => r.json()));

        // Объединяем данные всех дисциплин
        const combinedData = {
          tournaments: allData.flatMap((d) => d.tournaments),
          matches: allData.flatMap((d) => d.matches),
        };

        setSportData(combinedData);
      } catch (error) {
        console.error("Error fetching tournaments data:", error);
      }
    };

    fetchAllTournaments();
  }, []);
  const tournaments = sportData.tournaments;
  const matches = sportData.matches;
  const [isOpen, setIsOpen] = useState({});
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
  const toggleOpen = (tournamentId) => {
    setIsOpen((prev) => ({
      ...prev,
      [tournamentId]: !prev[tournamentId], // Переключаем состояние конкретного турнира
    }));
  };
  console.log(sportData);

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
        </div>{" "}
        <div className={styles.referralProgram}>
          <div className={styles.referralText}>
            <h2>Популярные события</h2>
            <p>Выбирайте фаворитов и участвуйте в активных голосованиях</p>
          </div>
          <img src="forward-white.png" alt="" />
        </div>
        {tournaments.map((tournament) => (
          <div key={tournament.id}>
            <div className={styles.competitions}>
              <div
                className={styles.competitionsText}
                onClick={() => handleMatchClick(tournament)}
              >
                <p>{tournament.discipline_name}</p>
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
              <div style={{ cursor: "pointer" }}>
                {matches
                  .filter((match) => match.tournament_id === tournament.id)
                  .map((match) => (
                    <div key={match.id} className={styles.dropdownContent}>
                      <div className={styles.timeDate}>
                        <p>{match.match_date}</p>
                      </div>
                      <div className={styles.fightersNames}>
                        <div
                          className={styles.fighterName}
                          onClick={() => handleFighterClick(match.competitor_1)}
                        >
                          <img
                            className={styles.Avatar}
                            src={
                              match.fighter1_photo
                                ? match.fighter1_photo
                                : "Avatar.png"
                            }
                            alt=""
                          />
                          <p className={styles.name}>{match.competitor_1}</p>
                        </div>
                        <div className={styles.fighterName}>
                          <img
                            className={styles.Avatar}
                            src={
                              match.fighter2_photo
                                ? match.fighter2_photo
                                : "Avatar.png"
                            }
                            alt=""
                          />
                          <p className={styles.name}>{match.competitor_2}</p>{" "}
                        </div>
                      </div>
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
            navigate("/main");
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

export default AllTournaments;
