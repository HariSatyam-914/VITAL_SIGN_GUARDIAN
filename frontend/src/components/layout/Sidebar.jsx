import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';

// Icons
import { 
  FiHome, 
  FiActivity, 
  FiFileText, 
  FiCamera, 
  FiBarChart2, 
  FiSettings,
  FiUser,
  FiX,
  FiUpload,
  FiCalendar,
  FiPieChart
} from 'react-icons/fi';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useContext(AuthContext);

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <FiHome /> },
    { 
      name: 'Vitals', 
      icon: <FiActivity />,
      submenu: [
        { path: '/vitals/manual', name: 'Manual Input', icon: <FiFileText /> },
        { path: '/vitals/history', name: 'History', icon: <FiCalendar /> },
        { path: '/vitals/pdf-upload', name: 'PDF Upload', icon: <FiUpload /> },
      ]
    },
    { path: '/face-scan', name: 'Face Scan', icon: <FiCamera /> },
    { 
      name: 'Reports', 
      icon: <FiBarChart2 />,
      submenu: [
        { path: '/reports', name: 'Weekly Reports', icon: <FiFileText /> },
        { path: '/visualizations', name: 'Visualizations', icon: <FiPieChart /> },
      ]
    },
    { path: '/profile', name: 'Profile', icon: <FiUser /> },
    { path: '/settings', name: 'Settings', icon: <FiSettings /> },
  ];

  const NavItem = ({ item }) => {
    const [submenuOpen, setSubmenuOpen] = React.useState(false);

    const toggleSubmenu = (e) => {
      if (item.submenu) {
        e.preventDefault();
        setSubmenuOpen(!submenuOpen);
      }
    };

    return (
      <div className="mb-2">
        {item.submenu ? (
          <>
            <button
              onClick={toggleSubmenu}
              className="w-full flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              <span className="text-sm font-medium">{item.name}</span>
              <svg
                className={`ml-auto h-5 w-5 transform transition-transform duration-200 ${
                  submenuOpen ? 'rotate-180' : ''
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <AnimatePresence>
              {submenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="pl-10 mt-1"
                >
                  {item.submenu.map((subItem, index) => (
                    <NavLink
                      key={index}
                      to={subItem.path}
                      className={({ isActive }) =>
                        `flex items-center px-4 py-2 mt-1 text-sm ${
                          isActive
                            ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-gray-700'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700'
                        } rounded-lg transition-colors duration-200`
                      }
                      onClick={() => {
                        if (window.innerWidth < 768) {
                          toggleSidebar();
                        }
                      }}
                    >
                      <span className="mr-3 text-sm">{subItem.icon}</span>
                      <span className="text-sm">{subItem.name}</span>
                    </NavLink>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-gray-700'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700'
              } rounded-lg transition-colors duration-200`
            }
            onClick={() => {
              if (window.innerWidth < 768) {
                toggleSidebar();
              }
            }}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            <span className="text-sm font-medium">{item.name}</span>
          </NavLink>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 bg-black md:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transform md:translate-x-0 md:static md:z-0 transition-transform duration-300 ease-in-out overflow-y-auto`}
      >
        <div className="py-4">
          {/* Close button (mobile only) */}
          <div className="flex items-center justify-between px-4 mb-6 md:hidden">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">VitalSign Guardian</h2>
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-md focus:outline-none focus:shadow-outline-purple"
            >
              <FiX className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* User info */}
          <div className="px-4 mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-gray-700 flex items-center justify-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="User avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <FiUser className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white">{user?.name || 'User'}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role || 'Patient'}</p>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Health Score: 75/100</p>
          </div>

          {/* Navigation */}
          <nav className="px-2">
            {navItems.map((item, index) => (
              <NavItem key={index} item={item} />
            ))}
          </nav>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;