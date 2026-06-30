import { FaBuilding } from "react-icons/fa";
import styles from "./CenterPage.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const CenterPage = () => {
  const [popupMessage, setPopupMessage] = useState("");

  const navigate = useNavigate();

  const userLoginData = JSON.parse(localStorage.getItem("loginData"));
  const projectName =
    userLoginData?.employee_assigned_project?.trim() || "Default Project";

  const handleNavigate = (path) => {
    if (projectName.toLowerCase() === "internal project") {
      setPopupMessage(
        "Venue Checklist cannot be created for internal projects. Please contact your administrator."
      );
      return;
    }

    if (projectName === "Default Project") {
      setPopupMessage(
        "You don't have a project assigned. Please select or get assigned a valid project before creating a Checklist."
      );
      return;
    }
    navigate(path);
  };
  const closePopup = () => {
    setPopupMessage("");
  };
  const actions = [
    {
      id: 1,
      icon: <FaBuilding />,
      label: "Venue Infrastructure",
      path: "/center/venue-infrastructure",
    },
  ];

  return (
    <div className={styles.centerPage}>
      <div className={styles.centerContainer}>
        <h1 className={styles.pageTitle}>Center Management</h1>

        <div className={styles.actionGrid}>
          {actions.map((action) => (
            <button
              key={action.id}
              className={styles.actionCard}
              onClick={() => handleNavigate(action.path)}
            >
              <div className={styles.icon}>{action.icon}</div>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
      {popupMessage && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupBox}>
            <p>{popupMessage}</p>
            <button className={styles.closeButton} onClick={closePopup}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CenterPage;
