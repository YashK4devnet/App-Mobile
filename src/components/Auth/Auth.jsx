import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../store/AppContext";
import styles from "./Auth.module.css";
import logo from "../../assets/Eduquity25.jpg";
import { useState } from "react";

const Auth = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { login } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  /*  const [configLoading, setConfigLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [configError, setConfigError] = useState("");
  const [configSuccess, setConfigSuccess] = useState("");

  const [currentConfig, setCurrentConfig] = useState({
    apiDomain: "",
    dbName: "",
  }); */

  /*  useEffect(() => {
    // Check if configuration exists in localStorage
    const apiDomain = localStorage.getItem("apiDomain");
    const dbName = localStorage.getItem("dbName");
    if (apiDomain && dbName) {
      setIsConfigured(true);
      setCurrentConfig({ apiDomain, dbName });
    }
  }, []); */

  /*  const handleConfiguration = async (e) => {
    e.preventDefault();
    setConfigError("");
    setConfigSuccess("");
    setConfigLoading(true);

    const apiDomain = e.target.apiDomain.value.trim();
    const dbName = e.target.dbName.value.trim();

    if (!apiDomain || !dbName) {
      setConfigError("Both API Domain and DB Name are required");
      setConfigLoading(false);
      return;
    }

    try {
      // Optional: Add validation by making a test request to the API
      const testResponse = await fetch(`${apiDomain}/api/test`, {
        method: "GET",
      });

      if (!testResponse.ok) {
        throw new Error("Invalid API domain");
      }

      // Store configuration in localStorage
      localStorage.setItem("apiDomain", apiDomain);
      localStorage.setItem("dbName", dbName);
      setIsConfigured(true);
      setConfigSuccess("Configuration successful! You can now login.");

      // Automatically return to login after 2 seconds
      setTimeout(() => {
        setShowConfig(false);
      }, 2000);
    } catch (error) {
      console.error("Configuration error:", error);
      setConfigError("Failed to validate API domain. Please check the URL.");
    } finally {
      setConfigLoading(false);
    }
  }; */

  const onSubmit = async (data) => {
    setLoginError("");
    /* if (!isConfigured) {
      setLoginError(
        "⚙️ Please configure API Domain and DB Name before logging in."
      );
      setLoading(false);
      return;
    } */

    setLoading(true);
    /* const apiDomain = localStorage.getItem("apiDomain");
    const dbName = localStorage.getItem("dbName"); */

    try {
      const response = await fetch(`https://erp.eduquity.com/odoo_connect`, {
        method: "GET",
        headers: {
          action: "login",
          login: data.email.trim(), // keep as typed (no lowercase)
          password: data.password,
          db: "erp-eduquity-com",
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Mobile; login-page)",
        },
      });

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
        // Try parsing as JSON
        responseData = JSON.parse(responseText);
      } catch (err) {
        console.log(err);
        // Not JSON → must be HTML
        if (responseText.includes("<html")) {
          const match = responseText.match(/<h2>(.*?)<\/h2>/i);
          if (match && match[1]) {
            let errorMsg = match[1];

            // Make server messages user-friendly
            if (/already login/i.test(errorMsg)) {
              errorMsg =
                "⚠️ You're already logged in on another device. Please log out there first or contact support.";
            } else if (/wrong login credentials/i.test(errorMsg)) {
              errorMsg = "❌ Invalid username or password. Please try again.";
            } else {
              errorMsg =
                "⚠️ Service not working. Please try to contact support.";
            }

            throw new Error(errorMsg);
          } else {
            throw new Error(
              "⚠️ Service not working. Please try to contact support."
            );
          }
        }
      }

      // If JSON and auth successful
      if (responseData && responseData.Status === "auth successful") {
        const userData = {
          name: responseData.User,
          email: data.email.trim(),
          password: data.password,
          ["api-Key"]: responseData["api-key"],
          Id: responseData.UserID,
          employeeId: responseData.employee_id,
          employee_email: responseData.work_email,
          employee_phone: responseData.work_phone,
          employee_latitude: responseData.employee_latitude,
          employee_longitude: responseData.employee_longitude,
          employee_department: responseData.department_id,
          employee_post: responseData.job_id,
          employee_assigned_project: responseData?.active_project ?? "None",
          employee_assigned_venue: responseData?.active_venue ?? "None",
          employee_code: responseData?.employee_code ?? "None",
          project_id: responseData.project_id,
          venue_id: responseData.venue_id,
          city_id: responseData.city_id,
          state_id: responseData.state_id,
        };

        localStorage.setItem("loginData", JSON.stringify(userData));
        localStorage.setItem(
          "employeeId",
          String(responseData.employee_id || "")
        );
        localStorage.setItem("serverApiKey", responseData["api-key"]);

        login(userData);
        navigate("/dashboard");
        return;
      } else {
        throw new Error(
          responseData?.message || "❌ Invalid login. Please try again."
        );
      }
      /*   const responseData = {
        Status: "auth successful",
        User: "Test User",
        "api-key": "dummy-key-123",
        UserID: "12345",
        employee_id: "E001",
        work_email: "test@example.com",
        work_phone: "9999999999",
        employee_latitude: "12.9716",
        employee_longitude: "77.5946",
        department_id: "Dept01",
        job_id: "Job01",
        active_project: "Mock Project",
        active_venue: "Mock Venue",
      };

      // same login flow
      const userData = {
        name: responseData.User,
        email: data.email,
        password: data.password,
        ["api-Key"]: responseData["api-key"],
        Id: responseData.UserID,
        employeeId: responseData.employee_id,
        employee_email: responseData.work_email,
        employee_phone: responseData.work_phone,
        employee_latitude: responseData.employee_latitude,
        employee_longitude: responseData.employee_longitude,
        employee_department: responseData.department_id,
        employee_post: responseData.job_id,
        employee_assigned_project: responseData?.active_project ?? "None",
        employee_assigned_venue: responseData?.active_venue ?? "None",
      };

      localStorage.setItem("loginData", JSON.stringify(userData));
      localStorage.setItem(
        "employeeId",
        String(responseData.employee_id || "")
      );
      localStorage.setItem("serverApiKey", responseData["api-key"]);

      login(userData);
      navigate("/dashboard");
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setLoading(false);
    } */
    } catch (error) {
      let message = error.message;

      // 🌐 Handle offline / network errors (common in mobile apps)
      if (
        message.includes("Failed to fetch") ||
        message.includes("NetworkError") ||
        message.includes("TypeError")
      ) {
        message =
          "🌐 No internet connection or server unreachable. Please check your network.";
      }

      setLoginError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      {/* {showConfig ? (
        // Configuration Card
        <div className={styles.loginCard}>
          <h1 className={styles.title}>Configure</h1>
          <form className={styles.form} onSubmit={handleConfiguration}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="apiDomain"
                placeholder="Enter API Domain"
                className={styles.input}
                defaultValue={currentConfig.apiDomain}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="dbName"
                placeholder="Enter DB Name"
                className={styles.input}
                defaultValue={currentConfig.dbName}
                required
              />
            </div>
            {configError && <div className={styles.error}>{configError}</div>}
            {configSuccess && (
              <div className={styles.success}>{configSuccess}</div>
            )}
            <button
              type="submit"
              className={styles.loginButton}
              disabled={configLoading}
            >
              {configLoading ? (
                <div className={styles.spinner}></div>
              ) : isConfigured ? (
                "Update Configuration"
              ) : (
                "Configure"
              )}
            </button>
            <button
              type="button"
              className={styles.backButton}
              onClick={() => setShowConfig(false)}
            >
              Back to Login
            </button>
          </form>
        </div>
      ) : ( */}
      <div className={styles.loginCard}>
        <button className={styles.gearButton} onClick={() => {}}>
          ⚙️
        </button>
        <h1 className={styles.title}>Login</h1>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              {...register("email", { required: true })}
              placeholder="Enter your email"
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="password"
              {...register("password", { required: true })}
              placeholder="Enter your password"
              className={styles.input}
              required
            />
          </div>
          {loginError && <div className={styles.error}>{loginError}</div>}
          <button
            type="submit"
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? <div className={styles.spinner}></div> : "Log-in"}
          </button>
        </form>
        <div className={styles.logoContainer}>
          <img src={logo} alt="Logo" className={styles.logo} />
        </div>
      </div>
      {/* )} */}
    </div>
  );
};

export default Auth;
