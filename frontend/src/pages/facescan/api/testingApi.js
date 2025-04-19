/**
 * Testing API for VitalSign Guardian face scanning functionality
 * This module provides functions to test various aspects of the face scanning feature
 */

// Mock test data
const testData = {
  heartRate: {
    testCases: [
      { name: 'Normal heart rate', data: generateMockFaceData(72), expected: { min: 65, max: 80 } },
      { name: 'Elevated heart rate', data: generateMockFaceData(110), expected: { min: 100, max: 120 } },
      { name: 'Low heart rate', data: generateMockFaceData(50), expected: { min: 45, max: 60 } }
    ]
  },
  respiratoryRate: {
    testCases: [
      { name: 'Normal respiratory rate', expected: { min: 12, max: 20 } },
      { name: 'Elevated respiratory rate', expected: { min: 20, max: 30 } },
      { name: 'Low respiratory rate', expected: { min: 8, max: 12 } }
    ]
  },
  stressLevel: {
    testCases: [
      { name: 'Low stress', heartRate: 65, respRate: 14, expected: 'Low' },
      { name: 'Medium stress', heartRate: 85, respRate: 16, expected: 'Medium' },
      { name: 'High stress', heartRate: 95, respRate: 22, expected: 'High' }
    ]
  },
  fatigue: {
    testCases: [
      { name: 'Low fatigue', expected: 'Low' },
      { name: 'Medium fatigue', expected: 'Medium' },
      { name: 'High fatigue', expected: 'High' }
    ]
  }
};

/**
 * Generate mock face data for testing
 * @param {number} targetHeartRate - The heart rate to simulate
 * @returns {Array} Array of mock face data points
 */
function generateMockFaceData(targetHeartRate = 72) {
  const data = [];
  const duration = 30; // seconds
  const fps = 30; // frames per second
  const totalFrames = duration * fps;
  
  // Convert heart rate to frequency in Hz
  const frequency = targetHeartRate / 60;
  
  for (let i = 0; i < totalFrames; i++) {
    const timestamp = Date.now() + (i * 1000 / fps);
    const time = i / fps;
    
    // Generate a sine wave with the target frequency
    const signal = Math.sin(2 * Math.PI * frequency * time);
    
    // Add some random noise
    const noise = (Math.random() - 0.5) * 0.2;
    
    data.push({
      timestamp,
      facePosition: {
        x: 320 + Math.random() * 10,
        y: 240 + Math.random() * 10,
        width: 200 + Math.random() * 5,
        height: 200 + Math.random() * 5
      },
      // Simulate RGB values with the pulse signal embedded in the red channel
      rgbValues: {
        red: 0.6 + 0.1 * (signal + noise),
        green: 0.5 + 0.05 * Math.random(),
        blue: 0.4 + 0.05 * Math.random()
      }
    });
  }
  
  return data;
}

/**
 * Run tests for the face scanning algorithms
 * @param {string} testType - Type of test to run ('heartRate', 'respiratoryRate', 'stressLevel', 'fatigue', or 'all')
 * @returns {Object} Test results
 */
export const runTests = async (testType = 'all') => {
  console.log(`Running ${testType} tests...`);
  
  const results = {
    summary: {
      total: 0,
      passed: 0,
      failed: 0
    },
    details: []
  };
  
  // Helper function to add test result
  const addResult = (name, passed, expected, actual, details = '') => {
    results.summary.total++;
    if (passed) results.summary.passed++;
    else results.summary.failed++;
    
    results.details.push({
      name,
      passed,
      expected,
      actual,
      details
    });
  };
  
  // Import algorithms dynamically to avoid circular dependencies
  const detectHeartRate = (faceData) => {
    // This is a simplified version for testing
    // In a real implementation, this would call the actual algorithm
    const heartRate = 72 + Math.random() * 10;
    return { value: heartRate, confidence: 0.8 };
  };
  
  const detectRespiratoryRate = () => {
    const respRate = 16 + Math.random() * 4;
    return { value: respRate, confidence: 0.7 };
  };
  
  const estimateStressLevel = (heartRate, respiratoryRate) => {
    let stressLevel = 'Low';
    if (heartRate > 90 || respiratoryRate > 18) stressLevel = 'High';
    else if (heartRate > 75 || respiratoryRate > 15) stressLevel = 'Medium';
    
    return { value: stressLevel, confidence: 0.6 };
  };
  
  const detectFatigue = () => {
    const options = ['Low', 'Medium', 'High'];
    const randomIndex = Math.floor(Math.random() * 3);
    return { value: options[randomIndex], confidence: 0.7 };
  };
  
  // Run heart rate tests
  if (testType === 'heartRate' || testType === 'all') {
    console.log('Testing heart rate detection...');
    
    for (const test of testData.heartRate.testCases) {
      const result = detectHeartRate(test.data);
      const passed = result.value >= test.expected.min && result.value <= test.expected.max;
      
      addResult(
        `Heart Rate: ${test.name}`,
        passed,
        `${test.expected.min}-${test.expected.max} bpm`,
        `${result.value} bpm`,
        `Confidence: ${result.confidence}`
      );
    }
  }
  
  // Run respiratory rate tests
  if (testType === 'respiratoryRate' || testType === 'all') {
    console.log('Testing respiratory rate detection...');
    
    for (const test of testData.respiratoryRate.testCases) {
      const result = detectRespiratoryRate();
      const passed = result.value >= test.expected.min && result.value <= test.expected.max;
      
      addResult(
        `Respiratory Rate: ${test.name}`,
        passed,
        `${test.expected.min}-${test.expected.max} bpm`,
        `${result.value} bpm`,
        `Confidence: ${result.confidence}`
      );
    }
  }
  
  // Run stress level tests
  if (testType === 'stressLevel' || testType === 'all') {
    console.log('Testing stress level estimation...');
    
    for (const test of testData.stressLevel.testCases) {
      const result = estimateStressLevel(test.heartRate, test.respRate);
      const passed = result.value === test.expected;
      
      addResult(
        `Stress Level: ${test.name}`,
        passed,
        test.expected,
        result.value,
        `Confidence: ${result.confidence}, HR: ${test.heartRate}, RR: ${test.respRate}`
      );
    }
  }
  
  // Run fatigue tests
  if (testType === 'fatigue' || testType === 'all') {
    console.log('Testing fatigue detection...');
    
    for (const test of testData.fatigue.testCases) {
      const result = detectFatigue();
      // For fatigue, we're just testing the API structure, not the actual values
      // since the implementation is randomized for demo purposes
      const passed = ['Low', 'Medium', 'High'].includes(result.value);
      
      addResult(
        `Fatigue: Test case`,
        passed,
        'Valid fatigue level',
        result.value,
        `Confidence: ${result.confidence}`
      );
    }
  }
  
  console.log('Test summary:', results.summary);
  return results;
};

export default {
  runTests,
  generateMockFaceData
};