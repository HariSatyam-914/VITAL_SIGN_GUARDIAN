import React from 'react';
import { motion } from 'framer-motion';

const sizes = {
  small: 'w-5 h-5',
  medium: 'w-8 h-8',
  large: 'w-12 h-12',
};

const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizeClass = sizes[size] || sizes.medium;
  
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <motion.div
        className={`${sizeClass} rounded-full border-4 border-gray-200 dark:border-gray-700`}
        style={{
          borderTopColor: 'var(--primary)',
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
};

export default LoadingSpinner;