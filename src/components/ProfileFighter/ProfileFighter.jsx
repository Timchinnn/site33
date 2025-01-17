import React, { useState, useEffect } from "react";
import styles from "./ProfileFighter.module.css";
import { useNavigate } from "react-router-dom";

function ProfileFighter() {
  const userType = localStorage.getItem("userType");

  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [userName, setUserName] = useState("");
  const [fighterName, setFighterName] = useState("");
  const [fighterData, setFighterData] = useState([]);
  // fighterData
  const [balance, setBalance] = useState(0);

  console.log(profilePhoto);
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      try {
        const response = await fetch(`/api/fighter/profile/${userId}`);
        if (response.ok) {
          const data = await response.json();

          setProfilePhoto(data.userData.photo_url); // Предполагая, что фото приходит в этом поле
          console.log("Profile photo:", data.userData.photo_url);
          console.log("Profile photo:", data);
          const fullPhotoUrl = `${data.userData.photo_url}`;
          console.log(data);
          setUserName(`${data.userData.name} ${data.userData.surname}`);
          setFighterName(
            `${data.userData.first_name} ${data.userData.last_name}`
          );
          setBalance(data.userData.balance);
          setFighterData(data);
          localStorage.setItem("profilePhotoUrl", fullPhotoUrl);
          console.log(data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);
  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div className={styles.backArrow}>
            <img src="arrow.png" alt="#" onClick={() => navigate("/main")} />
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
        <div className={styles.nameAvatar}>
          <img
            src={
              (localStorage.getItem("profilePhotoUrl") || "").slice(-4) ===
              "null"
                ? "/Avatar.png"
                : localStorage.getItem("profilePhotoUrl")
            }
            alt="Profile"
          />
          <div>
            <h2>{userName}</h2>
            <p>Легендарный донатер</p>
          </div>
        </div>
        <div className={styles.achievement}>
          <h3>Профиль спортсмена</h3>
          {fighterName && fighterData && fighterData.userData.fighter_id ? (
            <img
              src="forward.png"
              alt=""
              onClick={() =>
                navigate("/StatsFighter", {
                  state: {
                    fighterName: fighterName,
                    fighterData: fighterData,
                  },
                })
              }
            />
          ) : null}
        </div>
        {/* <div className={styles.sportsContainer}>
          <img src="Frame 9261.png" alt="#" />
          <img src="Frame 9263.png" alt="#" />
          <img src="Frame 9264.png" alt="#" />
          <img src="Frame 9257.png" alt="#" />
          <img src="Frame 9257.png" alt="#" />
        </div> */}
        <div className={styles.accountSection}>
          <div>
            <img src="person (2).png" alt="" />
            <p
              onClick={() => {
                navigate("/ProfileFighterAcc");
              }}
            >
              Аккаунт
            </p>
          </div>
          <div className={styles.balanceInfo}>
            <div>
              <img src="cash-stack.png" alt="" />
              <p
                onClick={() => {
                  navigate("/Balance");
                }}
              >
                Баланс
              </p>
            </div>{" "}
            <p class="subscriptions-amount">{balance}₽ </p>
          </div>
          <div
            onClick={() => {
              navigate("/Subscriptions");
            }}
          >
            <img src="lucide_tickets.png" alt="" />
            <p>Подписки</p>
          </div>
          <div
            onClick={() => {
              navigate("/Referal");
            }}
          >
            <img src="gift (1).png" alt="" />
            <p>Реферальная программа</p>
          </div>
          <div>
            <img src="ui-checks.png" alt="" />
            <p>FAQ</p>
          </div>
          <div>
            <img src="layout-text-window.png" alt="" />
            <p>Помощь</p>
          </div>
          {!fighterData?.userData?.fighter_id && (
            <div className={styles.achievement}>
              <h3>Пройти верификацию</h3>
              <img
                src="forward.png"
                alt=""
                onClick={() => navigate("/verification")} // Добавить соответствующий роут
              />
            </div>
          )}
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

export default ProfileFighter;
