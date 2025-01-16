import React, { useState, useEffect } from "react";
import styles from "./Referal.module.css";
import { useNavigate } from "react-router-dom";

function Referal() {
  const [referralLink, setReferralLink] = useState("");
  const [referralStatus, setReferralStatus] = useState({});
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");
  const [showRatingModal, setShowRatingModal] = useState(false);
  console.log(referralStatus);
  const handleBackClick = () => {
    navigate(-1); // Возврат на предыдущую страницу
  };

  // useEffect(() => {
  //   const userId = localStorage.getItem("userId");
  //   const baseUrl = "http://localhost:3000/register?ref="; // Базовый URL
  //   setReferralLink(`${baseUrl}${userId}`);
  // }, []);
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userType = localStorage.getItem("userType");

    // Получаем базовый URL для реферальной ссылки
    const baseUrl = "http://localhost:3000/register?ref=";
    setReferralLink(`${baseUrl}${userId}`);

    // Проверяем реферальные отношения
    const checkReferralStatus = async () => {
      try {
        const response = await fetch(
          `/api/referral/status/${userId}?userType=${userType}`
        );
        if (response.ok) {
          const data = await response.json();
          // data будет содержать информацию о том:
          // isReferrer - является ли пользователь чьим-то рефералом
          // hasReferrals - имеет ли пользователь рефералов
          console.log(data);
          setReferralStatus(data);
        }
      } catch (error) {
        console.error("Error checking referral status:", error);
      }
    };

    checkReferralStatus();
  }, []);
  const copyReferralLink = () => {
    navigator.clipboard
      .writeText(referralLink)
      .then(() => {
        alert("Ссылка скопирована!");
      })
      .catch((err) => {
        console.error("Ошибка при копировании:", err);
      });
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
        <h1>Реферальная программа</h1>
        <div className={styles.content}>
          <div className={styles.earned}>
            <p>Всего заработано</p>
            <p>62 750 ₽</p>
          </div>
          <p className={styles.earn}>
            Зарабатывай от 40 000 руб в месяц добавляя новых пользователей и
            бойцов. Вы получаете процент от каждого доната
          </p>
          <p className={styles.accruals}>
            Начисления и выплаты производятся каждый месяц
          </p>
        </div>

        <div className={styles.referralProgram}>
          <div className={styles.referralText}>
            <h2>Пригласить фаната</h2>
            <p>
              вам будет начисляться 8% от донатов каждого приглашенного друга
            </p>
          </div>
          <img
            src="forward-white.png"
            alt=""
            className="forwardWhite"
            onClick={() => {
              // setIsThankYouMessageRating(false);
              setShowRatingModal(true);
            }}
          />
        </div>
        <div className={styles.referralProgram}>
          <div className={styles.referralText}>
            <h2>Пригласить спортсмена</h2>
            <p>
              вам будет начисляться 5% от донатов каждого приглашенного бойца
            </p>
          </div>
          <img
            src="forward-white.png"
            alt=""
            className="forwardWhite"
            onClick={() => {
              // setIsThankYouMessageRating(false);
              setShowRatingModal(true);
            }}
          />
        </div>
        <div className={styles.content}>
          {referralStatus.isReferrer && referralStatus.referrerName && (
            <p className={styles.accruals}>
              Вы являетесь рефералом, приглашённым {referralStatus.referrerName}
            </p>
          )}
        </div>
        {referralStatus.hasReferrals && referralStatus.referrals.length > 0 && (
          <>
            <p className={styles.earnRef}>Мои рефералы</p>
            {referralStatus.referrals.map((referral) => (
              <div key={referral.id} className={styles.accruals1}>
                {referral.profile_name}{" "}
              </div>
            ))}
          </>
        )}
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
      {showRatingModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.topModalHead}>
              <div className={styles.namesBut}>
                <h2>Пригласить фаната</h2>
                <img
                  src="x-circle.png"
                  alt="#"
                  onClick={() => setShowRatingModal(false)}
                />
              </div>
              <p>Скопируйте реферальную ссылку, чтобы пригласить друга</p>
              <input
                type="text"
                value={referralLink}
                readOnly
                className={styles.referralInput}
              />
              <button onClick={copyReferralLink}>Скопировать ссылку</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Referal;
