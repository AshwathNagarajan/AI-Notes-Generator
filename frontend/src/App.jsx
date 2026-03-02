import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import Voice from './pages/Voice';
import PDF from './pages/PDF';
import Quiz from './pages/Quiz';
import MindMap from './pages/MindMap';
import History from './pages/History';
import Image from './pages/Image';
import Profile from './pages/Profile';
import KnowledgeGapRadar from './pages/KnowledgeGapRadar';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';

// Protected Route Component - Restricts access to dashboard and all user routes
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Admin Protected Route Component - Restricts access to admin dashboard
const AdminProtectedRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');

  // Redirect to admin login if admin token is not present
  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

// Catch-all Route - Redirects unmatched routes to login
const CatchAllRoute = () => {
  return <Navigate to="/login" replace />;
};

// App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Protected Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminProtectedRoute>
            <UserManagement />
          </AdminProtectedRoute>
        }
      />

      {/* User Protected Routes - Dashboard and all sub-paths */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="notes" element={<Notes />} />
        <Route path="voice" element={<Voice />} />
        <Route path="pdf" element={<PDF />} />
        <Route path="quiz" element={<Quiz />} />
        <Route path="mindmap" element={<MindMap />} />
        <Route path="image" element={<Image />} />
        <Route path="history" element={<History />} />
        <Route path="knowledge-gap-radar" element={<KnowledgeGapRadar />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Catch-all Route - Redirects any unmatched URLs to login */}
      <Route path="*" element={<CatchAllRoute />} />
    </Routes>
  );
};

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App; 