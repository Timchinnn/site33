import React, { useState } from "react";
import styles from "./TopMatches.module.css";
import { useNavigate, useLocation } from "react-router-dom";

function TopMatches() {
  const userType = localStorage.getItem("userType");
  const navigate = useNavigate();
  const location = useLocation();
  const { sportData } = location.state || {};
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
  // const [sportData, setsportData] = useState({});
  // const [tournaments, setTournaments] = useState([]);
  // const [matches, setMatches] = useState([]);
  // const [isOpen, setIsOpen] = useState({});
  // console.log(sportData);

  // const sports = useMemo(
  //   () => [
  //     "ММА",
  //     "Кулачные бои",
  //     "Кикбоксинг",
  //     "Тайский бокс",
  //     "Бокс",
  //     "Борьба",
  //   ],
  //   []
  // );

  // useEffect(() => {
  //   const fetchAllSportsData = async () => {
  //     try {
  //       for (const sportName of sports) {
  //         const response = await fetch(`/api/tournaments/${sportName}`);
  //         if (response.ok) {
  //           const data = await response.json();
  //           setsportData((prevData) => ({
  //             ...prevData,
  //             [sportName]: data,
  //           }));

  //           // For tournaments
  //           setTournaments((prevData) => ({
  //             ...prevData,
  //             [sportName]: data.tournaments,
  //           }));

  //           // For matches
  //           setMatches((prevData) => ({
  //             ...prevData,
  //             [sportName]: data.matches,
  //           }));
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error fetching tournament");
  //     }
  //   };

  //   fetchAllSportsData();
  // }, [sports]);
  // const toggleOpen = (tournamentId) => {
  //   setIsOpen((prev) => ({
  //     ...prev,
  //     [tournamentId]: !prev[tournamentId], // Переключаем состояние конкретного турнира
  //   }));
  // };
  // const handleMatchClick = (tournament) => {
  //   const tournamentMatches = matches.filter(
  //     (match) => match.tournament_id === tournament.id
  //   );

  //   navigate("/voting", {
  //     state: {
  //       tournament: tournament,
  //       matches: tournamentMatches,
  //     },
  //   });
  // };
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
