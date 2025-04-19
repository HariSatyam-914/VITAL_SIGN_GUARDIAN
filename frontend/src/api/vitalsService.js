import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

/**
 * Service for handling vitals data operations
 */
class VitalsService {
  /**
   * Save manual vitals input
   * @param {Object} vitalsData - The vitals data to save
   * @returns {Promise} - The API response
   */
  saveManualVitals(vitalsData) {
    return axios.post(`${API_URL}/vitals/manual`, vitalsData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  /**
   * Save scan results
   * @param {Object} scanResults - The scan results to save
   * @returns {Promise} - The API response
   */
  saveScanResults(scanResults) {
    return axios.post(`${API_URL}/vitals/scan`, scanResults, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  /**
   * Get vitals history
   * @param {Object} filters - Optional filters (date range, type, etc.)
   * @returns {Promise} - The API response
   */
  getVitalsHistory(filters = {}) {
    return axios.get(`${API_URL}/vitals/history`, {
      params: filters,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  /**
   * Save PDF extracted data
   * @param {Object} extractedData - The data extracted from PDF
   * @returns {Promise} - The API response
   */
  savePdfData(extractedData) {
    return axios.post(`${API_URL}/vitals/pdf`, extractedData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  /**
   * Upload PDF file
   * @param {File} file - The PDF file to upload
   * @returns {Promise} - The API response
   */
  uploadPdf(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    return axios.post(`${API_URL}/vitals/pdf/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  /**
   * Get health trends
   * @param {string} metric - The metric to get trends for (e.g., 'heart-rate')
   * @param {Object} timeRange - The time range for trends
   * @returns {Promise} - The API response
   */
  getHealthTrends(metric, timeRange = { period: '1month' }) {
    return axios.get(`${API_URL}/vitals/trends/${metric}`, {
      params: timeRange,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  /**
   * Get comparison between manual and scan vitals
   * @returns {Promise} - The API response
   */
  getVitalsComparison() {
    return axios.get(`${API_URL}/vitals/comparison`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
}

export default new VitalsService();