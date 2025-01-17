import React, { useEffect, useState, useCallback } from "react";
import styles from "./ProfileUserAcc.module.css";
import { useNavigate } from "react-router-dom";

function ProfileUserAcc() {
  const userType = localStorage.getItem("userType");

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedField, setSelectedField] = useState("");
  const [error, setError] = useState(null);
  console.log(error);
  const toggleModal = (field) => {
    setSelectedField(field);
    setEditedValue(userData[field]);
    setShowModal(!showModal);
  };
  const [profilePhoto, setProfilePhoto] = useState(
    localStorage.getItem("profilePhotoUrl") || null
  );
  const [editedValue, setEditedValue] = useState("");
  const currencies = {
    RUB: { name: "Российский рубль", image: "./images/rub.png" },
    USD: { name: "Доллар США", image: "./images/usd.png" },
    EUR: { name: "Евро", image: "./images/eur.png" },
    KZT: { name: "Казахстанский тенге", image: "./images/kzt.png" },
    BYN: { name: "Белорусский рубль", image: "./images/byn.png" },
  };
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const handleSaveForSelect = async () => {
    try {
      // Обновляем страну
      const countryResponse = await fetch(`/api/user/profile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          field: "country",
          value: selectedCountry,
        }),
      });

      // Если обновление страны прошло успешно, обновляем регион
      if (countryResponse.ok) {
        const regionResponse = await fetch(`/api/user/profile/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            field: "region",
            value: selectedRegion,
          }),
        });

        // Если оба запроса успешны, обновляем состояние
        if (regionResponse.ok) {
          setUserData((prev) => ({
            ...prev,
            country: selectedCountry,
            region: selectedRegion,
          }));
          setShowModal(false);
        } else {
          console.error("Error updating region");
        }
      } else {
        console.error("Error updating country");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleSave = async () => {
    try {
      const response = await fetch(`/api/user/profile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          field: selectedField, // Добавить состояние для отслеживания редактируемого поля
          value: editedValue,
        }),
      });

      if (response.ok) {
        // Обновляем локальное состояние
        setUserData((prev) => ({
          ...prev,
          [selectedField]: editedValue,
        }));
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
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
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setSelectedRegion("");
  };
  // eslint-disable-next-line no-unused-vars
  const userId = localStorage.getItem("userId");
  // const profilePhotoSt = localStorage.getItem("profilePhotoUrl");

  const [userData, setUserData] = useState({
    email: "",
    profileName: "",
    region: "",
    country: "",
    currency: "",
  });
  console.log(userData);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("photo", file);
      formData.append("userId", localStorage.getItem("userId"));
      try {
        const response = await fetch("/api/user/upload-photo", {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          const data = await response.json();
          const fullPhotoUrl = `${data.photoUrl}`;
          setProfilePhoto(fullPhotoUrl);
        }
      } catch (error) {
        console.error("Error uploading photo:", error);
      }
    }
  };
  const handleLogout = useCallback(() => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");
    navigate("/");
  }, [navigate]);
  const handleSavePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      alert("Новые пароли не совпадают");
      return;
    }

    try {
      const response = await fetch(`/api/user/password/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (response.status === 401) {
        alert("Старый пароль неправильный");
        return;
      }

      if (response.ok) {
        setShowModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        alert("Пароль успешно изменён");
      } else {
        alert("Произошла ошибка при изменении пароля");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Произошла ошибка при соединении с сервером");
    }
  };
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     const userId = localStorage.getItem("userId");

  //     try {
  //       const response = await fetch(
  //         `/api/user/profile/${userId}`,
  //         {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       if (response.ok) {
  //         const data = await response.json();
  //         setUserData(data.userData);
  //       } else {
  //         console.error("Failed to fetch user data");
  //       }
  //     } catch (error) {
  //       console.error("Error fet error");
  //     }
  //   };

  //   fetchUserData();
  // }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        handleLogout();
        return;
      }

      try {
        const response = await fetch(`/api/user/profile/${userId}`);

        if (response.ok) {
          const data = await response.json();
          if (!data.userData) {
            setError("User data not found");
            handleLogout();
            return;
          }
          setUserData(data.userData);
        } else {
          setError("Failed to fetch user data");
          handleLogout();
        }
      } catch (error) {
        setError("Error fetching data");
        handleLogout();
      }
    };

    fetchUserData();
  }, [handleLogout]);
  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div className={styles.backArrow}>
            <img
              src="arrow.png"
              alt="#"
              onClick={() => navigate("/ProfileUser")}
            />
            <h1>SportDonation</h1>
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
        <h2>Аккаунт</h2>

        <div className={styles.photoUpload}>
          <img
            src={
              profilePhoto.slice(-4) === "null" ? "/Avatar.png" : profilePhoto
            }
            alt="Profile"
            className={styles.profilePhoto}
            onClick={console.log(profilePhoto)}
          />
          <div
            className={styles.uploadPhoto}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <img
              src="material-symbols-light_photo-camera-outline_20.png"
              alt="#"
            />
            <p>Загрузить фото</p>
          </div>
          <input
            id="fileInput"
            type="file"
            onChange={handlePhotoUpload}
            style={{ display: "none" }}
            accept="image/*"
          />
        </div>
        <div onClick={() => toggleModal("mail")}>
          <p>Email</p>
          <p>{userData.mail}</p>
        </div>

        <div onClick={() => toggleModal("profile_name")}>
          <p>Имя профиля</p>
          <p>{userData.profile_name}</p>
        </div>

        <div onClick={() => toggleModal("password")}>
          <p>Пароль</p>
          <p>{userData.password?.replace(/./g, "*")}</p>
        </div>

        <div onClick={() => toggleModal("country")}>
          <p>Регион/Страна</p>
          <p>
            {userData.country}, {userData.region}
          </p>
        </div>

        <div onClick={() => toggleModal("currency")}>
          <p>Валюта отображения</p>
          <p>{userData.currency}</p>
        </div>
        <h2>Уведомления</h2>
        <div>
          <p>Получать уведомления о новых событиях</p>
          <div>
            <input type="checkbox" id="notificationSwitch" />
            <label htmlFor="notificationSwitch">Toggle</label>
          </div>
        </div>
        <div>
          <p>Получать уведомления о результатах голосования</p>
          <div>
            <input type="checkbox" id="votingSwitch" />
            <label htmlFor="votingSwitch">Toggle</label>
          </div>
        </div>
        <h2 onClick={handleLogout}>Выйти из аккаунта</h2>
      </div>
      <div className={styles.bottomNav}>
        <div
          className={styles.catalogItem}
          onClick={() => {
            navigate("/main");
          }}
        >
          <img
            src="ui-checks-grid.png"
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
            src="lightning-charge.png"
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
          <img src="gift.png" alt="" className={styles.catalogImage} />
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
          <img src="person.png" alt="" className={styles.catalogImage} />
          <p className={styles.catalogText}>Профиль</p>
        </div>
      </div>
      {showModal && selectedField !== "password" && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.topModalHead}>
              <div>
                <h2>Введите</h2>
                <img src="x-circle.png" alt="#" onClick={toggleModal} />
              </div>
            </div>
            <input
              type="text"
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
            />
            <button onClick={handleSave}>Сохранить</button>
          </div>
        </div>
      )}

      {showModal && selectedField === "password" && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.topModalHead}>
              <div>
                <h2>Введите пароль</h2>
                <img src="x-circle.png" alt="#" onClick={toggleModal} />
              </div>
            </div>

            <input
              type="password"
              placeholder="Введите текущий пароль"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={styles.passwordinput}
            />

            <input
              type="password"
              placeholder="Введите новый пароль"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={styles.passwordinput}
            />

            <input
              type="password"
              placeholder="Повторите новый пароль"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className={styles.passwordinput}
            />

            <button onClick={handleSavePassword}>Сохранить</button>
          </div>
        </div>
      )}
      {showModal && selectedField === "country" && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.topModalHead}>
              <div>
                <h2>Выбор страны/региона</h2>
                <img src="x-circle.png" alt="#" onClick={toggleModal} />
              </div>
            </div>
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
            <button onClick={handleSaveForSelect}>Сохранить</button>
          </div>
        </div>
      )}
      {showModal && selectedField === "currency" && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.topModalHead}>
              <div>
                <h2>Выбор валюты</h2>
                <img src="x-circle.png" alt="#" onClick={toggleModal} />
              </div>
            </div>
            <select
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
            >
              <option value="">Выберите валюту</option>
              {Object.entries(currencies).map(([code, { name }]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
            <button onClick={handleSave}>Сохранить</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileUserAcc;
