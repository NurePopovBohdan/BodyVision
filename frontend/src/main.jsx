import React from 'react';
import ReactDOM from 'react-dom/client';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { ToastProvider } from './components/ToastProvider.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import Admin from './pages/Admin.jsx';
import Analytics from './pages/Analytics.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Goals from './pages/Goals.jsx';
import Login from './pages/Login.jsx';
import Measurements from './pages/Measurements.jsx';
import Methodology from './pages/Methodology.jsx';
import Onboarding from './pages/Onboarding.jsx';
import PhotoProgress from './pages/PhotoProgress.jsx';
import Profile from './pages/Profile.jsx';
import Recommendations from './pages/Recommendations.jsx';
import Register from './pages/Register.jsx';
import Workouts from './pages/Workouts.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <ErrorBoundary>
        <ToastProvider>
          <AuthProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<App />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="measurements" element={<Measurements />} />
                  <Route path="goals" element={<Goals />} />
                  <Route path="recommendations" element={<Recommendations />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="photos" element={<PhotoProgress />} />
                  <Route path="workouts" element={<Workouts />} />
                  <Route path="onboarding" element={<Onboarding />} />
                  <Route path="methodology" element={<Methodology />} />
                  <Route path="admin" element={<Admin />} />
                </Route>
              </Routes>
            </Router>
          </AuthProvider>
        </ToastProvider>
      </ErrorBoundary>
    </LanguageProvider>
  </React.StrictMode>
);
