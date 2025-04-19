import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import TestStatusCard from '../../components/admin/TestStatusCard';
import TestResultsTable from '../../components/admin/TestResultsTable';
import PerformanceMetrics from '../../components/admin/PerformanceMetrics';
import { fetchTestResults, runTests } from '../../api/testingApi';

const TestingDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [testData, setTestData] = useState(null);
  const [error, setError] = useState(null);
  const [runningTests, setRunningTests] = useState(false);
  const [testType, setTestType] = useState('all'); // 'all', 'unit', 'integration', 'e2e'

  useEffect(() => {
    const loadTestData = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would fetch from the API
        // const data = await fetchTestResults(testType);
        
        // Mock data for frontend development
        const mockData = {
          summary: {
            total: 248,
            passed: 235,
            failed: 8,
            skipped: 5,
            lastRun: '2023-11-15 14:32',
            coverage: 87.5
          },
          unitTests: {
            total: 156,
            passed: 152,
            failed: 2,
            skipped: 2,
            coverage: 92.3
          },
          integrationTests: {
            total: 64,
            passed: 60,
            failed: 4,
            skipped: 0,
            coverage: 85.7
          },
          e2eTests: {
            total: 28,
            passed: 23,
            failed: 2,
            skipped: 3,
            coverage: 78.4
          },
          performance: {
            loadTime: 1.2,
            firstContentfulPaint: 0.8,
            timeToInteractive: 2.1,
            memoryUsage: 68.4,
            cpuUsage: 24.2
          },
          recentResults: [
            { id: 'test-001', name: 'User Authentication Flow', type: 'e2e', status: 'passed', duration: 3.2, timestamp: '2023-11-15 14:30' },
            { id: 'test-002', name: 'Vital Signs Input Validation', type: 'unit', status: 'passed', duration: 0.4, timestamp: '2023-11-15 14:30' },
            { id: 'test-003', name: 'PDF Report Generation', type: 'integration', status: 'failed', duration: 1.8, timestamp: '2023-11-15 14:31', error: 'Timeout waiting for PDF generation service' },
            { id: 'test-004', name: 'Face Scan Detection', type: 'integration', status: 'passed', duration: 2.1, timestamp: '2023-11-15 14:31' },
            { id: 'test-005', name: 'Dark Mode Toggle', type: 'unit', status: 'passed', duration: 0.3, timestamp: '2023-11-15 14:31' },
            { id: 'test-006', name: 'API Response Caching', type: 'unit', status: 'passed', duration: 0.5, timestamp: '2023-11-15 14:31' },
            { id: 'test-007', name: 'Mobile Responsive Layout', type: 'e2e', status: 'failed', duration: 2.7, timestamp: '2023-11-15 14:32', error: 'Element not visible on mobile viewport' },
            { id: 'test-008', name: 'Health Score Calculation', type: 'unit', status: 'passed', duration: 0.6, timestamp: '2023-11-15 14:32' }
          ]
        };
        
        setTimeout(() => {
          setTestData(mockData);
          setLoading(false);
        }, 1200); // Simulate loading
      } catch (err) {
        setError('Failed to load test results');
        setLoading(false);
      }
    };

    loadTestData();
  }, [testType]);

  const handleRunTests = async () => {
    try {
      setRunningTests(true);
      // In a real implementation, this would call the API
      // await runTests(testType);
      
      // Simulate API call
      setTimeout(() => {
        setRunningTests(false);
        // Refresh test data
        const updatedData = { ...testData };
        updatedData.summary.lastRun = new Date().toLocaleString();
        setTestData(updatedData);
      }, 3000);
    } catch (err) {
      setError('Failed to run tests');
      setRunningTests(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner size="large" message="Loading test results..." />
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <motion.h1 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold mb-4 md:mb-0 text-gray-800 dark:text-white"
          >
            Testing Dashboard
          </motion.h1>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <select
              value={testType}
              onChange={(e) => setTestType(e.target.value)}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-white border-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Tests</option>
              <option value="unit">Unit Tests</option>
              <option value="integration">Integration Tests</option>
              <option value="e2e">E2E Tests</option>
            </select>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRunTests}
              disabled={runningTests}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              {runningTests ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Running Tests...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Run Tests
                </>
              )}
            </motion.button>
          </div>
        </div>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-red-100 border border-red-200 text-red-800 rounded-lg flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </motion.div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <TestStatusCard 
              title="Total Tests"
              count={testData.summary.total}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
              color="blue"
              subtitle={`Last run: ${testData.summary.lastRun}`}
            />
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <TestStatusCard 
              title="Passed"
              count={testData.summary.passed}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="green"
              subtitle={`${Math.round((testData.summary.passed / testData.summary.total) * 100)}% success rate`}
            />
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <TestStatusCard 
              title="Failed"
              count={testData.summary.failed}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="red"
              subtitle={`${Math.round((testData.summary.failed / testData.summary.total) * 100)}% failure rate`}
            />
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <TestStatusCard 
              title="Code Coverage"
              count={`${testData.summary.coverage}%`}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              color="purple"
              subtitle="Target: 90%"
            />
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Recent Test Results
              </h2>
              <TestResultsTable results={testData.recentResults} />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Performance Metrics
              </h2>
              <PerformanceMetrics metrics={testData.performance} />
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Test Coverage by Type
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h3 className="font-medium text-gray-800 dark:text-white mb-2">Unit Tests</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Coverage:</span>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{testData.unitTests.coverage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${testData.unitTests.coverage}%` }}></div>
                </div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {testData.unitTests.passed} passed / {testData.unitTests.failed} failed
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <h3 className="font-medium text-gray-800 dark:text-white mb-2">Integration Tests</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Coverage:</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">{testData.integrationTests.coverage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${testData.integrationTests.coverage}%` }}></div>
                </div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {testData.integrationTests.passed} passed / {testData.integrationTests.failed} failed
                </div>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                <h3 className="font-medium text-gray-800 dark:text-white mb-2">E2E Tests</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Coverage:</span>
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">{testData.e2eTests.coverage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${testData.e2eTests.coverage}%` }}></div>
                </div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {testData.e2eTests.passed} passed / {testData.e2eTests.failed} failed
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Coverage Report
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default TestingDashboard;