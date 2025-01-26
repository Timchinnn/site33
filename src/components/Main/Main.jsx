import React, { useState, useEffect } from "react";
import styles from "./Main.module.css";

import { useNavigate } from "react-router-dom";
function Main() {
  const [activeSection, setActiveSection] = useState("donations"); // 'donations' или 'votes'

  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType");
  console.log(userId);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFighters, setFilteredFighters] = useState([]);

  // const handleSearch = (e) => {
  //   const query = e.target.value;
  //   if (query.trim()) {
  //     // если пользователь что-то ввел
  //     navigate("/Saerch"); // переход на страницу поиска
  //   }
  // };
  const [topFighters, setTopFighters] = useState([]);
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchTopFighters = async () => {
      try {
        const response = await fetch("/api/top-fighters");
        if (response.ok) {
          const data = await response.json();
          setTopFighters(data);
        }
      } catch (error) {
        console.error("Error fetching top fighters:", error);
      }
    };

    fetchTopFighters();
  }, []);
  const [topVotedFighters, setTopVotedFighters] = useState([]);
  useEffect(() => {
    const fetchTopVotedFighters = async () => {
      try {
        const response = await fetch("/api/top-voted-fighters");
        if (response.ok) {
          const data = await response.json();
          setTopVotedFighters(data);
        }
      } catch (error) {
        console.error("Error fetching top voted fighters:", error);
      }
    };

    fetchTopVotedFighters();
  }, []);
  const [topMatches, setTopMatches] = useState([]);
  useEffect(() => {
    const fetchTopMatches = async () => {
      try {
        const response = await fetch("/api/top-matches");
        if (response.ok) {
          const data = await response.json();
          setTopMatches(data);
        }
      } catch (error) {
        console.error("Ошибка при получении топовых матчей:", error);
      }
    };

    fetchTopMatches();
  }, []);
  const handleFighterClick = (fighter) => {
    navigate("/StatsFighterFan", {
      state: {
        fighterData: fighter,
      },
    });
  };
  // В Main.jsx
  const handleSportClick = async () => {
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

      navigate("/TopMatches", {
        state: {
          sportData: combinedData,
        },
      });
    } catch (error) {
      console.error("Error");
    }
  };
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Показывать бойцов только если есть поисковый запрос
    if (query.trim()) {
      const filtered = topFighters.filter(
        (fighter) =>
          fighter.name.toLowerCase().includes(query) ||
          fighter.surname.toLowerCase().includes(query) ||
          fighter.nick.toLowerCase().includes(query)
      );
      setFilteredFighters(filtered);
    } else {
      // Очищаем список отфильтрованных бойцов когда поиск пустой
      setFilteredFighters([]);
    }
  };
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);
  const [sortedUsers, setSortedUsers] = useState([]);

  // Add this useEffect to fetch sorted users
  useEffect(() => {
    const fetchSortedUsers = async () => {
      try {
        const response = await fetch("/api/users/sorted-by-votes");
        if (response.ok) {
          const data = await response.json();
          setSortedUsers(data);
        }
      } catch (error) {
        console.error("Error fetching sorted users:", error);
      }
    };

    fetchSortedUsers();
  }, []);
  console.log(sortedUsers);
  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div className={styles.backArrow}>
            {/* <img src="arrow.png" alt="#" onClick={() => navigate(-1)} /> */}
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
            {/* <img
              src="search.png"
              alt=""
              className={styles.search}
              onClick={() => navigate("/Saerch")}
            /> */}
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
        {filteredFighters.map((fighter) => (
          <div
            key={fighter.id}
            className={styles.fighterCard}
            onClick={() => handleFighterClick(fighter)}
          >
            <div>
              <p>
                {fighter.name} {fighter.surname}
              </p>
            </div>
          </div>
        ))}
        <div className={styles.navigationMenu}>
          <div
            className={styles.viewersBlock}
            // onClick={() => {
            //   navigate("/SupportFighters");
            // }}
            onClick={() => {
              navigate("/SupportFighters", {
                state: {
                  fighters: topVotedFighters,
                },
              });
            }}
          >
            <p className={styles.viewersDecide}>ПОДДЕРЖАТЬ СПОРТСМЕНА</p>
          </div>

          <div className={styles.votingBlock}>
            <p className={styles.hotVoting} onClick={handleSportClick}>
              ГОРЯЧИЕ ГОЛОСОВАНИЯ
            </p>
          </div>
          <div className={styles.leadersBlock}>
            <p
              className={styles.donateLeaders}
              onClick={() => {
                navigate("/TopFighters", {
                  state: {
                    fighters: topFighters,
                    activeSection: activeSection,
                  },
                });
              }}
            >
              ЛИДЕРЫ ДОНАТОВ
            </p>
          </div>
        </div>
        {/* <h2>Дисциплины</h2>
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
        </div> */}
        <div className={styles.topMatchesHeader} onClick={handleSportClick}>
          <h2>Топовые матчи</h2>
          <img src="forward.png" alt="" />
        </div>
        <div className={styles.games}>
          {topMatches.slice(0, 4).map((match, index) => (
            <div key={index} className={styles.game}>
              <img src="lightning.png" alt="" />
              <div className={styles.participants}>
                <p>{match.competitor_1}</p>
                <p>{match.competitor_2}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.referralProgram}>
          <div className={styles.referralText}>
            <h2>Реферальная программа</h2>
            <p>Приглашай друзей и получай %% с каждого доната</p>
          </div>
          <img
            src="forward-white.png"
            alt=""
            onClick={() => {
              navigate("/Referal");
            }}
          />
        </div>
        <div className={styles.allSection}>
          {" "}
          <div className={styles.topFightersSection}>
            <div className={styles.headerSection}>
              <h2>Топ бойцов</h2>
              <div className={styles.toggleButtons}>
                <p
                  className={activeSection === "donations" ? styles.active : ""}
                  onClick={() => setActiveSection("donations")}
                >
                  По сборам
                </p>
                <p
                  className={activeSection === "votes" ? styles.active : ""}
                  onClick={() => setActiveSection("votes")}
                >
                  По голосованию
                </p>
              </div>
            </div>
            <div className={styles.fightersList}>
              {activeSection === "donations"
                ? topFighters.slice(0, 4).map((fighter) => (
                    <div
                      key={fighter.id}
                      className={styles.fighterItem}
                      onClick={() => handleFighterClick(fighter)}
                    >
                      <img
                        src={
                          fighter.photo_url
                            ? `${fighter.photo_url}`
                            : "Avatar.png"
                        }
                        alt={fighter.name}
                      />
                      <p>
                        {fighter.name} {fighter.surname[0]}.
                      </p>
                    </div>
                  ))
                : topVotedFighters.slice(0, 4).map((fighter) => (
                    <div
                      key={fighter.id}
                      className={styles.fighterItem}
                      onClick={() => handleFighterClick(fighter)}
                    >
                      <img
                        src={
                          fighter.photo_url
                            ? `${fighter.photo_url}`
                            : "Avatar.png"
                        }
                        alt={fighter.name}
                      />
                      <p>
                        {fighter.name} {fighter.surname[0]}.
                      </p>
                    </div>
                  ))}
            </div>
            <div
              className={styles.watchAll}
              onClick={() => {
                navigate("/TopFighters", {
                  state: {
                    fighters:
                      activeSection === "donations"
                        ? topFighters
                        : topVotedFighters,
                    activeSection: activeSection,
                  },
                });
              }}
            >
              <p>Показать всех</p>
            </div>
          </div>
          <div className={styles.topFightersSection}>
            <div className={styles.headerSection}>
              <h2>Топ фанатов</h2>
              <div className={styles.toggleButtons}>
                <p
                  className={activeSection === "donations" ? styles.active : ""}
                  onClick={() => setActiveSection("donations")}
                >
                  По донатам
                </p>
                <p
                  className={activeSection === "votes" ? styles.active : ""}
                  onClick={() => setActiveSection("votes")}
                >
                  По голосам
                </p>
              </div>
            </div>
            <div className={styles.fightersList}>
              {activeSection === "donations"
                ? users.slice(0, 4).map((fighter) => (
                    <div
                      key={fighter.id}
                      className={styles.fighterItem}
                      // onClick={() => handleFighterClick(fighter)}
                    >
                      <img
                        src={
                          fighter.photo_url
                            ? `${fighter.photo_url}`
                            : "Avatar.png"
                        }
                        alt={fighter.name}
                      />
                      <p>{fighter.name}</p>
                    </div>
                  ))
                : users.slice(0, 4).map((fighter) => (
                    <div
                      key={fighter.id}
                      className={styles.fighterItem}
                      // onClick={() => handleFighterClick(fighter)}
                    >
                      <img
                        src={
                          fighter.photo_url
                            ? `${fighter.photo_url}`
                            : "Avatar.png"
                        }
                        alt={fighter.name}
                      />
                      <p>{fighter.name}</p>
                    </div>
                  ))}
            </div>
            <div
              className={styles.watchAll}
              onClick={() => {
                navigate("/TopFan");
              }}
            >
              <p>Показать всех</p>
            </div>
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

export default Main;
