import Navbar from "../Navbar/Navbar";
import styles from "./Attendance.module.css";
import { useAppContext } from "../../store/AppContext";
import { useEffect, useState } from "react";

import { Geolocation } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";

// Request location permissions
const requestLocationPermission = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      const permission = await Geolocation.requestPermissions();
      return permission.location === "granted";
    } catch {
      return false;
    }
  }
  return true;
};

// Get current position
const getCurrentPosition = async () => {
  if (Capacitor.isNativePlatform()) {
    const currentPermissions = await Geolocation.checkPermissions();
    if (currentPermissions.location !== "granted") {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) throw new Error("Location permission denied");
    }

    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000,
    });

    return {
      latitude: coordinates.coords.latitude,
      longitude: coordinates.coords.longitude,
    };
  }

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      (err) => reject(new Error(`Web Geolocation error: ${err.message}`)),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
};

const CheckIn = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentCheckInTime, setCurrentCheckInTime] = useState("");

  // loading screen state
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const {
    isCheckedIn,
    checkIn,
    checkOut,
    syncCheckInFromServer,
    syncCheckOutFromServer,
  } = useAppContext();

  const userLoginData = JSON.parse(localStorage.getItem("loginData"));

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // fetch attendance status
  const fetchAttendanceStatus = async () => {
    setLoading(true);
    setApiError("");

    try {
      const response = await fetch(
        "https://erp.eduquity.com/fetch_last_activity",
        {
          method: "GET",
          headers: {
            login: userLoginData.email,
            password: userLoginData.password,
            ["api-key"]: userLoginData["api-Key"],
            db: "erp-eduquity-com",
          },
        }
      );

      if (!response.ok) {
        let message = "Unexpected error occurred.";
        switch (response.status) {
          case 400:
            message = "Invalid request sent.";
            break;
          case 401:
          case 403:
            message = "Unauthorized. Please check your login.";
            break;
          case 404:
            message = "Employee record not found.";
            break;
          case 500:
            message = "Server error occurred.";
            break;
          case 503:
            message = "Service unavailable. Try later.";
            break;
          default:
            message = "Something went wrong. Try again.";
        }
        setApiError(message);
        return;
      }

      const responseText = await response.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        setApiError("⚠️ Service returned invalid response.");
        return;
      }

      if (data.status === "success" && data.records.length > 0) {
        const lastActivity = data.records[0].activity;

        // Sync with context
        if (lastActivity === "Check-In") {
          const apiCheckInId = data.records[0].att_id;
          const checkInId = JSON.parse(localStorage.getItem("checkInId"));
          if (apiCheckInId !== checkInId) {
            localStorage.setItem("checkInId", JSON.stringify(apiCheckInId));
          }
          const raw = data.records[0].check_in;
          const checkInTime = new Date(
            raw.replace(" ", "T") + "Z"
          ).toLocaleString();

          setCurrentCheckInTime(checkInTime);
          syncCheckInFromServer();
        } else if (lastActivity === "Check-Out") {
          syncCheckOutFromServer();
        } else {
          syncCheckOutFromServer();
        }
      }
    } catch (err) {
      console.log(err);
      setApiError("⚠️ Network error. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceStatus();
  }, []);

  // check-in/out logic
  const handleToggle = async () => {
    setError("");
    setSuccessMessage("");

    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) throw new Error("Location permission denied");

      setIsLoading(true);
      const position = await getCurrentPosition();

      if (!isCheckedIn) {
        await checkIn("Office Location", position);
        const fallbackTime = new Date().toLocaleString();
        setCurrentCheckInTime(fallbackTime); // temporary
        localStorage.setItem("checkInTime", fallbackTime);
        setSuccessMessage("✅ Checked in successfully!");
      } else {
        await checkOut(position);
        setSuccessMessage("✅ Checked out successfully!");
      }

      await fetchAttendanceStatus();
    } catch (err) {
      setError(err.message || "Failed to update attendance.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.attendanceContainer}>
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loader}></div>
            <p className={styles.loadingText}>Loading attendance status...</p>
          </div>
        )}

        <div
          className={`${styles.attendanceCard} ${
            loading ? styles.blurredCard : ""
          }`}
        >
          {/* Retry case */}
          {apiError && !loading && (
            <div className={styles.retryContainer}>
              <p className={styles.errorMessage}>{apiError}</p>
              <button
                onClick={fetchAttendanceStatus}
                className={styles.retryButton}
              >
                Retry
              </button>
            </div>
          )}

          {/* Normal flow */}
          {!apiError && !loading && (
            <>
              <div className={styles.buttonContainer}>
                <button
                  className={
                    isCheckedIn ? styles.checkInButton : styles.checkInButton2
                  }
                  onClick={handleToggle}
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Processing..."
                    : isCheckedIn
                    ? "Check-Out"
                    : "Check-In"}
                </button>
              </div>

              {error && (
                <div className={styles.errorContainer}>
                  <p className={styles.errorMessage}>{error}</p>
                </div>
              )}
              {successMessage && (
                <div className={styles.successContainer}>
                  <p className={styles.successMessage}>{successMessage}</p>
                </div>
              )}
            </>
          )}
          {isCheckedIn && (
            <div className={styles.checkInContainers}>
              <div className={styles.userData}>
                <div className={styles.userField}>
                  <strong>Email</strong>
                  {userLoginData?.email || ""}
                </div>
                <div className={styles.userField}>
                  <strong>Check-In Time</strong>
                  {currentCheckInTime || ""}
                </div>
                <div className={styles.userField}>
                  <strong>Status</strong>
                  {"Checked In"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CheckIn;
