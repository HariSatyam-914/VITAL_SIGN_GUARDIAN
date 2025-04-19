import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const RiskFactorsChart = ({ factors }) => {
  const chartRef = useRef(null);
  
  // Sort factors by score for better visualization
  const sortedFactors = [...factors].sort((a, b) => b.score - a.score);
  
  // Get color based on score
  const getBarColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Get impact badge color
  const getImpactColor = (impact) => {
    switch (impact) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full">
      {sortedFactors.map((factor, index) => (
        <motion.div
          key={factor.name}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="mb-4"
        >
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {factor.name}
              </span>
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getImpactColor(factor.impact)}`}>
                {factor.impact} Impact
              </span>
            </div>
            <span className="text-gray-700 dark:text-gray-300 font-bold">
              {factor.score}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${factor.score}%` }}
              transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
              className={`h-2.5 rounded-full ${getBarColor(factor.score)}`}
            />
          </div>
        </motion.div>
      ))}
      
      <div className="mt-6 flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Higher Risk</span>
        <span>Lower Risk</span>
      </div>
    </div>
  );
};

export default RiskFactorsChart;