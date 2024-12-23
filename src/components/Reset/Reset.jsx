import React from "react";
import styles from "./Reset.module.css";
import { useState } from "react";

function Reset() {
  const [showPassword, setShowPassword] = useState(false);
  const [eyeIcon, setEyeIcon] = useState("./eyeoff.png");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setEyeIcon(showPassword ? "./eyeoff.png" : "./eye.png");
  };
  return (
    <div>
      <div className={styles.titleblock}>
        <img
          className={styles.arrow}
          src="./arrow.png
        "
          alt="#"
        ></img>
        <h1 className={styles.title}>SportDonation</h1>
      </div>
      <div className={styles.authForm}>
        {" "}
        <h2 className={styles.authorization}>Восстановление пароля</h2>
        <div className={styles.passwordInputContainer}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Введите пароль"
            className={styles.passwordinput}
          />
          <img
            src={eyeIcon}
            alt="#"
            className={styles.eyeoff}
            onClick={togglePasswordVisibility}
            style={{ cursor: "pointer", pointerEvents: "auto" }}
          />
        </div>
        <button>Сохранить и войти</button>
      </div>
    </div>
  );
}

export default Reset;
