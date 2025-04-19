import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { FiSettings, FiBell, FiLock, FiToggleRight, FiToggleLeft, FiSave } from 'react-icons/fi';
import axios from 'axios';
import { USER_ENDPOINTS } from '../config';
import { ThemeContext } from '../context/ThemeContext';
import DashboardLayout from '../components/layouts/DashboardLayout';

const Settings = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [settings, setSettings] = useState({
    emailNotifications: {
      weeklyReports: true,
      healthAlerts: true,
      systemUpdates: false,
    },
    privacy: {
      shareDataForResearch: false,
      allowAnonymousDataCollection: true,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30, // minutes
    },
    appearance: {
      theme: theme,
      compactMode: false,
      highContrastMode: false,
    },
    units: {
      temperature: 'celsius',
      weight: 'kg',
      height: 'cm',
      bloodPressure: 'mmHg',
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(USER_ENDPOINTS.SETTINGS);
        setSettings(response.data);
      } catch (err) {
        setError('Failed to load settings. Please try again later.');
        console.error('Error fetching settings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Update theme in settings when theme context changes
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        theme: theme
      }
    }));
  }, [theme]);

  const handleToggle = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const handleSelectChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      await axios.put(USER_ENDPOINTS.SETTINGS, settings);
      setSuccessMessage('Settings saved successfully!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save settings. Please try again.');
      console.error('Error saving settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Settings</h1>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <FiSave className="mr-2" /> {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 dark:bg-red-800/30 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-400 rounded-lg">
              {successMessage}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Notifications */}
            <div className="neumorphic p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <FiBell className="mr-2" /> Notifications
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">Weekly Health Reports</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive weekly summary of your health data</p>
                  </div>
                  <button 
                    onClick={() => handleToggle('emailNotifications', 'weeklyReports')}
                    className="text-2xl text-indigo-600 dark:text-indigo-400"
                  >
                    {settings.emailNotifications.weeklyReports ? <FiToggleRight /> : <FiToggleLeft />}
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">Health Alerts</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Get notified about critical health changes</p>
                  </div>
                  <button 
                    onClick={() => handleToggle('emailNotifications', 'healthAlerts')}
                    className="text-2xl text-indigo-600 dark:text-indigo-400"
                  >
                    {settings.emailNotifications.healthAlerts ? <FiToggleRight /> : <FiToggleLeft />}
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">System Updates</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications about app updates</p>
                  </div>
                  <button 
                    onClick={() => handleToggle('emailNotifications', 'systemUpdates')}
                    className="text-2xl text-indigo-600 dark:text-indigo-400"
                  >
                    {settings.emailNotifications.systemUpdates ? <FiToggleRight /> : <FiToggleLeft />}
                  </button>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="neumorphic p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <FiLock className="mr-2" /> Security
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
                  </div>
                  <button 
                    onClick={() => handleToggle('security', 'twoFactorAuth')}
                    className="text-2xl text-indigo-600 dark:text-indigo-400"
                  >
                    {settings.security.twoFactorAuth ? <FiToggleRight /> : <FiToggleLeft />}
                  </button>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white mb-2">Session Timeout</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Automatically log out after inactivity</p>
                  <select
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleSelectChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                    <option value={240}>4 hours</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Privacy */}
            <div className="neumorphic p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Privacy
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">Share Data for Research</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Allow anonymized data to be used for health research</p>
                  </div>
                  <button 
                    onClick={() => handleToggle('privacy', 'shareDataForResearch')}
                    className="text-2xl text-indigo-600 dark:text-indigo-400"
                  >
                    {settings.privacy.shareDataForResearch ? <FiToggleRight /> : <FiToggleLeft />}
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">Anonymous Data Collection</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Allow collection of anonymous usage data to improve the app</p>
                  </div>
                  <button 
                    onClick={() => handleToggle('privacy', 'allowAnonymousDataCollection')}
                    className="text-2xl text-indigo-600 dark:text-indigo-400"
                  >
                    {settings.privacy.allowAnonymousDataCollection ? <FiToggleRight /> : <FiToggleLeft />}
                  </button>
                </div>
              </div>
            </div>

            {/* Appearance */}
            <div className="neumorphic p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <FiSettings className="mr-2" /> Appearance
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">Dark Mode</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark theme</p>
                  </div>
                  <button 
                    onClick={handleThemeToggle}
                    className="text-2xl text-indigo-600 dark:text-indigo-400"
                  >
                    {theme === 'dark' ? <FiToggleRight /> : <FiToggleLeft />}
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">Compact Mode</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Reduce spacing to show more content</p>
                  </div>
                  <button 
                    onClick={() => handleToggle('appearance', 'compactMode')}
                    className="text-2xl text-indigo-600 dark:text-indigo-400"
                  >
                    {settings.appearance.compactMode ? <FiToggleRight /> : <FiToggleLeft />}
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">High Contrast Mode</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Increase contrast for better readability</p>
                  </div>
                  <button 
                    onClick={() => handleToggle('appearance', 'highContrastMode')}
                    className="text-2xl text-indigo-600 dark:text-indigo-400"
                  >
                    {settings.appearance.highContrastMode ? <FiToggleRight /> : <FiToggleLeft />}
                  </button>
                </div>
              </div>
            </div>

            {/* Units */}
            <div className="neumorphic p-6 lg:col-span-2">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Measurement Units
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white mb-2">Temperature</h3>
                  <select
                    value={settings.units.temperature}
                    onChange={(e) => handleSelectChange('units', 'temperature', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="celsius">Celsius (°C)</option>
                    <option value="fahrenheit">Fahrenheit (°F)</option>
                  </select>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white mb-2">Weight</h3>
                  <select
                    value={settings.units.weight}
                    onChange={(e) => handleSelectChange('units', 'weight', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="lb">Pounds (lb)</option>
                  </select>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white mb-2">Height</h3>
                  <select
                    value={settings.units.height}
                    onChange={(e) => handleSelectChange('units', 'height', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="cm">Centimeters (cm)</option>
                    <option value="ft">Feet/Inches (ft/in)</option>
                  </select>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white mb-2">Blood Pressure</h3>
                  <select
                    value={settings.units.bloodPressure}
                    onChange={(e) => handleSelectChange('units', 'bloodPressure', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="mmHg">mmHg</option>
                    <option value="kPa">kPa</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;