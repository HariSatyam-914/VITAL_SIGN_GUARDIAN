import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ReportGenerator = ({ onClose, onGenerate }) => {
  const [reportType, setReportType] = useState('weekly');
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
  const [includeVisualizations, setIncludeVisualizations] = useState(true);
  const [includeRiskAssessment, setIncludeRiskAssessment] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGenerating(true);
    
    // In a real implementation, call the API
    // const response = await generateReport({
    //   reportType,
    //   includeRecommendations,
    //   includeVisualizations,
    //   includeRiskAssessment
    // });
    
    // Simulate API call
    setTimeout(() => {
      setGenerating(false);
      setSuccess(true);
      
      // Call the onGenerate callback with the report details
      onGenerate({
        id: `report-${reportType}-${Date.now()}`,
        type: reportType,
        date: new Date().toISOString(),
        status: 'scheduled'
      });
      
      // Close the modal after showing success message
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 2000);
  };
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Generate Report
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                disabled={generating || success}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {!success ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Report Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setReportType('weekly')}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          reportType === 'weekly'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-2 border-blue-500'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        Weekly
                      </button>
                      <button
                        type="button"
                        onClick={() => setReportType('monthly')}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          reportType === 'monthly'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-2 border-purple-500'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        type="button"
                        onClick={() => setReportType('quarterly')}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          reportType === 'quarterly'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-2 border-green-500'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        Quarterly
                      </button>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Report Contents
                    </label>
                    
                    <div className="space-y-3">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeRecommendations}
                          onChange={(e) => setIncludeRecommendations(e.target.checked)}
                          className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Include Personalized Recommendations</span>
                      </label>
                      
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeVisualizations}
                          onChange={(e) => setIncludeVisualizations(e.target.checked)}
                          className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Include Data Visualizations</span>
                      </label>
                      
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeRiskAssessment}
                          onChange={(e) => setIncludeRiskAssessment(e.target.checked)}
                          className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Include Health Risk Assessment</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 text-sm text-blue-800 dark:text-blue-200">
                    <div className="flex">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        {reportType === 'weekly' && 'Weekly reports include data from the past 7 days.'}
                        {reportType === 'monthly' && 'Monthly reports include data from the past 30 days.'}
                        {reportType === 'quarterly' && 'Quarterly reports include data from the past 3 months.'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mr-2"
                    disabled={generating}
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    disabled={generating}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    {generating && (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    
                    {generating ? 'Generating...' : 'Generate Report'}
                  </button>
                </div>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Report Scheduled!</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your {reportType} report is being generated and will be available soon.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReportGenerator;