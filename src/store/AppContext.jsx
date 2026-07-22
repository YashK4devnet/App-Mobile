import { createContext, useContext, useReducer, useEffect } from "react";
import { getAccurateTime } from "../services/timeService";

const getAssignedCoordinates = async () => {
  try {
    // ✅ Step 1: Validate localStorage
    const loginDataRaw = localStorage.getItem("loginData");
    if (!loginDataRaw) {
      throw new Error("Your session has expired. Please login again.");
    }

    let loginData;
    try {
      loginData = JSON.parse(loginDataRaw);
    } catch {
      throw new Error("Saved login data is corrupted. Please login again.");
    }

    const id = loginData.employeeId;
    if (!id) {
      throw new Error("Employee ID not found. Please login again.");
    }

    // ✅ Step 2: API call
    const response = await fetch(
      `https://erp.eduquity.com/active_data?model=hr.employee&Id=${id}`,
      {
        headers: {
          login: loginData.email,
          password: loginData.password,
          ["api-key"]: loginData["api-Key"],
          db: "erp-eduquity-com",
          "Content-Type": "application/json",
        },
      }
    );

    // ✅ Step 3: Handle HTTP errors -> convert to user-friendly
    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new Error(
            "Invalid request sent. Please contact administrator."
          );
        case 401:
        case 403:
          throw new Error(
            "You are not authorized. Please check your login details."
          );
        case 404:
          throw new Error(
            "Employee record not found. Please contact administrator."
          );
        case 500:
          throw new Error("Server error occurred. Please try again later.");
        case 503:
          throw new Error("Service temporarily unavailable. Try again later.");
        default:
          throw new Error("Unexpected error occurred. Please try again later.");
      }
    }

    // ✅ Step 4: Parse JSON safely
    const responseText = await response.text();

    let data;
    try {
      data = await JSON.parse(responseText);
    } catch {
      throw new Error("⚠️ Service not working. Please try to contact support.");
    }

    console.log("📡 API Response:", data);

    // ✅ Step 5: Validate coordinates
    if (data && data.employee_latitude && data.employee_longitude) {
      const apiLatitude = parseFloat(data.employee_latitude);
      const apiLongitude = parseFloat(data.employee_longitude);

      // Sync updated details back to localStorage if changed
      let needsUpdate = false;
      if (apiLatitude !== parseFloat(loginData.employee_latitude)) {
        loginData.employee_latitude = apiLatitude;
        needsUpdate = true;
      }
      if (apiLongitude !== parseFloat(loginData.employee_longitude)) {
        loginData.employee_longitude = apiLongitude;
        needsUpdate = true;
      }
      if (data.active_project !== loginData.employee_assigned_project) {
        loginData.employee_assigned_project = data.active_project;
        needsUpdate = true;
      }
      if (data.active_venue !== loginData.employee_assigned_venue) {
        loginData.employee_assigned_venue = data.active_venue;
        needsUpdate = true;
      }
      if (needsUpdate) {
        localStorage.setItem("loginData", JSON.stringify(loginData));
      }

      return { latitude: apiLatitude, longitude: apiLongitude };
    }

    // ✅ If API didn’t return coordinates
    throw new Error(
      "Your assigned location is not configured. Please contact administrator."
    );
  } catch (error) {
    console.error("❌ Error getting assigned coordinates:", error);

    // ✅ Friendly messages for network issues
    if (
      error.message.includes("Failed to fetch") ||
      error.message.includes("NetworkError") ||
      error.message.includes("TypeError") ||
      error.message.includes("resolve host") ||
      error.message.includes("ERR_NAME_NOT_RESOLVED")
    ) {
      throw new Error("No internet connection. Please check your network.");
    }

    // ✅ If we already threw a friendly message above, just reuse it
    throw new Error(error.message || "Something went wrong. Please try again.");
  }
};

const ALLOWED_DISTANCE_METERS = 100;

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

const isWithinAllowedLocation = async (userLat, userLon) => {
  const assignedCoords = await getAssignedCoordinates();

  if (!assignedCoords) {
    console.warn("No assigned coordinates available, allowing check-in/out");
    return true; // or false, depending on your business logic
  }

  const distance = calculateDistance(
    userLat,
    userLon,
    assignedCoords.latitude,
    assignedCoords.longitude
  );

  return distance <= ALLOWED_DISTANCE_METERS;
};

const initialState = {
  user: null,
  isAuthenticated: false,
  isCheckedIn: false,
  currentCheckInTime: null,
  isLoading: true,
};

// Action types
const ActionTypes = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  CHECK_IN: "CHECK_IN",
  CHECK_OUT: "CHECK_OUT",
  SET_LOADING: "SET_LOADING",
  SYNC_CHECK_IN: "SYNC_CHECK_IN",
  SYNC_CHECK_OUT: "SYNC_CHECK_OUT",
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN: {
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    }

    case ActionTypes.LOGOUT: {
      // 🔄 Preserve check-in state during logout by checking localStorage
      const checkInStatus = localStorage.getItem("checkInStatus");
      let preservedCheckInState = {
        isCheckedIn: false,
        currentCheckInTime: null,
      };

      if (checkInStatus) {
        try {
          const parsedStatus = JSON.parse(checkInStatus);
          if (parsedStatus.isCheckedIn && parsedStatus.checkInTime) {
            preservedCheckInState = {
              isCheckedIn: true,
              currentCheckInTime: parsedStatus.checkInTime,
            };
            console.log("✅ Check-in state preserved during logout");
          }
        } catch (error) {
          console.error(
            "❌ Error parsing check-in status during logout:",
            error
          );
        }
      }

      return {
        ...state,
        user: null,
        isAuthenticated: false,
        ...preservedCheckInState, // Use preserved state instead of resetting
      };
    }
    case ActionTypes.SET_LOADING: {
      return {
        ...state,
        isLoading: action.payload,
      };
    }

    case ActionTypes.CHECK_IN: {
      return {
        ...state,
        isCheckedIn: true,
        currentCheckInTime: action.payload.time,
      };
    }

    case ActionTypes.CHECK_OUT: {
      return {
        ...state,
        isCheckedIn: false,
        currentCheckInTime: null,
      };
    }
    case ActionTypes.SYNC_CHECK_IN:
      return {
        ...state,
        isCheckedIn: true,
        currentCheckInTime: action.payload?.time || null,
      };

    case ActionTypes.SYNC_CHECK_OUT:
      return {
        ...state,
        isCheckedIn: false,
        currentCheckInTime: null,
      };

    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadStoredData = async () => {
      let isLoggedOut = false;
      try {
        const loginData = localStorage.getItem("loginData");
        if (loginData) {
          let parsedData = JSON.parse(loginData);

          // Check server access / re-auth
          try {
            const response = await fetch(`https://erp.eduquity.com/odoo_connect`, {
              method: "GET",
              headers: {
                action: "login",
                login: parsedData.email.trim(),
                password: parsedData.password,
                db: "erp-eduquity-com",
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Mobile; app-reload-check)",
              },
            });

            const responseText = await response.text();

            const isAlreadyLogin = /already login/i.test(responseText);

            if (
              response.status === 401 ||
              response.status === 403 ||
              /wrong login credentials/i.test(responseText)
            ) {
              alert("Session expired or invalid credentials. Please log in again.");
              localStorage.removeItem("loginData");
              isLoggedOut = true;
            } else if (response.ok || isAlreadyLogin) {
              if (isAlreadyLogin) {
                const storedApiKey = localStorage.getItem("serverApiKey");
                if (!storedApiKey) {
                  console.warn("Server reports session active, but local serverApiKey is missing. Wiping local session.");
                  localStorage.removeItem("loginData");
                  localStorage.removeItem("serverApiKey");
                  isLoggedOut = true;
                } else {
                  console.log("Server reports session is active. Maintaining current login state.");
                }
              } else {
                try {
                  const responseData = JSON.parse(responseText);
                  if (responseData["api-key"]) {
                    parsedData["api-Key"] = responseData["api-key"];
                    parsedData.employeeId = responseData.employeeId;
                    parsedData.userId = responseData.userId;
                    localStorage.setItem("loginData", JSON.stringify(parsedData));
                    localStorage.setItem("serverApiKey", responseData["api-key"]);
                  }
                } catch (e) {
                  console.warn("Could not parse re-auth JSON response.", e);
                }
              }
            }
          } catch (networkError) {
            console.log("Network error checking auth, assuming offline mode.");
          }

          if (!isLoggedOut) {
            dispatch({
              type: ActionTypes.LOGIN,
              payload: parsedData,
            });
          }
        }
      } catch (error) {
        console.error("Error loading stored data:", error);
      } finally {
        dispatch({
          type: ActionTypes.SET_LOADING,
          payload: false,
        });
      }
    };

    loadStoredData();
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem("loginData", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("loginData");
    }
  }, [state.user]);

  // Action creators
  const login = (userData) => {
    dispatch({
      type: ActionTypes.LOGIN,
      payload: userData,
    });
  };

  const logout = async () => {
    try {
      const loginData = localStorage.getItem("loginData");

      if (!loginData) {
        console.error("No login data found");
        return;
      }

      const userLoginData = JSON.parse(loginData);
      const userId = userLoginData.employeeId;

      const logoutData = {
        fields: ["log_in"],
        values: {
          log_in: "0",
        },
      };

      const response = await fetch(
        `https://erp.eduquity.com/send_request?model=hr.employee&Id=${userId}`,
        {
          method: "PUT",
          headers: {
            login: userLoginData.email,
            password: userLoginData.password,
            ["api-key"]: userLoginData["api-Key"],
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Mobile; check-in-page)",
          },
          body: JSON.stringify(logoutData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // ✅ Step 1: Parse response safely (try JSON first)
      const responseText = await response.text();

      let responseData;
      try {
        // Try parsing as JSON
        responseData = JSON.parse(responseText);
      } catch (err) {
        console.error("Response is not JSON:", err);
        // ❌ Any HTML / unexpected response → show fixed alert
        alert("⚠️ Service not working. Please contact support.");
        return;
      }

      // ✅ Step 2: Check structure safely
      if (
        responseData["Updated resource"] &&
        Array.isArray(responseData["Updated resource"]) &&
        responseData["Updated resource"].length > 0
      ) {
        const updatedResource = responseData["Updated resource"][0];

        // ✅ Step 3: Check log_in value
        if (updatedResource.log_in === "0" || updatedResource.log_in === 0) {
          console.log(
            "✅ Logout successful, preserving check-in state and clearing sensitive data"
          );

          const preserveKeys = [
            "ExamDayReadinessChecklistData",
            "SealingChecklistData",
            "ShiftWiseChecklistData",
            "UnsealingChecklistData",
          ];

          // Save values you want to preserve
          const preservedData = {};
          preserveKeys.forEach((key) => {
            const value = localStorage.getItem(key);
            if (value !== null) {
              preservedData[key] = value;
            }
          });

          // Clear all localStorage
          localStorage.clear();
          // Restore preserved values
          Object.keys(preservedData).forEach((key) => {
            localStorage.setItem(key, preservedData[key]);
          });
          dispatch({
            type: ActionTypes.LOGOUT,
          });
        } else {
          console.warn(
            "❌ Logout failed - log_in status is not 0:",
            updatedResource.log_in
          );
          alert("Logout failed. Please try again.");
        }
      } else {
        console.error("❌ Unexpected response structure:", responseData);
        alert("Logout failed due to unexpected server response.");
      }
    } catch (error) {
      console.error("❌ Logout error:", error);
      let message = error.message || "Logout failed due to unknown error.";

      // 🌐 Handle network / offline errors gracefully
      if (
        message.includes("Failed to fetch") ||
        message.includes("NetworkError") ||
        message.includes("TypeError") ||
        message.includes("Unable to resolve host") || // Android native
        message.includes("No address associated") || // Android native
        message.includes("ERR_NAME_NOT_RESOLVED") // Browser DNS
      ) {
        message =
          "🌐 No internet connection or server unreachable. Please check your network and try again.";
      }

      alert(message); // Show user-friendly message
    }
  };

  const checkIn = async (
    location = "Location not available",
    coordinates = null
  ) => {
    try {
      // ✅ Step 1: Get assigned coordinates safely
      const assignedCoords = await getAssignedCoordinates();
      if (!assignedCoords) {
        throw new Error(
          "Employee location coordinates not configured. Please contact administrator."
        );
      }

      // ✅ Step 2: Verify location if coordinates are provided
      if (coordinates) {
        const { latitude, longitude } = coordinates;
        if (!(await isWithinAllowedLocation(latitude, longitude))) {
          const distance = calculateDistance(
            latitude,
            longitude,
            assignedCoords.latitude,
            assignedCoords.longitude
          );
          throw new Error(
            `You are not at the assigned location. You are ${Math.round(
              distance
            )} meters away from the allowed check-in area (${ALLOWED_DISTANCE_METERS}m allowed).`
          );
        }
      }

      // ✅ Step 3: Get accurate server time
      const accurateTime = await getAccurateTime();
      const formattedTime = accurateTime
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      // ✅ Step 4: Get user login data
      const loginData = localStorage.getItem("loginData");
      if (!loginData) {
        throw new Error("User login data not found. Please login again.");
      }

      const userLoginData = JSON.parse(loginData);
      if (
        !userLoginData.email ||
        !userLoginData.password ||
        !userLoginData["api-Key"]
      ) {
        throw new Error("Invalid login credentials. Please login again.");
      }

      // ✅ Step 5: Send check-in request to server
      const response = await fetch(
        `https://erp.eduquity.com/send_request?model=hr.attendance`,
        {
          method: "POST",
          headers: {
            login: userLoginData.email,
            password: userLoginData.password,
            ["api-key"]: userLoginData["api-Key"],
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Mobile; check-in-page)",
          },
          body: JSON.stringify({
            fields: ["employee_id", "check_in", "in_latitude", "in_longitude"],
            values: {
              employee_id: userLoginData.employeeId,
              check_in: formattedTime,
              in_latitude: coordinates?.latitude || null,
              in_longitude: coordinates?.longitude || null,
            },
          }),
        }
      );

      if (!response.ok) {
        let friendlyMessage = "";

        switch (response.status) {
          case 400:
            friendlyMessage =
              "⚠️ You are already checked in. Please check out before trying again or contact Admin.";
            break;
          case 401:
          case 403:
            friendlyMessage =
              "❌ Unauthorized. Please check your email or password.";
            break;
          case 404:
            friendlyMessage =
              "❌ Server not found. Please check the API domain.";
            break;
          case 500:
            friendlyMessage =
              "⚠️ Server error. The system is temporarily unavailable. Please try again later or contact support.";
            break;
          case 502:
            friendlyMessage =
              "⚠️ The server is temporarily unavailable (Bad Gateway). Please try again later or contact support.";
            break;
          case 503:
            friendlyMessage =
              "⚠️ Service unavailable. The server might be down for maintenance. Please try again later.";
            break;
          default:
            friendlyMessage = `⚠️ Unexpected error (code: ${response.status}). Please try again later.`;
        }

        throw new Error(friendlyMessage);
      }

      // ✅ Step 6: Read response once as text
      const rawResponse = await response.text();

      let responseData;
      try {
        responseData = JSON.parse(rawResponse);
      } catch (err) {
        console.log(err);
        console.error("⚠️ Server returned non-JSON response:", rawResponse);

        if (rawResponse.includes("Invalid JSON Data")) {
          throw new Error(
            "You are already checked in. Please check out before trying again or contact Admin."
          );
        }

        throw new Error("Unexpected server response. Please contact support.");
      }

      // ✅ Step 7: Save check-in ID for later checkout
      const checkInId = responseData?.["New resource"]?.[0]?.id;
      if (checkInId) {
        localStorage.setItem("checkInId", checkInId.toString());
        console.log("✅ Check-in ID saved:", checkInId);
      } else {
        console.warn("⚠️ checkInId not found in response", responseData);
        throw new Error(
          "Check-in successful but ID not received. Please contact support."
        );
      }

      // ✅ Step 8: Update local state
      dispatch({
        type: ActionTypes.CHECK_IN,
        payload: {
          time: accurateTime.toLocaleString(),
          location,
          timestamp: accurateTime.toISOString(),
        },
      });

      console.log("✅ Check-in completed successfully");
    } catch (error) {
      console.error("❌ Error during check-in:", error);

      let message = error.message;

      // 🌐 Handle network / offline errors gracefully
      if (
        message.includes("Failed to fetch") ||
        message.includes("NetworkError") ||
        message.includes("TypeError") ||
        message.includes("Unable to resolve host") || // Android native error
        message.includes("No address associated") || // Android native error
        message.includes("ERR_NAME_NOT_RESOLVED") // Browser DNS error
      ) {
        message =
          "🌐 No internet connection or server unreachable. Please check your network and try again.";
      }

      throw new Error(message);
    }
  };

  const checkOut = async (coordinates = null) => {
    try {
      // ✅ Step 1: Get assigned coordinates safely
      const assignedCoords = await getAssignedCoordinates();
      if (!assignedCoords) {
        throw new Error(
          "Employee location coordinates not configured. Please contact administrator."
        );
      }

      // ✅ Step 2: Verify location if coordinates are provided
      if (coordinates) {
        const { latitude, longitude } = coordinates;
        if (!(await isWithinAllowedLocation(latitude, longitude))) {
          const distance = calculateDistance(
            latitude,
            longitude,
            assignedCoords.latitude,
            assignedCoords.longitude
          );
          throw new Error(
            `You are not at the assigned location. You are ${Math.round(
              distance
            )} meters away from the allowed check-out area (${ALLOWED_DISTANCE_METERS}m allowed).`
          );
        }
      }

      // ✅ Step 3: Get saved check-in ID from localStorage
      const checkInId = localStorage.getItem("checkInId");

      // ⚠️ If no checkInId but user is showing as checked in, try to find the latest attendance record
      if (!checkInId) {
        console.warn("⚠️ Check-in ID not found in localStorage");

        // Check if user is actually checked in according to our state
        const checkInStatus = localStorage.getItem("checkInStatus");
        if (checkInStatus) {
          const parsedStatus = JSON.parse(checkInStatus);
          if (!parsedStatus.isCheckedIn) {
            throw new Error("You are not currently checked in.");
          }
          console.log(
            "📝 User appears to be checked in but check-in ID is missing. Proceeding with local checkout only."
          );

          // Perform local checkout without server update
          dispatch({
            type: ActionTypes.CHECK_OUT,
            payload: {
              time: new Date().toLocaleString(),
              timestamp: new Date().toISOString(),
              fromServer: false,
            },
          });

          console.log(
            "✅ Local check-out completed due to missing check-in ID"
          );
          return; // Exit early
        } else {
          throw new Error("You are not currently checked in.");
        }
      }

      // ✅ Step 4: Get user login data
      const loginData = localStorage.getItem("loginData");
      if (!loginData) {
        throw new Error("User login data not found. Please login again.");
      }

      const userLoginData = JSON.parse(loginData);
      if (
        !userLoginData.email ||
        !userLoginData.password ||
        !userLoginData["api-Key"]
      ) {
        throw new Error("Invalid login credentials. Please login again.");
      }

      // ✅ Step 5: Get accurate server time
      const accurateTime = await getAccurateTime();
      const formattedTime = accurateTime
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      console.log("⏰ Proceeding with check-out at:", formattedTime);

      // ✅ Step 6: Prepare check-out data
      const checkOutData = {
        fields: ["check_out", "out_latitude", "out_longitude"],
        values: {
          check_out: formattedTime,
          out_latitude: coordinates?.latitude || null,
          out_longitude: coordinates?.longitude || null,
        },
      };

      /* const apiDomain = localStorage.getItem("apiDomain"); */

      // ✅ Step 7: Send PUT request to update attendance record
      const response = await fetch(
        `https://erp.eduquity.com/send_request?model=hr.attendance&Id=${checkInId}`,
        {
          method: "PUT",
          headers: {
            login: userLoginData.email,
            password: userLoginData.password,
            ["api-key"]: userLoginData["api-Key"],
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Mobile; check-out-page)",
          },
          body: JSON.stringify(checkOutData),
        }
      );

      // ✅ Handle non-OK responses gracefully
      if (!response.ok) {
        let friendlyMessage = "";
        switch (response.status) {
          case 400:
            friendlyMessage =
              "⚠️ Bad request. Please check your input and try again.";
            break;
          case 401:
          case 403:
            friendlyMessage =
              "❌ Unauthorized. Please check your email or password.";
            break;
          case 404:
            friendlyMessage =
              "❌ Server not found. Please check the API domain.";
            break;
          case 500:
            friendlyMessage =
              "⚠️ Server error. The system is temporarily unavailable. Please try again later or contact support.";
            break;
          case 502:
            friendlyMessage =
              "⚠️ The server is temporarily unavailable (Bad Gateway). Please try again later or contact support.";
            break;
          case 503:
            friendlyMessage =
              "⚠️ Service unavailable. The server might be down for maintenance. Please try again later.";
            break;
          default:
            friendlyMessage = `⚠️ Unexpected error (code: ${response.status}). Please try again later.`;
        }

        throw new Error(friendlyMessage);
      }
      const responseText = await response.text();
      let responseData;
      try {
        responseData = await JSON.parse(responseText); // try to parse JSON
      } catch (err) {
        console.log(err);
        // If response is not JSON, assume it's the "already checked in" case
        throw new Error(
          "⚠️ Service not working. Please try to contact support."
        );
      }

      // ✅ Step 8: Verify the response
      if (
        responseData["Updated resource"] &&
        responseData["Updated resource"].length > 0
      ) {
        const updatedRecord = responseData["Updated resource"][0];
        if (updatedRecord.check_out) {
          console.log(
            "✅ Check-out confirmed by server:",
            updatedRecord.check_out
          );
        } else {
          console.warn("⚠️ Check-out may not have been recorded properly");
        }
      }

      // ✅ Step 9: Update local state
      dispatch({
        type: ActionTypes.CHECK_OUT,
        payload: {
          time: accurateTime.toLocaleString(),
          timestamp: accurateTime.toISOString(),
          fromServer: true,
        },
      });

      // ✅ Step 10: Clean up check-in ID
      localStorage.removeItem("checkInId");
      console.log("✅ Check-out completed successfully");
    } catch (error) {
      console.error("❌ Error during check-out:", error);

      // Graceful network/offline handling
      let message = error.message;
      if (
        message.includes("Failed to fetch") ||
        message.includes("NetworkError") ||
        message.includes("TypeError") ||
        message.includes("Unable to resolve host") || // Android native error
        message.includes("No address associated") || // Android native error
        message.includes("ERR_NAME_NOT_RESOLVED") // Browser DNS error
      ) {
        message =
          "🌐 No internet connection or server unreachable. Please check your network and try again.";
      }

      // Local fallback if check-in ID was missing
      if (message.includes("Check-in ID not found")) {
        dispatch({
          type: ActionTypes.CHECK_OUT,
          payload: {
            time: new Date().toLocaleString(),
            timestamp: new Date().toISOString(),
            fromServer: false,
          },
        });
      }

      throw new Error(message);
    }
  };
  const syncCheckInFromServer = (time = null) => {
    dispatch({ type: ActionTypes.SYNC_CHECK_IN, payload: { time } });
  };

  const syncCheckOutFromServer = () => {
    dispatch({ type: ActionTypes.SYNC_CHECK_OUT });
  };

  // Context value
  const contextValue = {
    // State
    ...state,

    // Actions
    login,
    logout,
    checkIn,
    checkOut,
    syncCheckInFromServer,
    syncCheckOutFromServer,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export default AppContext;
