import { API_URL } from '../config';
import axios from 'axios';

// Fetch health data for visualizations
export const fetchHealthData = async (timeRange = 'week', dataType = 'all') => {
  try {
    const response = await axios.get(`${API_URL}/visualizations/health-data`, {
      params: { timeRange, dataType },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching health data:', error);
    throw error;
  }
};

// Fetch health score data
export const fetchHealthScore = async () => {
  try {
    const response = await axios.get(`${API_URL}/visualizations/health-score`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching health score:', error);
    throw error;
  }
};

// Fetch comparative analysis data
export const fetchComparativeData = async () => {
  try {
    const response = await axios.get(`${API_URL}/visualizations/comparative`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching comparative data:', error);
    throw error;
  }
};

// Export visualization data as CSV
export const exportVisualizationData = async (dataType = 'all', timeRange = 'week', format = 'csv') => {
  try {
    const response = await axios.get(`${API_URL}/visualizations/export`, {
      params: { dataType, timeRange, format },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `health_data_${dataType}_${timeRange}.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return true;
  } catch (error) {
    console.error('Error exporting visualization data:', error);
    throw error;
  }
};