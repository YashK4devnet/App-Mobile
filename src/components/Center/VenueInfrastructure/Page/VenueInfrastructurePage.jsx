import {
  FaDoorOpen,
  FaDoorClosed,
  FaClipboardList,
  FaBan,
} from "react-icons/fa";
import { FiUnlock } from "react-icons/fi";
import styles from "./VenueInfrastructurePage.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppContext } from "../../../../store/AppContext";

const VenueInfrastructurePage = () => {
  const { isCheckedIn } = useAppContext();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const handleNavigate = (path) => {
    if (isCheckedIn) {
      navigate(path);
    } else {
      setShowPopup(true);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Back button */}
      {/*  <button className={styles.backButton} onClick={() => navigate("/center")}>
        <FaArrowLeft className={styles.backIcon} />
        Back to Center
      </button> */}

      {/* Grid container */}
      <div className={styles.pageContainer}>
        {/* Venue Opening Checklist */}
        <button
          className={styles.cardButton}
          onClick={() =>
            handleNavigate("/center/venue-infrastructure/readiness-checklist")
          }
        >
          <FaDoorOpen className={styles.cardIcon} />
          <span className={styles.cardTitle}>Exam Day Readiness Checklist</span>
          <span className={styles.cardSubtitle}>Tasks before opening</span>
        </button>

        {/* Venue Closing Checklist */}
        <button
          className={styles.cardButton}
          onClick={() =>
            handleNavigate("/center/venue-infrastructure/sealing-checklist")
          }
        >
          <FaDoorClosed className={styles.cardIcon} />
          <span className={styles.cardTitle}>Venue Sealing Checklist</span>
          <span className={styles.cardSubtitle}>Tasks after closing</span>
        </button>

        {/* Venue Shift-wise Checklist */}
        <button
          className={styles.cardButton}
          onClick={() =>
            handleNavigate("/center/venue-infrastructure/shift-wise-checklist")
          }
        >
          <FaClipboardList className={styles.cardIcon} />
          <span className={styles.cardTitle}>Venue Shift-wise Checklist</span>
          <span className={styles.cardSubtitle}>Review per shift tasks</span>
        </button>

        {/* Venue Unsealing Checklist */}
        <button
          className={styles.cardButton}
          onClick={() =>
            handleNavigate("/center/venue-infrastructure/unsealing-checklist")
          }
        >
          <FiUnlock className={styles.cardIcon} />
          <span className={styles.cardTitle}>Venue Unsealing Checklist</span>
          <span className={styles.cardSubtitle}>Unsealing Checklist</span>
        </button>
      </div>
      {/* Popup */}
      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupCard}>
            <FaBan className={styles.popupIcon} />
            <h2 className={styles.popupTitle}>Check-in Required</h2>
            <p className={styles.popupMessage}>
              You need to be checked in to create a Checklist. Please check in
              first using the attendance feature.
            </p>
            <button
              className={styles.popupCloseBtn}
              onClick={() => setShowPopup(false)}
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueInfrastructurePage;
