import React, { useState, useEffect } from "react";
import styles from "./Referal.module.css";
import { useNavigate } from "react-router-dom";

function Referal() {
  const [referralLink, setReferralLink] = useState("");
  const [referralStatus, setReferralStatus] = useState({});
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showRatingModalFight, setShowRatingModalFight] = useState(false);
  console.log(referralStatus);
  useEffect(() => {
    const images = [
      "ui-checks-grid-black.png",
      "ui-checks-grid.png",
      "lightning-charge-black.png",
      "lightning-charge.png",
      "gift-black.png",
      "gift.png",
      "person-black.png",
      "person.png",
    ];

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);
  useEffect(() => {
    const images = [
      "ui-checks-grid-black.png",
      "ui-checks-grid.png",
      "lightning-charge-black.png",
      "lightning-charge.png",
      "gift-black.png",
      "gift.png",
      "person-black.png",
      "person.png",
    ];

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);
  const handleBackClick = () => {
    navigate(-1); // Возврат на предыдущую страницу
  };
  const [activeTab, setActiveTab] = useState("referrals"); // начальное значение зависит от текущей страницы

  // useEffect(() => {
  //   const userId = localStorage.getItem("userId");
  //   const baseUrl = "http://localhost:3000/register?ref="; // Базовый URL
  //   setReferralLink(`${baseUrl}${userId}`);
  // }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
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
            <h1 className={styles.BroDonate}>BroDonate</h1>
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
            <img
              src="/solar_download-outline.png"
              alt=""
              className={styles.solarDownload}
            />
            <p>Зачислить на текущий счёт</p>
          </div>
          {/* <p className={styles.earn}>
            Зарабатывай от 40 000 руб в месяц добавляя новых пользователей и
            бойцов. Вы получаете процент от каждого доната
          </p> */}
          <p className={styles.accruals}>
            Приглашай друзей или спортсменов и получай % с каждого доната
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
            className={styles.forwardWhite}
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
            className={styles.forwardWhite}
            onClick={() => {
              // setIsThankYouMessageRating(false);
              setShowRatingModalFight(true);
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
      {showRatingModalFight && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.topModalHead}>
              <div className={styles.namesBut}>
                <h2>Пригласить бойца</h2>
                <img
                  src="x-circle.png"
                  alt="#"
                  onClick={() => setShowRatingModalFight(false)}
                />
              </div>
              <p>Скопируйте реферальную ссылку, чтобы пригласить бойца</p>
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
