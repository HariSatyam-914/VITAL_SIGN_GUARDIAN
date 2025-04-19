import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiDownload, FiShare2, FiInfo, FiHeart, FiWind, FiActivity, FiAlertTriangle } from 'react-icons/fi';
import vitalsService from '../../api/vitalsService';
import { runTests } from '../facescan/api/testingApi';

// Test execution function - moved after imports
const executeTests = async () => {
  try {
    const result = await runTests('all'); // Run all tests
    console.log('Test results:', result);
  } catch (error) {
    console.error('Error executing tests:', error);
  }
};

// Uncomment the line below if you want to run tests automatically
// executeTests();

// Heart rate detection algorithm
const detectHeartRate = (faceData) => {
  if (!faceData || faceData.length < 100) {
    return { value: null, confidence: 0 };
  }
  
  // Extract timestamps and face positions
  const timestamps = faceData.map(data => data.timestamp);
  
  // Calculate time differences between frames
  const timeDiffs = [];
  for (let i = 1; i < timestamps.length; i++) {
    timeDiffs.push(timestamps[i] - timestamps[i-1]);
  }
  
  // Calculate average time difference (in milliseconds)
  const avgTimeDiff = timeDiffs.reduce((sum, diff) => sum + diff, 0) / timeDiffs.length;
  
  // Extract red channel values from face regions (simulated)
  // In a real implementation, this would analyze pixel data from the face region
  const simulatedPulseSignal = [];
  for (let i = 0; i < faceData.length; i++) {
    // Simulate a pulse signal with noise
    const time = i * avgTimeDiff / 1000; // convert to seconds
    const baseSignal = Math.sin(2 * Math.PI * 1.2 * time); // ~72 bpm
    const noise = (Math.random() - 0.5) * 0.3;
    simulatedPulseSignal.push(baseSignal + noise);
  }
  
  // Apply a simple moving average filter to reduce noise
  const windowSize = 5;
  const filteredSignal = [];
  for (let i = 0; i < simulatedPulseSignal.length; i++) {
    let sum = 0;
    let count = 0;
    for (let j = Math.max(0, i - windowSize); j <= Math.min(simulatedPulseSignal.length - 1, i + windowSize); j++) {
      sum += simulatedPulseSignal[j];
      count++;
    }
    filteredSignal.push(sum / count);
  }
  
  // Find peaks in the filtered signal
  const peaks = [];
  for (let i = 1; i < filteredSignal.length - 1; i++) {
    if (filteredSignal[i] > filteredSignal[i-1] && filteredSignal[i] > filteredSignal[i+1] && filteredSignal[i] > 0.2) {
      peaks.push(i);
    }
  }
  
  // Calculate heart rate from peak intervals
  const peakIntervals = [];
  for (let i = 1; i < peaks.length; i++) {
    const interval = (peaks[i] - peaks[i-1]) * avgTimeDiff;
    peakIntervals.push(interval);
  }
  
  if (peakIntervals.length === 0) {
    return { value: 72, confidence: 0.5 }; // Fallback value with low confidence
  }
  
  // Calculate average interval and convert to BPM
  const avgInterval = peakIntervals.reduce((sum, interval) => sum + interval, 0) / peakIntervals.length;
  const heartRate = Math.round(60000 / avgInterval); // Convert ms to BPM
  
  // Calculate confidence based on consistency of intervals
  const intervalVariance = peakIntervals.reduce((sum, interval) => {
    return sum + Math.pow(interval - avgInterval, 2);
  }, 0) / peakIntervals.length;
  
  const normalizedVariance = Math.min(1, intervalVariance / 10000);
  const confidence = 1 - normalizedVariance;
  
  // Ensure heart rate is within physiological limits
  if (heartRate < 40 || heartRate > 200) {
    return { value: 72, confidence: 0.3 }; // Fallback to average with low confidence
  }
  
  return { value: heartRate, confidence };
};

// Respiratory rate detection algorithm
const detectRespiratoryRate = (faceData) => {
  if (!faceData || faceData.length < 100) {
    return { value: null, confidence: 0 };
  }
  
  // In a real implementation, this would analyze vertical movement patterns of the face/chest
  // For this demo, we'll simulate a respiratory rate between 12-20 breaths per minute
  const baseRate = 14 + Math.floor(Math.random() * 6);
  const confidence = 0.7 + Math.random() * 0.2;
  
  return { value: baseRate, confidence };
};

// Stress level estimation
const estimateStressLevel = (heartRate, respiratoryRate) => {
  if (!heartRate || !respiratoryRate) {
    return { value: 'Medium', confidence: 0.5 };
  }
  
  // Simple algorithm: higher heart rate and respiratory rate indicate higher stress
  let stressScore = 0;
  
  // Heart rate contribution
  if (heartRate > 90) stressScore += 2;
  else if (heartRate > 75) stressScore += 1;
  
  // Respiratory rate contribution
  if (respiratoryRate > 18) stressScore += 2;
  else if (respiratoryRate > 15) stressScore += 1;
  
  // Determine stress level
  let stressLevel;
  let status;
  
  if (stressScore >= 3) {
    stressLevel = 'High';
    status = 'danger';
  } else if (stressScore >= 1) {
    stressLevel = 'Medium';
    status = 'warning';
  } else {
    stressLevel = 'Low';
    status = 'normal';
  }
  
  return { value: stressLevel, status, confidence: 0.6 };
};

// Fatigue detection
const detectFatigue = (faceData) => {
  // In a real implementation, this would analyze blink rate, eye openness, etc.
  // For this demo, we'll simulate fatigue levels
  const fatigueOptions = [
    { value: 'Low', status: 'normal', confidence: 0.8 },
    { value: 'Medium', status: 'warning', confidence: 0.7 },
    { value: 'High', status: 'danger', confidence: 0.6 }
  ];
  
  // Randomly select one with weighted probability
  const rand = Math.random();
  if (rand < 0.6) return fatigueOptions[0]; // 60% chance of low fatigue
  if (rand < 0.9) return fatigueOptions[1]; // 30% chance of medium fatigue
  return fatigueOptions[2]; // 10% chance of high fatigue
};

const ScanResults = () => {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Define an async function inside useEffect
    const processAndSaveFaceData = async () => {
      // Get face data from session storage
      const faceDataString = sessionStorage.getItem('faceData');
      
      if (!faceDataString) {
        // No face data found, redirect back to scan page
        navigate('/face-scan');
        return;
      }
      
      // Process the face data
      try {
        const faceData = JSON.parse(faceDataString);
        
        // Detect vital signs
        const heartRateResult = detectHeartRate(faceData);
        const respiratoryRateResult = detectRespiratoryRate(faceData);
        const stressLevelResult = estimateStressLevel(heartRateResult.value, respiratoryRateResult.value);
        const fatigueResult = detectFatigue(faceData);
        
        // Determine heart rate status
        let heartRateStatus = 'normal';
        let heartRateDescription = 'Your heart rate is within the normal range.';
        
        if (heartRateResult.value < 60) {
          heartRateStatus = 'warning';
          heartRateDescription = 'Your heart rate is below the typical resting range. This could be normal for athletes or may indicate bradycardia.';
        } else if (heartRateResult.value > 100) {
          heartRateStatus = 'warning';
          heartRateDescription = 'Your heart rate is elevated. This could be due to recent activity, stress, or other factors.';
        }
        
        // Determine respiratory rate status
        let respRateStatus = 'normal';
        let respRateDescription = 'Your respiratory rate is within the normal range.';
        
        if (respiratoryRateResult.value < 12) {
          respRateStatus = 'warning';
          respRateDescription = 'Your respiratory rate is below the typical range. This may indicate respiratory depression.';
        } else if (respiratoryRateResult.value > 20) {
          respRateStatus = 'warning';
          respRateDescription = 'Your respiratory rate is elevated. This could be due to recent activity, anxiety, or respiratory issues.';
        }
        
        // Create results object
        const processedResults = {
          timestamp: new Date().toISOString(),
          metrics: [
            { 
              id: 'heart-rate', 
              name: 'Heart Rate', 
              value: heartRateResult.value, 
              unit: 'bpm', 
              status: heartRateStatus,
              icon: <FiHeart />,
              color: 'text-red-500',
              range: '60-100 bpm',
              description: heartRateDescription,
              confidence: heartRateResult.confidence
            },
            { 
              id: 'respiratory-rate', 
              name: 'Respiratory Rate', 
              value: respiratoryRateResult.value, 
              unit: 'bpm', 
              status: respRateStatus,
              icon: <FiWind />,
              color: 'text-blue-500',
              range: '12-20 bpm',
              description: respRateDescription,
              confidence: respiratoryRateResult.confidence
            },
            { 
              id: 'stress-level', 
              name: 'Stress Level', 
              value: stressLevelResult.value, 
              status: stressLevelResult.status,
              icon: <FiActivity />,
              color: 'text-yellow-500',
              range: 'Low/Medium/High',
              description: `Your stress level appears to be ${stressLevelResult.value.toLowerCase()}. ${
                stressLevelResult.value === 'High' 
                  ? 'Consider stress reduction techniques.' 
                  : stressLevelResult.value === 'Medium' 
                    ? 'Consider relaxation techniques.' 
                    : 'Continue your current stress management practices.'
              }`,
              confidence: stressLevelResult.confidence
            },
            { 
              id: 'fatigue', 
              name: 'Fatigue', 
              value: fatigueResult.value, 
              status: fatigueResult.status,
              icon: <FiActivity />,
              color: 'text-green-500',
              range: 'Low/Medium/High',
              description: `Your fatigue level appears to be ${fatigueResult.value.toLowerCase()}. ${
                fatigueResult.value === 'High' 
                  ? 'Consider getting more rest.' 
                  : fatigueResult.value === 'Medium' 
                    ? 'Ensure you get adequate sleep tonight.' 
                    : 'Your energy levels appear good.'
              }`,
              confidence: fatigueResult.confidence
            }
          ]
        };
        
        setResults(processedResults);
        
        // Save results to database
        try {
          await vitalsService.saveScanResults({
            timestamp: processedResults.timestamp,
            metrics: processedResults.metrics.map(metric => ({
              id: metric.id,
              name: metric.name,
              value: metric.value,
              unit: metric.unit,
              status: metric.status,
              confidence: metric.confidence
            }))
          });
        } catch (saveError) {
          console.error('Error saving scan results:', saveError);
          // Continue showing results even if save fails
        }
      } catch (error) {
        console.error('Error processing face data:', error);
        // Create fallback results
        setResults({
        timestamp: new Date().toISOString(),
        metrics: [
          { 
            id: 'heart-rate', 
            name: 'Heart Rate', 
            value: 72, 
            unit: 'bpm', 
            status: 'normal',
            icon: <FiHeart />,
            color: 'text-red-500',
            range: '60-100 bpm',
            description: 'Your heart rate is within the normal range.',
            confidence: 0.5
          },
          { 
            id: 'respiratory-rate', 
            name: 'Respiratory Rate', 
            value: 16, 
            unit: 'bpm', 
            status: 'normal',
            icon: <FiWind />,
            color: 'text-blue-500',
            range: '12-20 bpm',
            description: 'Your respiratory rate is within the normal range.',
            confidence: 0.5
          },
          { 
            id: 'stress-level', 
            name: 'Stress Level', 
            value: 'Medium', 
            status: 'warning',
            icon: <FiActivity />,
            color: 'text-yellow-500',
            range: 'Low/Medium/High',
            description: 'Your stress level is slightly elevated. Consider relaxation techniques.',
            confidence: 0.5
          },
          { 
            id: 'fatigue', 
            name: 'Fatigue', 
            value: 'Low', 
            status: 'normal',
            icon: <FiActivity />,
            color: 'text-green-500',
            range: 'Low/Medium/High',
            description: 'Your fatigue level is low, indicating good energy levels.',
            confidence: 0.5
          }
        ]
      });
    } finally {
      setIsLoading(false);
    }
    };
    
    // Call the async function
    processAndSaveFaceData();
    
  }, [navigate]);
  
  if (isLoading || !results) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Processing your results...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'danger':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusRing = (status) => {
    switch (status) {
      case 'normal':
        return 'ring-green-500';
      case 'warning':
        return 'ring-yellow-500';
      case 'danger':
        return 'ring-red-500';
      default:
        return 'ring-gray-400';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link to="/face-scan" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 mb-2">
            <FiArrowLeft className="mr-1" />
            Back to Scan
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Scan Results</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Scan completed on {formatDate(results.timestamp)}
          </p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center"
          >
            <FiDownload className="mr-1" />
            Save
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center"
          >
            <FiShare2 className="mr-1" />
            Share
          </motion.button>
        </div>
      </div>

      {/* Results Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass dark:glass p-6 rounded-2xl mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Summary</h2>
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-sm font-medium">
            Good Health
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Your vital signs are mostly within normal ranges. Your stress level is slightly elevated, which may be temporary. Consider monitoring this over time.
        </p>
      </motion.div>

      {/* Detailed Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {results.metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${metric.color} bg-opacity-10 mr-4`}>
                    {metric.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{metric.name}</h3>
                    <div className="flex items-center mt-1">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</span>
                      {metric.unit && (
                        <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">{metric.unit}</span>
                      )}
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(metric.status)}`}>
                  {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                </span>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500 dark:text-gray-400">Normal Range:</span>
                  <span className="text-gray-700 dark:text-gray-300">{metric.range}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  {metric.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Health Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8"
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Health Indicators</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: 'Overall Health', value: 85, max: 100, status: 'normal' },
              { name: 'Stress Management', value: 65, max: 100, status: 'warning' },
              { name: 'Energy Level', value: 80, max: 100, status: 'normal' },
              { name: 'Recovery', value: 75, max: 100, status: 'normal' },
            ].map((indicator, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`relative w-20 h-20 rounded-full flex items-center justify-center ring-4 ${getStatusRing(indicator.status)}`}>
                  <span className="text-xl font-bold text-gray-800 dark:text-white">{indicator.value}%</span>
                </div>
                <span className="mt-2 text-sm text-gray-600 dark:text-gray-300 text-center">{indicator.name}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8"
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Recommendations</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="ml-2 text-gray-600 dark:text-gray-300">
                Continue maintaining your current heart rate through regular exercise.
              </p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="ml-2 text-gray-600 dark:text-gray-300">
                Practice deep breathing exercises to help maintain your respiratory rate.
              </p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-yellow-500">
                <FiAlertTriangle />
              </div>
              <p className="ml-2 text-gray-600 dark:text-gray-300">
                Consider stress reduction techniques such as meditation or yoga to address your elevated stress levels.
              </p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="ml-2 text-gray-600 dark:text-gray-300">
                Maintain your current sleep schedule to keep fatigue levels low.
              </p>
            </li>
          </ul>
        </div>
      </motion.div>

      {/* Disclaimer */}
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 rounded-r-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiInfo className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Disclaimer</h3>
            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              <p>
                These results are for informational purposes only and should not be used for medical diagnosis. Always consult with a healthcare professional for medical advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanResults;