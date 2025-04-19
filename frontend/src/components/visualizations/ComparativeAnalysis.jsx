import React from 'react';
import { motion } from 'framer-motion';

const ComparativeAnalysis = ({ data }) => {
  const { current, previous, optimal } = data;
  
  // Calculate percentage change
  const calculateChange = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };
  
  // Format percentage change with + or - sign
  const formatChange = (change) => {
    return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  };
  
  // Determine if value is within optimal range
  const isWithinRange = (value, range) => {
    return value >= range.min && value <= range.max;
  };
  
  // Get color based on change direction and whether it's good
  const getChangeColor = (change, isGood) => {
    if (change === 0) return 'text-gray-500';
    if ((change > 0 && isGood) || (change < 0 && !isGood)) {
      return 'text-green-600';
    }
    return 'text-red-600';
  };
  
  // Get color for current value based on optimal range
  const getCurrentValueColor = (value, range) => {
    if (isWithinRange(value, range)) {
      return 'text-green-600';
    }
    return 'text-red-600';
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300">Vital Sign</th>
              <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300">Current</th>
              <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300">Previous</th>
              <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300">Change</th>
              <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300">Optimal Range</th>
            </tr>
          </thead>
          <tbody>
            {/* Heart Rate */}
            <motion.tr
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="border-b border-gray-200 dark:border-gray-700"
            >
              <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">Heart Rate</td>
              <td className={`px-4 py-3 font-medium ${getCurrentValueColor(current.heartRate, optimal.heartRate)}`}>
                {current.heartRate} bpm
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {previous.heartRate} bpm
              </td>
              <td className={`px-4 py-3 ${getChangeColor(
                calculateChange(current.heartRate, previous.heartRate),
                isWithinRange(current.heartRate, optimal.heartRate)
              )}`}>
                {formatChange(calculateChange(current.heartRate, previous.heartRate))}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {optimal.heartRate.min} - {optimal.heartRate.max} bpm
              </td>
            </motion.tr>
            
            {/* Blood Pressure - Systolic */}
            <motion.tr
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="border-b border-gray-200 dark:border-gray-700"
            >
              <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">Systolic BP</td>
              <td className={`px-4 py-3 font-medium ${getCurrentValueColor(
                current.bloodPressure.systolic, 
                optimal.bloodPressure.systolic
              )}`}>
                {current.bloodPressure.systolic} mmHg
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {previous.bloodPressure.systolic} mmHg
              </td>
              <td className={`px-4 py-3 ${getChangeColor(
                calculateChange(current.bloodPressure.systolic, previous.bloodPressure.systolic),
                !isWithinRange(current.bloodPressure.systolic, optimal.bloodPressure.systolic)
              )}`}>
                {formatChange(calculateChange(current.bloodPressure.systolic, previous.bloodPressure.systolic))}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {optimal.bloodPressure.systolic.min} - {optimal.bloodPressure.systolic.max} mmHg
              </td>
            </motion.tr>
            
            {/* Blood Pressure - Diastolic */}
            <motion.tr
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="border-b border-gray-200 dark:border-gray-700"
            >
              <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">Diastolic BP</td>
              <td className={`px-4 py-3 font-medium ${getCurrentValueColor(
                current.bloodPressure.diastolic, 
                optimal.bloodPressure.diastolic
              )}`}>
                {current.bloodPressure.diastolic} mmHg
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {previous.bloodPressure.diastolic} mmHg
              </td>
              <td className={`px-4 py-3 ${getChangeColor(
                calculateChange(current.bloodPressure.diastolic, previous.bloodPressure.diastolic),
                !isWithinRange(current.bloodPressure.diastolic, optimal.bloodPressure.diastolic)
              )}`}>
                {formatChange(calculateChange(current.bloodPressure.diastolic, previous.bloodPressure.diastolic))}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {optimal.bloodPressure.diastolic.min} - {optimal.bloodPressure.diastolic.max} mmHg
              </td>
            </motion.tr>
            
            {/* Respiratory Rate */}
            <motion.tr
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="border-b border-gray-200 dark:border-gray-700"
            >
              <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">Respiratory Rate</td>
              <td className={`px-4 py-3 font-medium ${getCurrentValueColor(
                current.respiratoryRate, 
                optimal.respiratoryRate
              )}`}>
                {current.respiratoryRate} bpm
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {previous.respiratoryRate} bpm
              </td>
              <td className={`px-4 py-3 ${getChangeColor(
                calculateChange(current.respiratoryRate, previous.respiratoryRate),
                isWithinRange(current.respiratoryRate, optimal.respiratoryRate)
              )}`}>
                {formatChange(calculateChange(current.respiratoryRate, previous.respiratoryRate))}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {optimal.respiratoryRate.min} - {optimal.respiratoryRate.max} bpm
              </td>
            </motion.tr>
            
            {/* Stress Level */}
            <motion.tr
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">Stress Level</td>
              <td className={`px-4 py-3 font-medium ${getCurrentValueColor(
                current.stress, 
                optimal.stress
              )}`}>
                {current.stress}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {previous.stress}
              </td>
              <td className={`px-4 py-3 ${getChangeColor(
                calculateChange(current.stress, previous.stress),
                !isWithinRange(current.stress, optimal.stress)
              )}`}>
                {formatChange(calculateChange(current.stress, previous.stress))}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {optimal.stress.min} - {optimal.stress.max}
              </td>
            </motion.tr>
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex justify-center">
        <div className="flex space-x-6 text-xs">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-600 mr-1"></span>
            <span className="text-gray-600 dark:text-gray-400">Within optimal range</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-red-600 mr-1"></span>
            <span className="text-gray-600 dark:text-gray-400">Outside optimal range</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparativeAnalysis;