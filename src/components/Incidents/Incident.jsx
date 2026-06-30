import { useState } from "react";
import styles from "./Incident.module.css";
import { useNavigate } from "react-router-dom";

const Incident = () => {
  const [isActive, setIsActive] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const navigate = useNavigate();

  const userLoginData = JSON.parse(localStorage.getItem("loginData"));
  const projectName =
    userLoginData?.employee_assigned_project?.trim() || "Default Project";

  const handleTicketsClick = () => {
    setIsActive(!isActive);

    if (projectName.toLowerCase() === "internal project") {
      setPopupMessage(
        "Support tickets cannot be created for internal projects. Please contact your administrator."
      );
      return;
    }

    if (projectName === "Default Project") {
      setPopupMessage(
        "You don't have a project assigned. Please select or get assigned a valid project before creating a ticket."
      );
      return;
    }

    // ✅ Allowed case
    navigate("/tickets");
  };

  const closePopup = () => {
    setPopupMessage("");
  };

  return (
    <div className={styles.pageBackground}>
      <div className={styles.incidentContainer}>
        <div className={styles.incidentHeader}>
          <div className={styles.incidentIcon}>🎫</div>
          <h2 className={styles.incidentTitle}>Incident Management</h2>
        </div>

        <div className={styles.incidentContent}>
          <p className={styles.incidentDescription}>
            Manage and track your support tickets efficiently
          </p>

          <button
            className={`${styles.ticketsButton} ${
              isActive ? styles.activeButton : ""
            }`}
            onClick={handleTicketsClick}
          >
            <span className={styles.buttonIcon}>🎟️</span>
            <span className={styles.buttonText}>Ticket</span>
            <span className={styles.buttonArrow}>→</span>
          </button>
        </div>
      </div>

      {/* Popup */}
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

export default Incident;
