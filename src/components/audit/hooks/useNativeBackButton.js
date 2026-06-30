import { useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { useLocation, useNavigate } from 'react-router-dom';

export function useNativeBackButton() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Intercept native hardware back button using Capacitor App plugin
    let backButtonListener = null;
    try {
      backButtonListener = CapacitorApp.addListener('backButton', () => {
        const path = location.pathname;
        const isDashboard = path === '/audit' || path === '/audit/home' || path === '/audit/';
        
        if (isDashboard) {
          navigate('/dashboard');
        } else {
          navigate(-1);
        }
      });
    } catch (e) {
      console.log('Capacitor App plugin backButton listener failed', e);
    }

    return () => {
      if (backButtonListener) {
        backButtonListener.then(listener => listener.remove()).catch(() => {});
      }
    };
  }, [location.pathname, navigate]);
}
