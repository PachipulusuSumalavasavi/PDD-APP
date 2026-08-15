import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { AuthContext } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import BrowseJobsPage from './pages/BrowseJobsPage';
import ApplicationTrackerPage from './pages/ApplicationTrackerPage';
import DeadlineCalendarPage from './pages/DeadlineCalendarPage';
import StudentProfilePage from './pages/StudentProfilePage';

// Company Pages
import CompanyDashboard from './pages/CompanyDashboard';
import PostJobPage from './pages/PostJobPage';
import ManageApplicantsPage from './pages/ManageApplicantsPage';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import ManageUsersPage from './pages/ManageUsersPage';
import FeedbackPage from './pages/FeedbackPage';

const App = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const isPublicRoute = ['/', '/login', '/register'].includes(location.pathname);

  return (
    <div className="app-container">
      {user && !isPublicRoute && <Sidebar />}

      <main className={user && !isPublicRoute ? 'main-content' : 'main-content-full'}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Student Portal Routes */}
          <Route path="/student/dashboard" element={user?.role === 'student' ? <StudentDashboard /> : <Navigate to="/login" />} />
          <Route path="/student/jobs" element={user?.role === 'student' ? <BrowseJobsPage /> : <Navigate to="/login" />} />
          <Route path="/student/tracker" element={user?.role === 'student' ? <ApplicationTrackerPage /> : <Navigate to="/login" />} />
          <Route path="/student/calendar" element={user?.role === 'student' ? <DeadlineCalendarPage /> : <Navigate to="/login" />} />
          <Route path="/student/profile" element={user?.role === 'student' ? <StudentProfilePage /> : <Navigate to="/login" />} />

          {/* Company Portal Routes */}
          <Route path="/company/dashboard" element={user?.role === 'company' ? <CompanyDashboard /> : <Navigate to="/login" />} />
          <Route path="/company/post-job" element={user?.role === 'company' ? <PostJobPage /> : <Navigate to="/login" />} />
          <Route path="/company/applicants" element={user?.role === 'company' ? <ManageApplicantsPage /> : <Navigate to="/login" />} />

          {/* Admin Portal Routes */}
          <Route path="/admin/dashboard" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/admin/users" element={user?.role === 'admin' ? <ManageUsersPage /> : <Navigate to="/login" />} />
          <Route path="/admin/feedbacks" element={user?.role === 'admin' ? <FeedbackPage /> : <Navigate to="/login" />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
