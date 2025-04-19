import axios from 'axios';
import { API_BASE_URL } from '../config';

// Get risk assessment for the current user
export const fetchRiskAssessment = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/risk/assessment`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching risk assessment:', error);
    throw error;
  }
};

// Get detailed risk factors
export const fetchRiskFactors = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/risk/factors`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching risk factors:', error);
    throw error;
  }
};

// Get health predictions based on ML models
export const fetchHealthPredictions = async (timeframe = 'all') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/risk/predictions`, {
      params: { timeframe },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching health predictions:', error);
    throw error;
  }
};

// Get personalized health recommendations
export const fetchRecommendations = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/risk/recommendations`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};