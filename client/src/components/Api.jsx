import { getToken } from './authToken';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export const secureApiCall = async (endpoint, method = 'GET', body = null) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };

  const config = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API call failed');
    }
    
    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};