import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import SecurityCard from '../../components/settings/SecurityCard';
import ConsentManager from '../../components/settings/ConsentManager';
import DataRetentionSettings from '../../components/settings/DataRetentionSettings';
import { fetchSecuritySettings, updateSecuritySettings } from '../../api/securityApi';

const Security = () => {
  const [loading, setLoading] = useState(true);
  const [securitySettings, setSecuritySettings] = useState(null);
  const [error, setError] = useState(null);
  const [showConsentManager, setShowConsentManager] = useState(false);
  const [showDataRetention, setShowDataRetention] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const loadSecuritySettings = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would fetch from the API
        // const data = await fetchSecuritySettings();
        
        // Mock data for frontend development
        const mockSettings = {
          twoFactorEnabled: false,
          dataEncryption: true,
          lastPasswordChange: '2023-10-15',
          loginHistory: [
            { date: '2023-11-15 14:32', ip: '192.168.1.1', device: 'Chrome on macOS' },
            { date: '2023-11-14 09:15', ip: '192.168.1.1', device: 'Safari on iOS' },
            { date: '2023-11-12 18:45', ip: '192.168.1.1', device: 'Chrome on macOS' }
          ],
          consentSettings: {
            dataProcessing: true,
            healthInsights: true,
            thirdPartySharing: false,
            marketingCommunications: false
          },
          dataRetention: {
            vitalsData: '1 year',
            scanResults: '6 months',
            reportHistory: '2 years',
            accountDeletion: 'manual'
          }
        };
        
        setTimeout(() => {
          setSecuritySettings(mockSettings);
          setLoading(false);
        }, 1000); // Simulate loading
      } catch (err) {
        setError('Failed to load security settings');
        setLoading(false);
      }
    };

    loadSecuritySettings();
  }, []);

  const handleToggleTwoFactor = async () => {
    try {
      setSecuritySettings(prev => ({
        ...prev,
        twoFactorEnabled: !prev.twoFactorEnabled
      }));
      
      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
      // In a real implementation, this would update the API
      // await updateSecuritySettings({ twoFactorEnabled: !securitySettings.twoFactorEnabled });
    } catch (err) {
      setError('Failed to update two-factor authentication');
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner size="large" message="Loading security settings..." />
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
        <motion.h1 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold mb-6 text-gray-800 dark:text-white"
        >
          Security & Privacy
        </motion.h1>
        
        {/* Success message */}
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-green-100 border border-green-200 text-green-800 rounded-lg flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Settings updated successfully
          </motion.div>
        )}
        
        {/* Error message */}
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account Security */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <SecurityCard
              title="Account Security"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={securitySettings.twoFactorEnabled}
                      onChange={handleToggleTwoFactor}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">Password</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Last changed: {securitySettings.lastPasswordChange}
                  </p>
                  <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    Change Password
                  </button>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">End-to-End Encryption</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {securitySettings.dataEncryption ? 
                      'Your health data is encrypted' : 
                      'Enable encryption for your health data'}
                  </p>
                  <div className="flex items-center text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-600">HIPAA/GDPR Compliant</span>
                  </div>
                </div>
              </div>
            </SecurityCard>
          </motion.div>
          
          {/* Login History */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <SecurityCard
              title="Login History"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            >
              <div className="space-y-3">
                {securitySettings.loginHistory.map((login, index) => (
                  <div key={index} className="flex justify-between items-start border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">{login.device}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">IP: {login.ip}</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{login.date}</p>
                  </div>
                ))}
                
                <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  View Full History
                </button>
              </div>
            </SecurityCard>
          </motion.div>
          
          {/* Data Privacy */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <SecurityCard
              title="Data Privacy & Consent"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
            >
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage how your health data is used and shared within the application.
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-800 dark:text-white">Data Processing Consent</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    securitySettings.consentSettings.dataProcessing ? 
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {securitySettings.consentSettings.dataProcessing ? 'Granted' : 'Not Granted'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-800 dark:text-white">Third-Party Data Sharing</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    securitySettings.consentSettings.thirdPartySharing ? 
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {securitySettings.consentSettings.thirdPartySharing ? 'Allowed' : 'Restricted'}
                  </span>
                </div>
                
                <button 
                  onClick={() => setShowConsentManager(true)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Manage Consent Settings
                </button>
              </div>
            </SecurityCard>
          </motion.div>
          
          {/* Data Retention */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <SecurityCard
              title="Data Retention & Deletion"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              }
            >
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Control how long your data is stored and when it should be deleted.
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Vitals Data Retention:</span>
                    <span className="text-sm font-medium text-gray-800 dark:text-white">{securitySettings.dataRetention.vitalsData}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Scan Results Retention:</span>
                    <span className="text-sm font-medium text-gray-800 dark:text-white">{securitySettings.dataRetention.scanResults}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Report History Retention:</span>
                    <span className="text-sm font-medium text-gray-800 dark:text-white">{securitySettings.dataRetention.reportHistory}</span>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <button 
                    onClick={() => setShowDataRetention(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Customize Retention Settings
                  </button>
                  
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Request Data Deletion
                  </button>
                </div>
              </div>
            </SecurityCard>
          </motion.div>
        </div>
        
        {/* Audit Log */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <SecurityCard
            title="Audit Log"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          >
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                View a log of all actions and data access events related to your account.
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Date & Time</th>
                      <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Action</th>
                      <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">IP Address</th>
                      <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-3 text-gray-800 dark:text-white">2023-11-15 14:32</td>
                      <td className="px-4 py-3 text-gray-800 dark:text-white">Login</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">192.168.1.1</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          Success
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-3 text-gray-800 dark:text-white">2023-11-15 14:35</td>
                      <td className="px-4 py-3 text-gray-800 dark:text-white">View Health Data</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">192.168.1.1</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          Success
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-3 text-gray-800 dark:text-white">2023-11-15 14:40</td>
                      <td className="px-4 py-3 text-gray-800 dark:text-white">Export Data</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">192.168.1.1</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          Success
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 flex justify-center">
                <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  View Complete Audit Log
                </button>
              </div>
            </div>
          </SecurityCard>
        </motion.div>
        
        {/* Consent Manager Modal */}
        {showConsentManager && (
          <ConsentManager 
            initialConsent={securitySettings.consentSettings}
            onClose={() => setShowConsentManager(false)}
            onSave={(newConsent) => {
              setSecuritySettings(prev => ({
                ...prev,
                consentSettings: newConsent
              }));
              setShowConsentManager(false);
              setSaveSuccess(true);
              setTimeout(() => setSaveSuccess(false), 3000);
            }}
          />
        )}
        
        {/* Data Retention Modal */}
        {showDataRetention && (
          <DataRetentionSettings 
            initialSettings={securitySettings.dataRetention}
            onClose={() => setShowDataRetention(false)}
            onSave={(newSettings) => {
              setSecuritySettings(prev => ({
                ...prev,
                dataRetention: newSettings
              }));
              setShowDataRetention(false);
              setSaveSuccess(true);
              setTimeout(() => setSaveSuccess(false), 3000);
            }}
          />
        )}
      </motion.div>
    </Layout>
  );
};

export default Security;