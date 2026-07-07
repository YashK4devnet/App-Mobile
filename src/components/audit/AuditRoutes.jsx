import React, { Suspense, lazy, createContext } from 'react';
import { Routes, Route, useLocation, useNavigate, useResolvedPath } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { useNativeBackButton } from './hooks/useNativeBackButton';
import { useSwipeGesture } from './hooks/useSwipeGesture';
import MobileLayout from './components/MobileLayout';
import Header from './components/Header';
import BottomNav from './components/BottomNav';

import AuditDashboardPage from './pages/AuditDashboard/AuditDashboardPage';
import AuditReportsPage from './pages/AuditReports/AuditReportsPage';
import AuditSettingsPage from './pages/AuditSettings/AuditSettingsPage';

const getHeaderTitle = (pathname) => {
  if (pathname.startsWith('/audit/reports/')) {
    const venueName = decodeURIComponent(pathname.split('/audit/reports/')[1]);
    return `Reports - ${venueName}`;
  }
  if (pathname === '/audit/reports' || pathname === '/audit/reports/') return "Select a Venue";
  if (pathname === '/audit/settings' || pathname === '/audit/settings/') return "Settings";
  return "Management System";
};


const VenueAuditWizard = lazy(() => import('./pages/VenueAudit/VenueAuditWizard'));
const PowerAuditWizard = lazy(() => import('./pages/PowerAudit/PowerAuditWizard'));
const NetworkAuditWizard = lazy(() => import('./pages/NetworkAudit/NetworkAuditWizard'));
const AuditSetupFlow = lazy(() => import('./pages/AuditDashboard/components/AuditSetupFlow'));

const ModuleContext = createContext({ basePath: '/audit' });

const TAB_ROUTES = ['/audit', '/audit/reports', '/audit/settings'];

const getPathIndex = (path) => {
  let normalizedPath = path === '/audit/home' ? '/audit' : path;
  if (normalizedPath.startsWith('/audit/reports/')) {
    normalizedPath = '/audit/reports';
  }
  return TAB_ROUTES.indexOf(normalizedPath);
};

const PageTransition = ({ children, direction }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentIndex = getPathIndex(location.pathname);

  const { onTouchStart, onTouchMove, onTouchEnd, dragX, isDragging } = useSwipeGesture({
    onSwipeLeft: () => {
      if (currentIndex !== -1 && currentIndex < TAB_ROUTES.length - 1) {
        navigate(TAB_ROUTES[currentIndex + 1]);
      }
    },
    onSwipeRight: () => {
      if (currentIndex !== -1 && currentIndex > 0) {
        navigate(TAB_ROUTES[currentIndex - 1]);
      }
    }
  });

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 80 : dir < 0 ? -80 : 0,
      opacity: 0
    }),
    center: {
      x: isDragging ? dragX : 0,
      opacity: 1
    },
    exit: (dir) => ({
      x: dir > 0 ? '-100%' : dir < 0 ? '100%' : 0,
      opacity: 0
    })
  };

  return (
    <motion.div
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={isDragging ? { type: "tween", duration: 0 } : { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        touchAction: 'pan-y'
      }}
      className="h-full w-full overflow-y-auto px-5 pt-4 pb-28 scrollbar-none"
    >
      {children}
    </motion.div>
  );
};

const WizardTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="h-full w-full bg-transparent z-50 absolute top-0 left-0"
    >
      {children}
    </motion.div>
  );
};

function LoadingFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-transparent z-50 absolute top-0 left-0">
      <div className="w-8 h-8 border-4 border-[#4ecdc4]/20 border-t-[#4ecdc4] rounded-full animate-spin"></div>
    </div>
  );
}

export default function AuditRoutes() {
  useNativeBackButton();
  const location = useLocation();
  const navigate = useNavigate();
  const basePath = '/audit';

  React.useEffect(() => {
    document.body.classList.add('audit-theme');
    return () => {
      document.body.classList.remove('audit-theme');
    };
  }, []);
  
  const isAuditActive = location.pathname.includes('-audit') || location.pathname.includes('setup');

  const currentIndex = getPathIndex(location.pathname);
  const prevIndexRef = React.useRef(currentIndex);

  let direction = 0;
  if (currentIndex !== -1 && currentIndex !== prevIndexRef.current) {
    direction = currentIndex > prevIndexRef.current ? 1 : -1;
    prevIndexRef.current = currentIndex;
  }

  return (
    <ModuleContext.Provider value={{ basePath }}>
      <MobileLayout
        header={
          !isAuditActive && (
            <Header
              title={getHeaderTitle(location.pathname)}
              onMenuClick={() => console.log('Menu drawer toggled')}
              onNotificationClick={() => console.log('Notifications overlay toggled')}
              hasNotifications={true}
            />
          )
        }
        bottomNav={
          !isAuditActive && <BottomNav />
        }
      >
        <div className="relative h-full w-full overflow-hidden">
          <AnimatePresence mode="popLayout">
            <Routes location={location} key={isAuditActive ? 'audit-wizard' : currentIndex}>
            {/* Main Tabs */}
            <Route index element={<PageTransition direction={direction}><AuditDashboardPage /></PageTransition>} />
            <Route path="home" element={<PageTransition direction={direction}><AuditDashboardPage /></PageTransition>} />
            <Route path="reports" element={<PageTransition direction={direction}><AuditReportsPage hideHeader={true} /></PageTransition>} />
            <Route path="reports/:venueName" element={<PageTransition direction={direction}><AuditReportsPage hideHeader={true} /></PageTransition>} />
            <Route path="settings" element={<PageTransition direction={direction}><AuditSettingsPage /></PageTransition>} />

            {/* Audit Wizards */}
            <Route path="audit-setup/*" element={
              <WizardTransition>
                <Suspense fallback={<LoadingFallback />}>
                  <AuditSetupFlow />
                </Suspense>
              </WizardTransition>
            } />
            <Route path="venue-audit/*" element={
              <WizardTransition>
                <Suspense fallback={<LoadingFallback />}>
                  <VenueAuditWizard />
                </Suspense>
              </WizardTransition>
            } />
            <Route path="power-audit/*" element={
              <WizardTransition>
                <Suspense fallback={<LoadingFallback />}>
                  <PowerAuditWizard />
                </Suspense>
              </WizardTransition>
            } />
            <Route path="network-audit/*" element={
              <WizardTransition>
                <Suspense fallback={<LoadingFallback />}>
                  <NetworkAuditWizard />
                </Suspense>
              </WizardTransition>
            } />
          </Routes>
        </AnimatePresence>
      </div>
    </MobileLayout>
    </ModuleContext.Provider>
  );
}
