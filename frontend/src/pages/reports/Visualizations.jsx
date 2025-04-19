import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import HealthTrendChart from '../../components/visualizations/HealthTrendChart';
import HealthScoreGauge from '../../components/visualizations/HealthScoreGauge';
import ComparativeAnalysis from '../../components/visualizations/ComparativeAnalysis';
import InteractiveHealthTrend from '../../components/visualizations/InteractiveHealthTrend';
import HealthScoreDashboard from '../../components/visualizations/HealthScoreDashboard';
import ReportGenerator from '../../components/reports/ReportGenerator';
import { fetchHealthData } from '../../api/visualizationsApi';

const Visualizations = () => {
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState(null);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('week'); // 'week', 'month', 'quarter', 'year'
  const [dataType, setDataType] = useState('all'); // 'all', 'heart', 'blood', 'respiratory', 'stress'
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const [showAdvancedView, setShowAdvancedView] = useState(false);

  useEffect(() => {
    const loadHealthData = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would fetch from the API
        // const data = await fetchHealthData(timeRange, dataType);
        
        // Mock data for frontend development
        const mockData = {
          healthScore: 78,
          previousHealthScore: 72,
          categories: [
            { name: 'Cardiovascular', score: 82, color: '#FF6384' },
            { name: 'Respiratory', score: 75, color: '#36A2EB' },
            { name: 'Stress Management', score: 65, color: '#9966FF' },
            { name: 'Sleep Quality', score: 70, color: '#4BC0C0' }
          ],
          trends: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: {
              heartRate: [72, 75, 71, 74, 73, 70, 72],
              bloodPressure: {
                systolic: [125, 128, 124, 130, 126, 122, 125],
                diastolic: [82, 84, 80, 86, 83, 81, 82]
              },
              respiratoryRate: [16, 15, 16, 17, 16, 15, 16],
              stress: [45, 60, 40, 55, 35, 30, 42]
            }
          },
          comparison: {
            current: {
              heartRate: 72,
              bloodPressure: { systolic: 125, diastolic: 82 },
              respiratoryRate: 16,
              stress: 42
            },
            previous: {
              heartRate: 75,
              bloodPressure: { systolic: 130, diastolic: 85 },
              respiratoryRate: 17,
              stress: 55
            },
            optimal: {
              heartRate: { min: 60, max: 100 },
              bloodPressure: { systolic: { min: 90, max: 120 }, diastolic: { min: 60, max: 80 } },
              respiratoryRate: { min: 12, max: 20 },
              stress: { min: 0, max: 30 }
            }
          }
        };
        
        setTimeout(() => {
          setHealthData(mockData);
          setLoading(false);
        }, 1500); // Simulate loading
      } catch (err) {
        setError('Failed to load health visualization data');
        setLoading(false);
      }
    };

    loadHealthData();
  }, [timeRange, dataType]);

  const handleGenerateReport = (newReport) => {
    // In a real implementation, this would trigger a notification or redirect
    console.log('Report generation requested:', newReport);
    // Show a success message or redirect to reports page
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner size="large" message="Preparing your health visualizations..." />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-xl mb-4"
          >
            {error}
          </motion.div>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <motion.h1 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold text-gray-800 dark:text-white"
          >
            Health Visualizations
          </motion.h1>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2"
          >
            <button
              onClick={() => setShowReportGenerator(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" />
              </svg>
              Generate Report
            </button>
            
            <button
              onClick={() => setShowAdvancedView(!showAdvancedView)}
              className={`px-4 py-2 ${showAdvancedView ? 'bg-indigo-600' : 'bg-gray-600'} text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
              </svg>
              {showAdvancedView ? 'Simple View' : 'Advanced View'}
            </button>
          </motion.div>
        </div>
        
        {/* Health Score Dashboard */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <HealthScoreDashboard 
            score={healthData.healthScore} 
            previousScore={healthData.previousHealthScore}
            categories={healthData.categories}
          />
        </motion.div>
        
        {/* Health Trends Chart */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Health Trends
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Track your vital signs over time
              </p>
            </div>
            
            <div className="flex space-x-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-white border-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last 3 Months</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>
          
          {showAdvancedView ? (
            <InteractiveHealthTrend data={healthData.trends} timeRange={timeRange} />
          ) : (
            <HealthTrendChart data={healthData.trends} dataType={dataType} />
          )}
          
          <div className="mt-4 flex justify-end">
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Data
            </button>
          </div>
        </motion.div>
        
        {/* Comparative Analysis */}
        {showAdvancedView && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Comparative Analysis
            </h2>
            <ComparativeAnalysis data={healthData.comparison} />
            <p className="mt-4 text-center text-gray-600 dark:text-gray-400 text-sm">
              Compare your current vital signs with previous measurements and optimal ranges.
            </p>
          </motion.div>
        )}
        
        {/* Insights & Recommendations */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Insights & Recommendations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800"
            >
              <h3 className="font-medium text-gray-800 dark:text-white mb-2">Heart Rate</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Your heart rate has been stable within the normal range. Continue with your current exercise routine.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800"
            >
              <h3 className="font-medium text-gray-800 dark:text-white mb-2">Blood Pressure</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Your blood pressure is slightly elevated. Consider reducing sodium intake and monitoring regularly.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4 border border-green-200 dark:border-green-800"
            >
              <h3 className="font-medium text-gray-800 dark:text-white mb-2">Respiratory Rate</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Your respiratory rate is within optimal range. Your breathing patterns show good lung function.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4 border border-purple-200 dark:border-purple-800"
            >
              <h3 className="font-medium text-gray-800 dark:text-white mb-2">Stress Level</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Your stress levels have decreased by 15% compared to last week. Continue with your stress management techniques.
              </p>
            </motion.div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowReportGenerator(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Generate Detailed Report
            </motion.button>
          </div>
        </motion.div>
        
        {/* Report Generator Modal */}
        <AnimatePresence>
          {showReportGenerator && (
            <ReportGenerator 
              onClose={() => setShowReportGenerator(false)} 
              onGenerate={handleGenerateReport}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </Layout>
  );
};

export default Visualizations;