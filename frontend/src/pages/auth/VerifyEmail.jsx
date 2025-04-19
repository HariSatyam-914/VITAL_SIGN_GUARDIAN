import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiArrowLeft, FiMail } from 'react-icons/fi';
import axios from 'axios';
import { AUTH_ENDPOINTS } from '../../config';

const VerifyEmail = () => {
  const [verificationStatus, setVerificationStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      // Extract token from URL query parameters
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get('token');
      
      if (!token) {
        setVerificationStatus('error');
        setMessage('Verification token is missing. Please use the link from your email.');
        return;
      }

      try {
        const response = await axios.post(AUTH_ENDPOINTS.VERIFY_EMAIL, { token });
        setVerificationStatus('success');
        setMessage(response.data?.message || 'Your email has been successfully verified!');
        
        // Redirect to login after 5 seconds
        setTimeout(() => {
          navigate('/login');
        }, 5000);
      } catch (error) {
        setVerificationStatus('error');
        setMessage(error.response?.data?.detail || 'Email verification failed. Please try again.');
      }
    };

    verifyEmail();
  }, [location, navigate]);

  const handleResendVerification = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('Please enter your email address.');
      return;
    }

    setIsResending(true);
    
    try {
      await axios.post(`${AUTH_ENDPOINTS.VERIFY_EMAIL}/resend`, { email });
      setMessage('Verification email has been resent. Please check your inbox.');
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Failed to resend verification email. Please try again.');
    } finally {
      setIsResending(false);
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
            <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">Email Verification</h2>
          </div>

          {verificationStatus === 'loading' && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Verifying your email...</p>
            </div>
          )}

          {verificationStatus === 'success' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <FiCheckCircle className="w-20 h-20 text-green-500" />
              <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">Verification Successful!</h3>
              <p className="mt-2 text-center text-gray-600 dark:text-gray-300">{message}</p>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Redirecting to login page...</p>
            </motion.div>
          )}

          {verificationStatus === 'error' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-6"
            >
              <FiXCircle className="w-20 h-20 text-red-500" />
              <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">Verification Failed</h3>
              <p className="mt-2 text-center text-gray-600 dark:text-gray-300">{message}</p>
              
              <div className="mt-6 w-full">
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Resend Verification Email</h4>
                <form onSubmit={handleResendVerification} className="space-y-4">
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400
                                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isResending}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg
                             shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700
                             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                             disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isResending ? 'Sending...' : 'Resend Verification Email'}
                  </button>
                </form>
              </div>
            </motion.div>
          )}

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

export default VerifyEmail;