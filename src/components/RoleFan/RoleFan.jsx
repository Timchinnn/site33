import React, { useState } from "react";
import styles from "./RoleFan.module.css";
import { useNavigate, useLocation } from "react-router-dom";

function RoleFan() {
  const navigate = useNavigate();

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

  const [profileName, setProfileName] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const location = useLocation();
  const emailFromRegister = location.state?.email;
  const passwordFromRegister = location.state?.password;
  const [email, setEmail] = useState(emailFromRegister || "");
  const referralCode = location.state?.referralCode;
  console.log(referralCode);

  // console.log("Location state:", location.state);
  // console.log(passwordFromRegister);
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

  const currencies = {
    RUB: { name: "Российский рубль", image: "./images/rub.png" },
    USD: { name: "Доллар США", image: "./images/usd.png" },
    EUR: { name: "Евро", image: "./images/eur.png" },
    KZT: { name: "Казахстанский тенге", image: "./images/kzt.png" },
    BYN: { name: "Белорусский рубль", image: "./images/byn.png" },
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setSelectedRegion("");
  };

  const handleBackClick = () => {
    navigate("/chooserole");
  };
  // const handleNavigateToMainPage = () => {
  //   navigate("/main");
  // };

  const isFormValid =
    email &&
    profileName &&
    selectedCountry &&
    selectedRegion &&
    selectedCurrency;
  const handleSave = async () => {
    if (!email.includes("@") || !email.includes(".")) {
      alert("Пожалуйста, введите корректный email адрес");
      return;
    }
    try {
      // First check if email exists
      const checkResponse = await fetch("/api/check-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!checkResponse.ok) {
        const data = await checkResponse.json();
        alert(data.message); // Will show "Email уже зарегистрирован"
        return;
      }

      // If email doesn't exist, proceed with registration
      const userData = {
        email,
        profileName,
        selectedCountry,
        selectedRegion,
        selectedCurrency,
        passwordFromRegister,
        referralCode,
      };

      const response = await fetch("/api/rolefan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("userId", data.id);
        localStorage.setItem("userType", data.userType);
        navigate("/main");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Произошла ошибка при регистрации");
    }
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
        <h1 className={styles.title}>BroDonate</h1>
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
          placeholder="Имя профиля"
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
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
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
        >
          <option value="">Выберите валюту</option>
          {Object.entries(currencies).map(([code, { name }]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>

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

export default RoleFan;
