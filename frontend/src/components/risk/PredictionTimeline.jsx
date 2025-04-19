import React from 'react';
import { motion } from 'framer-motion';

const PredictionTimeline = ({ predictions }) => {
  const { shortTerm, mediumTerm, longTerm } = predictions;
  
  // Get confidence color
  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // Format confidence as percentage
  const formatConfidence = (confidence) => {
    return `${Math.round(confidence * 100)}%`;
  };

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600" />
      
      {/* Short term prediction */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="relative mb-8 pl-16"
      >
        <div className="absolute left-0 w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
          <span className="text-blue-600 dark:text-blue-300 text-sm font-medium">1 Week</span>
        </div>
        
        <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Short-term Outlook
          </h4>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            {shortTerm.prediction}
          </p>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">Confidence:</span>
            <span className={`ml-2 text-sm font-medium ${getConfidenceColor(shortTerm.confidence)}`}>
              {formatConfidence(shortTerm.confidence)}
            </span>
          </div>
        </div>
      </motion.div>
      
      {/* Medium term prediction */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative mb-8 pl-16"
      >
        <div className="absolute left-0 w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
          <span className="text-purple-600 dark:text-purple-300 text-sm font-medium">1 Month</span>
        </div>
        
        <div className="bg-purple-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Medium-term Projection
          </h4>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            {mediumTerm.prediction}
          </p>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">Confidence:</span>
            <span className={`ml-2 text-sm font-medium ${getConfidenceColor(mediumTerm.confidence)}`}>
              {formatConfidence(mediumTerm.confidence)}
            </span>
          </div>
        </div>
      </motion.div>
      
      {/* Long term prediction */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative pl-16"
      >
        <div className="absolute left-0 w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
          <span className="text-indigo-600 dark:text-indigo-300 text-sm font-medium">3 Months</span>
        </div>
        
        <div className="bg-indigo-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Long-term Forecast
          </h4>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            {longTerm.prediction}
          </p>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">Confidence:</span>
            <span className={`ml-2 text-sm font-medium ${getConfidenceColor(longTerm.confidence)}`}>
              {formatConfidence(longTerm.confidence)}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PredictionTimeline;