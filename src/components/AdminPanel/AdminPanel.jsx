import React, { useState, useEffect, useCallback } from "react";
import styles from "./AdminPanel.module.css";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [fighters, setFighters] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [selectedSection, setSelectedSection] = useState("users");
  const [matches, setMatches] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [selectedDiscipline, setSelectedDiscipline] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [selectedTournament, setSelectedTournament] = useState("");
  const [unverifiedFighters, setUnverifiedFighters] = useState([]);
  const [allFighters, setAllFighters] = useState([]);
  // eslint-disable-next-line
  const [selectedFighterId, setSelectedFighterId] = useState(null);
  const [usersFighters, setUsersFighters] = useState([]);

  const [selectedFighterIds, setSelectedFighterIds] = useState({});
  const [selectedTournamentIds, setSelectedTournamentIds] = useState({});
  // eslint-disable-next-line
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);
  // В AdminPanel.jsx добавьте новый useEffect для получения данных из users_fighters
  useEffect(() => {
    const fetchUsersFighters = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/users-fighters"
        );
        if (response.ok) {
          const data = await response.json();
          // Добавьте состояние для хранения данных если необходимо
          setUsersFighters(data);
          console.log(data);
        }
      } catch (error) {
        console.error("Error fetching users_fighters:", error);
      }
    };

    fetchUsersFighters();
  }, []);
  console.log(usersFighters);
  // Добавим useEffect для загрузки неверифицированных бойцов и существующих бойцов
  useEffect(() => {
    const fetchUnverifiedFighters = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/unverified-fighters"
        );
        if (response.ok) {
          const data = await response.json();
          // Фильтруем уникальные записи по id
          const uniqueFighters = [
            ...new Map(data.map((item) => [item.id, item])).values(),
          ];
          setUnverifiedFighters(uniqueFighters);
        }
      } catch (error) {
        console.error("Error fetching unverified fighters:", error);
      }
    };

    const fetchAllFighters = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/all-fighters"
        );
        if (response.ok) {
          const data = await response.json();
          setAllFighters(data);
        }
      } catch (error) {
        console.error("Error fetching all fighters:", error);
      }
    };

    fetchUnverifiedFighters();
    fetchAllFighters();
  }, []);

  // Добавим функцию для верификации бойца

  const handleVerifyFighter = async (
    usersFighterId,
    selectedFighterId,
    tournamentId
  ) => {
    console.log(
      parseInt(usersFighterId),
      parseInt(selectedFighterId),
      parseInt(tournamentId)
    );
    try {
      if (!usersFighterId || !selectedFighterId || !tournamentId) {
        console.error("Все поля обязательны");
        return;
      }
      const response = await fetch(
        "http://localhost:5000/api/admin/verify-fighter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            users_fighter_id: parseInt(usersFighterId),
            selected_fighter_id: parseInt(selectedFighterId),
            tournament_id: parseInt(tournamentId),
          }),
        }
      );

      if (response.ok) {
        setUnverifiedFighters(
          unverifiedFighters.filter((fighter) => fighter.id !== usersFighterId)
        );
        setSelectedFighterId(null);
        setSelectedTournamentId(null);
      }
    } catch (error) {
      console.error("Error verifying fighter:", error);
    }
  };
  useEffect(() => {
    const fetchDisciplinesAndTournaments = async () => {
      try {
        const [disciplinesResponse, tournamentsResponse] = await Promise.all([
          fetch("http://localhost:5000/api/admin/disciplines"),
          fetch("http://localhost:5000/api/admin/tournaments"),
        ]);

        const disciplinesData = await disciplinesResponse.json();
        const tournamentsData = await tournamentsResponse.json();

        setDisciplines(disciplinesData);
        setTournaments(tournamentsData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDisciplinesAndTournaments();
  }, []);
  const fetchData = useCallback(async () => {
    try {
      let response;
      switch (selectedSection) {
        case "users":
          response = await fetch("http://localhost:5000/api/admin/users");
          break;
        case "fighters":
          response = await fetch("http://localhost:5000/api/admin/fighters");
          break;
        case "tournaments":
          response = await fetch("http://localhost:5000/api/admin/tournaments");
          break;
        case "matches":
          response = await fetch("http://localhost:5000/api/admin/matches");
          break;
        default:
          return;
      }
      const data = await response.json();
      switch (selectedSection) {
        case "users":
          setUsers(data);
          break;
        case "fighters":
          setFighters(data);
          break;
        case "tournaments":
          setTournaments(data);
          break;
        case "matches":
          setMatches(data);
          break;
        default:
          // обработка по умолчанию
          break;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [selectedSection]);
  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const response = await fetch("http://localhost:5000/api/admin/users");
  //       if (response.ok) {
  //         const data = await response.json();
  //         // Убедитесь, что data - это массив
  //         setUsers(Array.isArray(data) ? data : []);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching users:", error);
  //       setUsers([]); // Установите пустой массив в случае ошибки
  //     }
  //   };

  //   fetchUsers();
  // }, []);
  useEffect(() => {
    fetchData(); // Добавьте начальный вызов для загрузки данных
  }, [selectedSection, fetchData]);

  const handleDelete = async (id, type) => {
    try {
      // Находим fighter_id если удаляется боец
      let fighter_id = null;
      if (type === "fighters") {
        const fighter = usersFighters.find((f) => f.id === id);
        fighter_id = fighter?.fighter_id;
      }

      // Отправляем запрос на удаление с fighter_id
      await fetch(`http://localhost:5000/api/admin/${type}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fighter_id: fighter_id,
        }),
      });

      fetchData();
      const fetchUsersFighters = async () => {
        try {
          const response = await fetch(
            "http://localhost:5000/api/admin/users-fighters"
          );
          if (response.ok) {
            const data = await response.json();
            // Добавьте состояние для хранения данных если необходимо
            setUsersFighters(data);
            console.log(data);
          }
        } catch (error) {
          console.error("Error fetching users_fighters:", error);
        }
      };

      fetchUsersFighters(); // Обновляем данные после удаления
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemData, setNewItemData] = useState({});

  // Добавить функцию создания

  const handleCreate = async () => {
    try {
      if (selectedSection === "matches") {
        if (
          !newItemData.competitor_1 ||
          !newItemData.competitor_2 ||
          !selectedTournament ||
          !newItemData.match_date
        ) {
          alert("Пожалуйста, заполните все обязательные поля");
          return;
        }

        try {
          const response = await fetch(
            "http://localhost:5000/api/admin/matches",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                competitor_1: newItemData.competitor_1,
                competitor_2: newItemData.competitor_2,
                tournament_id: selectedTournament,
                match_date: newItemData.match_date,
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            // Add fighter names to the response data
            const matchWithNames = {
              ...data,
              competitor_1: newItemData.competitor_1,
              competitor_2: newItemData.competitor_2,
            };
            setMatches((prevMatches) => [...prevMatches, matchWithNames]);
            setShowAddForm(false);
            setNewItemData({});
          }
          return; // Добавляем return для предотвращения дальнейшего выполнения
        } catch (error) {
          console.error("Error creating match:", error);
          return;
        }
      }
      if (selectedSection === "tournaments") {
        const response = await fetch(
          `http://localhost:5000/api/admin/${selectedSection}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: newItemData.name,
              date: newItemData.date,
              discipline_id: selectedDiscipline,
            }),
          }
        );

        if (response.ok) {
          fetchData();
          setShowAddForm(false);
          setNewItemData({});
          setSelectedDiscipline("");
        }
      } else {
        // Существующая логика для других разделов
        const formData = new FormData();
        formData.append("name", newItemData.name);
        formData.append("surname", newItemData.surname);
        formData.append("discipline_id", selectedDiscipline);
        formData.append("photo", newItemData.photo);
        formData.append("nick", newItemData.nick);
        formData.append("country", newItemData.country);
        formData.append("region", newItemData.region);
        formData.append("record", newItemData.record);

        const response = await fetch(
          `http://localhost:5000/api/admin/${selectedSection}`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          fetchData();
          setShowAddForm(false);
          setNewItemData({});
          setSelectedDiscipline("");
        }
      }
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };
  return (
    <div className={styles.adminPanel}>
      <div className={styles.header}>
        <h1>Админ панель</h1>
        {/* <button onClick={() => navigate("/main")}>Назад</button> */}
        <img src="arrow.png" alt="#" onClick={() => navigate("/main")} />
      </div>
      <div className={styles.navigation}>
        <button
          onClick={() => setSelectedSection("users")}
          className={selectedSection === "users" ? styles.active : ""}
        >
          Пользователи
        </button>
        <button
          onClick={() => setSelectedSection("fighters")}
          className={selectedSection === "fighters" ? styles.active : ""}
        >
          Бойцы
        </button>
        <button
          onClick={() => setSelectedSection("tournaments")}
          className={selectedSection === "tournaments" ? styles.active : ""}
        >
          Турниры
        </button>
        <button
          onClick={() => setSelectedSection("matches")}
          className={selectedSection === "matches" ? styles.active : ""}
        >
          Матчи
        </button>
      </div>
      <div className={styles.content}>
        {selectedSection === "users" && (
          <div className={styles.table}>
            {Array.isArray(users) &&
              users.map((user) => (
                <div key={user.id} className={styles.row}>
                  <span>{user.mail}</span>
                  <span>{user.profile_name}</span>
                  <button onClick={() => handleDelete(user.id, "users")}>
                    Удалить
                  </button>
                </div>
              ))}
          </div>
        )}

        {selectedSection === "fighters" && (
          <div className={styles.table}>
            {/* Отображение бойцов */}
            <h3>Бойцы</h3>

            {Array.isArray(fighters) &&
              fighters.map((fighter) => (
                <div key={fighter.id} className={styles.row}>
                  <span>
                    {fighter.name} {fighter.surname[0]}.
                  </span>
                  <span>{fighter.discipline}</span>
                  {/* Убираем кнопку удаления для бойцов */}
                </div>
              ))}

            {/* Отображение аккаунтов бойцов с возможностью удаления */}
            <h3>Аккаунты бойцов</h3>

            <div className={styles.table}>
              {Array.isArray(usersFighters) &&
                usersFighters.map((fighter) => (
                  <div key={fighter.id} className={styles.row}>
                    <span>{fighter.name}</span>
                    <button
                      onClick={() => handleDelete(fighter.id, "fighters")}
                    >
                      Удалить
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
        {selectedSection === "fighters" && (
          <div className={styles.table}>
            <h3>Неверифицированные аккаунты бойцов</h3>

            {unverifiedFighters.map((fighter) => (
              <div key={fighter.id} className={styles.rowVer}>
                <span>{fighter.name}</span>
                <select
                  onChange={(e) =>
                    setSelectedFighterIds((prev) => ({
                      ...prev,
                      [fighter.id]: e.target.value,
                    }))
                  }
                  value={selectedFighterIds[fighter.id] || ""}
                >
                  <option value="">Выберите бойца</option>
                  {allFighters.map((existingFighter) => (
                    <option key={existingFighter.id} value={existingFighter.id}>
                      {existingFighter.name}
                    </option>
                  ))}
                </select>
                <select
                  onChange={(e) =>
                    setSelectedTournamentIds((prev) => ({
                      ...prev,
                      [fighter.id]: e.target.value,
                    }))
                  }
                  value={selectedTournamentIds[fighter.id] || ""}
                >
                  <option value="">Выберите турнир</option>
                  {tournaments.map((tournament) => (
                    <option key={tournament.id} value={tournament.id}>
                      {tournament.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() =>
                    handleVerifyFighter(
                      fighter.id,
                      selectedFighterIds[fighter.id],
                      selectedTournamentIds[fighter.id]
                    )
                  }
                  disabled={
                    !selectedFighterIds[fighter.id] ||
                    !selectedTournamentIds[fighter.id]
                  }
                >
                  Верифицировать
                </button>
              </div>
            ))}
          </div>
        )}
        {selectedSection === "tournaments" && (
          <div className={styles.table}>
            {Array.isArray(tournaments) &&
              tournaments.map((tournament) => (
                <div key={tournament.id} className={styles.row}>
                  <span>{tournament.name}</span>
                  <span>{tournament.date}</span>
                  <button
                    onClick={() => handleDelete(tournament.id, "tournaments")}
                  >
                    Удалить
                  </button>
                </div>
              ))}
          </div>
        )}
        {selectedSection === "matches" && (
          <div className={styles.table}>
            {Array.isArray(matches) &&
              matches.map((match) => (
                <div key={match.id} className={styles.row}>
                  <span>
                    {match.competitor_1} vs {match.competitor_2}
                  </span>
                  <span>{match.date}</span>
                  <button onClick={() => handleDelete(match.id, "matches")}>
                    Удалить
                  </button>
                </div>
              ))}
          </div>
        )}
        {/* Аналогичные секции для fighters и tournaments */}
        <div className={styles.navigation1}>
          {/* Существующие кнопки */}
          <button onClick={() => setShowAddForm(true)}>
            Добавить{" "}
            {selectedSection === "users"
              ? "пользователя"
              : selectedSection === "matches"
              ? "матч"
              : selectedSection === "fighters"
              ? "бойца"
              : "турнир"}
          </button>
        </div>
      </div>
      {/* // Добавить форму создания в JSX */}

      {showAddForm && (
        <div className={styles.addFormFigh}>
          {selectedSection === "users" && (
            <>
              <input
                placeholder="Email"
                onChange={(e) =>
                  setNewItemData({ ...newItemData, email: e.target.value })
                }
              />
              <input
                placeholder="Имя профиля"
                onChange={(e) =>
                  setNewItemData({
                    ...newItemData,
                    profile_name: e.target.value,
                  })
                }
              />
            </>
          )}

          {selectedSection === "fighters" && (
            <>
              {/* <input
                placeholder="Имя"
                onChange={(e) =>
                  setNewItemData({ ...newItemData, name: e.target.value })
                }
              />
              <input
                placeholder="Фамилия"
                onChange={(e) =>
                  setNewItemData({ ...newItemData, surname: e.target.value })
                }
              /> */}
              <input
                placeholder="Имя"
                onChange={(e) =>
                  setNewItemData({ ...newItemData, name: e.target.value })
                }
              />
              <input
                placeholder="Фамилия"
                onChange={(e) =>
                  setNewItemData({ ...newItemData, surname: e.target.value })
                }
              />
              <input
                placeholder="Никнейм"
                onChange={(e) =>
                  setNewItemData({ ...newItemData, nick: e.target.value })
                }
              />
              <input
                placeholder="Страна"
                onChange={(e) =>
                  setNewItemData({ ...newItemData, country: e.target.value })
                }
              />
              <input
                placeholder="Регион"
                onChange={(e) =>
                  setNewItemData({ ...newItemData, region: e.target.value })
                }
              />
              <input
                placeholder="Рекорд"
                onChange={(e) =>
                  setNewItemData({ ...newItemData, record: e.target.value })
                }
              />
              <input
                type="file"
                className={styles.fileInput}
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setNewItemData({
                    ...newItemData,
                    photo: file,
                  });
                }}
              />
              {/* Заменить input на select для дисциплины */}
              <select
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value)}
              >
                <option value="">Выберите дисциплину</option>
                {disciplines.map((discipline) => (
                  <option key={discipline.id} value={discipline.id}>
                    {discipline.name}
                  </option>
                ))}
              </select>

              {/* Добавить select для турнира */}
              <select
                value={selectedTournament}
                onChange={(e) => {
                  setSelectedTournament(e.target.value);
                  setNewItemData({
                    ...newItemData,
                    tournament_id: e.target.value,
                  });
                }}
              >
                <option value="">Выберите турнир</option>
                {tournaments.map((tournament) => (
                  <option key={tournament.id} value={tournament.id}>
                    {tournament.name}
                  </option>
                ))}
              </select>
            </>
          )}
          {selectedSection === "tournaments" && (
            <>
              <select
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value)}
              >
                <option value="">Выберите дисциплину</option>
                {disciplines.map((discipline) => (
                  <option key={discipline.id} value={discipline.id}>
                    {discipline.name}
                  </option>
                ))}
              </select>
              <input
                placeholder="Название турнира"
                onChange={(e) =>
                  setNewItemData({
                    ...newItemData,
                    name: e.target.value,
                    discipline_id: selectedDiscipline,
                  })
                }
              />
              <input
                placeholder="Дата"
                type="date"
                onChange={(e) =>
                  setNewItemData({ ...newItemData, date: e.target.value })
                }
              />
            </>
          )}
          {/* jsx */}
          {selectedSection === "matches" && (
            <>
              <select
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value)}
              >
                <option value="">Выберите дисциплину</option>
                {disciplines.map((discipline) => (
                  <option key={discipline.id} value={discipline.id}>
                    {discipline.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedTournament}
                onChange={(e) => {
                  setSelectedTournament(e.target.value);
                  setNewItemData({
                    ...newItemData,
                    tournament_id: e.target.value,
                  });
                }}
              >
                <option value="">Выберите турнир</option>
                {tournaments.map((tournament) => (
                  <option key={tournament.id} value={tournament.id}>
                    {tournament.name}
                  </option>
                ))}
              </select>

              <input
                placeholder="Первый боец"
                onChange={(e) =>
                  setNewItemData({
                    ...newItemData,
                    competitor_1: e.target.value,
                  })
                }
              />
              <input
                placeholder="Второй боец"
                onChange={(e) =>
                  setNewItemData({
                    ...newItemData,
                    competitor_2: e.target.value,
                  })
                }
              />
              <input
                placeholder="Дата и время"
                type="datetime-local"
                onChange={(e) => {
                  setNewItemData({
                    ...newItemData,
                    match_date: e.target.value, // Сохраняем исходное значение в match_date
                  });
                }}
              />
            </>
          )}
          <button className={styles.create} onClick={handleCreate}>
            Создать
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
