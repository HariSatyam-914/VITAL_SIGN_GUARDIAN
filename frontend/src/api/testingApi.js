import axios from 'axios';
import { API_BASE_URL } from '../config';

// Fetch test results
export const fetchTestResults = async (testType = 'all') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/testing/results`, {
      params: { type: testType },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching test results:', error);
    throw error;
  }
};

// Run tests
export const runTests = async (testType = 'all') => {
  try {
    const response = await axios.post(`${API_BASE_URL}/testing/run`, 
      { type: testType },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error running tests:', error);
    throw error;
  }
};

// Fetch test coverage report
export const fetchCoverageReport = async (format = 'json') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/testing/coverage`, {
      params: { format },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      responseType: format === 'pdf' ? 'blob' : 'json'
    });
    
    if (format === 'pdf') {
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `coverage_report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      return true;
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching coverage report:', error);
    throw error;
  }
};

// Fetch performance metrics
export const fetchPerformanceMetrics = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/testing/performance`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    throw error;
  }
};

// Fetch test history
export const fetchTestHistory = async (limit = 10, offset = 0) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/testing/history`, {
      params: { limit, offset },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching test history:', error);
    throw error;
  }
};