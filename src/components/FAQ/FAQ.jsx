import React, { useEffect, useState } from "react";
import styles from "./FAQ.module.css";
import { useNavigate } from "react-router-dom";

function FAQ() {
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");
  const userId = localStorage.getItem("userId");
  console.log(userId);
  const [activeTab, setActiveTab] = useState(null); // начальное значение зависит от текущей страницы
  const [openQuestions, setOpenQuestions] = useState({}); // Состояние для отслеживания открытых вопросов

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const questions = [
    {
      id: 1,
      question: "Как принять участие в голосовании в турнире?",
      answer:
        "Перейдите в раздел «Турниры» или «Топовые события», нажмите кнопку Голосовать, выберите категорию и проголосуйте за понравившегося спортсмена. Голосовать в турнире можно один раз за каждую категорию",
    },
    {
      id: 2,
      question: "Почему мой голос не учитывается?",
      answer:
        "Возможно, вы уже проголосовали за выбранного спортсмена, попробуйте в следующий раз или проверьте соединение с интернетом",
    },
    {
      id: 3,
      question: "Как часто я могу голосовать за одного спортсмена?",
      answer:
        "Голосовать за одного спортсмена в турнире можно один раз в одной из категорий турнира. Также вы можете повлиять на рейтинг спортсмена, проголосовав в его профиле. Голосование обновляется каждый месяц",
    },
    {
      id: 4,
      question: "Как отправить донат спортсмену?",
      answer:
        "В профиле спортсмена нажмите кнопку Поддержать донатом, укажите сумму. Также вы можете поддержать выбранного спортсмена из меню турнирова по кнопке Отправить донат. Оплата осуществляется либо с текущего баланса приложения, либо через выбранное средство платежа",
    },
    {
      id: 5,
      question: "Как узнать, получил ли спортсмен мой донат?",
      answer:
        "После успешной оплаты вы получите уведомление, ваш донат отобразится в статистике спортсмена в разделе Донаты",
    },
    {
      id: 6,
      question: "Что такое автодонат?",
      answer:
        "Вы можете настроить регулярный автодонат выбранному спортсмену, чтобы поддержать его. Управление подпиской находится в меню Профиль - Подписки",
    },
    {
      id: 7,
      question: "Могу ли я добавить спортсмена в приложение?",
      answer:
        "Вы можете приглашать фанатов и спортсменов в рамках нашей реферальной программы. При регистрации нового профиля нужно выбрать роль, если участник авторизировался как спортсмен, его профиль отобразится в общем списке спортсменов",
    },
    // Добавьте остальные вопросы
  ];

  const toggleQuestion = (id) => {
    setOpenQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
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
        <h2>FAQ</h2>
        <div>
          {questions.map((q) => (
            <div key={q.id} className={styles.questionBlock}>
              <div
                className={styles.questionHeader}
                onClick={() => toggleQuestion(q.id)}
              >
                <h3>{q.question}</h3>
                <img
                  src="chevron-down.png"
                  alt="Toggle"
                  className={`${styles.arrow} ${
                    openQuestions[q.id] ? styles.expanded : ""
                  }`}
                />
              </div>
              {openQuestions[q.id] && (
                <div className={styles.answer}>{q.answer}</div>
              )}
            </div>
          ))}
        </div>
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

export default FAQ;
