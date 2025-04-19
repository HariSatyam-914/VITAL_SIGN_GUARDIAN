import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
import { AUTH_ENDPOINTS } from '../../config';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
      setMessage({ 
        type: 'success', 
        text: 'Password reset instructions have been sent to your email.' 
      });
      setEmail('');
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
            <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">Forgot Password</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Enter your email address and we'll send you instructions to reset your password.
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg
                         shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
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

export default ForgotPassword;