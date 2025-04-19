import axios from 'axios';
import { API_BASE_URL } from '../config';

// Fetch security settings for the current user
export const fetchSecuritySettings = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/security/settings`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching security settings:', error);
    throw error;
  }
};

// Update security settings
export const updateSecuritySettings = async (settings) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/security/settings`, 
      settings,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating security settings:', error);
    throw error;
  }
};

// Enable/disable two-factor authentication
export const toggleTwoFactorAuth = async (enabled) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/security/two-factor`, 
      { enabled },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error toggling two-factor authentication:', error);
    throw error;
  }
};

// Update consent settings
export const updateConsentSettings = async (consentSettings) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/security/consent`, 
      consentSettings,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating consent settings:', error);
    throw error;
  }
};

// Update data retention settings
export const updateDataRetentionSettings = async (retentionSettings) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/security/data-retention`, 
      retentionSettings,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating data retention settings:', error);
    throw error;
  }
};

// Request data deletion
export const requestDataDeletion = async (reason = '') => {
  try {
    const response = await axios.post(`${API_BASE_URL}/security/data-deletion`, 
      { reason },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error requesting data deletion:', error);
    throw error;
  }
};

// Fetch login history
export const fetchLoginHistory = async (limit = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/security/login-history`, {
      params: { limit },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching login history:', error);
    throw error;
  }
};

// Fetch audit log
export const fetchAuditLog = async (limit = 10, offset = 0) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/security/audit-log`, {
      params: { limit, offset },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching audit log:', error);
    throw error;
  }
};