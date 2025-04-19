import React from 'react';
import { motion } from 'framer-motion';

const TestStatusCard = ({ title, count, icon, color, subtitle }) => {
  // Get color classes based on color prop
  const getColorClasses = (color) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          border: 'border-blue-200 dark:border-blue-800',
          text: 'text-blue-600 dark:text-blue-400',
          iconBg: 'bg-blue-500'
        };
      case 'green':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          border: 'border-green-200 dark:border-green-800',
          text: 'text-green-600 dark:text-green-400',
          iconBg: 'bg-green-500'
        };
      case 'red':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-600 dark:text-red-400',
          iconBg: 'bg-red-500'
        };
      case 'purple':
        return {
          bg: 'bg-purple-100 dark:bg-purple-900/30',
          border: 'border-purple-200 dark:border-purple-800',
          text: 'text-purple-600 dark:text-purple-400',
          iconBg: 'bg-purple-500'
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-700',
          border: 'border-gray-200 dark:border-gray-600',
          text: 'text-gray-600 dark:text-gray-400',
          iconBg: 'bg-gray-500'
        };
    }
  };
  
  const colorClasses = getColorClasses(color);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`${colorClasses.bg} rounded-xl border ${colorClasses.border} p-6`}
    >
      <div className="flex items-center">
        <div className={`w-12 h-12 rounded-full ${colorClasses.iconBg} flex items-center justify-center text-white mr-4`}>
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {subtitle}
          </p>
        </div>
      </div>
      <div className={`text-4xl font-bold mt-4 ${colorClasses.text}`}>
        {count}
      </div>
    </motion.div>
  );
};

export default TestStatusCard;