import { API_URL } from '../config';
import axios from 'axios';

// Fetch all reports for the current user
export const fetchReports = async () => {
  try {
    const response = await axios.get(`${API_URL}/reports`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

// Fetch a specific report by ID
export const fetchReportById = async (reportId) => {
  try {
    const response = await axios.get(`${API_URL}/reports/${reportId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching report ${reportId}:`, error);
    throw error;
  }
};

// Generate a new report on demand
export const generateReport = async (reportType = 'weekly') => {
  try {
    const response = await axios.post(`${API_URL}/reports/generate`, 
      { reportType },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};

// Download a report as PDF
export const downloadReportPdf = async (reportId) => {
  try {
    const response = await axios.get(`${API_URL}/reports/${reportId}/download`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `report_${reportId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return true;
  } catch (error) {
    console.error(`Error downloading report ${reportId}:`, error);
    throw error;
  }
};

// Update email preferences
export const updateEmailPreferences = async (preferences) => {
  try {
    const response = await axios.put(`${API_URL}/user/email-preferences`, 
      preferences,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating email preferences:', error);
    throw error;
  }
};

// Get current email preferences
export const getEmailPreferences = async () => {
  try {
    const response = await axios.get(`${API_URL}/user/email-preferences`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching email preferences:', error);
    throw error;
  }
};