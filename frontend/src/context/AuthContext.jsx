import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/api';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          // Token expired
          localStorage.removeItem('token');
          setUser(null);
        } else {
          // Set user from token
          setUser(decoded);
          // Set authorization header for all requests
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Invalid token', error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      setError(null);
      return user;
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send reset email');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, password) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/reset-password', { token, password });
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reset password');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (token) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/verify-email', { token });
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to verify email');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const response = await api.put('/users/profile', userData);
      setUser({ ...user, ...response.data });
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        verifyEmail,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;