import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import { ThemeContext } from '../../context/ThemeContext';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode } = useContext(ThemeContext);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;