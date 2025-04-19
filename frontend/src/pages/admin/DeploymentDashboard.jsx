import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import DeploymentCard from '../../components/admin/DeploymentCard';
import EnvironmentStatus from '../../components/admin/EnvironmentStatus';
import DeploymentHistory from '../../components/admin/DeploymentHistory';
import { fetchDeploymentStatus, deployToEnvironment } from '../../api/deploymentApi';

const DeploymentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [deploymentData, setDeploymentData] = useState(null);
  const [error, setError] = useState(null);
  const [deploying, setDeploying] = useState(false);
  const [deployTarget, setDeployTarget] = useState(null);
  const [deploySuccess, setDeploySuccess] = useState(false);

  useEffect(() => {
    const loadDeploymentData = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would fetch from the API
        // const data = await fetchDeploymentStatus();
        
        // Mock data for frontend development
        const mockData = {
          environments: [
            {
              name: 'Development',
              status: 'online',
              version: 'v0.9.2',
              lastDeployed: '2023-11-14 10:45',
              url: 'https://dev.vitalsignguardian.com',
              health: 'healthy'
            },
            {
              name: 'Staging',
              status: 'online',
              version: 'v0.9.1',
              lastDeployed: '2023-11-10 15:30',
              url: 'https://staging.vitalsignguardian.com',
              health: 'healthy'
            },
            {
              name: 'Production',
              status: 'online',
              version: 'v0.9.0',
              lastDeployed: '2023-11-01 09:15',
              url: 'https://vitalsignguardian.com',
              health: 'healthy'
            }
          ],
          deploymentHistory: [
            {
              id: 'dep-001',
              environment: 'Development',
              version: 'v0.9.2',
              timestamp: '2023-11-14 10:45',
              status: 'success',
              deployedBy: 'CI/CD Pipeline',
              changes: '15 files changed, 420 insertions, 125 deletions'
            },
            {
              id: 'dep-002',
              environment: 'Staging',
              version: 'v0.9.1',
              timestamp: '2023-11-10 15:30',
              status: 'success',
              deployedBy: 'John Doe',
              changes: '32 files changed, 890 insertions, 340 deletions'
            },
            {
              id: 'dep-003',
              environment: 'Production',
              version: 'v0.9.0',
              timestamp: '2023-11-01 09:15',
              status: 'success',
              deployedBy: 'Jane Smith',
              changes: '47 files changed, 1250 insertions, 820 deletions'
            },
            {
              id: 'dep-004',
              environment: 'Development',
              version: 'v0.9.1',
              timestamp: '2023-11-09 14:20',
              status: 'success',
              deployedBy: 'CI/CD Pipeline',
              changes: '8 files changed, 230 insertions, 45 deletions'
            },
            {
              id: 'dep-005',
              environment: 'Development',
              version: 'v0.9.0',
              timestamp: '2023-11-01 08:30',
              status: 'failed',
              deployedBy: 'CI/CD Pipeline',
              changes: '12 files changed, 340 insertions, 120 deletions',
              error: 'Build failed: Missing dependency'
            }
          ],
          availableVersions: [
            { version: 'v0.9.2', timestamp: '2023-11-14 10:30', commitHash: 'a1b2c3d' },
            { version: 'v0.9.1', timestamp: '2023-11-10 15:15', commitHash: 'e4f5g6h' },
            { version: 'v0.9.0', timestamp: '2023-11-01 09:00', commitHash: 'i7j8k9l' }
          ]
        };
        
        setTimeout(() => {
          setDeploymentData(mockData);
          setLoading(false);
        }, 1200); // Simulate loading
      } catch (err) {
        setError('Failed to load deployment data');
        setLoading(false);
      }
    };

    loadDeploymentData();
  }, []);

  const handleDeploy = async (environment, version) => {
    try {
      setDeploying(true);
      setDeployTarget(`${environment} (${version})`);
      
      // In a real implementation, this would call the API
      // await deployToEnvironment(environment, version);
      
      // Simulate API call
      setTimeout(() => {
        setDeploying(false);
        setDeploySuccess(true);
        
        // Update environment version
        const updatedEnvironments = deploymentData.environments.map(env => {
          if (env.name === environment) {
            return { ...env, version, lastDeployed: new Date().toLocaleString() };
          }
          return env;
        });
        
        // Add to deployment history
        const newDeployment = {
          id: `dep-${Date.now()}`,
          environment,
          version,
          timestamp: new Date().toLocaleString(),
          status: 'success',
          deployedBy: 'Admin User',
          changes: 'Manual deployment from dashboard'
        };
        
        setDeploymentData({
          ...deploymentData,
          environments: updatedEnvironments,
          deploymentHistory: [newDeployment, ...deploymentData.deploymentHistory]
        });
        
        // Reset success message after 3 seconds
        setTimeout(() => setDeploySuccess(false), 3000);
      }, 3000);
    } catch (err) {
      setError('Deployment failed');
      setDeploying(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner size="large" message="Loading deployment data..." />
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
          Deployment Dashboard
        </motion.h1>
        
        {/* Success message */}
        {deploySuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-green-100 border border-green-200 text-green-800 rounded-lg flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Successfully deployed to {deployTarget}
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
        
        {/* Deployment progress */}
        {deploying && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-blue-100 border border-blue-200 text-blue-800 rounded-lg flex items-center"
          >
            <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Deploying to {deployTarget}...
          </motion.div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {deploymentData.environments.map((env, index) => (
            <motion.div
              key={env.name}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + (index * 0.1) }}
            >
              <DeploymentCard
                environment={env}
                availableVersions={deploymentData.availableVersions}
                onDeploy={handleDeploy}
                isDeploying={deploying}
              />
            </motion.div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Deployment History
              </h2>
              <DeploymentHistory history={deploymentData.deploymentHistory} />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Environment Status
              </h2>
              <EnvironmentStatus environments={deploymentData.environments} />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default DeploymentDashboard;