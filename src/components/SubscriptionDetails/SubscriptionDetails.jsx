import React from "react";
import styles from "./SubscriptionDetails.module.css";
import { useNavigate, useLocation } from "react-router-dom";

function SubscriptionDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { subscription } = location.state;
  const userType = localStorage.getItem("userType");
  const handleBackClick = () => {
    navigate(-1); // Возврат на предыдущую страницу
  };
  const handleEdit = () => {
    navigate("/SubscriptionEdit", {
      state: { subscription: subscription },
    });
  };
  const fetchSubscriptions = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        `/api/subscriptions/${userId}`
      );
      if (response.ok) {
        // Обновление списка подписок после успешного запроса
        navigate(-1); // Возврат на предыдущую страницу после отмены подписки
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  };
  const handleCancel = async () => {
    try {
      const response = await fetch(
        `/api/subscriptions/${subscription.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: localStorage.getItem("userId"),
          }),
        }
      );

      if (response.ok) {
        // Обновляем список подписок после удаления
        fetchSubscriptions();
      }
    } catch (error) {
      console.error("Ошибка при отмене подписки:", error);
    }
  };
  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div className={styles.backArrow}>
            <img src="/arrow.png" alt="#" onClick={handleBackClick} />{" "}
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
        <h1>Управление подпиской</h1>

        <div key={subscription.id} className={styles.referralProgram}>
          <div className={styles.fighterInfo}>
            <img
              src={`${subscription.fighter_photo}`}
              alt=""
              className={styles.avatar}
            />
            <div className={styles.actionName}>
              <p className={styles.name}>
                {subscription.fighter_name} {subscription.fighter_surname[0]}.
              </p>
              <p className={styles.action}>Активная подписка</p>
            </div>
            <img src="/forward.png" alt="" />
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
        <div className={styles.buttons}>
          <button className={styles.editButton} onClick={handleEdit}>
            Изменить
          </button>
          <button className={styles.cancelButton} onClick={handleCancel}>
            Отменить
          </button>
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

export default SubscriptionDetails;
