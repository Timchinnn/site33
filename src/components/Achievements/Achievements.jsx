import React, { useEffect, useState } from "react";
import styles from "./Achievements.module.css";
import { useNavigate } from "react-router-dom";

function Achievements() {
  const [achievements, setAchievements] = useState(null);
  console.log(achievements);
  useEffect(() => {
    const fetchAchievements = async () => {
      const userId = localStorage.getItem("userId");
      const userType = localStorage.getItem("userType");

      try {
        const [
          achievementsResponse,
          votingResponse,
          negativeVotingResponse,
          epicFanResponse,
          tournamentCouncilResponse,
          refereeAchievementResponse, // Добавляем новый запрос
          outstandingBenefactorResponse, // Новый запрос
          referralAchievementResponse, // Добавляем новый запрос
          referralAchievementFighResponse, // Добавляем новый запрос
        ] = await Promise.all([
          fetch(`/api/achievements/${userId}`),
          fetch(`/api/voting-achievements/${userId}`),
          fetch(`/api/negative-voting-achievements/${userId}`),
          fetch(`/api/user/epic-fan/${userId}`),
          fetch(`/api/tournament-council/${userId}?userType=${userType}`),
          fetch(`/api/referee-achievement/${userId}?userType=${userType}`), // Новый эндпоинт
          fetch(`/api/outstanding-benefactor/${userId}?userType=${userType}`), // Новый эндпоинт
          fetch(`/api/referral-achievement/${userId}`),
          fetch(`/api/referral-achievement-figh/${userId}`),
        ]);

        // Проверяем успешность всех запросов
        if (
          achievementsResponse.ok &&
          votingResponse.ok &&
          negativeVotingResponse.ok &&
          epicFanResponse.ok &&
          tournamentCouncilResponse.ok &&
          refereeAchievementResponse.ok && // Добавляем проверку
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
            await refereeAchievementResponse.json(); // Получаем данные
          const outstandingBenefactorData =
            await outstandingBenefactorResponse.json();
          const referralAchievementData =
            await referralAchievementResponse.json();
          const referralAchievementFighData =
            await referralAchievementFighResponse.json();

          setAchievements({
            ...achievementsData,
            ...votingData,
            ...negativeVotingData,
            epicFan: epicFanData,
            tournamentCouncil: tournamentCouncilData,
            refereeAchievement: refereeAchievementData, // Добавляем новое достижение
            outstandingBenefactor: outstandingBenefactorData,
            referralAchievement: referralAchievementData,
            referralAchievementFigh: referralAchievementFighData,
          });
        }
      } catch (error) {
        console.error("Error fetching achievements:", error);
      }
    };
    fetchAchievements();
  }, []);

  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");
  const userId = localStorage.getItem("userId");
  console.log(userId);
  const [activeTab, setActiveTab] = useState(null); // начальное значение зависит от текущей страницы

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const calculateTotalStars = () => {
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
        : achievements.referralAchievement.current >= 10
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

        <div
          className={styles.mainAchievement}
          onClick={() => {
            navigate("/allAchievements");
          }}
        >
          <div className={styles.abotMainAchievement}>
            <h2>Золотой наставник</h2>
            <p className={styles.aboutTextWeight}>
              Ваш вес в сообществе огромен, вы задаёте тон поддержки
            </p>
          </div>
          <div className={styles.starCounts}>
            <img src="Star icon.png" alt="" />
            <h2>{calculateTotalStars()}/15</h2>
          </div>
        </div>
        <h2>Все достижения</h2>
        <div className={styles.allAchievements}>
          <div className={styles.Achievements}>
            <div className={styles.aboutTextBlock}>
              <p className={styles.aboutText}>Скаут перспектив</p>
            </div>
            <img
              className={styles.achievementImg}
              src="boxer-beginner (1) 1.png"
              alt=""
            />
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${
                    (achievements?.scoutProgress.current /
                      achievements?.scoutProgress.targets[
                        achievements?.scoutProgress.current < 5
                          ? 0
                          : achievements?.scoutProgress.current < 10
                          ? 1
                          : 2
                      ]) *
                    100
                  }%`,
                }}
              />
            </div>
            {/* <div className={styles.stars}>
              <img src="Star icon.png" alt="" />
              <img src="Star icon.png" alt="" />
              <img src="Star icon.png" alt="" />
            </div> */}
            <div className={styles.stars}>
              {[
                ...Array(
                  achievements?.scoutProgress.current < 5
                    ? 1
                    : achievements?.scoutProgress.current < 10
                    ? 2
                    : achievements?.scoutProgress.current >= 20 // Изменено условие
                    ? 3
                    : 2
                ),
              ].map((_, i) => (
                <img key={i} src="Star icon.png" alt="" />
              ))}
            </div>
            <p className={styles.task}>
              {
                achievements?.scoutProgress.descriptions[
                  achievements?.scoutProgress.current < 5
                    ? 0
                    : achievements?.scoutProgress.current < 10
                    ? 1
                    : 2
                ]
              }
            </p>
          </div>
          <div className={styles.Achievements}>
            <div className={styles.aboutTextBlock}>
              <p className={styles.aboutText}>Верный союзник</p>
            </div>
            <img
              className={styles.achievementImg}
              src="-boxer-master 1.png"
              alt=""
            />
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${
                    (achievements?.loyalAllyProgress.current /
                      achievements?.loyalAllyProgress.targets[
                        achievements?.loyalAllyProgress.current < 2
                          ? 0
                          : achievements?.loyalAllyProgress.current < 3
                          ? 1
                          : 2
                      ]) *
                    100
                  }%`,
                }}
              />
            </div>
            {/* <div className={styles.stars}>
              <img src="Star icon.png" alt="" />
              <img src="Star icon.png" alt="" />
              <img src="Star icon.png" alt="" />
            </div> */}
            <div className={styles.stars}>
              {[
                ...Array(
                  achievements?.loyalAllyProgress.current < 2
                    ? 1
                    : achievements?.loyalAllyProgress.current < 3
                    ? 2
                    : achievements?.loyalAllyProgress.current >= 5 // Изменено условие
                    ? 3
                    : 2
                ),
              ].map((_, i) => (
                <img key={i} src="Star icon.png" alt="" />
              ))}
            </div>
            {/* <p className={styles.task}>Отправить 5 донатов одному бойцу</p> */}
            <p className={styles.aboutText}>
              {
                achievements?.loyalAllyProgress.descriptions[
                  achievements?.loyalAllyProgress.current < 2
                    ? 0
                    : achievements?.loyalAllyProgress.current < 3
                    ? 1
                    : 2
                ]
              }
            </p>
          </div>
          <div className={styles.Achievements}>
            <div className={styles.aboutTextBlock}>
              <p className={styles.aboutText}>Большая ставка</p>
            </div>
            <img
              className={styles.achievementImg}
              src="-benefactor (1) 1.png"
              alt=""
            />
            {/* <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${
                    (achievements?.bigDonationProgress.current /
                      achievements?.bigDonationProgress.target) *
                    100
                  }%`,
                }}
              />
            </div> */}
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${
                    (achievements?.bigDonationProgress.current /
                      achievements?.bigDonationProgress.targets[
                        achievements?.bigDonationProgress.current
                      ]) *
                    100
                  }%`,
                }}
              />
            </div>
            {/* <div className={styles.stars}>
              <img src="Star icon.png" alt="" />
              <img src="Star icon.png" alt="" />
              <img src="Star icon.png" alt="" />
            </div> */}
            <div className={styles.stars}>
              {[
                ...Array(
                  achievements?.bigDonationProgress.current < 3
                    ? 1
                    : achievements?.bigDonationProgress.current < 5
                    ? 2
                    : achievements?.bigDonationProgress.current >= 5 // Изменено условие
                    ? 3
                    : 2
                ),
              ].map((_, i) => (
                <img key={i} src="Star icon.png" alt="" />
              ))}
            </div>
            {/* <p className={styles.task}>
              Отправить донат со ставкой 5000 и более
            </p> */}
            <p className={styles.task}>
              {
                achievements?.bigDonationProgress.descriptions[
                  achievements?.bigDonationProgress.current
                ]
              }
            </p>
          </div>
          <div className={styles.Achievements}>
            <div className={styles.aboutTextBlock}>
              <p className={styles.aboutText}>Голос справедливости</p>
            </div>
            <img
              className={styles.achievementImg}
              src="-voting-man 1.png"
              alt=""
            />
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${
                    (achievements?.voiceOfJusticeProgress.current /
                      achievements?.voiceOfJusticeProgress.targets[
                        achievements?.voiceOfJusticeProgress.current < 5
                          ? 0
                          : achievements?.voiceOfJusticeProgress.current < 10
                          ? 1
                          : 2
                      ]) *
                    100
                  }%`,
                }}
              />
            </div>
            {/* <div className={styles.stars}>
              <img src="Star icon.png" alt="" />
              <img src="Star icon.png" alt="" />
              <img src="Star icon.png" alt="" />
            </div> */}
            <div className={styles.stars}>
              {[
                ...Array(
                  achievements?.voiceOfJusticeProgress.current < 5
                    ? 1
                    : achievements?.voiceOfJusticeProgress.current < 10
                    ? 2
                    : achievements?.voiceOfJusticeProgress.current >= 15 // Изменено условие
                    ? 3
                    : 2
                ),
              ].map((_, i) => (
                <img key={i} src="Star icon.png" alt="" />
              ))}
            </div>
            <p className={styles.task}>
              {
                achievements?.voiceOfJusticeProgress.descriptions[
                  achievements?.voiceOfJusticeProgress.current < 5
                    ? 0
                    : achievements?.voiceOfJusticeProgress.current < 10
                    ? 1
                    : 2
                ]
              }
            </p>
          </div>
          <div className={styles.Achievements}>
            <div className={styles.aboutTextBlock}>
              <p className={styles.aboutText}>Справедливость восторжествует</p>
            </div>
            <img className={styles.achievementImg} src="fighter.png" alt="" />
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${
                    (achievements?.justiceWillPrevailProgress.current /
                      achievements?.justiceWillPrevailProgress.targets[
                        achievements?.justiceWillPrevailProgress.current < 1
                          ? 0
                          : achievements?.justiceWillPrevailProgress.current < 3
                          ? 1
                          : 2
                      ]) *
                    100
                  }%`,
                }}
              />
            </div>
            {/* <div className={styles.stars}>
              <img src="Star icon.png" alt="" />
              <img src="Star icon.png" alt="" />
              <img src="Star icon.png" alt="" />
            </div> */}
            <div className={styles.stars}>
              {[
                ...Array(
                  achievements?.justiceWillPrevailProgress.current < 1
                    ? 1
                    : achievements?.justiceWillPrevailProgress.current < 3
                    ? 2
                    : achievements?.justiceWillPrevailProgress.current >= 5 // Изменено условие
                    ? 3
                    : 2
                ),
              ].map((_, i) => (
                <img key={i} src="Star icon.png" alt="" />
              ))}
            </div>
            <p className={styles.task}>
              {
                achievements?.justiceWillPrevailProgress.descriptions[
                  achievements?.justiceWillPrevailProgress.current < 1
                    ? 0
                    : achievements?.justiceWillPrevailProgress.current < 3
                    ? 1
                    : 2
                ]
              }
            </p>
          </div>
          <div className={styles.Achievements}>
            <div className={styles.aboutTextBlock}>
              <p className={styles.aboutText}>Эпический фанат</p>
            </div>
            <img
              className={styles.achievementImg}
              src="boxer-beginner.png"
              alt=""
            />
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${
                    (achievements?.epicFan.current /
                      achievements?.epicFan.targets[
                        achievements?.epicFan.current < 2
                          ? 0
                          : achievements?.epicFan.current < 4
                          ? 1
                          : 2
                      ]) *
                    100
                  }%`,
                }}
              />
            </div>
            {/* <div className={styles.stars}>
              <img src="Star icon.png" alt="" />
              <img src="Star icon.png" alt="" />
              <img src="Star icon.png" alt="" />
            </div> */}
            <div className={styles.stars}>
              {[
                ...Array(
                  achievements?.epicFan.current < 2
                    ? 1
                    : achievements?.epicFan.current < 4
                    ? 2
                    : achievements?.epicFan.current >= 6 // Изменено условие
                    ? 3
                    : 2
                ),
              ].map((_, i) => (
                <img key={i} src="Star icon.png" alt="" />
              ))}
            </div>
            <p className={styles.task}>
              {
                achievements?.epicFan.descriptions[
                  achievements?.epicFan.current < 2
                    ? 0
                    : achievements?.epicFan.current < 4
                    ? 1
                    : 2
                ]
              }
            </p>
          </div>
          <div className={styles.Achievements}>
            <div className={styles.aboutTextBlock}>
              <p className={styles.aboutText}>Совет турнира</p>
            </div>
            <img
              className={styles.achievementImg}
              src="-boxing-referee (1) 1.png"
              alt=""
            />
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${
                    (achievements?.tournamentCouncil.current /
                      achievements?.tournamentCouncil.targets[
                        achievements?.tournamentCouncil.current < 1
                          ? 0
                          : achievements?.tournamentCouncil.current < 3
                          ? 1
                          : 2
                      ]) *
                    100
                  }%`,
                }}
              />
            </div>
            {/* <div className={styles.stars}>
              <img src="Star icon.png" alt="" />
              <img src="Star icon.png" alt="" />
              <img src="Star icon.png" alt="" />
            </div> */}
            <div className={styles.stars}>
              {[
                ...Array(
                  achievements?.tournamentCouncil.current < 1
                    ? 1
                    : achievements?.tournamentCouncil.current < 3
                    ? 2
                    : achievements?.tournamentCouncil.current >= 5 // Изменено условие
                    ? 3
                    : 2
                ),
              ].map((_, i) => (
                <img key={i} src="Star icon.png" alt="" />
              ))}
            </div>
            <p className={styles.task}>
              {
                achievements?.tournamentCouncil.descriptions[
                  achievements?.tournamentCouncil.current < 1
                    ? 0
                    : achievements?.tournamentCouncil.current < 3
                    ? 1
                    : 2
                ]
              }
            </p>
          </div>
          <div className={styles.Achievements}>
            <div className={styles.aboutTextBlock}>
              <p className={styles.aboutText}>Внимательный рефери</p>
            </div>
            <img
              className={styles.achievementImg}
              src="-boxing-referee 1.png"
              alt=""
            />
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${
                    (achievements?.refereeAchievement.current /
                      achievements?.refereeAchievement.targets[
                        achievements?.refereeAchievement.current < 5
                          ? 0
                          : achievements?.refereeAchievement.current < 10
                          ? 1
                          : 2
                      ]) *
                    100
                  }%`,
                }}
              />
            </div>
            {/* <div className={styles.stars}>
              <img src="Star icon.png" alt="" />
              <img src="Star icon.png" alt="" />
              <img src="Star icon.png" alt="" />
            </div> */}
            <div className={styles.stars}>
              {[
                ...Array(
                  achievements?.refereeAchievement.current < 5
                    ? 1
                    : achievements?.refereeAchievement.current < 10
                    ? 2
                    : achievements?.refereeAchievement.current >= 15 // Изменено условие
                    ? 3
                    : 2
                ),
              ].map((_, i) => (
                <img key={i} src="Star icon.png" alt="" />
              ))}
            </div>
            <p className={styles.task}>
              {
                achievements?.refereeAchievement.descriptions[
                  achievements?.refereeAchievement.current < 5
                    ? 0
                    : achievements?.refereeAchievement.current < 10
                    ? 1
                    : 2
                ]
              }
            </p>
          </div>
          <div className={styles.Achievements}>
            <div className={styles.aboutTextBlock}>
              <p className={styles.aboutText}>Выдающийся благотворитель</p>
            </div>
            <img
              className={styles.achievementImg}
              src="-benefactor.png"
              alt=""
            />
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${
                    (achievements?.outstandingBenefactor.current /
                      achievements?.outstandingBenefactor.targets[
                        achievements?.outstandingBenefactor.current < 17
                          ? 0
                          : achievements?.outstandingBenefactor.current < 34
                          ? 1
                          : 2
                      ]) *
                    100
                  }%`,
                }}
              />
            </div>
            {/* <div className={styles.stars}>
              <img src="Star icon.png" alt="" />
              <img src="Star icon.png" alt="" />
              <img src="Star icon.png" alt="" />
            </div> */}
            <div className={styles.stars}>
              {[
                ...Array(
                  achievements?.outstandingBenefactor.current < 17
                    ? 1
                    : achievements?.outstandingBenefactor.current < 34
                    ? 2
                    : achievements?.outstandingBenefactor.current >= 50 // Изменено условие
                    ? 3
                    : 2
                ),
              ].map((_, i) => (
                <img key={i} src="Star icon.png" alt="" />
              ))}
            </div>
            <p className={styles.task}>
              {
                achievements?.outstandingBenefactor.descriptions[
                  achievements?.outstandingBenefactor.current < 17
                    ? 0
                    : achievements?.outstandingBenefactor.current < 34
                    ? 1
                    : 2
                ]
              }
            </p>
          </div>
          <div className={styles.Achievements}>
            <div className={styles.aboutTextBlock}>
              <p className={styles.aboutText}>Единомышленники</p>
            </div>
            <img
              className={styles.achievementImg}
              src="2-fighter 1.png"
              alt=""
            />
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${
                    (achievements?.referralAchievement.current /
                      achievements?.referralAchievement.targets[
                        achievements?.referralAchievement.current < 3
                          ? 0
                          : achievements?.referralAchievement.current < 6
                          ? 1
                          : 2
                      ]) *
                    100
                  }%`,
                }}
              />
            </div>
            {/* <div className={styles.stars}>
              <img src="Star icon.png" alt="" />
              <img src="Star icon.png" alt="" />
              <img src="Star icon.png" alt="" />
            </div> */}
            <div className={styles.stars}>
              {[
                ...Array(
                  achievements?.referralAchievement.current < 3
                    ? 1
                    : achievements?.referralAchievement.current < 6
                    ? 2
                    : achievements?.refereeAchievement.current >= 10 // Изменено условие
                    ? 3
                    : 2
                ),
              ].map((_, i) => (
                <img key={i} src="Star icon.png" alt="" />
              ))}
            </div>
            <p className={styles.task}>
              {
                achievements?.referralAchievement.descriptions[
                  achievements?.referralAchievement.current < 3
                    ? 0
                    : achievements?.referralAchievement.current < 6
                    ? 1
                    : 2
                ]
              }
            </p>
          </div>
          <div className={styles.Achievements}>
            <div className={styles.aboutTextBlock}>
              <p className={styles.aboutText}>Менеджер легенд</p>
            </div>
            <img className={styles.achievementImg} src="image 12.png" alt="" />
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${
                    (achievements?.referralAchievementFigh.current /
                      achievements?.referralAchievementFigh.targets[
                        achievements?.referralAchievementFigh.current < 1
                          ? 0
                          : achievements?.referralAchievementFigh.current < 3
                          ? 1
                          : 2
                      ]) *
                    100
                  }%`,
                }}
              />
            </div>
            {/* <div className={styles.stars}>
              <img src="Star icon.png" alt="" />
              <img src="Star icon.png" alt="" />
              <img src="Star icon.png" alt="" />
            </div> */}
            <div className={styles.stars}>
              {[
                ...Array(
                  achievements?.referralAchievementFigh.current < 1
                    ? 1
                    : achievements?.referralAchievementFigh.current < 3
                    ? 2
                    : achievements?.referralAchievementFigh.current >= 5 // Изменено условие
                    ? 3
                    : 2
                ),
              ].map((_, i) => (
                <img key={i} src="Star icon.png" alt="" />
              ))}
            </div>
            <p className={styles.task}>
              {
                achievements?.referralAchievementFigh.descriptions[
                  achievements?.referralAchievementFigh.current < 1
                    ? 0
                    : achievements?.referralAchievementFigh.current < 3
                    ? 1
                    : 2
                ]
              }
            </p>
          </div>
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

export default Achievements;
