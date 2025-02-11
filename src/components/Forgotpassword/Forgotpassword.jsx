import React from "react";
import styles from "./Forgotpassword.module.css";
import { useNavigate } from "react-router-dom";

function Forgotpassword() {
  const handleBackClick = () => {
    navigate("/");
  };
  const navigate = useNavigate();

  return (
    <div className={styles.Forgotpassword}>
      <div className={styles.titleblock}>
        <img
          className={styles.arrow}
          src="./arrow.png
        "
          alt="#"
          onClick={handleBackClick}
        ></img>
        <h1 className={styles.title}>BroDonate</h1>
      </div>
      <div className={styles.authForm}>
        {" "}
        <h2 className={styles.authorization}>Восстановление пароля</h2>
        <input
          type="email"
          placeholder="Введите Email"
          name=""
          id=""
          className={styles.email}
        />
        <button>Оправить письмо</button>
      </div>
    </div>
  );
}

export default Forgotpassword;
