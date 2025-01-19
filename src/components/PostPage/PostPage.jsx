import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import styles from "./PostPage.module.css";

const PostPage = () => {
  const { id } = useParams();
  //   const navigate = useNavigate();
  const location = useLocation();
  const { post, fighterData } = location.state || {};
  const [commentReplies, setCommentReplies] = useState({});
  // const profilePhotoUrl = localStorage.getItem("profilePhotoUrl");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [selectedComment, setSelectedComment] = useState(null);
  const [commentLikes, setCommentLikes] = useState({});
  const [postLikes, setPostLikes] = useState(post.totalLikes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [likedComments, setLikedComments] = useState({});
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");

  const handleBackClick = () => {
    navigate(-1); // Возврат на предыдущую страницу
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCommentLikeStatuses = async () => {
      const statuses = {};
      for (const comment of comments) {
        try {
          // const response = await fetch(
          //   `/api/comments/${
          //     comment.id
          //   }/likes/${localStorage.getItem("userId")}`
          // );
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
      setLikedComments(statuses);
    };

    if (comments.length > 0) {
      fetchCommentLikeStatuses();
    }
  }, [comments, userType]);
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await fetch(
          `/api/posts/${post.id}/likes/${localStorage.getItem(
            "userId"
          )}?userType=${userType}`
        );
        if (response.ok) {
          const data = await response.json();
          setIsLiked(data.isLiked);
        }
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    fetchLikeStatus();
  }, [post.id, userType]);
  const handleCommentClick = (comment) => {
    setSelectedComment(comment);
    setNewComment(``);
  };
  const sendNotification = async (commentId, recipientId, messageContent) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment_id: commentId,
          sender_id: localStorage.getItem("userId"),
          recipient_id: recipientId,
          type: "comment_reply",
          message_content: messageContent,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send notification");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          userType: userType,
        }),
      });

      if (response.ok) {
        // Обновляем список комментариев после удаления
        fetchComments(post.id);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };
  const fetchComments = async (postId) => {
    try {
      const response = await fetch(`/api/comments/${id}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data); // Просто устанавливаем массив данных
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
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
  const fetchTotalLikes = async (postId, userType) => {
    try {
      const response = await fetch(
        `/api/posts/${postId}/likes${userType ? `?userType=${userType}` : ""}`
      );
      if (response.ok) {
        const data = await response.json();
        setPostLikes(data.totalLikes);
      }
    } catch (error) {
      console.error("Error fetching total likes:", error);
    }
  };

  // Лайк поста
  const handlePostLike = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
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
        setIsLiked(!isLiked);
        fetchTotalLikes(post.id);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // Получение лайков комментария
  const fetchCommentLikes = async (commentId) => {
    try {
      const response = await fetch(`/api/comments/${commentId}/likes`);
      if (response.ok) {
        const data = await response.json();
        setCommentLikes((prev) => ({ ...prev, [commentId]: data.totalLikes }));
      }
    } catch (error) {
      console.error("Error fetching comment likes:", error);
    }
  };

  // Лайк комментария

  const handleCommentLike = async (commentId) => {
    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          userType: userType,
        }),
      });

      if (response.ok) {
        setLikedComments((prev) => ({
          ...prev,
          [commentId]: !prev[commentId],
        }));
        fetchCommentLikes(commentId);
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments/${post.id}`);
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [post.id]);
  useEffect(() => {
    comments.forEach((comment) => {
      console.log(comment);
      fetchCommentLikes(comment.id);

      fetchRepliesCount(comment.id).then((repliesCount) => {
        setCommentReplies((prev) => ({
          ...prev,
          [comment.id]: repliesCount,
        }));
      });
    });
  }, [post.id, comments]);
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const commentContent = selectedComment
      ? `${selectedComment.user_name}, ${newComment}`
      : newComment;

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: post.id,
          user_id: localStorage.getItem("userId"),
          content: commentContent,
          reply_to: selectedComment ? selectedComment.id : null,
          userType: userType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      // Отправляем уведомление если это ответ на комментарий
      if (selectedComment) {
        await sendNotification(
          selectedComment.id,
          selectedComment.user_id,
          commentContent
        );
      }

      fetchComments(post.id);
      setNewComment("");
      setSelectedComment(null);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  //   if (!post) return <div>Loading...</div>;
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    if (selectedComment) {
      const prefix = `${selectedComment.user_name}, `;
      if (inputValue.startsWith(prefix)) {
        setNewComment(inputValue.slice(prefix.length));
      } else {
        setNewComment(inputValue);
      }
    } else {
      setNewComment(inputValue);
    }
  };
  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div className={styles.backArrow}>
            <img src="/arrow.png" alt="#" onClick={handleBackClick} />
            <h1>BroDonate</h1>
          </div>
          <div className={styles.iconsContainer}>
            <img
              src="/Notification.png"
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

        <div className={styles.cardHeaders}>
          <div className={styles.cardHeader}>
            <img
              src={
                fighterData.photo_url
                  ? `${fighterData.photo_url}`
                  : "/Avatar.png"
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
            src="/pepicons-pop_dots-y_20.png"
            alt=""
            className={styles.optionsIcon}
          />
        </div>
        <p className={styles.message}>{post.content}</p>
        <div className={styles.cardFooter}>
          <img
            src={isLiked ? "/Active=Yes.png" : "/hand-thumbs-up_20.png"}
            alt=""
            className={styles.likeIcon}
            onClick={handlePostLike}
          />
          {postLikes > 0 && <p className={styles.likeCount}>{postLikes}</p>}
        </div>
        <div className={styles.commentsSection}>
          {/* <h3 className={styles.commentsHeader}>Комментарии</h3> */}

          {comments.map((comment) => (
            <div
              key={comment.id}
              className={styles.comment}
              onClick={() => handleCommentClick(comment)}
            >
              <div className={styles.cardHeaders}>
                <div className={styles.cardHeader}>
                  <img
                    src={
                      comment.photo_url ? `${comment.photo_url}` : "/Avatar.png"
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
                {comment.user_id ===
                  parseInt(localStorage.getItem("userId")) && (
                  <img
                    src="/delete-icon.png" // Текущий путь относительный
                    alt="delete"
                    className={styles.deleteIcon}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteComment(comment.id);
                    }}
                  />
                )}
              </div>
              <p className={styles.commentContent}>
                {comment.reply_to && (
                  <>
                    {comment.content.split(" ").map((word, index) =>
                      index === 0 ? (
                        <span key={index} className={styles.replyingTo}>
                          {word}{" "}
                        </span>
                      ) : (
                        word + " "
                      )
                    )}
                  </>
                )}
                {!comment.reply_to && comment.content}
              </p>
              <div className={styles.cardFooter}>
                <img
                  src={
                    likedComments[comment.id]
                      ? "/Active=Yes.png"
                      : "/hand-thumbs-up_20.png"
                  }
                  alt=""
                  className={styles.likeIcon}
                  onClick={() => handleCommentLike(comment.id)}
                />
                {commentLikes[comment.id] > 0 && (
                  <p className={styles.likeCount}>{commentLikes[comment.id]}</p>
                )}
                {/* <img
                  src="/comment-icon.png"
                  alt=""
                  className={styles.commentIcon}
                /> */}
                <img
                  src="/proicons_comment_20.png"
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
          ))}

          <div className={styles.passwordInputContainer}>
            <input
              type="text"
              onChange={handleInputChange}
              value={
                selectedComment
                  ? `${selectedComment.user_name}, ${newComment}`
                  : newComment
              }
              placeholder={
                selectedComment
                  ? `Ответить ${selectedComment.user_name}: `
                  : "Написать комментарий..."
              }
              className={styles.passwordinput}
            />
            <img
              src="/iconoir_send.png"
              alt="#"
              className={styles.eyeoff}
              onClick={handleAddComment}
              style={{ cursor: "pointer", pointerEvents: "auto" }}
            />
          </div>
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
            src="/ui-checks-grid.png"
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
            src="/lightning-charge.png"
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
          <img src="/gift.png" alt="" className={styles.catalogImage} />
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
          <img src="/person.png" alt="" className={styles.catalogImage} />
          <p className={styles.catalogText}>Профиль</p>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
