import React, { useState } from "react";
import styles from "./RoleFighter.module.css";
import { useNavigate, useLocation } from "react-router-dom";
function RoleFighter() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const emailFromRegister = location.state?.email;
  const passwordFromRegister = location.state?.password;
  const [email, setEmail] = useState(emailFromRegister || "");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [record, setRecord] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState("");
  const referralCode = location.state?.referralCode;

  const countries = {
    Россия: [
      "Центральный ФО",
      "Северо-Западный ФО",
      "Южный ФО",
      "Северо-Кавказский ФО",
      "Приволжский ФО",
      "Уральский ФО",
      "Сибирский ФО",
      "Дальневосточный ФО",
    ],
    Казахстан: [
      "Акмолинская область",
      "Актюбинская область",
      "Алматинская область",
      "Атырауская область",
      "Восточно-Казахстанская область",
    ],
    Беларусь: [
      "Брестская область",
      "Витебская область",
      "Гомельская область",
      "Гродненская область",
      "Минская область",
      "Могилёвская область",
    ],
  };

  const disciplines = ["Бокс", "ММА", "Кикбоксинг", "Борьба", "Дзюдо"];

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setSelectedRegion("");
  };

  const handleBackClick = () => {
    navigate("/chooserole");
  };

  const handleSave = async () => {
    if (!email.includes("@") || !email.includes(".")) {
      alert("Пожалуйста, введите корректный email адрес");
      return;
    }
    try {
      // Сначала проверяем существование email
      const checkResponse = await fetch(
        "http://localhost:5000/api/check-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!checkResponse.ok) {
        const data = await checkResponse.json();
        alert(data.message); // Покажет "Email уже зарегистрирован"
        return;
      }

      // Если email не существует, продолжаем регистрацию
      const userData = {
        email,
        firstName,
        lastName,
        selectedCountry,
        selectedRegion,
        selectedDiscipline,
        record,
        passwordFromRegister,
        referralCode,
      };

      const registerResponse = await fetch(
        "http://localhost:5000/api/rolefighter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (registerResponse.ok) {
        const data = await registerResponse.json();
        localStorage.setItem("userId", data.id);
        localStorage.setItem("userType", data.userType);
        navigate("/main");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Произошла ошибка при регистрации");
    }
  };

  const isFormValid =
    email &&
    firstName &&
    lastName &&
    selectedCountry &&
    selectedRegion &&
    selectedDiscipline &&
    record;

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
        <h2 className={styles.authorization}>Аккаунт</h2>
        <input
          type="text"
          placeholder="Введите Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.email}
        />
        <input
          type="text"
          placeholder="Ваше имя"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className={styles.email}
        />
        <input
          type="text"
          placeholder="Ваша фамилия"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className={styles.email}
        />
        <select value={selectedCountry} onChange={handleCountryChange}>
          <option value="">Выберите страну</option>
          {Object.keys(countries).map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        {selectedCountry && (
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="">Выберите регион</option>
            {countries[selectedCountry].map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        )}

        <select
          value={selectedDiscipline}
          onChange={(e) => setSelectedDiscipline(e.target.value)}
        >
          <option value="">Выберите дисциплину</option>
          {disciplines.map((discipline) => (
            <option key={discipline} value={discipline}>
              {discipline}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Введите рекорд матчей"
          value={record}
          onChange={(e) => setRecord(e.target.value)}
          className={styles.email}
        />

        <button
          onClick={handleSave}
          disabled={!isFormValid}
          className={isFormValid ? styles.activeButton : styles.disabledButton}
        >
          Сохранить и продолжить
        </button>
      </div>
    </div>
  );
}

export default RoleFighter;
