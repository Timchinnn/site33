import React, { useState, useEffect } from "react";
import styles from "./Saerch.module.css";
import { useNavigate } from "react-router-dom";

function Saerch() {
  const userType = localStorage.getItem("userType");

  const navigate = useNavigate();
  const [fighters, setFighters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFighters, setFilteredFighters] = useState([]);

  // Fetch all fighters
  useEffect(() => {
    const fetchFighters = async () => {
      try {
        const response = await fetch("/api/fighters");
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setFighters(data);
          // setFilteredFighters(data);
        }
      } catch (error) {
        console.error("Error fetching fighters:", error);
      }
    };

    fetchFighters();
  }, []);
  // В Search.jsx изменить функцию handleFighterClick:
  const handleFighterClick = async (fighter) => {
    try {
      navigate("/StatsFighterFan", {
        state: {
          fighterName: fighter.name, // Добавляем имя бойца
          fighterData: fighter, // Передаем все данные о бойце
        },
      });
    } catch (error) {
      console.error("Error navigating to fighter stats:", error);
    }
  };
  // Handle search input

  // В функции handleSearch измените условие:
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Показывать бойцов только если есть поисковый запрос
    if (query.trim()) {
      const filtered = fighters.filter(
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
        </div>{" "}
        <div className={styles.authForm}>
          {/* <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Поиск бойцов..."
          className={styles.searchInput}
        /> */}
          <div className={styles.passwordInputContainer}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Поиск бойцов..."
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

export default Saerch;
