import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../store/AppContext";
import styles from "./Auth.module.css";
import logo from "../../assets/Eduquity25.jpg";
import { useState } from "react";
import { SparklesIcon, MailIcon, LockIcon } from "../Navbar/NavbarIcons";

const Auth = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { login } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const onSubmit = async (data) => {
    setLoginError("");
    setLoading(true);

    try {
      const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://erp.eduquity.com';
      const baseUrl = rawBaseUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');
      const loginEndpoint = (import.meta.env.VITE_LOGIN_ENDPOINT || '/odoo_connect').replace(/^\/+/, '');
      const dbName = import.meta.env.VITE_API_DB || "erp-eduquity-com";

      const response = await fetch(`${baseUrl}/${loginEndpoint}`, {
        method: "GET",
        headers: {
          action: "login",
          login: data.email.trim(), // keep as typed (no lowercase)
          password: data.password,
          db: dbName,
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
      } catch {
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

      // Normalize response status and verify auth success
      const statusValue = String(responseData?.Status || responseData?.status || responseData?.message || "").trim().toLowerCase();
      const hasApiKey = Boolean(responseData?.["api-key"] || responseData?.["api_key"]);
      const isAuthSuccessful =
        statusValue === "auth successful" ||
        statusValue === "success" ||
        statusValue === "authentication successful" ||
        (hasApiKey && Boolean(responseData?.UserID || responseData?.user_id || responseData?.employee_id || responseData?.partner_id || responseData?.user || responseData?.User));

      if (/already login/i.test(statusValue)) {
        throw new Error(
          "⚠️ You're already logged in on another device or session. Please log out there first or contact support."
        );
      }

      // If JSON and auth successful
      if (responseData && isAuthSuccessful) {
        const apiKey = responseData["api-key"] || responseData["api_key"] || "";
        const userId = responseData.UserID || responseData.user_id || responseData.id || responseData.uid;
        const employeeId = responseData.employee_id || responseData.partner_id || responseData.user_id || userId;
        const userName = responseData.User || responseData.user || responseData.name || "User";

        const userData = {
          name: userName,
          email: data.email.trim(),
          password: data.password,
          ["api-Key"]: apiKey,
          ["api-key"]: apiKey,
          Id: userId,
          user_id: responseData.user_id || userId,
          partner_id: responseData.partner_id,
          employeeId: employeeId,
          employee_email: responseData.work_email || responseData.employee_email,
          employee_phone: responseData.work_phone || responseData.employee_phone,
          employee_latitude: responseData.employee_latitude,
          employee_longitude: responseData.employee_longitude,
          employee_department: responseData.department_id,
          employee_post: responseData.job_id,
          employee_assigned_project: responseData?.active_project ?? responseData?.assigned_project ?? "None",
          employee_assigned_venue: responseData?.active_venue ?? "None",
          employee_code: responseData?.employee_code ?? "None",
          skip_location: responseData?.skip_location ?? false,
          project_id: responseData.project_id,
          venue_id: responseData.venue_id,
          city_id: responseData.city_id,
          state_id: responseData.state_id,
        };

        localStorage.setItem("loginData", JSON.stringify(userData));
        localStorage.setItem(
          "employeeId",
          String(employeeId || "")
        );
        localStorage.setItem("serverApiKey", apiKey);

        login(userData);
        navigate("/dashboard");
        return;
      } else {
        throw new Error(
          responseData?.message || responseData?.error || "❌ Invalid login. Please try again."
        );
      }
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
      <div className={styles.loginCard}>
        {/* Brand Header Badge */}
        <div className={styles.brandHeader}>
          <div className={styles.brandIcon}>
            <SparklesIcon className={styles.sparkleSvg} />
          </div>
          <div>
            <span className={styles.brandBadge}>EDUQUITY</span>
            <h1 className={styles.title}>Sign In</h1>
          </div>
        </div>

        <p className={styles.subtitle}>Welcome back! Enter your account details to access your dashboard.</p>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email / Username</label>
            <div className={styles.inputWrapper}>
              <MailIcon className={styles.fieldIcon} />
              <input
                type="text"
                {...register("email", { required: true })}
                placeholder="Enter your email"
                className={styles.input}
                required
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <LockIcon className={styles.fieldIcon} />
              <input
                type="password"
                {...register("password", { required: true })}
                placeholder="Enter your password"
                className={styles.input}
                required
              />
            </div>
          </div>

          {loginError && <div className={styles.error}>{loginError}</div>}

          <button
            type="submit"
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? (
              <div className={styles.buttonLoading}>
                <div className={styles.jumpingDots}>
                  <span className={styles.dot}></span>
                  <span className={styles.dot}></span>
                  <span className={styles.dot}></span>
                </div>
              </div>
            ) : (
              "Log-in"
            )}
          </button>
        </form>

        {/* Original Logo Kept in Place */}
        <div className={styles.logoContainer}>
          <img src={logo} alt="Logo" className={styles.logo} />
        </div>
      </div>
    </div>
  );
};

export default Auth;

