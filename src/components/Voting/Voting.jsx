import React, { useState, useEffect } from "react";
import styles from "./Voting.module.css";
import { useNavigate, useLocation } from "react-router-dom";

function Voting() {
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");
  const [selectedFighter, setSelectedFighter] = useState("");
  const [showDonateModal, setShowDonateModal] = useState(false);

  const [expandedVoting, setExpandedVoting] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const { tournament, matches } = location.state || {};
  // console.log(matches);
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const [isThankYouMessage, setIsThankYouMessage] = useState(false);
  const [showDonateInput, setShowDonateInput] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isToggleOn, setIsToggleOn] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [donateAmount, setDonateAmount] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const handleDonateSelect = (amount) => {
    setSelectedAmount(amount);
    setDonateAmount(amount);
  };

  const handlePaymentSelect = (type) => {
    setSelectedPayment(type);
  };

  const handleDonateNext = () => {
    setShowDonateInput(true);
  };

  const handleDonateEnd = async () => {
    setIsThankYouMessage(true);
  };
  useEffect(() => {
    const fetchUserBalance = async () => {
      try {
        const userType = localStorage.getItem("userType");
        const userId = localStorage.getItem("userId");
        const response = await fetch(
          `/api/balance/${userId}?userType=${userType}`
        );
        if (response.ok) {
          const data = await response.json();
          setUserBalance(data.balance);
        }
      } catch (error) {
        console.error("Error fetching user balance:", error);
      }
    };
    fetchUserBalance();
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
    if (showModal && matches.length > 0) {
      setSelectedFighter(matches[0].competitor_1);
    }
  }, [showModal, matches]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  // console.log(selectedCategories);
  const handleFighterClick = async (fighterName) => {
    // Убираем последние 3 символа из имени бойца
    const trimmedName = fighterName.slice(0, -3);

    try {
      // Отправляем запрос на сервер
      const response = await fetch(`/api/fighter/${trimmedName}`);

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
  const handleCategoryClick = (category) => {
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(category)) {
        return prevSelected.filter((item) => item !== category);
      } else {
        return [...prevSelected, category];
      }
    });
  };
  const [userVotes, setUserVotes] = useState({});
  const userId = localStorage.getItem("userId");

  // Функция для проверки голосов пользователя при загрузке компонента
  useEffect(() => {
    const fetchUserVotes = async () => {
      try {
        const response = await fetch(
          `/api/user-votes/${userId}/${tournament.id}?userType=${userType}`
        );
        if (response.ok) {
          const data = await response.json();
          const votedCategories = {};
          data.votes.forEach((vote) => {
            votedCategories[vote.category_id] = vote.fighter_id;
          });
          setUserVotes(votedCategories);
        }
      } catch (error) {
        console.error("Error fetching user votes:", error);
      }
    };

    if (userId && tournament) {
      fetchUserVotes();
    }
  }, [userId, tournament, userType]);

  // Модифицируем функцию голосования
  // В handleVote функции
  // In Voting.jsx
  const handleVote = async (fighterId) => {
    if (!selectedCategories.length) return;

    try {
      // Check votes with userType
      const response = await fetch("/api/check-votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          tournamentId: tournament.id,
          categories: selectedCategories,
          userType: localStorage.getItem("userType"),
        }),
      });

      const { votedCategories } = await response.json();
      const newCategories = selectedCategories.filter(
        (cat) => !votedCategories.includes(cat)
      );

      if (newCategories.length === 0) {
        alert("Вы уже проголосовали во всех выбранных категориях");
        return;
      }

      // Add matchId to the request body
      await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          tournamentId: tournament.id,
          categories: newCategories,
          fighterId,
          matchId: matches.find(
            (m) =>
              m.competitor_1 === selectedFighter ||
              m.competitor_2 === selectedFighter
          )?.id,
          userType: localStorage.getItem("userType"),
        }),
      });

      const newVotes = { ...userVotes };
      newCategories.forEach((cat) => {
        newVotes[cat] = fighterId;
      });
      setUserVotes(newVotes);
      setShowModal(false);
      setSelectedCategories([]);
    } catch (error) {
      console.error("Error voting:", error);
    }
  };
  const [voteResults, setVoteResults] = useState({});
  console.log(voteResults);
  console.log(matches);
  useEffect(() => {
    const fetchVoteResults = async () => {
      try {
        const response = await fetch(`/api/tournament-votes/${tournament.id}`);
        if (response.ok) {
          const data = await response.json();

          setVoteResults(data);
          console.log(data);
        }
      } catch (error) {
        console.error("Error fetching vote results:", error);
      }
    };
    if (tournament) {
      fetchVoteResults();
    }
  }, [tournament]);

  const [topDonations, setTopDonations] = useState([]);
  console.log(topDonations);
  useEffect(() => {
    const fetchTopDonations = async () => {
      try {
        const response = await fetch(
          `/api/tournament/${tournament.id}/top-donations`
        );
        if (response.ok) {
          const data = await response.json();
          setTopDonations(data);
        }
      } catch (error) {
        console.error("Error fetching top donations:", error);
      }
    };

    if (tournament) {
      fetchTopDonations();
    }
  }, [tournament]);
  // console.log(topDonations);
  function calculateVotePercentages(voteResults) {
    const percentages = {};

    Object.entries(voteResults).forEach(([category, fighters]) => {
      // Группируем голоса по fighter_id
      const votesMap = {};
      fighters.forEach((fighter) => {
        if (!votesMap[fighter.fighter_id]) {
          votesMap[fighter.fighter_id] = 0;
        }
        votesMap[fighter.fighter_id] += fighter.votes;
      });

      // Считаем общую сумму
      const totalVotes = Object.values(votesMap).reduce(
        (sum, votes) => sum + votes,
        0
      );

      // Вычисляем проценты
      percentages[category] = {};
      Object.entries(votesMap).forEach(([fighterId, votes]) => {
        percentages[category][fighterId] =
          totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
      });
    });

    return percentages;
  }

  // Пример использования:
  const percentages = calculateVotePercentages(voteResults);
  console.log(percentages);
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
        <p className={styles.selectTour}>Турниры·MMA</p>
        <h1>{tournament.name}</h1>
        <p className={styles.date}>15 декабря 2024, воскресенье</p>
        <div>
          {/* <img src="mdi_fire.png" alt="" className={styles.mdiFire} /> */}

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
                    <p className={styles.name}>{match.competitor_1}</p>{" "}
                  </div>
                  <div
                    className={styles.fighterName}
                    onClick={() => handleFighterClick(match.competitor_2)}
                  >
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
        <p className={styles.currentVoting}>Текущее голосование</p>
        {/* <div className={styles.currentVotings}>
          <div
            style={
              !topDonations[0]?.surname && !topDonations[0]?.name
                ? {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }
                : null
            }
          >
            <p>Топ донатов</p>
            {topDonations[0]?.surname && topDonations[0]?.name && (
              <p className={styles.nameFigh}>
                {topDonations[0].surname} {topDonations[0].name[0]}.
              </p>
            )}
          </div>
          <div
            style={
              !voteResults["fan"]
                ? {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }
                : null
            }
          >
            {" "}
            <p>Выбор фанатов</p>
            {voteResults["fan"] && (
              <p className={styles.nameFigh}>{voteResults["fan"]}</p>
            )}
          </div>
          <div
            style={
              !voteResults["best-fight"]
                ? {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }
                : null
            }
          >
            <p>Лучший бой турнира</p>
            {voteResults["best-fight"] && (
              <p className={styles.nameFigh}>{voteResults["best-fight"]}</p>
            )}
          </div>
          <div
            style={
              !voteResults["best-fighter"]
                ? {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }
                : null
            }
          >
            <p>Лучший боец турнира</p>
            {voteResults["best-fighter"] && (
              <p className={styles.nameFigh}>{voteResults["best-fighter"]}</p>
            )}
          </div>
          <div
            style={
              !voteResults["best-knockout"]
                ? {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }
                : null
            }
          >
            <p>Лучший нокаут турнира</p>
            {voteResults["best-knockout"] && (
              <p className={styles.nameFigh}>{voteResults["best-knockout"]}</p>
            )}
          </div>
          <div
            style={
              !voteResults["best-bicycle"]
                ? {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }
                : null
            }
          >
            <p>Велосипед турнира</p>
            {voteResults["best-bicycle"] && (
              <p className={styles.nameFigh}>{voteResults["best-bicycle"]}</p>
            )}
          </div>
        </div> */}
        <div className={styles.currentVotings}>
          <div
            className={styles.voting}
            style={{
              paddingBottom: expandedVoting === "best-fight" ? undefined : 0,
            }}
            onClick={() =>
              setExpandedVoting((prev) =>
                prev === "best-fight" ? null : "best-fight"
              )
            }
          >
            <div className={styles.votingHeader}>
              <p>Лучший бой турнира</p>
              <img
                src="/down.png"
                alt="expand"
                className={`${styles.expandIcon} ${
                  expandedVoting ? styles.expanded : ""
                }`}
              />
            </div>

            {expandedVoting === "best-fight" && (
              <div className={styles.votingDetails}>
                {matches.map((match) => (
                  <div key={match.id} className={styles.matchVotes}>
                    <div className={styles.fighters}>
                      <p>{match.competitor_1}</p>
                      <div className={styles.progressContainer}>
                        <div className={styles.voteProgressBar}>
                          <div
                            className={styles.voteProgressFill}
                            style={{
                              width: `${
                                percentages["best-fight"][match.competitor_1] ||
                                0
                              }%`,
                            }}
                          />
                        </div>
                        <p className={styles.percentage}>
                          {percentages["best-fight"][match.competitor_1] || 0}%
                        </p>
                      </div>

                      <p>{match.competitor_2}</p>
                      <div className={styles.progressContainer}>
                        <div className={styles.voteProgressBar}>
                          <div
                            className={styles.voteProgressFill}
                            style={{
                              width: `${
                                percentages["best-fight"][match.competitor_2] ||
                                0
                              }%`,
                            }}
                          />
                        </div>
                        <p className={styles.percentage}>
                          {percentages["best-fight"][match.competitor_2] || 0}%
                        </p>
                      </div>
                    </div>
                    {/* <div className={styles.voteCount}>
                      <p>
                        {percentages["best-fight"][match.competitor_1] || 0}%
                      </p>
                      <p>
                        {percentages["best-fight"][match.competitor_2] || 0}%
                      </p>
                    </div> */}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div
            className={styles.voting}
            style={{
              paddingBottom: expandedVoting === "best-fighter" ? undefined : 0,
            }}
            onClick={() =>
              setExpandedVoting((prev) =>
                prev === "best-fighter" ? null : "best-fighter"
              )
            }
          >
            <div className={styles.votingHeader}>
              <p>Лучший боец турнира</p>
              <img
                src="/down.png"
                alt="expand"
                className={`${styles.expandIcon} ${
                  expandedVoting ? styles.expanded : ""
                }`}
              />
            </div>

            {expandedVoting === "best-fighter" && (
              <div className={styles.votingDetails}>
                {matches.map((match) => (
                  <div key={match.id} className={styles.matchVotes}>
                    <div className={styles.fighters}>
                      <p>{match.competitor_1}</p>
                      <div className={styles.progressContainer}>
                        <div className={styles.voteProgressBar}>
                          <div
                            className={styles.voteProgressFill}
                            style={{
                              width: `${
                                percentages["best-fighter"][
                                  match.competitor_1
                                ] || 0
                              }%`,
                            }}
                          />
                        </div>
                        <p className={styles.percentage}>
                          {percentages["best-fighter"][match.competitor_1] || 0}
                          %
                        </p>
                      </div>

                      <p>{match.competitor_2}</p>
                      <div className={styles.progressContainer}>
                        <div className={styles.voteProgressBar}>
                          <div
                            className={styles.voteProgressFill}
                            style={{
                              width: `${
                                percentages["best-fighter"][
                                  match.competitor_2
                                ] || 0
                              }%`,
                            }}
                          />
                        </div>
                        <p className={styles.percentage}>
                          {percentages["best-fighter"][match.competitor_2] || 0}
                          %
                        </p>
                      </div>
                    </div>
                    {/* <div className={styles.voteCount}>
                      <p>
                        {percentages["best-fight"][match.competitor_1] || 0}%
                      </p>
                      <p>
                        {percentages["best-fight"][match.competitor_2] || 0}%
                      </p>
                    </div> */}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div
            className={styles.voting}
            style={{
              paddingBottom: expandedVoting === "best-knockout" ? undefined : 0,
            }}
            onClick={() =>
              setExpandedVoting((prev) =>
                prev === "best-knockout" ? null : "best-knockout"
              )
            }
          >
            <div className={styles.votingHeader}>
              <p>Лучший нокаут турнира</p>
              <img
                src="/down.png"
                alt="expand"
                className={`${styles.expandIcon} ${
                  expandedVoting ? styles.expanded : ""
                }`}
              />
            </div>

            {expandedVoting === "best-knockout" && (
              <div className={styles.votingDetails}>
                {matches.map((match) => (
                  <div key={match.id} className={styles.matchVotes}>
                    <div className={styles.fighters}>
                      <p>{match.competitor_1}</p>
                      <div className={styles.progressContainer}>
                        <div className={styles.voteProgressBar}>
                          <div
                            className={styles.voteProgressFill}
                            style={{
                              width: `${
                                percentages["best-knockout"][
                                  match.competitor_1
                                ] || 0
                              }%`,
                            }}
                          />
                        </div>
                        <p className={styles.percentage}>
                          {percentages["best-knockout"][match.competitor_1] ||
                            0}
                          %
                        </p>
                      </div>

                      <p>{match.competitor_2}</p>
                      <div className={styles.progressContainer}>
                        <div className={styles.voteProgressBar}>
                          <div
                            className={styles.voteProgressFill}
                            style={{
                              width: `${
                                percentages["best-knockout"][
                                  match.competitor_2
                                ] || 0
                              }%`,
                            }}
                          />
                        </div>
                        <p className={styles.percentage}>
                          {percentages["best-knockout"][match.competitor_2] ||
                            0}
                          %
                        </p>
                      </div>
                    </div>
                    {/* <div className={styles.voteCount}>
                      <p>
                        {percentages["best-fight"][match.competitor_1] || 0}%
                      </p>
                      <p>
                        {percentages["best-fight"][match.competitor_2] || 0}%
                      </p>
                    </div> */}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div
            className={styles.voting}
            style={{
              paddingBottom: expandedVoting === "best-bicycle" ? undefined : 0,
            }}
            onClick={() =>
              setExpandedVoting((prev) =>
                prev === "best-bicycle" ? null : "best-bicycle"
              )
            }
          >
            <div className={styles.votingHeader}>
              <p>Велосипед турнира</p>
              <img
                src="/down.png"
                alt="expand"
                className={`${styles.expandIcon} ${
                  expandedVoting ? styles.expanded : ""
                }`}
              />
            </div>

            {expandedVoting === "best-bicycle" && (
              <div className={styles.votingDetails}>
                {matches.map((match) => (
                  <div key={match.id} className={styles.matchVotes}>
                    <div className={styles.fighters}>
                      <p>{match.competitor_1}</p>
                      <div className={styles.progressContainer}>
                        <div className={styles.voteProgressBar}>
                          <div
                            className={styles.voteProgressFill}
                            style={{
                              width: `${
                                percentages["best-bicycle"][
                                  match.competitor_1
                                ] || 0
                              }%`,
                            }}
                          />
                        </div>
                        <p className={styles.percentage}>
                          {percentages["best-bicycle"][match.competitor_1] || 0}
                          %
                        </p>
                      </div>

                      <p>{match.competitor_2}</p>
                      <div className={styles.progressContainer}>
                        <div className={styles.voteProgressBar}>
                          <div
                            className={styles.voteProgressFill}
                            style={{
                              width: `${
                                percentages["best-bicycle"][
                                  match.competitor_2
                                ] || 0
                              }%`,
                            }}
                          />
                        </div>
                        <p className={styles.percentage}>
                          {percentages["best-bicycle"][match.competitor_2] || 0}
                          %
                        </p>
                      </div>
                    </div>
                    {/* <div className={styles.voteCount}>
                      <p>
                        {percentages["best-fight"][match.competitor_1] || 0}%
                      </p>
                      <p>
                        {percentages["best-fight"][match.competitor_2] || 0}%
                      </p>
                    </div> */}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <p className={styles.currentVoting}>Топ донатов турнира</p>
        <div className={styles.topTournamentDonations}>
          <div>
            <p>Ellen SH</p>
            <p>Грант Д.</p>
          </div>
          <div>
            <p>#1</p>
            <p> ₽15600.00</p>
          </div>
        </div>
        <hr />
        <div className={styles.topTournamentDonations}>
          <div>
            <p>Ellen SH</p>
            <p>Грант Д.</p>
          </div>
          <div>
            <p>#1</p>
            <p> ₽15600.00</p>
          </div>
        </div>{" "}
        <hr />
        <div className={styles.topTournamentDonations}>
          <div>
            <p>Ellen SH</p>
            <p>Грант Д.</p>
          </div>
          <div>
            <p>#1</p>
            <p> ₽15600.00</p>
          </div>
        </div>{" "}
        <hr />
        <div className={styles.topTournamentDonations}>
          <div>
            <p>Ellen SH</p>
            <p>Грант Д.</p>
          </div>
          <div>
            <p>#1</p>
            <p> ₽15600.00</p>
          </div>
        </div>
        <div className={styles.vote}>
          <button onClick={toggleModal}>Голосовать</button>
          <div
            className={styles.imgDonateBlack}
            onClick={() => setShowDonateModal(true)}
          >
            <img src="hands-helping.png" alt="" />
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
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.topModalHead}>
              <div className={styles.headerVoting}>
                <img src="arrow.png" alt="#" onClick={() => navigate(-1)} />
                <h2>{tournament.name}</h2>
              </div>
              <img src="x-circle.png" alt="#" onClick={toggleModal} />
            </div>
            <h3 className={styles.currentVoting}>Выберите категорию</h3>
            <div
              className={`${styles.chooseFan} ${
                selectedCategories.includes("fan")
                  ? styles.categorySelected
                  : ""
              }`}
              onClick={() => !userVotes["fan"] && handleCategoryClick("fan")}
              style={{
                backgroundColor: userVotes["fan"] ? "black" : "",
                color: userVotes["fan"] ? "white" : "",
              }}
            >
              <p>Выбор фанатов</p>
            </div>

            <div className={styles.choose}>
              {[
                // { id: "fan", label: "Выбор фанатов" },
                { id: "best-fight", label: "Лучший бой турнира" },
                { id: "best-fighter", label: "Лучший боец турнира" },
                { id: "best-knockout", label: "Лучший нокаут турнира" },
                { id: "best-bicycle", label: "Велосипед турнира" },
              ].map((category) => (
                <div
                  key={category.id}
                  className={`${styles.choosesTp} ${
                    selectedCategories.includes(category.id)
                      ? styles.categorySelected
                      : ""
                  }`}
                  onClick={() =>
                    !userVotes[category.id] && handleCategoryClick(category.id)
                  }
                  style={{
                    backgroundColor: userVotes[category.id] ? "black" : "",
                    color: userVotes[category.id] ? "white" : "",
                  }}
                >
                  <p>{category.label}</p>
                </div>
              ))}
            </div>

            {selectedCategories.length > 0 && (
              <div className={`${styles.selectionBlock} ${styles.visible}`}>
                <div className={styles.selectionContent}>
                  <p>Выберите бойца</p>
                  <select onChange={(e) => setSelectedFighter(e.target.value)}>
                    {matches &&
                      matches.flatMap((match) => [
                        <option
                          key={`${match.id}-1`}
                          value={match.competitor_1}
                        >
                          {match.competitor_1}
                        </option>,
                        <option
                          key={`${match.id}-2`}
                          value={match.competitor_2}
                        >
                          {match.competitor_2}
                        </option>,
                      ])}
                  </select>
                  <button onClick={() => handleVote(selectedFighter)}>
                    Голосовать
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {showDonateModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            {isThankYouMessage ? (
              <div>
                {" "}
                <p>Спасибо!</p>
                <p>
                  Ваш донат успешно отправлен! Сумма отобразится в статистике в
                  течение несольких минут
                </p>
                <button
                  onClick={() => {
                    setIsThankYouMessage(false);
                    setShowDonateModal(false);
                    setShowDonateInput(false);
                  }}
                >
                  Назад в профиль
                </button>
              </div>
            ) : (
              <div>
                {" "}
                <div className={styles.topModalHead}>
                  <div className={styles.namesBut}>
                    <h2>Донат</h2>
                    <img
                      src="x-circle.png"
                      alt="#"
                      onClick={() => {
                        setShowDonateModal(false);
                        setShowDonateInput(false); // Сброс состояния при закрытии
                      }}
                    />
                  </div>
                </div>
                {!showDonateInput ? (
                  // Текущий контент с кнопками
                  <>
                    <div className={styles.donateButtonsGrid}>
                      <button
                        className={`${styles.donateButton} ${
                          selectedAmount === 100 ? styles.selected : ""
                        }`}
                        onClick={() => handleDonateSelect(100)}
                      >
                        100 ₽
                      </button>
                      <button
                        className={`${styles.donateButton} ${
                          selectedAmount === 300 ? styles.selected : ""
                        }`}
                        onClick={() => handleDonateSelect(300)}
                      >
                        300 ₽
                      </button>
                      <button
                        className={`${styles.donateButton} ${
                          selectedAmount === 500 ? styles.selected : ""
                        }`}
                        onClick={() => handleDonateSelect(500)}
                      >
                        500 ₽
                      </button>
                      <button
                        className={`${styles.donateButton} ${
                          selectedAmount === 1000 ? styles.selected : ""
                        }`}
                        onClick={() => handleDonateSelect(1000)}
                      >
                        1000 ₽
                      </button>
                      <button
                        className={`${styles.donateButton} ${
                          selectedAmount === 3000 ? styles.selected : ""
                        }`}
                        onClick={() => handleDonateSelect(3000)}
                      >
                        3000 ₽
                      </button>
                      <button
                        className={`${styles.donateButton} ${
                          selectedAmount === 5000 ? styles.selected : ""
                        }`}
                        onClick={() => handleDonateSelect(5000)}
                      >
                        5000 ₽
                      </button>
                    </div>
                    <button
                      className={`${styles.customAmountButton} ${
                        selectedAmount === 1 ? styles.selected : ""
                      }`}
                      onClick={() => setSelectedAmount(1)}
                    >
                      Ввести другую сумму
                    </button>
                    {selectedAmount > 0 && (
                      <div
                        className={`${styles.selectionBlock} ${styles.visible}`}
                      >
                        <div className={styles.selectionContent}>
                          <button onClick={handleDonateNext}>Далее</button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  // Новый контент с input и p
                  <>
                    <div className={styles.donateCounts}>
                      <div className={styles.donateCount}>
                        <p>Сумма доната</p>
                        <p>{donateAmount}₽</p>
                      </div>
                      <input
                        type="text"
                        placeholder="Введите сообщение"
                        className={styles.donateInput}
                      />
                      <p className={styles.donateMessage}>Способ платежа</p>
                      <div
                        className={`${styles.balanceNow} ${
                          selectedPayment === "balance" ? styles.selected : ""
                        }`}
                        onClick={() => handlePaymentSelect("balance")}
                        style={{ cursor: "pointer" }}
                      >
                        <p>Текущий баланс</p>
                        <p>{userBalance}₽</p>
                      </div>
                      <p>или</p>
                      <div className={styles.banks}>
                        <img
                          src="visa.png"
                          alt="visa"
                          className={`${styles.visa} ${
                            selectedPayment === "visa" ? styles.selected : ""
                          }`}
                          onClick={() => handlePaymentSelect("visa")}
                          style={{ cursor: "pointer" }}
                        />
                        <img
                          src="master.png"
                          alt="mastercard"
                          className={`${styles.master} ${
                            selectedPayment === "mastercard"
                              ? styles.selected
                              : ""
                          }`}
                          onClick={() => handlePaymentSelect("mastercard")}
                          style={{ cursor: "pointer" }}
                        />
                        <img
                          src="mir.png"
                          alt="mir"
                          className={`${styles.mir} ${
                            selectedPayment === "mir" ? styles.selected : ""
                          }`}
                          onClick={() => handlePaymentSelect("mir")}
                          style={{ cursor: "pointer" }}
                        />
                        <img
                          src="sbp.png"
                          alt="sbp"
                          className={`${styles.sbp} ${
                            selectedPayment === "sbp" ? styles.selected : ""
                          }`}
                          onClick={() => handlePaymentSelect("sbp")}
                          style={{ cursor: "pointer" }}
                        />
                        <img
                          src="halva.png"
                          alt="halva"
                          className={`${styles.halva} ${
                            selectedPayment === "halva" ? styles.selected : ""
                          }`}
                          onClick={() => handlePaymentSelect("halva")}
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                      <div className={styles.autoSupport}>
                        <div className={styles.autoSupportToggleInput}>
                          <input
                            type="checkbox"
                            id="notificationSwitch"
                            className={styles.noneInput}
                            onChange={() => setIsToggleOn(!isToggleOn)}
                            checked={isToggleOn}
                          />
                          <label htmlFor="notificationSwitch">Toggle</label>
                        </div>
                        <p>Братская автоподдержка</p>
                      </div>
                      {isToggleOn && (
                        <div>
                          <div className={styles.donateButtonsGrid}>
                            <button
                              className={`${styles.donateButton} ${
                                selectedDate === 7 ? styles.selected : ""
                              }`}
                              onClick={() => setSelectedDate(7)}
                            >
                              неделя
                            </button>
                            <button
                              className={`${styles.donateButton} ${
                                selectedDate === 14 ? styles.selected : ""
                              }`}
                              onClick={() => setSelectedDate(14)}
                            >
                              2 недели
                            </button>
                            <button
                              className={`${styles.donateButton} ${
                                selectedDate === 28 ? styles.selected : ""
                              }`}
                              onClick={() => setSelectedDate(28)}
                            >
                              4 недели
                            </button>
                          </div>
                          <button
                            className={`${styles.customAmountButton} ${
                              selectedDate === 1 ? styles.selected : ""
                            }`}
                            onClick={() => setSelectedDate(1)}
                          >
                            Свой вариант в днях
                          </button>
                          {selectedDate > 0 && (
                            <div
                              className={`${styles.selectionBlock} ${styles.visible}`}
                            ></div>
                          )}
                        </div>
                      )}
                      <div className={styles.selectionContent}>
                        <button onClick={handleDonateEnd}>Далее</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Voting;
