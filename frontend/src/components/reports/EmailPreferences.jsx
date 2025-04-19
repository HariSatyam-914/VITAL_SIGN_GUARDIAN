import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EmailPreferences = ({ onClose }) => {
  const [preferences, setPreferences] = useState({
    weeklyReport: true,
    monthlyReport: true,
    quarterlyReport: true,
    alertEmails: true,
    recommendationEmails: false,
    reminderEmails: true
  });
  
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const handleChange = (e) => {
    const { name, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      
      // Reset saved state after 2 seconds
      setTimeout(() => {
        setSaved(false);
      }, 2000);
    }, 1000);
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
                Email Preferences
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                  Report Emails
                </h3>
                
                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="weeklyReport"
                      checked={preferences.weeklyReport}
                      onChange={handleChange}
                      className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Weekly Health Summary</span>
                  </label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Every Wednesday</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="monthlyReport"
                      checked={preferences.monthlyReport}
                      onChange={handleChange}
                      className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Monthly Health Analysis</span>
                  </label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">1st of each month</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="quarterlyReport"
                      checked={preferences.quarterlyReport}
                      onChange={handleChange}
                      className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Quarterly Health Review</span>
                  </label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Every 3 months</span>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                    Notifications
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="alertEmails"
                        checked={preferences.alertEmails}
                        onChange={handleChange}
                        className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">Health Alerts</span>
                    </label>
                    <span className="text-xs text-gray-500 dark:text-gray-400">When abnormal patterns detected</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="recommendationEmails"
                        checked={preferences.recommendationEmails}
                        onChange={handleChange}
                        className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">Personalized Recommendations</span>
                    </label>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Weekly</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="reminderEmails"
                        checked={preferences.reminderEmails}
                        onChange={handleChange}
                        className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">Check-in Reminders</span>
                    </label>
                    <span className="text-xs text-gray-500 dark:text-gray-400">When you haven't logged in for a week</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mr-2"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={saving || saved}
                  className={`px-4 py-2 rounded-lg text-white ${
                    saved ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
                  } transition-colors flex items-center`}
                >
                  {saving && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  
                  {saved && (
                    <svg className="-ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  
                  {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Preferences'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmailPreferences;