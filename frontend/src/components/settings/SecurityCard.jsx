import React from 'react';
import { motion } from 'framer-motion';

const SecurityCard = ({ title, icon, children }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden h-full"
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-3">
            {icon}
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {title}
          </h2>
        </div>
        
        {children}
      </div>
    </motion.div>
  );
};

export default SecurityCard;