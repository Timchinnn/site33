import React, { useState } from "react";
import styles from "./SubscriptionEdit.module.css";
import { useNavigate, useLocation } from "react-router-dom";

function SubscriptionEdit() {
  const location = useLocation();
  const navigate = useNavigate();
  const { subscription } = location.state;
  const userType = localStorage.getItem("userType");
  const handleBackClick = () => {
    navigate(-1); // Возврат на предыдущую страницу
  };
  const [activeTab, setActiveTab] = useState(null); // начальное значение зависит от текущей страницы
  const [selectedAmount, setSelectedAmount] = useState(subscription.amount);
  const [selectedPeriod, setSelectedPeriod] = useState(
    subscription.subscription_period
  );

  const handleEdit = async () => {
    try {
      const response = await fetch(`/api/subscriptions/${subscription.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: selectedAmount,
          subscription_period: selectedPeriod,
          userId: localStorage.getItem("userId"),
        }),
      });

      if (response.ok) {
        navigate(-1);
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
    }
  };

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
        <p className={styles.specify}>Укажите сумму автодоната</p>
        <div className={styles.donateButtonsGrid}>
          {[100, 300, 500, 1000, 3000, 5000].map((amount) => (
            <button
              key={amount}
              className={`${styles.donateButton} ${
                selectedAmount === amount ? styles.selected : ""
              }`}
              onClick={() => setSelectedAmount(amount)}
            >
              {amount} ₽
            </button>
          ))}
        </div>
        <p className={styles.specify}>Укажите регулярность автодоната</p>
        <div className={styles.periodSelection}>
          {["неделя", "2 недели", "4 недели"].map((period) => (
            <button
              key={period}
              className={`${styles.periodButton} ${
                selectedPeriod === period ? styles.selected : ""
              }`}
              onClick={() => setSelectedPeriod(period)}
            >
              {period}
            </button>
          ))}
        </div>

        <button onClick={handleEdit} className={styles.saveButton}>
          Сохранить
        </button>
      </div>
      <div className={styles.bottomNav}>
        <div
          className={styles.catalogItem}
          onClick={() => {
            navigate("/main");
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

export default SubscriptionEdit;
