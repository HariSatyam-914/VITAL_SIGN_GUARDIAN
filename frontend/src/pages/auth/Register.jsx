import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiPhone, FiCalendar } from 'react-icons/fi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dob: '',
    role: 'patient',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const { register, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    
    try {
      await register(formData);
      navigate('/login', { state: { message: 'Registration successful! Please check your email to verify your account.' } });
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: error.message || 'Registration failed' });
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass dark:glass p-8 rounded-2xl shadow-xl"
      >
        <div className="text-center mb-8">
          <motion.h1 
            className="text-3xl font-bold text-gray-800 dark:text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Create Account
          </motion.h1>
          <motion.p 
            className="text-gray-600 dark:text-gray-300 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Join VitalSign Guardian
          </motion.p>
        </div>

        {errors.general && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded"
          >
            <p>{errors.general}</p>
          </motion.div>
        )}

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                1
              </div>
              <span className="text-xs mt-1 text-gray-600 dark:text-gray-300">Account</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${
              step >= 2 ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}></div>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                2
              </div>
              <span className="text-xs mt-1 text-gray-600 dark:text-gray-300">Profile</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="name">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                      errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                      errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                      errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleNextStep}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Next
              </motion.button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="phone">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                      errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="dob">
                  Date of Birth
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="text-gray-400" />
                  </div>
                  <input
                    id="dob"
                    name="dob"
                    type="date"
                    className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                      errors.dob ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </div>
                {errors.dob && <p className="mt-1 text-sm text-red-500">{errors.dob}</p>}
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`p-4 border rounded-lg cursor-pointer ${
                      formData.role === 'patient'
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    onClick={() => setFormData({ ...formData, role: 'patient' })}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="role"
                        value="patient"
                        checked={formData.role === 'patient'}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Patient
                      </label>
                    </div>
                  </div>
                  <div
                    className={`p-4 border rounded-lg cursor-pointer ${
                      formData.role === 'doctor'
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    onClick={() => setFormData({ ...formData, role: 'doctor' })}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="role"
                        value="doctor"
                        checked={formData.role === 'doctor'}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Doctor
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handlePrevStep}
                  className="w-1/2 flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? <LoadingSpinner size="small" /> : 'Register'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;