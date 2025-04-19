import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import AuthProvider from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';

// Main Pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Vitals Pages
import ManualVitals from './pages/vitals/ManualVitals';
import VitalsHistory from './pages/vitals/VitalsHistory';
import PdfUpload from './pages/vitals/PdfUpload';

// Face Scan Pages
import FaceScan from './pages/facescan/FaceScan';
import ScanResults from './pages/facescan/ScanResults';

// Reports Pages
import Reports from './pages/reports/Reports';
import Visualizations from './pages/reports/Visualizations';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                
                {/* Vitals Routes */}
                <Route path="/vitals/manual" element={<ManualVitals />} />
                <Route path="/vitals/history" element={<VitalsHistory />} />
                <Route path="/vitals/pdf-upload" element={<PdfUpload />} />
                
                {/* Face Scan Routes */}
                <Route path="/face-scan" element={<FaceScan />} />
                <Route path="/face-scan/results" element={<ScanResults />} />
                
                {/* Reports Routes */}
                <Route path="/reports" element={<Reports />} />
                <Route path="/visualizations" element={<Visualizations />} />
              </Route>
              
              {/* Redirect to login if not authenticated */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </AnimatePresence>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;