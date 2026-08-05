import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./components/Auth/Auth";
import Dashboard from "./components/Dashboard/Dashboard";
import CheckIn from "./components/Attendance/Attendance";
import Profile from "./components/Profile/Profile";
import AttendanceHistory from "./components/AttendanceHistory/AttendanceHistory";
import Expenses from "./components/Expenses/Expenses";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import ManualAttendance from "./components/ManualAttendance/ManualAttendance";
import AuditRoutes from './components/audit/AuditRoutes';
import SyncManager from './components/audit/components/SyncManager';
import MainLayout from "./components/Layout/MainLayout";

import Incident from "./components/Incidents/Incident";
import TicketTable from "./components/Tickets/TicketTable";
import About from "./components/About/About";
import { useBackButton } from "./hooks/useBackButton";
import { Toaster } from "react-hot-toast";
import CenterPage from "./components/Center/Page/CenterPage";
import VenueInfrastructurePage from "./components/Center/VenueInfrastructure/Page/VenueInfrastructurePage";
import ExamDayReadinessChecklist from "./components/Center/VenueInfrastructure/ExamDayReadinessChecklist/ExamDayReadinessChecklist";
import SealingChecklist from "./components/Center/VenueInfrastructure/VenueSealingChecklist/SealingChecklist";
import ShiftWiseChecklist from "./components/Center/VenueInfrastructure/VenueShiftWiseChecklist/ShiftWiseChecklist";
import UnsealingChecklist from "./components/Center/VenueInfrastructure/VenueUnsealingChecklist/UnsealingChecklist";

function AppRoutes() {
  useBackButton();
  return (
    <Routes>
      {/* Public route - only accessible when not authenticated */}
      <Route
        path="/"
        element={
          <ProtectedRoute requireAuth={false}>
            <Auth />
          </ProtectedRoute>
        }
      />

      {/* Protected main app routes wrapped in MainLayout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requireAuth={true}>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <ProtectedRoute requireAuth={true}>
            <MainLayout>
              <CheckIn />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manual-attendance"
        element={
          <ProtectedRoute requireAuth={true}>
            <MainLayout>
              <ManualAttendance />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute requireAuth={true}>
            <MainLayout>
              <Profile />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets"
        element={
          <ProtectedRoute requireAuth={true}>
            <MainLayout>
              <TicketTable />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/incidents"
        element={
          <ProtectedRoute requireAuth={true}>
            <MainLayout>
              <Incident />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance-history"
        element={
          <ProtectedRoute requireAuth={true}>
            <MainLayout>
              <AttendanceHistory />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/expenses"
        element={
          <ProtectedRoute requireAuth={true}>
            <MainLayout>
              <Expenses />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Audit routes - manages its own AuditLayout */}
      <Route
        path="/audit/*"
        element={
          <ProtectedRoute requireAuth={true}>
            <AuditRoutes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/about"
        element={
          <ProtectedRoute requireAuth={true}>
            <MainLayout>
              <About />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/center"
        element={
          <ProtectedRoute requireAuth={true}>
            <MainLayout>
              <CenterPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/center/venue-infrastructure"
        element={
          <ProtectedRoute requireAuth={true}>
            <MainLayout>
              <VenueInfrastructurePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/center/venue-infrastructure/readiness-checklist"
        element={
          <ProtectedRoute requireAuth={true}>
            <MainLayout>
              <ExamDayReadinessChecklist />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/center/venue-infrastructure/sealing-checklist"
        element={
          <ProtectedRoute requireAuth={true}>
            <MainLayout>
              <SealingChecklist />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/center/venue-infrastructure/shift-wise-checklist"
        element={
          <ProtectedRoute requireAuth={true}>
            <MainLayout>
              <ShiftWiseChecklist />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/center/venue-infrastructure/unsealing-checklist"
        element={
          <ProtectedRoute requireAuth={true}>
            <MainLayout>
              <UnsealingChecklist />
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <Toaster />
      <SyncManager />
      <AppRoutes />
    </Router>
  );
}

export default App;
