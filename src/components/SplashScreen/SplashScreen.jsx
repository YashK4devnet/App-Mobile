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
          // Style.Light forces dark icons/text over status bar
          await StatusBar.setStyle({ style: Style.Light });
          // Re-enforces your webview overlay configuration
          await StatusBar.setOverlaysWebView({ overlay: true });
        } catch (error) {
          console.error("Failed to update status bar on splash load:", error);
        }
      }
    };

    setLightModeBars();
  }, []);

  return (
    <div className={styles.splashContainer}>
      {/* Orange Background Waves */}
      <div className={styles.waveContainer}>
        <div className={`${styles.wave} ${styles.wave1}`}></div>
        <div className={`${styles.wave} ${styles.wave2}`}></div>
        <div className={`${styles.wave} ${styles.wave3}`}></div>
      </div>

      {/* Dead-Centered Logo for Seamless Native Hand-off */}
      <div className={styles.logoContainer}>
        <img src={logo} alt="Eduquity OP Logo" className={styles.logo} />
      </div>

      {/* App Title & Loading Animation Below Logo */}
      <div className={styles.bottomContent}>
        <h1 className={styles.title}>Eduquity OP</h1>
      </div>
    </div>
  );
};

export default SplashScreen;
