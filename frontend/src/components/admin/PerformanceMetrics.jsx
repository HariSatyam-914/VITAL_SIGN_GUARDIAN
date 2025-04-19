import React from 'react';
import { motion } from 'framer-motion';

const PerformanceMetrics = ({ metrics }) => {
  // Get color based on value and threshold
  const getValueColor = (value, thresholds) => {
    const { good, warning } = thresholds;
    if (value <= good) return 'text-green-600 dark:text-green-400';
    if (value <= warning) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };
  
  // Get progress bar color based on value and threshold
  const getProgressColor = (value, thresholds) => {
    const { good, warning } = thresholds;
    if (value <= good) return 'bg-green-600';
    if (value <= warning) return 'bg-yellow-600';
    return 'bg-red-600';
  };
  
  // Define thresholds for each metric
  const thresholds = {
    loadTime: { good: 1.5, warning: 3 },
    firstContentfulPaint: { good: 1, warning: 2 },
    timeToInteractive: { good: 2.5, warning: 4 },
    memoryUsage: { good: 60, warning: 80 },
    cpuUsage: { good: 30, warning: 60 }
  };
  
  // Calculate percentage for progress bars
  const getPercentage = (value, metric) => {
    switch (metric) {
      case 'loadTime':
        return Math.min((value / 5) * 100, 100); // 5s is 100%
      case 'firstContentfulPaint':
        return Math.min((value / 3) * 100, 100); // 3s is 100%
      case 'timeToInteractive':
        return Math.min((value / 6) * 100, 100); // 6s is 100%
      case 'memoryUsage':
      case 'cpuUsage':
        return value; // Already a percentage
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-4">
      {/* Load Time */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-700 dark:text-gray-300">Load Time</span>
          <span className={`text-sm font-medium ${getValueColor(metrics.loadTime, thresholds.loadTime)}`}>
            {metrics.loadTime}s
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${getPercentage(metrics.loadTime, 'loadTime')}%` }}
            transition={{ duration: 1 }}
            className={`h-2.5 rounded-full ${getProgressColor(metrics.loadTime, thresholds.loadTime)}`}
          />
        </div>
      </motion.div>
      
      {/* First Contentful Paint */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-700 dark:text-gray-300">First Contentful Paint</span>
          <span className={`text-sm font-medium ${getValueColor(metrics.firstContentfulPaint, thresholds.firstContentfulPaint)}`}>
            {metrics.firstContentfulPaint}s
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${getPercentage(metrics.firstContentfulPaint, 'firstContentfulPaint')}%` }}
            transition={{ duration: 1 }}
            className={`h-2.5 rounded-full ${getProgressColor(metrics.firstContentfulPaint, thresholds.firstContentfulPaint)}`}
          />
        </div>
      </motion.div>
      
      {/* Time to Interactive */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-700 dark:text-gray-300">Time to Interactive</span>
          <span className={`text-sm font-medium ${getValueColor(metrics.timeToInteractive, thresholds.timeToInteractive)}`}>
            {metrics.timeToInteractive}s
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${getPercentage(metrics.timeToInteractive, 'timeToInteractive')}%` }}
            transition={{ duration: 1 }}
            className={`h-2.5 rounded-full ${getProgressColor(metrics.timeToInteractive, thresholds.timeToInteractive)}`}
          />
        </div>
      </motion.div>
      
      {/* Memory Usage */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-700 dark:text-gray-300">Memory Usage</span>
          <span className={`text-sm font-medium ${getValueColor(metrics.memoryUsage, thresholds.memoryUsage)}`}>
            {metrics.memoryUsage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${metrics.memoryUsage}%` }}
            transition={{ duration: 1 }}
            className={`h-2.5 rounded-full ${getProgressColor(metrics.memoryUsage, thresholds.memoryUsage)}`}
          />
        </div>
      </motion.div>
      
      {/* CPU Usage */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-700 dark:text-gray-300">CPU Usage</span>
          <span className={`text-sm font-medium ${getValueColor(metrics.cpuUsage, thresholds.cpuUsage)}`}>
            {metrics.cpuUsage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${metrics.cpuUsage}%` }}
            transition={{ duration: 1 }}
            className={`h-2.5 rounded-full ${getProgressColor(metrics.cpuUsage, thresholds.cpuUsage)}`}
          />
        </div>
      </motion.div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Good</span>
          <span>Warning</span>
          <span>Critical</span>
        </div>
        <div className="w-full h-1.5 mt-1 rounded-full overflow-hidden flex">
          <div className="bg-green-600 flex-1"></div>
          <div className="bg-yellow-600 flex-1"></div>
          <div className="bg-red-600 flex-1"></div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;