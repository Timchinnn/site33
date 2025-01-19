import React, { useEffect, useState } from "react";
import styles from "./Subscriptions.module.css";
import { useNavigate } from "react-router-dom";

function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]); // Инициализация пустым массивом
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");
  const handleBackClick = () => {
    navigate(-1); // Возврат на предыдущую страницу
  };
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await fetch(`/api/subscriptions/${userId}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          // Проверка что data является массивом
          if (Array.isArray(data)) {
            setSubscriptions(data);
          } else {
            setSubscriptions([]); // Если нет, устанавливаем пустой массив
          }
        }
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
        setSubscriptions([]); // При ошибке устанавливаем пустой массив
      }
    };

    fetchSubscriptions();
  }, []);
  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div className={styles.backArrow}>
            <img src="/arrow.png" alt="#" onClick={handleBackClick} />{" "}
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
        <h1>Активные подписки</h1>
        <div className={styles.content}>
          <p className={styles.earn}>
            Настраивай автодонаты, чтобы регулярно поддерживать выбранных
            спортсменов. Каждый донат увеличивает вес твоего голоса
          </p>
        </div>

        {Array.isArray(subscriptions) &&
          subscriptions.map((subscription) => (
            <div key={subscription.id} className={styles.referralProgram}>
              <div className={styles.fighterInfo}>
                <img
                  src={`${subscription.fighter_photo}`}
                  alt=""
                  className={styles.avatar}
                />
                <div className={styles.actionName}>
                  <p className={styles.name}>
                    {subscription.fighter_name}{" "}
                    {subscription.fighter_surname[0]}.
                  </p>
                  <p className={styles.action}>Активная подписка</p>
                </div>
                <img
                  src="/forward.png"
                  alt=""
                  onClick={() =>
                    navigate("/SubscriptionDetails", {
                      state: { subscription: subscription },
                    })
                  }
                />
              </div>
              <div className={styles.autoDonat}>
                <p>Текущая сумма автодоната</p>
                <p>{subscription.amount} ₽</p>
              </div>
              <div className={styles.payments}>
                {" "}
                <p>Регулярность платежей</p>
                <p>{subscription.subscription_period}</p>
              </div>
            </div>
          ))}
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

export default Subscriptions;
