import React from 'react';
import { motion } from 'framer-motion';

const ReportCard = ({ report }) => {
  const { id, title, date, type, highlights, recommendations, status } = report;
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get report type color
  const getTypeColor = (type) => {
    switch (type) {
      case 'weekly':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'monthly':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'quarterly':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  // Get status badge
  const getStatusBadge = (status) => {
    if (status === 'generated') {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          Ready
        </span>
      );
    }
    
    return (
      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
        Scheduled
      </span>
    );
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
              {title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(date)}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(type)}`}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
            {getStatusBadge(status)}
          </div>
        </div>
        
        {status === 'generated' && (
          <>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Highlights
              </h4>
              <ul className="space-y-1">
                {highlights.map((highlight, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Recommendations
              </h4>
              <ul className="space-y-1">
                {recommendations.map((recommendation, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
        
        {status === 'scheduled' && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                This report is scheduled to be generated soon.
              </p>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex justify-between">
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
          View Full Report
        </button>
        
        <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PDF
        </button>
      </div>
    </motion.div>
  );
};

export default ReportCard;