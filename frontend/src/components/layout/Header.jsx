import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';

// Icons
import { FiMenu, FiSun, FiMoon, FiBell, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';

const Header = ({ toggleSidebar }) => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
    if (notificationsOpen) setNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (profileOpen) setProfileOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="z-10 py-4 bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple"
            aria-label="Menu"
          >
            <FiMenu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            VitalSign Guardian
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 focus:outline-none"
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <FiSun className="w-5 h-5" />
            ) : (
              <FiMoon className="w-5 h-5" />
            )}
          </motion.button>

          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleNotifications}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 focus:outline-none relative"
              aria-label="Notifications"
            >
              <FiBell className="w-5 h-5" />
              <span className="absolute top-0 right-0 inline-block w-3 h-3 bg-red-500 rounded-full"></span>
            </motion.button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-20 overflow-hidden"
                >
                  <div className="p-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Your weekly health report is ready to view.
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          2 hours ago
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 text-center">
                    <Link to="/notifications" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                      View all notifications
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile dropdown */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleProfile}
              className="flex items-center space-x-2 focus:outline-none"
              aria-label="Account"
              aria-haspopup="true"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.name || 'User'}
              </span>
            </motion.button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-20"
                >
                  <div className="p-4 border-b dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setProfileOpen(false)}
                    >
                      <FiUser className="w-4 h-4 mr-3" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setProfileOpen(false)}
                    >
                      <FiSettings className="w-4 h-4 mr-3" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiLogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;