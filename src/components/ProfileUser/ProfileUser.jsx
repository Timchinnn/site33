import React, { useState, useEffect } from "react";
import styles from "./ProfileUser.module.css";
import { useNavigate } from "react-router-dom";

function ProfileUser() {
  const userType = localStorage.getItem("userType");
  const [activeTab, setActiveTab] = useState("profile"); // начальное значение зависит от текущей страницы

  const userId = localStorage.getItem("userId");

  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [userName, setUserName] = useState("");
  const [balance, setBalance] = useState(0);
  // const [achievements, setAchievements] = useState(null);
  const [totalStars, setTotalStars] = useState(null);
  const calculateTotalStars = (achievements) => {
    if (!achievements) return 0;
    let total = 0;
    // Scout Progress stars (Скаут перспектив)
    total +=
      achievements.scoutProgress.current < 5
        ? 1
        : achievements.scoutProgress.current < 10
        ? 2
        : achievements.scoutProgress.current >= 20
        ? 3
        : 2;
    // Loyal Ally stars (Верный союзник)
    total +=
      achievements.loyalAllyProgress.current < 2
        ? 1
        : achievements.loyalAllyProgress.current < 3
        ? 2
        : achievements.loyalAllyProgress.current >= 5
        ? 3
        : 2;
    // Big Donation stars (Большая ставка)
    total +=
      achievements.bigDonationProgress.current < 3
        ? 1
        : achievements.bigDonationProgress.current < 5
        ? 2
        : achievements.bigDonationProgress.current >= 5
        ? 3
        : 2;
    // Voice of Justice stars (Голос справедливости)
    total +=
      achievements.voiceOfJusticeProgress.current < 5
        ? 1
        : achievements.voiceOfJusticeProgress.current < 10
        ? 2
        : achievements.voiceOfJusticeProgress.current >= 15
        ? 3
        : 2;
    // Justice Will Prevail stars (Справедливость восторжествует)
    total +=
      achievements.justiceWillPrevailProgress.current < 1
        ? 1
        : achievements.justiceWillPrevailProgress.current < 3
        ? 2
        : achievements.justiceWillPrevailProgress.current >= 5
        ? 3
        : 2;
    // Epic Fan stars (Эпический фанат)
    total +=
      achievements.epicFan.current < 2
        ? 1
        : achievements.epicFan.current < 4
        ? 2
        : achievements.epicFan.current >= 6
        ? 3
        : 2;
    // Tournament Council stars (Совет турнира)
    total +=
      achievements.tournamentCouncil.current < 1
        ? 1
        : achievements.tournamentCouncil.current < 3
        ? 2
        : achievements.tournamentCouncil.current >= 5
        ? 3
        : 2;
    // Referee Achievement stars (Внимательный рефери)
    total +=
      achievements.refereeAchievement.current < 5
        ? 1
        : achievements.refereeAchievement.current < 10
        ? 2
        : achievements.refereeAchievement.current >= 15
        ? 3
        : 2;
    // Outstanding Benefactor stars (Выдающийся благотворитель)
    total +=
      achievements.outstandingBenefactor.current < 17
        ? 1
        : achievements.outstandingBenefactor.current < 34
        ? 2
        : achievements.outstandingBenefactor.current >= 50
        ? 3
        : 2;
    // Referral Achievement stars (Единомышленники)
    total +=
      achievements.referralAchievement.current < 3
        ? 1
        : achievements.referralAchievement.current < 6
        ? 2
        : achievements.refereeAchievement.current >= 10
        ? 3
        : 2;
    // Referral Achievement Fighter stars (Менеджер легенд)
    total +=
      achievements.referralAchievementFigh.current < 1
        ? 1
        : achievements.referralAchievementFigh.current < 3
        ? 2
        : achievements.referralAchievementFigh.current >= 5
        ? 3
        : 2;
    return total;
  };
  useEffect(() => {
    const fetchAchievementsAndCalculate = async () => {
      const userId = localStorage.getItem("userId");
      const userType = localStorage.getItem("userType");

      try {
        const [
          achievementsResponse,
          votingResponse,
          negativeVotingResponse,
          epicFanResponse,
          tournamentCouncilResponse,
          refereeAchievementResponse,
          outstandingBenefactorResponse,
          referralAchievementResponse,
          referralAchievementFighResponse,
        ] = await Promise.all([
          fetch(`/api/achievements/${userId}`),
          fetch(`/api/voting-achievements/${userId}`),
          fetch(`/api/negative-voting-achievements/${userId}`),
          fetch(`/api/user/epic-fan/${userId}`),
          fetch(`/api/tournament-council/${userId}?userType=${userType}`),
          fetch(`/api/referee-achievement/${userId}?userType=${userType}`),
          fetch(`/api/outstanding-benefactor/${userId}?userType=${userType}`),
          fetch(`/api/referral-achievement/${userId}`),
          fetch(`/api/referral-achievement-figh/${userId}`),
        ]);

        if (
          achievementsResponse.ok &&
          votingResponse.ok &&
          negativeVotingResponse.ok &&
          epicFanResponse.ok &&
          tournamentCouncilResponse.ok &&
          refereeAchievementResponse.ok &&
          outstandingBenefactorResponse.ok &&
          referralAchievementResponse.ok &&
          referralAchievementFighResponse.ok
        ) {
          const achievementsData = await achievementsResponse.json();
          const votingData = await votingResponse.json();
          const negativeVotingData = await negativeVotingResponse.json();
          const epicFanData = await epicFanResponse.json();
          const tournamentCouncilData = await tournamentCouncilResponse.json();
          const refereeAchievementData =
            await refereeAchievementResponse.json();
          const outstandingBenefactorData =
            await outstandingBenefactorResponse.json();
          const referralAchievementData =
            await referralAchievementResponse.json();
          const referralAchievementFighData =
            await referralAchievementFighResponse.json();

          const newAchievements = {
            ...achievementsData,
            ...votingData,
            ...negativeVotingData,
            epicFan: epicFanData,
            tournamentCouncil: tournamentCouncilData,
            refereeAchievement: refereeAchievementData,
            outstandingBenefactor: outstandingBenefactorData,
            referralAchievement: referralAchievementData,
            referralAchievementFigh: referralAchievementFighData,
          };

          // setAchievements(newAchievements);
          const totalStars = calculateTotalStars(newAchievements);
          setTotalStars(totalStars);
        }
      } catch (error) {
        console.error("Error fetching achievements:", error);
      }
    };

    fetchAchievementsAndCalculate();
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
  console.log(profilePhoto);
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      try {
        const response = await fetch(`/api/user/profile/${userId}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setProfilePhoto(data.userData.photo_url); // Предполагая, что фото приходит в этом поле
          // console.log("Profile photo:", data.userData.photo_url);
          const fullPhotoUrl = `${data.userData.photo_url}`;
          setUserName(data.userData.profile_name);
          setBalance(data.userData.balance);
          localStorage.setItem("profilePhotoUrl", fullPhotoUrl);
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
            <img src="arrow.png" alt="#" onClick={() => navigate("/")} />
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
          <h3>Достижения</h3>
          <img src="forward.png" alt="" />
        </div>
        <div
          className={styles.sportsContainer}
          onClick={() => {
            navigate("/Achievements");
          }}
        >
          <div className={styles.starCoint}>
            <p className={styles.stars}>Звезды достижений</p>
            <p className={styles.starsCount}>{totalStars}</p>
          </div>
          <img src="/Frame 9411.png" alt="" />
          {/* <img src="Frame 9261.png" alt="#" />
          <img src="Frame 9263.png" alt="#" />
          <img src="Frame 9264.png" alt="#" />
          <img src="Frame 9257.png" alt="#" />
          <img src="Frame 9257.png" alt="#" /> */}
        </div>
        <div className={styles.accountSection}>
          <div>
            <img src="person (2).png" alt="" />
            <p
              onClick={() => {
                navigate("/ProfileUserAcc");
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
            <p className="subscriptions-amount">{balance}₽ </p>
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
          {userId === "3" && userType === "fan" && (
            <div onClick={() => navigate("/AdminPanel")}>
              <img src="admin-icon.png" alt="" />
              <p>Админ панель</p>
            </div>
          )}
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

export default ProfileUser;
