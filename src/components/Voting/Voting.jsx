import React, { useState } from "react";
import styles from "./Voting.module.css";
import { useNavigate, useLocation } from "react-router-dom";

function Voting() {
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");

  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const { tournament, matches } = location.state || {};
  // console.log(matches);
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const [selectedCategories, setSelectedCategories] = useState([]);
  const handleFighterClick = async (fighterName) => {
    // Убираем последние 3 символа из имени бойца
    const trimmedName = fighterName.slice(0, -3);

    try {
      // Отправляем запрос на сервер
      const response = await fetch(
        `/api/fighter/${trimmedName}`
      );

      if (response.ok) {
        const fighterData = await response.json();

        // Перенаправляем на страницу статистики с полученными данными
        navigate("/StatsFighter", {
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
          <div>
            <p>Топ донатов</p>
            <p>Таверас Р.</p>
          </div>
          <div>
            <p>Выбор фанатов</p>
            <p>Куарантилло Б.</p>
          </div>
          <div>
            <p>Лучший бой турнира</p>
            <p>Свонсон К.</p>
          </div>
          <div>
            <p>Лучший боец турнира</p>
            <p>Куарантилло Б.</p>
          </div>
          <div>
            <p>Лучший нокаут турнира</p>
            <p>Свонсон К.</p>
          </div>
          <div>
            <p>Велосипед турнира</p>
            <p>Куарантилло Б.</p>
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
          <div className={styles.imgDonateBlack}>
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
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.topModalHead}>
              <div>
                <img src="arrow.png" alt="#" />
                <h2>UFC Fight Night</h2>
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
              onClick={() => handleCategoryClick("fan")}
            >
              <p>Выбор фанатов</p>
            </div>

            <div className={styles.choose}>
              {[
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
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <p>{category.label}</p>
                </div>
              ))}
            </div>

            {selectedCategories.length > 0 && (
              <div className={`${styles.selectionBlock} ${styles.visible}`}>
                <div className={styles.selectionContent}>
                  <p>Выберите бойца</p>
                  <select>
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
                  <button>Голосовать</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Voting;
