import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
import { AUTH_ENDPOINTS } from '../../config';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract token from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setMessage({ 
        type: 'error', 
        text: 'Reset token is missing. Please use the link from your email.' 
      });
    }
  }, [location]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password) => {
    // Password must be at least 8 characters with at least one uppercase, one lowercase, and one number
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (!validatePassword(password)) {
      setMessage({ 
        type: 'error', 
        text: 'Password must be at least 8 characters with at least one uppercase letter, one lowercase letter, and one number.' 
      });
      return;
    }
    
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      await axios.post(AUTH_ENDPOINTS.RESET_PASSWORD, { 
        token, 
        new_password: password 
      });
      
      setMessage({ 
        type: 'success', 
        text: 'Your password has been reset successfully!' 
      });
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.detail || 'An error occurred. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">Reset Password</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Create a new password for your account
            </p>
          </div>

          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg mb-6 ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-400' 
                  : 'bg-red-100 text-red-700 dark:bg-red-800/30 dark:text-red-400'
              }`}
            >
              {message.text}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Must be at least 8 characters with uppercase, lowercase, and number
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || !token}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg
                         shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
            >
              <FiArrowLeft className="mr-2" /> Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;