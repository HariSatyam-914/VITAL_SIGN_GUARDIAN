import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const HealthScoreDashboard = ({ score, previousScore, categories }) => {
  const [animateScore, setAnimateScore] = useState(0);
  
  useEffect(() => {
    // Animate the score from 0 to the actual value
    const timer = setTimeout(() => {
      setAnimateScore(score);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [score]);
  
  // Calculate the score change
  const scoreChange = score - previousScore;
  const scoreChangeText = scoreChange >= 0 ? `+${scoreChange}` : scoreChange;
  const scoreChangeColor = scoreChange >= 0 ? 'text-green-500' : 'text-red-500';
  
  // Determine the overall health status based on the score
  const getHealthStatus = (score) => {
    if (score >= 85) return { text: 'Excellent', color: 'text-green-500' };
    if (score >= 70) return { text: 'Good', color: 'text-blue-500' };
    if (score >= 50) return { text: 'Fair', color: 'text-yellow-500' };
    return { text: 'Needs Attention', color: 'text-red-500' };
  };
  
  const healthStatus = getHealthStatus(score);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
          Health Score Dashboard
        </h2>
        
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          {/* Main score display */}
          <div className="text-center mb-6 md:mb-0">
            <div className="relative w-40 h-40 mx-auto">
              {/* Background circle */}
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  className="dark:opacity-20"
                />
                
                {/* Progress circle */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={score >= 70 ? "#10b981" : score >= 50 ? "#3b82f6" : "#f59e0b"}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="283"
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 283 - (283 * animateScore / 100) }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              
              {/* Score text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div 
                  className="text-4xl font-bold text-gray-800 dark:text-white"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  {Math.round(animateScore)}
                </motion.div>
                <div className="text-sm text-gray-500 dark:text-gray-400">out of 100</div>
                <div className={`text-sm font-medium mt-1 ${scoreChangeColor}`}>
                  {scoreChangeText} pts
                </div>
              </div>
            </div>
            
            <div className={`mt-4 font-semibold ${healthStatus.color}`}>
              {healthStatus.text}
            </div>
          </div>
          
          {/* Category breakdown */}
          <div className="w-full md:w-1/2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Category Breakdown
            </h3>
            
            <div className="space-y-4">
              {categories.map((category, index) => (
                <div key={category.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{category.name}</span>
                    <span className="text-sm font-medium text-gray-800 dark:text-white">{category.score}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <motion.div
                      className="h-2.5 rounded-full"
                      style={{ backgroundColor: category.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${category.score}%` }}
                      transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Insights */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Key Insights
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {score >= previousScore ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3 border border-green-200 dark:border-green-800"
              >
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="text-sm font-medium text-gray-800 dark:text-white">Improvement</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Your health score has improved by {scoreChange} points since your last assessment.
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800"
              >
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="text-sm font-medium text-gray-800 dark:text-white">Attention Needed</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Your health score has decreased by {Math.abs(scoreChange)} points. Check the recommendations for improvement.
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 border border-blue-200 dark:border-blue-800"
            >
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                </svg>
                <div>
                  <div className="text-sm font-medium text-gray-800 dark:text-white">Tip</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Focus on improving your {categories.sort((a, b) => a.score - b.score)[0].name.toLowerCase()} score for the biggest overall health impact.
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex justify-between">
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
          View Detailed Analysis
        </button>
        
        <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Data
        </button>
      </div>
    </div>
  );
};

export default HealthScoreDashboard;