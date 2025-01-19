import React, { useState } from "react";
import styles from "./ChooseRole.module.css";
import { useNavigate, useLocation } from "react-router-dom";

function ChooseRole() {
  const location = useLocation();
  const emailFromRegister = location.state?.email;
  const passwordFromRegister = location.state?.password; // Добавьте эту строку
  const referralCode = location.state?.referralCode;
  console.log(referralCode);

  const [email, setEmail] = useState(emailFromRegister || "");
  // console.log("Password in ChooseRole:", passwordFromRegister);
  console.log(setEmail);
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/register");
  };
  const handleClickFight = () => {
    navigate("/rolefighter", {
      state: {
        email: email,
        password: passwordFromRegister,
        referralCode: referralCode, // Добавьте передачу пароля
      },
    });
  };
  const handleClickFan = () => {
    navigate("/rolefan", {
      state: {
        email: email,
        password: passwordFromRegister,
        referralCode: referralCode, // Добавьте передачу пароля
      },
    });
  };

  return (
    <div>
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
        <h2 className={styles.authorization}>Выберите роль</h2>
        <button onClick={handleClickFan}>Я - фанат</button>
        <button onClick={handleClickFight}>Я - спортсмен</button>
      </div>
    </div>
  );
}

export default ChooseRole;
