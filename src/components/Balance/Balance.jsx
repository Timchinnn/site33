import React, { useState } from "react";
import styles from "./Balance.module.css";
import { useNavigate } from "react-router-dom";

function Balance() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(null); // начальное значение зависит от текущей страницы

  const [isThankYouMessage, setIsThankYouMessage] = useState(false);
  const [showDonateInput, setShowDonateInput] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isToggleOn, setIsToggleOn] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [donateAmount, setDonateAmount] = useState(0);
  // eslint-disable-next-line
  const [userBalance, setUserBalance] = useState(0);
  const userType = localStorage.getItem("userType");

  const [showDonateModal, setShowDonateModal] = useState(false);
  const handleDonateClick = () => {
    setShowDonateModal(true);
  };
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
    // Логика завершения доната
    setIsThankYouMessage(true);
  };
  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div className={styles.backArrow}>
            <img src="arrow.png" alt="#" onClick={() => navigate(-1)} />{" "}
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
            <img src="search.png" alt="" className={styles.search} />
          </div>
        </div>
        <div className={styles.content}>
          <h1>Текущий баланс</h1>
          <div className={styles.balance}>
            <h2>{userBalance}₽</h2>
            <div className={styles.button} onClick={handleDonateClick}>
              <p>Пополнить</p>
              <img src="forward-white.png" alt="" />
            </div>
          </div>
        </div>
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
                      {/* <input
                        type="text"
                        placeholder="Введите сообщение"
                        className={styles.donateInput}
                      /> */}
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
                      {/* <div className={styles.autoSupport}>
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
                                selectedDate === 100 ? styles.selected : ""
                              }`}
                              onClick={() => setSelectedDate(100)}
                            >
                              неделя
                            </button>
                            <button
                              className={`${styles.donateButton} ${
                                selectedDate === 300 ? styles.selected : ""
                              }`}
                              onClick={() => setSelectedDate(300)}
                            >
                              2 недели
                            </button>
                            <button
                              className={`${styles.donateButton} ${
                                selectedDate === 500 ? styles.selected : ""
                              }`}
                              onClick={() => setSelectedDate(500)}
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
                      )} */}
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

export default Balance;
