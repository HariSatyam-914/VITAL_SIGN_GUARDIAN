/**
 * Configuration file for the VitalSign Guardian frontend
 * Contains API URLs and other configuration settings
 */

// API base URL - defaults to localhost if not set in environment
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_URL}/auth/login`,
  REGISTER: `${API_URL}/auth/register`,
  VERIFY_EMAIL: `${API_URL}/auth/verify-email`,
  FORGOT_PASSWORD: `${API_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${API_URL}/auth/reset-password`,
  REFRESH_TOKEN: `${API_URL}/auth/refresh-token`,
};

// Vitals endpoints
export const VITALS_ENDPOINTS = {
  MANUAL_INPUT: `${API_URL}/vitals/manual`,
  HISTORY: `${API_URL}/vitals/history`,
  PDF_UPLOAD: `${API_URL}/vitals/pdf-upload`,
  FACE_SCAN: `${API_URL}/vitals/face-scan`,
};

// Reports endpoints
export const REPORTS_ENDPOINTS = {
  WEEKLY: `${API_URL}/reports/weekly`,
  VISUALIZATIONS: `${API_URL}/reports/visualizations`,
};

// User endpoints
export const USER_ENDPOINTS = {
  PROFILE: `${API_URL}/users/profile`,
  SETTINGS: `${API_URL}/users/settings`,
};

// JWT token configuration
export const JWT_CONFIG = {
  TOKEN_KEY: 'vsg_auth_token',
  REFRESH_KEY: 'vsg_refresh_token',
};

// Application settings
export const APP_CONFIG = {
  APP_NAME: 'VitalSign Guardian',
  SUPPORT_EMAIL: 'support@vitalsignguardian.com',
  VERSION: '0.1.0',
};

export default {
  API_URL,
  AUTH_ENDPOINTS,
  VITALS_ENDPOINTS,
  REPORTS_ENDPOINTS,
  USER_ENDPOINTS,
  JWT_CONFIG,
  APP_CONFIG,
};