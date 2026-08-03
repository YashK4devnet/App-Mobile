import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { StatusBar } from "@capacitor/status-bar";
import { useAppContext } from "../../store/AppContext";
import styles from "./Navbar.module.css";
import {
  HomeIcon,
  ClockIcon,
  ManualEditIcon,
  HistoryIcon,
  AlertIcon,
  TicketIcon,
  UserIcon,
  LogoutIcon,
  ChevronDownIcon,
  SparklesIcon,
  InfoIcon,
} from "./NavbarIcons";

const Navbar = () => {
  const [isAttendanceDropdownOpen, setIsAttendanceDropdownOpen] = useState(false);
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { logout, user } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      StatusBar.setOverlaysWebView({ overlay: true });
    } catch (e) {
      // Ignore if not in Capacitor native context
    }

    const statusBarHeight = 24;
    document.documentElement.style.setProperty(
      "--android-statusbar-height",
      statusBarHeight + "px"
    );
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setIsAttendanceDropdownOpen(false);
    setIsMenuDropdownOpen(false);
  };

  const toggleInfoPage = () => {
    if (location.pathname === "/about") {
      navigate(-1);
    } else {
      navigate("/about");
    }
  };

  const initiateLogout = () => {
    setShowLogoutConfirmation(true);
  };

  const confirmLogout = async (confirmed) => {
    if (confirmed) {
      setIsLoggingOut(true);
      try {
        await logout();
        navigate("/");
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        setIsLoggingOut(false);
        setShowLogoutConfirmation(false);
      }
    } else {
      setShowLogoutConfirmation(false);
    }
  };

  const getHeaderText = () => {
    const path = location.pathname;
    if (path === "/dashboard" || path === "/") return "Dashboard";
    if (path === "/attendance") return "Attendance";
    if (path === "/manual-attendance") return "Manual Attendance";
    if (path === "/attendance-history") return "Attendance History";
    if (path === "/expenses") return "Expenses";
    if (path === "/profile") return "User Profile";
    if (path === "/incidents") return "Incidents";
    if (path === "/tickets") return "Support Tickets";
    if (path === "/about") return "About System";
    return "Management System";
  };

  const mobileNavItems = [
    { id: "home", path: "/dashboard", label: "Home", icon: HomeIcon },
    { id: "attendance", path: "/attendance", label: "Attendance", icon: ClockIcon },
    { id: "incidents", path: "/incidents", label: "Incidents", icon: AlertIcon },
    { id: "profile", path: "/profile", label: "Profile", icon: UserIcon },
  ];

  const getActiveMobileIndex = () => {
    const path = location.pathname;
    if (path === "/dashboard" || path === "/") return 0;
    if (path.startsWith("/attendance") || path === "/manual-attendance" || path === "/attendance-history") return 1;
    if (path.startsWith("/incidents") || path.startsWith("/tickets")) return 2;
    if (path.startsWith("/profile")) return 3;
    return 0;
  };

  const activeMobileIndex = getActiveMobileIndex();

  return (
    <>
      {/* Logout Confirmation Modal */}
      {showLogoutConfirmation && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeaderIcon}>
              <LogoutIcon className="w-8 h-8 text-[#FF6B6B]" />
            </div>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to end your session ({user?.name || "User"})?</p>
            {isLoggingOut ? (
              <div className={styles.loadingSpinner}>
                <div className={styles.spinner}></div>
                <p>Signing out securely...</p>
              </div>
            ) : (
              <div className={styles.modalButtons}>
                <button
                  className={styles.cancelButton}
                  onClick={() => confirmLogout(false)}
                >
                  Cancel
                </button>
                <button
                  className={styles.confirmButton}
                  onClick={() => confirmLogout(true)}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Top Glassmorphic Navbar Header */}
      <header className={styles.navbar}>
        {/* Brand & Page Title Section */}
        <div className={styles.logoSection}>
          <div className={styles.brandContainer}>
            <div className={styles.brandIcon}>
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className={styles.brandBadge}>EDUQUITY</span>
              <h1 className={styles.title}>{getHeaderText()}</h1>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          <div className={styles.navLinks}>
            {/* Dashboard */}
            <button
              className={`${styles.navLink} ${
                location.pathname === "/dashboard" ? styles.activeNavLink : ""
              }`}
              onClick={() => handleNavigation("/dashboard")}
            >
              <HomeIcon className={styles.navIcon} />
              <span>Dashboard</span>
            </button>

            {/* Attendance Dropdown */}
            <div className={styles.dropdownContainer}>
              <button
                className={`${styles.navLink} ${
                  location.pathname.startsWith("/attendance") ||
                  location.pathname === "/manual-attendance" ||
                  location.pathname === "/attendance-history"
                    ? styles.activeNavLink
                    : ""
                }`}
                onClick={() =>
                  setIsAttendanceDropdownOpen(!isAttendanceDropdownOpen)
                }
              >
                <ClockIcon className={styles.navIcon} />
                <span>Attendance</span>
                <ChevronDownIcon
                  className={`${styles.arrow} ${
                    isAttendanceDropdownOpen ? styles.arrowUp : ""
                  }`}
                />
              </button>

              {isAttendanceDropdownOpen && (
                <div className={styles.dropdown}>
                  <button
                    className={styles.dropdownItem}
                    onClick={() => handleNavigation("/attendance")}
                  >
                    <ClockIcon className="w-4 h-4 text-[#4ECDC4]" />
                    <span>Regular Attendance</span>
                  </button>
                  <button
                    className={styles.dropdownItem}
                    onClick={() => handleNavigation("/manual-attendance")}
                  >
                    <ManualEditIcon className="w-4 h-4 text-[#4ECDC4]" />
                    <span>Manual Attendance</span>
                  </button>
                  <button
                    className={styles.dropdownItem}
                    onClick={() => handleNavigation("/attendance-history")}
                  >
                    <HistoryIcon className="w-4 h-4 text-[#4ECDC4]" />
                    <span>Attendance History</span>
                  </button>
                </div>
              )}
            </div>

            {/* Incidents & Tickets Dropdown */}
            <div className={styles.dropdownContainer}>
              <button
                className={`${styles.navLink} ${
                  location.pathname.startsWith("/incidents") ||
                  location.pathname.startsWith("/tickets")
                    ? styles.activeNavLink
                    : ""
                }`}
                onClick={() => setIsMenuDropdownOpen(!isMenuDropdownOpen)}
              >
                <AlertIcon className={styles.navIcon} />
                <span>Incidents</span>
                <ChevronDownIcon
                  className={`${styles.arrow} ${
                    isMenuDropdownOpen ? styles.arrowUp : ""
                  }`}
                />
              </button>

              {isMenuDropdownOpen && (
                <div className={styles.dropdown}>
                  <button
                    className={styles.dropdownItem}
                    onClick={() => handleNavigation("/incidents")}
                  >
                    <AlertIcon className="w-4 h-4 text-[#4ECDC4]" />
                    <span>Incidents Overview</span>
                  </button>
                  <button
                    className={styles.dropdownItem}
                    onClick={() => handleNavigation("/tickets")}
                  >
                    <TicketIcon className="w-4 h-4 text-[#4ECDC4]" />
                    <span>Support Tickets</span>
                  </button>
                </div>
              )}
            </div>

            {/* Profile Link */}
            <button
              className={`${styles.navLink} ${
                location.pathname === "/profile" ? styles.activeNavLink : ""
              }`}
              onClick={() => handleNavigation("/profile")}
            >
              <UserIcon className={styles.navIcon} />
              <span>Profile</span>
            </button>
          </div>

          {/* Info Icon + Explicit Logout Button in Desktop Header */}
          <div className={styles.headerActions}>
            <button
              className={`${styles.infoHeaderBtn} ${
                location.pathname === "/about" ? styles.activeInfoHeaderBtn : ""
              }`}
              onClick={toggleInfoPage}
              title={location.pathname === "/about" ? "Close Info" : "About System"}
            >
              <InfoIcon className="w-4.5 h-4.5 text-white/80" />
            </button>
            <button
              className={styles.logoutHeaderBtn}
              onClick={initiateLogout}
              title="Logout"
            >
              <LogoutIcon className="w-4 h-4 text-[#FF6B6B]" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Header Right Section with Info + Logout Buttons */}
        <div className={styles.mobileHeaderRight}>
          <button
            className={`${styles.mobileInfoHeaderBtn} ${
              location.pathname === "/about" ? styles.activeInfoHeaderBtn : ""
            }`}
            onClick={toggleInfoPage}
            aria-label={location.pathname === "/about" ? "Close Info" : "About System"}
          >
            <InfoIcon className="w-5 h-5 text-white/80" />
          </button>
          <button
            className={styles.mobileLogoutHeaderBtn}
            onClick={initiateLogout}
            aria-label="Logout"
          >
            <LogoutIcon className="w-5 h-5 text-[#FF6B6B]" />
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (4 clean tabs with non-clipping sliding pill) */}
      <nav className={styles.mobileBottomNav}>
        <div className={styles.mobileBottomNavContainer}>
          {/* Sliding Glass Pill Background */}
          <div
            className={styles.slidingPill}
            style={{ transform: `translateX(${activeMobileIndex * 100}%)` }}
          >
            <div className={styles.slidingPillInner} />
          </div>

          {mobileNavItems.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = activeMobileIndex === index;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`${styles.mobileNavItem} ${
                  isActive ? styles.activeMobileNavItem : ""
                }`}
              >
                <IconComponent className={styles.mobileNavIcon} />
                <span className={styles.mobileNavLabel}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
