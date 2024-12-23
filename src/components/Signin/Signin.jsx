import styles from "./Signin.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signin() {
  const navigate = useNavigate();
  // useEffect(() => {
  //   const userId = localStorage.getItem("userId");
  //   const userType = localStorage.getItem("userType");

  //   if (userId && userType) {
  //     navigate("/main");
  //   }
  // }, [navigate]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [eyeIcon, setEyeIcon] = useState("./eyeoff.png");

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setEyeIcon(showPassword ? "./eyeoff.png" : "./eye.png");
  };
  const handleForgotPassword = () => {
    navigate("/forgotpassword");
  };
  const handleRegister = () => {
    navigate("/register");
  };
  const handleLogin = async () => {
    try {
      const response = await fetch("http://91.186.198.179:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Сохраняем ID пользователя и тип таблицы
        localStorage.setItem("userId", data.id);
        localStorage.setItem("userType", data.userType);
        // localStorage.setItem("userTable", data.table);

        // Перенаправляем на главную страницу
        navigate("/main");
      } else {
        alert("Неверный email или пароль");
      }
    } catch (error) {
      console.error("Ошибка при авторизации:", error);
      alert("Произошла ошибка при попытке входа");
    }
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
        <h2 className={styles.authorization}>Авторизация</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Введите Email"
          className={styles.email}
        />
        <div className={styles.passwordInputContainer}>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
        <button onClick={handleLogin}>Войти</button>{" "}
        <p onClick={handleForgotPassword} style={{ cursor: "pointer" }}>
          Забыли пароль?
        </p>
      </div>
      <div className={styles.registrationPrompt}>
        <p>Нет аккаунта?</p>
        <button onClick={handleRegister}>Зарегистрироваться</button>
      </div>
    </div>
  );
}

export default Signin;
