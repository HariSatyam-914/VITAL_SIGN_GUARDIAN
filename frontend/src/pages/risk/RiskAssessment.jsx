import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import RiskScoreCard from '../../components/risk/RiskScoreCard';
import RiskFactorsChart from '../../components/risk/RiskFactorsChart';
import PredictionTimeline from '../../components/risk/PredictionTimeline';
import { fetchRiskAssessment } from '../../api/riskApi';

const RiskAssessment = () => {
  const [loading, setLoading] = useState(true);
  const [riskData, setRiskData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRiskData = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would fetch from the API
        // const data = await fetchRiskAssessment();
        
        // Mock data for frontend development
        const mockData = {
          overallScore: 72,
          riskLevel: 'Moderate',
          riskFactors: [
            { name: 'Heart Rate Variability', score: 65, impact: 'Medium' },
            { name: 'Blood Pressure Trends', score: 78, impact: 'High' },
            { name: 'Respiratory Patterns', score: 82, impact: 'Medium' },
            { name: 'Stress Indicators', score: 58, impact: 'High' },
            { name: 'Sleep Quality', score: 45, impact: 'Medium' },
          ],
          predictions: {
            shortTerm: { prediction: 'Stable', confidence: 0.85 },
            mediumTerm: { prediction: 'Slight Improvement', confidence: 0.72 },
            longTerm: { prediction: 'Monitoring Recommended', confidence: 0.65 }
          },
          recommendations: [
            'Monitor blood pressure daily',
            'Consider stress reduction techniques',
            'Improve sleep hygiene',
            'Consult with healthcare provider about HRV trends'
          ]
        };
        
        setTimeout(() => {
          setRiskData(mockData);
          setLoading(false);
        }, 1500); // Simulate loading
      } catch (err) {
        setError('Failed to load risk assessment data');
        setLoading(false);
      }
    };

    loadRiskData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner size="large" message="Analyzing your health data..." />
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
        <motion.h1 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold mb-6 text-gray-800 dark:text-white"
        >
          Health Risk Assessment
        </motion.h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <RiskScoreCard 
              score={riskData.overallScore} 
              level={riskData.riskLevel} 
            />
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recommendations</h3>
              <ul className="space-y-3">
                {riskData.recommendations.map((rec, index) => (
                  <motion.li
                    key={index}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + (index * 0.1) }}
                    className="flex items-start"
                  >
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Risk Factors Analysis</h3>
              <RiskFactorsChart factors={riskData.riskFactors} />
            </div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Health Trend Predictions</h3>
              <PredictionTimeline predictions={riskData.predictions} />
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                * Predictions are based on your historical health data and similar health profiles. 
                These are not medical diagnoses and should be discussed with healthcare professionals.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default RiskAssessment;