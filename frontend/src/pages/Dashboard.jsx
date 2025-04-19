import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { FiActivity, FiCamera, FiFileText, FiBarChart2, FiArrowRight } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  // Mock data for dashboard
  const healthMetrics = {
    heartRate: { value: 72, unit: 'bpm', status: 'normal' },
    bloodPressure: { value: '120/80', unit: 'mmHg', status: 'normal' },
    respiratoryRate: { value: 16, unit: 'bpm', status: 'normal' },
    oxygenSaturation: { value: 98, unit: '%', status: 'normal' },
    temperature: { value: 98.6, unit: '°F', status: 'normal' },
    stressLevel: { value: 'Medium', status: 'warning' },
  };

  const recentActivities = [
    { id: 1, type: 'Face Scan', date: '2 hours ago', result: 'Normal' },
    { id: 2, type: 'Manual Input', date: 'Yesterday', result: 'Warning' },
    { id: 3, type: 'PDF Upload', date: '3 days ago', result: 'Normal' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'danger':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass dark:glass p-6 rounded-2xl"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
              Welcome back, {user?.name?.split(' ')[0] || 'User'}!
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Here's an overview of your health status
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              to="/face-scan"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
            >
              <FiCamera className="mr-2" />
              Quick Scan
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Health Metrics */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Health Metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(healthMetrics).map(([key, metric], i) => (
            <motion.div
              key={key}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="neumorphic p-4 rounded-xl"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <div className="flex items-baseline mt-1">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                      {metric.value}
                    </h3>
                    {metric.unit && (
                      <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                        {metric.unit}
                      </span>
                    )}
                  </div>
                </div>
                <span className={`text-sm font-medium ${getStatusColor(metric.status)} capitalize`}>
                  {metric.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <FiCamera />, title: 'Face Scan', path: '/face-scan', color: 'from-blue-500 to-indigo-600' },
            { icon: <FiActivity />, title: 'Manual Input', path: '/vitals/manual', color: 'from-green-500 to-teal-600' },
            { icon: <FiFileText />, title: 'Upload PDF', path: '/vitals/pdf-upload', color: 'from-purple-500 to-pink-600' },
            { icon: <FiBarChart2 />, title: 'View Reports', path: '/reports', color: 'from-orange-500 to-red-600' },
          ].map((action, i) => (
            <motion.div
              key={action.title}
              custom={i + 6} // Continue from previous animations
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <Link
                to={action.path}
                className={`block p-6 rounded-xl bg-gradient-to-br ${action.color} hover:shadow-lg transition-shadow duration-200`}
              >
                <div className="text-white">
                  <div className="text-3xl mb-2">{action.icon}</div>
                  <h3 className="text-lg font-semibold">{action.title}</h3>
                  <div className="mt-4 flex items-center text-sm">
                    <span>Go to</span>
                    <FiArrowRight className="ml-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Recent Activities
        </h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Result
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {recentActivities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{activity.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{activity.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        activity.result === 'Normal' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {activity.result}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href="#" className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;