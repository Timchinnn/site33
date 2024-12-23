import styles from "./Register.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [eyeIcon1, setEyeIcon1] = useState("./eyeoff.png");
  const [eyeIcon2, setEyeIcon2] = useState("./eyeoff.png");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [consentImage, setConsentImage] = useState("./consent.png");
  const [showReferralInput, setShowReferralInput] = useState(false);
  const [buttonStyle, setButtonStyle] = useState({
    backgroundColor: "rgba(232, 231, 237, 1)",
    color: "rgba(149, 149, 155, 1)",
  });

  const togglePasswordVisibility1 = () => {
    setShowPassword1(!showPassword1);
    setEyeIcon1(showPassword1 ? "./eyeoff.png" : "./eye.png");
  };

  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
    setEyeIcon2(showPassword2 ? "./eyeoff.png" : "./eye.png");
  };

  const toggleConsentImage = () => {
    setConsentImage(
      consentImage === "./consent.png" ? "./consenton.png" : "./consent.png"
    );
    setButtonStyle({
      backgroundColor:
        consentImage === "./consenton.png" ? "rgba(232, 231, 237, 1)" : "black",
      color:
        consentImage === "./consenton.png" ? "rgba(149, 149, 155, 1)" : "white",
    });
  };

  const handleRegisterClick = () => {
    if (buttonStyle.backgroundColor !== "rgba(232, 231, 237, 1)") {
      if (password !== confirmPassword) {
        alert("Пароли не совпадают. Пожалуйста, попробуйте снова.");
        return; // Прекращаем выполнение функции, если пароли не совпадают
      }

      navigate("/chooserole", {
        state: {
          email: email,
          password: password,
        },
      });
    }
  };

  const handleReferralClick = () => {
    setShowReferralInput(!showReferralInput);
  };

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <div>
      <div className={styles.titleblock}>
        <img
          className={styles.arrow}
          src="./arrow.png"
          alt="#"
          onClick={handleBackClick}
        />
        <h1 className={styles.title}>SportDonation</h1>
      </div>
      <div className={styles.authForm}>
        <h2 className={styles.authorization}>Регистрация</h2>
        <input
          type="email"
          placeholder="Введите Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.email}
        />
        <div className={styles.passwordInputContainer}>
          <input
            type={showPassword1 ? "text" : "password"}
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.passwordinput}
          />
          <img
            src={eyeIcon1}
            alt="#"
            className={styles.eyeoff}
            onClick={togglePasswordVisibility1}
            style={{ cursor: "pointer", pointerEvents: "auto" }}
          />
        </div>
        <div className={styles.passwordInputContainer}>
          <input
            type={showPassword2 ? "text" : "password"}
            placeholder="Повторите пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.passwordinput}
          />
          <img
            src={eyeIcon2}
            alt="#"
            className={styles.eyeoff}
            onClick={togglePasswordVisibility2}
            style={{ cursor: "pointer", pointerEvents: "auto" }}
          />
        </div>
        <div className={styles.consentBlock}>
          <img
            src={consentImage}
            alt="#"
            onClick={toggleConsentImage}
            style={{ cursor: "pointer" }}
          />
          <p>
            Я подтверждаю, что ознакомлен(-а) и согласен(-на) с{" "}
            <span className={styles.privacyPolicy}>
              Политикой конфиденциальности
            </span>
            , а также даю согласие на обработку моих персональных данных
          </p>
        </div>
        <button
          className={styles.nextReg}
          style={buttonStyle}
          onClick={handleRegisterClick}
        >
          Продолжить
        </button>
        <p
          className={styles.referralLink}
          onClick={handleReferralClick}
          style={{ cursor: "pointer" }}
        >
          У меня есть реферальная ссылка
        </p>
        {showReferralInput && (
          <input
            type="text"
            placeholder="Введите реферальную ссылку"
            className={styles.email}
          />
        )}
      </div>
    </div>
  );
}

export default Register;
