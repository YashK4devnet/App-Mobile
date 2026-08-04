import { useState } from "react";
import Navbar from "../Navbar/Navbar";
import styles from "./Incident.module.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Eduquity25.jpg";
import { TicketIcon } from "../Navbar/NavbarIcons";

const Incident = () => {
  const [isActive, setIsActive] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const navigate = useNavigate();

  const userLoginData = JSON.parse(localStorage.getItem("loginData") || "{}");
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
    <>
      <Navbar />
      <div className={styles.pageBackground}>
        <div className={styles.incidentCard}>
          {/* Header */}
          <div className={styles.incidentHeader}>
            <div className={styles.incidentIconBadge}>
              <TicketIcon className="w-6 h-6 text-[#ff7700]" />
            </div>
            <div>
              <h2 className={styles.incidentTitle}>Incident Management</h2>
              <p className={styles.incidentSubtitle}>Project: {projectName}</p>
            </div>
          </div>

          {/* Content */}
          <div className={styles.incidentContent}>
            <p className={styles.incidentDescription}>
              Create and track support tickets efficiently for your assigned project.
            </p>

            <button
              className={`${styles.ticketsButton} ${isActive ? styles.activeButton : ""
                }`}
              onClick={handleTicketsClick}
            >
              <TicketIcon className="w-5 h-5 text-white" />
              <span className={styles.buttonText}>Support Tickets</span>
              <span className={styles.buttonArrow}>→</span>
            </button>
          </div>
        </div>

        {/* Eduquity Brand Logo */}
        <div className={styles.logoContainer}>
          <img src={logo} alt="Logo" className={styles.logo} />
        </div>

        {/* Modal Popup */}
        {popupMessage && (
          <div className={styles.popupOverlay}>
            <div className={styles.popupBox}>
              <div className={styles.popupHeaderIcon}>
                <TicketIcon className="w-7 h-7 text-[#ff7700]" />
              </div>
              <h3>Project Restriction</h3>
              <p>{popupMessage}</p>
              <button className={styles.closeButton} onClick={closePopup}>
                Understand
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Incident;
