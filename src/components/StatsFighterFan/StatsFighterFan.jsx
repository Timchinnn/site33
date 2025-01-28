import React, { useEffect, useState } from "react";
import styles from "./StatsFighterFan.module.css";
import { useNavigate, useLocation } from "react-router-dom";
function StatsFighterFan() {
  const location = useLocation();

  const { fighterData } = location.state || {};

  const [selectedCategories, setSelectedCategories] = useState("");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [commentLikes, setCommentLikes] = useState({});
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});

  console.log(fighterData);
  const rotation = (fighterData.rating / 100) * 180 - 90;
  const [commentReplies, setCommentReplies] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [likedComments, setLikedComments] = useState({});
  const [showDonateInput, setShowDonateInput] = useState(false);
  const [isToggleOn, setIsToggleOn] = useState(false);
  const [isThankYouMessage, setIsThankYouMessage] = useState(false);
  const [isThankYouMessageRating, setIsThankYouMessageRating] = useState(false);
  const [donateAmount, setDonateAmount] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [activeTab, setActiveTab] = useState(null); // начальное значение зависит от текущей страницы

  const handleDonateSelect = (amount) => {
    setSelectedAmount(amount);
    setDonateAmount(amount);
  };
  // eslint-disable-next-line
  const [donationProgress, setDonationProgress] = useState({
    current: fighterData.donat_now, // Current donation amount
    target: fighterData.donat, // Target donation amount
  });
  // const [paymentType, setPaymentType] = useState(null); // 'balance' или 'card'
  // const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const handlePaymentSelect = (type) => {
    setSelectedPayment(type);
  };
  const handleRatingEnd = async () => {
    try {
      const response = await fetch("/api/fighter-vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          fighterId: fighterData.id,
          voteType: selectedCategories, // "best-fight" или "best-fighter"
          userType: localStorage.getItem("userType"),
        }),
      });

      if (response.ok) {
        setIsThankYouMessageRating(true);
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  };
  const handleDonateNext = () => {
    setShowDonateInput(true);
  };
  // In StatsFighterFan.jsx
  const handleDonateEnd = async () => {
    if (!selectedPayment) {
      alert("Пожалуйста, выберите способ оплаты");
      return;
    }

    // Add balance deduction logic for current balance
    if (selectedPayment === "balance") {
      try {
        const response = await fetch(`/api/balance/deduct`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: localStorage.getItem("userId"),
            amount: donateAmount,
            userType: localStorage.getItem("userType"),
            fighterId: fighterData.id,
          }),
        });
        if (!response.ok) {
          alert("Недостаточно средств на балансе");
          return;
        }
      } catch (error) {
        console.error("Error deducting balance:", error);
        return;
      }
    }

    // Добавляем логику создания подписки
    if (isToggleOn && selectedDate) {
      try {
        const response = await fetch("/api/subscriptions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: localStorage.getItem("userId"),
            fighterId: fighterData.id,
            duration: selectedDate,
            amount: donateAmount,
          }),
        });

        if (!response.ok) {
          throw new Error("Ошибка при создании подписки");
        }
      } catch (error) {
        console.error("Ошибка:", error);
      }
    }

    setIsThankYouMessage(true);
  };
  const checkVoteStatus = async () => {
    try {
      const response = await fetch(`/api/check-fighter-vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          fighterId: fighterData.id,
          userType: localStorage.getItem("userType"),
        }),
      });

      const data = await response.json();
      return data.hasVoted;
    } catch (error) {
      console.error("Error checking vote status:", error);
      return false;
    }
  };
  const handleRatingClick = async () => {
    const hasVoted = await checkVoteStatus();
    if (hasVoted) {
      alert("Вы уже голосовали за этого бойца");
      return;
    }
    setShowRatingModal(true);
  };
  const handleCategoryClick = (category) => {
    if (selectedCategories === category) {
      setSelectedCategories("");
    } else {
      setSelectedCategories(category);
    }
  };
  const handleDonateClick = () => {
    setShowDonateModal(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchUserBalance = async () => {
      try {
        const userType = localStorage.getItem("userType"); // Получаем тип пользователя
        const userId = localStorage.getItem("userId");

        const response = await fetch(
          `/api/balance/${userId}?userType=${userType}`
        );

        if (response.ok) {
          const data = await response.json();
          setUserBalance(data.balance);
        }
      } catch (error) {
        console.error("Error fetching user balance:", error);
      }
    };
    fetchUserBalance();
  }, []);
  useEffect(() => {
    const fetchCommentLikeStatuses = async () => {
      const statuses = {};
      for (const postId in comments) {
        for (const comment of comments[postId]) {
          try {
            const response = await fetch(
              `/api/comments/${comment.id}/likes/${localStorage.getItem(
                "userId"
              )}?userType=${userType}`
            );
            if (response.ok) {
              const data = await response.json();
              statuses[comment.id] = data.isLiked;
            }
          } catch (error) {
            console.error("Error fetching comment like status:", error);
          }
        }
      }
      setLikedComments(statuses);
    };

    if (Object.keys(comments).length > 0) {
      fetchCommentLikeStatuses();
    }
  }, [comments, userType]);

  const handleCommentLike = async (commentId) => {
    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          userType: userType, // Добавляем userType
        }),
      });

      if (response.ok) {
        setLikedComments((prev) => ({
          ...prev,
          [commentId]: !prev[commentId],
        }));

        // Добавляем обновление количества лайков
        const newLikeCount = await fetchCommentLikes(commentId);
        setCommentLikes((prev) => ({
          ...prev,
          [commentId]: newLikeCount,
        }));
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };
  async function fetchRepliesCount(commentId) {
    try {
      const response = await fetch(`/api/comments/${commentId}/repliesCount`);
      if (!response.ok) {
        throw new Error("Ошибка при получении количества ответов");
      }
      const data = await response.json();
      return data.repliesCount;
    } catch (error) {
      console.error("Ошибка:", error);
      return 0;
    }
  }
  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Добавить токен авторизации
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          userType: userType,
        }),
      });

      if (response.status === 403) {
        alert("У вас нет прав для удаления этого поста");
        return;
      }

      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== postId));
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      console.log(fighterData);
      try {
        const response = await fetch(`/api/posts/${fighterData.id}`);
        if (response.ok) {
          const data = await response.json();
          const postsWithDetails = await Promise.all(
            data.map(async (post) => {
              const [totalLikes, comments, likeStatus] = await Promise.all([
                fetchTotalLikes(post.id),
                fetchComments(post.id),
                fetchLikeStatus(post.id),
              ]);
              return { ...post, totalLikes, comments, likeStatus };
            })
          );
          console.log(postsWithDetails);
          setPosts(postsWithDetails);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, [fighterData]);
  useEffect(() => {
    const loadCommentLikesAndReplies = async () => {
      for (const postId in comments) {
        const commentLikesPromises = comments[postId].map((comment) =>
          fetchCommentLikes(comment.id)
        );
        const likes = await Promise.all(commentLikesPromises);

        const repliesPromises = comments[postId].map((comment) =>
          fetchRepliesCount(comment.id)
        );
        const repliesCounts = await Promise.all(repliesPromises);

        const newCommentLikes = {};
        const newCommentReplies = {};

        comments[postId].forEach((comment, index) => {
          newCommentLikes[comment.id] = likes[index];
          newCommentReplies[comment.id] = repliesCounts[index];
        });

        setCommentLikes((prev) => ({ ...prev, ...newCommentLikes }));
        setCommentReplies((prev) => ({ ...prev, ...newCommentReplies }));
      }
    };

    if (Object.keys(comments).length > 0) {
      loadCommentLikesAndReplies();
    }
  }, [comments]);
  const fetchTotalLikes = async (postId) => {
    try {
      const response = await fetch(`/api/posts/${postId}/likes`);
      if (response.ok) {
        const data = await response.json();
        // console.log(data);

        return data.totalLikes;
      }
    } catch (error) {
      console.error("Error fetching total likes:", error);
      return 0;
    }
  };
  useEffect(() => {
    const fetchLikeStatus = async (postId) => {
      try {
        const response = await fetch(
          `/api/posts/${postId}/likes/${localStorage.getItem(
            "userId"
          )}?userType=${localStorage.getItem("userType")}`
        );

        if (response.ok) {
          const data = await response.json();
          setLikedPosts((prev) => ({
            ...prev,
            [postId]: data.isLiked,
          }));
        }
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    posts.forEach((post) => fetchLikeStatus(post.id));
  }, [posts]);

  const fetchLikeStatus = async (postId) => {
    try {
      const response = await fetch(
        `/api/posts/${postId}/likes/${localStorage.getItem("userId")}`
      );
      if (response.ok) {
        const data = await response.json();
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, isLiked: data.isLiked } : post
          )
        );
      }
    } catch (error) {
      console.error("Error fetching like status:", error);
    }
  };
  const handlePostClick = (post) => {
    navigate(`/post/${post.id}`, {
      state: {
        post: post,
        fighterData: fighterData,
        comments: comments[post.id],
      },
    });
  };
  const fetchComments = async (postId) => {
    try {
      const response = await fetch(`/api/comments/${postId}`);
      if (response.ok) {
        const data = await response.json();
        // console.log(data);
        setComments((prev) => ({
          ...prev,
          [postId]: data,
        }));
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  const fetchCommentLikes = async (commentId) => {
    try {
      const response = await fetch(`/api/comments/${commentId}/likes`);
      if (response.ok) {
        const data = await response.json();
        return data.totalLikes;
      }
      return 0;
    } catch (error) {
      console.error("Error fetching comment likes:", error);
      return 0;
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          userType: localStorage.getItem("userType"), // Добавляем userType
        }),
      });

      if (response.ok) {
        setLikedPosts((prev) => ({
          ...prev,
          [postId]: !prev[postId],
        }));
        const totalLikes = await fetchTotalLikes(postId);
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, totalLikes } : post
          )
        );
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
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
        <p className={styles.competitions}>Турниры·Профиль спортсмена</p>
        <div className={styles.contentAbout}>
          <div className={styles.contentAboutImg}>
            <img
              src={
                fighterData.photo_url
                  ? `${fighterData.photo_url}`
                  : "Avatar.png"
              }
              alt="User Avatar"
              className={styles.profileImage}
            />
          </div>
          <div className={styles.nameFlag}>
            <h1>
              {fighterData.name} {fighterData.surname}
            </h1>
            <img src="flag.png" alt="#" />
          </div>
          <h2>{fighterData.nick}</h2>
          <p className={styles.greyText}>
            {fighterData.region}, {fighterData.country}
          </p>
          <div className={styles.count}>
            <p className={styles.greyText}> {fighterData.discipline} </p>
            <p className={styles.greyText}> {fighterData.record} </p>
          </div>
          {/* jsx // Добавьте это в JSX-код, где отображается полоска прогресса */}
          {fighterData.donat_now != null && fighterData.donat != null && (
            <div className={styles.donationProgressContainer}>
              <p>{fighterData.dream}</p>
              <div className={styles.donationProgressBar}>
                <div
                  className={styles.donationProgressFill}
                  style={{
                    width: `${
                      (donationProgress.current / donationProgress.target) * 100
                    }%`,
                  }}
                >
                  <span className={styles.donationProgressPercentage}>
                    {Math.round(
                      (donationProgress.current / donationProgress.target) * 100
                    )}
                    %
                  </span>
                </div>
              </div>
              <div className={styles.donationProgressText}>
                <span
                  onClick={console.log(
                    donationProgress.current.toLocaleString()
                  )}
                >
                  {donationProgress.current.toLocaleString()} ₽
                </span>
                <span>{donationProgress.target.toLocaleString()} ₽</span>
              </div>
            </div>
          )}
          {fighterData.msg && (
            <button className={styles.inputButton}>{fighterData.msg}</button>
          )}

          <button className={styles.votingDonat} onClick={handleDonateClick}>
            Поддержать донатом
          </button>
          <div className={styles.donations}>
            <div>
              <p>Донаты</p>
              <p>562 000 ₽</p>
            </div>
            <div>
              <p>Благотворительность</p>
              <p>110 500 ₽</p>
            </div>
          </div>
          <div className={styles.gaugeContainer}>
            <img
              src="half-circle.png"
              alt="Полукруг"
              className={styles.halfCircle}
            />
            <img
              src="arrowqw.png"
              alt="Стрелка"
              className={styles.arrow}
              style={{ transform: `rotate(${rotation}deg)` }}
            />
            <div className={styles.percentage}></div>
          </div>
          <p className={styles.heroFans}>Герой фанатов</p>
          <div className={styles.approvalRating}>
            <img src="lucide_info_20.png" alt="#" />
            <p>Рейтинг одобрения</p>
            <p>{fighterData.rating} %</p>
          </div>
        </div>
        <div className={styles.votings}>
          <button className={styles.votingReit} onClick={handleRatingClick}>
            Голосовать
          </button>
        </div>

        {/* <div className={styles.votings}>
          <div className={styles.votingReit} onClick={handleRatingClick}>
            <p>Повлиять на рейтинг</p>
          </div>
          <div className={styles.votingDonat} onClick={handleDonateClick}>
            <p>Братская поддержка</p>
          </div>
        </div> */}
        <h3>Статистика</h3>
        <div className={styles.statistics}>
          <div className={styles.statistic}>
            <p>Место в рейтинге</p>
            <p>#714</p>
          </div>
          <div className={styles.statistic}>
            <p>Получено голосов</p>
            <p>72 465</p>
          </div>
        </div>
        <div className={styles.community}>
          <h3>Сообщество</h3>
          <h3>Донаты</h3>
        </div>
        <div className={styles.buttonsPopular}>
          <button className={styles.buttonAll}>Все</button>
          <button className={styles.buttonPopular}>
            <img src="mdi_fire_20.png" alt="#" />
            Популярно
          </button>
        </div>

        {posts.map((post) => (
          <React.Fragment key={post.id}>
            {/* Пост */}
            <div className={styles.cardFighter}>
              <div
                className={styles.cardHeaders}
                onClick={() => handlePostClick(post)}
              >
                <div className={styles.cardHeader}>
                  <img
                    src={
                      fighterData.photo_url
                        ? `${fighterData.photo_url}`
                        : "Avatar.png"
                    }
                    alt="User Avatar"
                    className={styles.profileImage}
                  />
                  <div className={styles.userInfo}>
                    <p className={styles.userName}>{fighterData.name}</p>
                    <p className={styles.timestamp}>
                      {new Date(post.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <img
                  src="pepicons-pop_dots-y_20.png"
                  alt="Delete"
                  onClick={() => handleDeletePost(post.id)}
                  style={{ cursor: "pointer" }}
                  className={styles.optionsIcon}
                />
              </div>
              <p className={styles.message}>{post.content}</p>
              <div className={styles.cardFooter}>
                <img
                  src={
                    likedPosts[post.id]
                      ? "Active=Yes.png"
                      : "hand-thumbs-up_20.png"
                  }
                  alt=""
                  className={styles.likeIcon}
                  onClick={() => handleLike(post.id)}
                  style={{ cursor: "pointer" }}
                />
                {post.totalLikes > 0 && (
                  <p className={styles.likeCount}>{post.totalLikes}</p>
                )}
                <img
                  src="proicons_comment_20.png"
                  alt=""
                  className={styles.commentIcon}
                />
                {comments[post.id]?.length > 0 && (
                  <p className={styles.likeCount}>{comments[post.id].length}</p>
                )}
              </div>
            </div>

            {/* Комментарии */}
            {comments[post.id]?.slice(0, 2).map((comment) => (
              <div key={comment.id} className={styles.commentCard}>
                <div className={styles.cardHeaders}>
                  <div className={styles.cardHeader}>
                    <img
                      src={
                        comment.photo_url
                          ? `${comment.photo_url}`
                          : "Avatar.png"
                      }
                      alt="User Avatar"
                      className={styles.profileImage}
                    />
                    <div className={styles.userInfo}>
                      <p className={styles.userName}>{comment.user_name}</p>
                      <p className={styles.timestamp}>
                        {new Date(comment.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <p className={styles.message}>{comment.content}</p>
                <div className={styles.cardFooter}>
                  <img
                    src={
                      likedComments[comment.id]
                        ? "Active=Yes.png"
                        : "hand-thumbs-up_20.png"
                    }
                    alt=""
                    className={styles.likeIcon}
                    onClick={() => handleCommentLike(comment.id)}
                  />
                  {commentLikes[comment.id] > 0 && (
                    <p className={styles.likeCount}>
                      {commentLikes[comment.id]}
                    </p>
                  )}
                  <div className={styles.cardFooter}>
                    <img
                      src="proicons_comment_20.png"
                      alt=""
                      className={styles.commentIcon}
                    />
                    {commentReplies[comment.id] > 0 && (
                      <p className={styles.likeCount}>
                        {commentReplies[comment.id]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
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
            Каталог
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
            {isThankYouMessageRating ? (
              <div>
                {" "}
                <p>Спасибо!</p>
                <p>Голос успешно отправлен!</p>
                <button
                  onClick={() => {
                    setIsThankYouMessageRating(false);
                    setShowRatingModal(false);
                  }}
                >
                  Назад в профиль
                </button>
              </div>
            ) : (
              <div className={styles.topModalHead}>
                <div className={styles.namesBut}>
                  <h2>Рейтинг</h2>
                  <img
                    src="x-circle.png"
                    alt="#"
                    onClick={() => setShowRatingModal(false)}
                  />
                </div>
                <div className={styles.choose}>
                  {[
                    { id: "not-best-fight", label: "Понизить рейтинг бойцу" },
                    { id: "best-fighter", label: "Повысить рейтинг бойцу" },
                  ].map((category) => (
                    <div
                      key={category.id}
                      className={`${styles.choosesTp} ${
                        selectedCategories === category.id
                          ? styles.categorySelected
                          : ""
                      }`}
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      <p>{category.label}</p>
                    </div>
                  ))}
                </div>
                {selectedCategories && (
                  <div className={`${styles.selectionBlock} ${styles.visible}`}>
                    <div className={styles.selectionContent}>
                      <button onClick={handleRatingEnd}>Голосовать</button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* Содержимое модального окна рейтинга */}
          </div>
        </div>
      )}
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
                      <input
                        type="text"
                        placeholder="Введите сообщение"
                        className={styles.donateInput}
                      />
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
                      <div className={styles.autoSupport}>
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
                                selectedDate === 7 ? styles.selected : ""
                              }`}
                              onClick={() => setSelectedDate(7)}
                            >
                              неделя
                            </button>
                            <button
                              className={`${styles.donateButton} ${
                                selectedDate === 14 ? styles.selected : ""
                              }`}
                              onClick={() => setSelectedDate(14)}
                            >
                              2 недели
                            </button>
                            <button
                              className={`${styles.donateButton} ${
                                selectedDate === 28 ? styles.selected : ""
                              }`}
                              onClick={() => setSelectedDate(28)}
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
                      )}
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

export default StatsFighterFan;
