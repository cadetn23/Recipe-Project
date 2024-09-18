import { getToken } from './authToken'; // Import the getToken function from the authToken file

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export const secureApiCall = async (endpoint, method = 'GET', body = null) => {
  const token = getToken();   // Fish for the authentication token

  // Sets up the headers for requests
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };


   // Configure request options
  const config = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  };


  //Make API call(S)
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    throw new Error('API call failed');
  }

  return response.json();
};