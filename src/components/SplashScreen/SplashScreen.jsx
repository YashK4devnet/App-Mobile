import React, { useEffect } from 'react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import styles from "./SplashScreen.module.css";
import logo from "../../assets/logo.png";

const SplashScreen = () => {
  useEffect(() => {
    const setLightModeBars = async () => {
      // Only run on actual mobile devices to prevent web browser errors
      if (Capacitor.isNativePlatform()) {
        try {
          // Style.Light forces dark icons/text
          await StatusBar.setStyle({ style: Style.Light });

          // Re-enforces your webview overlay configuration
          await StatusBar.setOverlaysWebView({ overlay: true });
        } catch (error) {
          console.error("Failed to update status bar on splash load:", error);
        }
      }
    };

    setLightModeBars();
  }, []); // Empty dependency array ensures this runs immediately on mount

  return (
    <div className={styles.splashContainer}>
      <div className={styles.content}>
        <div className={styles.logoContainer}>
          <img src={logo} alt="Eduquity OP Logo" className={styles.logo} />
        </div>
        <h1 className={styles.title}>Eduquity OP</h1>
        <div className={styles.spinner}></div>
      </div>
    </div>
  );
};

export default SplashScreen;
