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

import Navbar from "./components/Navbar/Navbar";
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

      {/* Protected routes - only accessible when authenticated */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requireAuth={true}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <ProtectedRoute requireAuth={true}>
            <CheckIn />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manual-attendance"
        element={
          <ProtectedRoute requireAuth={true}>
            <ManualAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute requireAuth={true}>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets"
        element={
          <ProtectedRoute requireAuth={true}>
            <Navbar />
            <TicketTable />
          </ProtectedRoute>
        }
      />
      <Route
        path="/incidents"
        element={
          <ProtectedRoute requireAuth={true}>
            <Navbar />
            <Incident />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance-history"
        element={
          <ProtectedRoute requireAuth={true}>
            <AttendanceHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/expenses"
        element={
          <ProtectedRoute requireAuth={true}>
            <Expenses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/about"
        element={
          <ProtectedRoute requireAuth={true}>
            <Navbar />
            <About />
          </ProtectedRoute>
        }
      />
      <Route
        path="/center"
        element={
          <ProtectedRoute requireAuth={true}>
            <Navbar />
            <CenterPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/center/venue-infrastructure"
        element={
          <ProtectedRoute requireAuth={true}>
            <Navbar />
            <VenueInfrastructurePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/center/venue-infrastructure/readiness-checklist"
        element={
          <ProtectedRoute requireAuth={true}>
            <Navbar />
            <ExamDayReadinessChecklist />
          </ProtectedRoute>
        }
      />
      <Route
        path="/center/venue-infrastructure/sealing-checklist"
        element={
          <ProtectedRoute requireAuth={true}>
            <Navbar />
            <SealingChecklist />
          </ProtectedRoute>
        }
      />
      <Route
        path="/center/venue-infrastructure/shift-wise-checklist"
        element={
          <ProtectedRoute requireAuth={true}>
            <Navbar />
            <ShiftWiseChecklist />
          </ProtectedRoute>
        }
      />
      <Route
        path="/center/venue-infrastructure/unsealing-checklist"
        element={
          <ProtectedRoute requireAuth={true}>
            <Navbar />
            <UnsealingChecklist />
          </ProtectedRoute>
        }
      />
      <Route
        path="/expenses"
        element={
          <ProtectedRoute requireAuth={true}>
            <Navbar />
            <Expenses />
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
      <AppRoutes />
    </Router>
  );
}

export default App;
