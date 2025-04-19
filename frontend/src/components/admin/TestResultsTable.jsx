import React from 'react';
import { motion } from 'framer-motion';

const TestResultsTable = ({ results }) => {
  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'passed':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Passed
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Failed
          </span>
        );
      case 'skipped':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Skipped
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            Unknown
          </span>
        );
    }
  };
  
  // Get type badge
  const getTypeBadge = (type) => {
    switch (type) {
      case 'unit':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            Unit
          </span>
        );
      case 'integration':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
            Integration
          </span>
        );
      case 'e2e':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
            E2E
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            Other
          </span>
        );
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300">Test Name</th>
            <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300">Type</th>
            <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300">Status</th>
            <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300">Duration</th>
            <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <motion.tr
              key={result.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="border-b border-gray-200 dark:border-gray-700"
            >
              <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">
                {result.name}
                {result.error && (
                  <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                    Error: {result.error}
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                {getTypeBadge(result.type)}
              </td>
              <td className="px-4 py-3">
                {getStatusBadge(result.status)}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {result.duration}s
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {result.timestamp}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestResultsTable;