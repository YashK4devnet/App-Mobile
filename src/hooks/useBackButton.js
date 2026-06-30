import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import toast from "react-hot-toast";

export const useBackButton = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const lastBackPress = useRef(0);
  const backPressTimeout = useRef(null);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const handleBackButton = () => {
      const currentPath = location.pathname;
      const now = Date.now();

      // If on login screen, do nothing - let default behavior happen (app closes)
      if (currentPath === "/") {
        App.exitApp();
        return;
      }

      // If we are in the audit module subroutes, let the audit module's back handler manage it.
      if (currentPath.startsWith("/audit/")) {
        return;
      }

      // If not on dashboard, navigate to dashboard
      if (currentPath !== "/dashboard") {
        navigate("/dashboard");
        return;
      }

      // If on dashboard, handle double-tap to exit
      if (now - lastBackPress.current < 2000) {
        // Double tap detected - exit app
        App.exitApp();
      } else {
        // First tap - show message and set timer
        lastBackPress.current = now;

        // You can show a toast message here
        toast("Press back again to exit", {
          duration: 2000,
          position: "bottom-center",
        });
        // Or use a toast library: toast.show('Press back again to exit');

        // Reset after 2 seconds
        if (backPressTimeout.current) {
          clearTimeout(backPressTimeout.current);
        }

        backPressTimeout.current = setTimeout(() => {
          lastBackPress.current = 0;
        }, 2000);
      }
    };

    // Add event listener
    const listener = App.addListener("backButton", handleBackButton);

    // Cleanup
    return () => {
      listener.remove();
      if (backPressTimeout.current) {
        clearTimeout(backPressTimeout.current);
      }
    };
  }, [location.pathname, navigate]);
};
