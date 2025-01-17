import React, { useState, useEffect } from "react";
import styles from "./Voting.module.css";
import { useNavigate, useLocation } from "react-router-dom";

function Voting() {
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");
  const [selectedFighter, setSelectedFighter] = useState("");
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [donateAmount, setDonateAmount] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [userBalance, setUserBalance] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const { tournament, matches } = location.state || {};
  // console.log(matches);
  const toggleModal = () => {
    setShowModal(!showModal);
  };
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
  console.log(matches);
  useEffect(() => {
    const fetchVoteResults = async () => {
      try {
        const response = await fetch(`/api/tournament-votes/${tournament.id}`);
        if (response.ok) {
          const data = await response.json();
          const results = {};
          data.forEach((vote) => {
            // Используем fighter_id вместо name и surname
            results[vote.category_id] = vote.fighter_id;
          });
          setVoteResults(results);
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
  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div className={styles.backArrow}>
            <img src="arrow.png" alt="#" onClick={() => navigate(-1)} />
            <h1>SportDonation</h1>
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
          <img src="mdi_fire.png" alt="" className={styles.mdiFire} />
          {matches
            .filter((match) => match.tournament_id === tournament.id)
            .map((match) => (
              <div key={match.id} className={styles.dropdownContent}>
                <p
                  className={styles.name}
                  onClick={() => handleFighterClick(match.competitor_1)}
                  style={{ cursor: "pointer" }}
                >
                  {match.competitor_1}
                </p>
                <div className={styles.timeDate}>
                  <p>{match.match_date}</p>
                </div>
                <p
                  className={styles.name}
                  onClick={() => handleFighterClick(match.competitor_2)}
                  style={{ cursor: "pointer" }}
                >
                  {match.competitor_2}
                </p>
              </div>
            ))}
        </div>
        <p className={styles.currentVoting}>Текущее голосование</p>
        <div className={styles.currentVotings}>
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
              <div>
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
            <div className={styles.topModalHead}>
              <div className={styles.namesBut}>
                <h2>Донат</h2>
                <img
                  src="x-circle.png"
                  alt="#"
                  onClick={() => setShowDonateModal(false)}
                />
              </div>
            </div>
            <div className={styles.donateButtonsGrid}>
              {[100, 300, 500, 1000, 3000, 5000].map((amount) => (
                <button
                  key={amount}
                  className={`${styles.donateButton} ${
                    selectedAmount === amount ? styles.selected : ""
                  }`}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setDonateAmount(amount);
                  }}
                >
                  {amount} ₽
                </button>
              ))}
            </div>
            {/* Add payment methods section */}
            <div className={styles.paymentMethods}>
              <div
                className={styles.balanceNow}
                onClick={() => handlePaymentSelect("balance")}
              >
                <p>Текущий баланс</p>
                <p>{userBalance}₽</p>
              </div>
              {/* Add bank card options */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Voting;
