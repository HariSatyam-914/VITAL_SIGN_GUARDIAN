import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ReportCard from '../../components/reports/ReportCard';
import EmailPreferences from '../../components/reports/EmailPreferences';
import ReportGenerator from '../../components/reports/ReportGenerator';
import { fetchReports } from '../../api/reportsApi';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [showEmailPreferences, setShowEmailPreferences] = useState(false);
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would fetch from the API
        // const data = await fetchReports();
        
        // Mock data for frontend development
        const mockReports = [
          {
            id: 'rep-001',
            title: 'Weekly Health Summary',
            date: '2023-11-15',
            type: 'weekly',
            highlights: [
              'Heart rate stable within normal range',
              'Blood pressure slightly elevated',
              'Stress levels decreased by 15%'
            ],
            recommendations: [
              'Continue regular exercise routine',
              'Monitor sodium intake to address blood pressure'
            ],
            status: 'generated'
          },
          {
            id: 'rep-002',
            title: 'Monthly Health Analysis',
            date: '2023-11-01',
            type: 'monthly',
            highlights: [
              'Overall health score improved by 8%',
              'Sleep quality shows positive trend',
              'Respiratory rate normalized'
            ],
            recommendations: [
              'Maintain current sleep schedule',
              'Consider adding meditation to daily routine'
            ],
            status: 'generated'
          },
          {
            id: 'rep-003',
            title: 'Quarterly Health Review',
            date: '2023-10-01',
            type: 'quarterly',
            highlights: [
              'Significant improvement in cardiovascular health',
              'Stress management techniques showing positive results',
              'Weight stabilized within healthy range'
            ],
            recommendations: [
              'Schedule follow-up with primary care physician',
              'Continue current health management plan'
            ],
            status: 'generated'
          },
          {
            id: 'rep-004',
            title: 'Weekly Health Summary',
            date: '2023-11-22',
            type: 'weekly',
            status: 'scheduled'
          }
        ];
        
        setTimeout(() => {
          setReports(mockReports);
          setLoading(false);
        }, 1200); // Simulate loading
      } catch (err) {
        setError('Failed to load reports');
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const handleGenerateReport = (newReport) => {
    // Add the new report to the list
    setReports(prevReports => [
      {
        id: newReport.id,
        title: `${newReport.type.charAt(0).toUpperCase() + newReport.type.slice(1)} Health Report`,
        date: newReport.date,
        type: newReport.type,
        status: 'scheduled'
      },
      ...prevReports
    ]);
  };

  // Filter reports based on selected type
  const filteredReports = filterType === 'all' 
    ? reports 
    : reports.filter(report => report.type === filterType);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner size="large" message="Loading your health reports..." />
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
            Health Reports
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
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Generate Report
            </button>
            
            <button
              onClick={() => setShowEmailPreferences(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Email Preferences
            </button>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Report Schedule</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">Weekly Report</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Every Wednesday</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4 border border-purple-200 dark:border-purple-800"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">Monthly Report</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">1st of each month</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4 border border-green-200 dark:border-green-800"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">Quarterly Review</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Every 3 months</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Reports</h2>
          
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filterType === 'all'
                  ? 'bg-white dark:bg-gray-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('weekly')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filterType === 'weekly'
                  ? 'bg-white dark:bg-gray-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setFilterType('monthly')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filterType === 'monthly'
                  ? 'bg-white dark:bg-gray-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setFilterType('quarterly')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filterType === 'quarterly'
                  ? 'bg-white dark:bg-gray-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Quarterly
            </button>
          </div>
        </div>
        
        {filteredReports.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">No reports found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {filterType === 'all' 
                ? "You don't have any reports yet." 
                : `You don't have any ${filterType} reports yet.`}
            </p>
            <button
              onClick={() => setShowReportGenerator(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Generate Your First Report
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + (index * 0.1) }}
              >
                <ReportCard report={report} />
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Email Preferences Modal */}
        <AnimatePresence>
          {showEmailPreferences && (
            <EmailPreferences onClose={() => setShowEmailPreferences(false)} />
          )}
        </AnimatePresence>
        
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

export default Reports;