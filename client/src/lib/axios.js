import axios from 'axios';

// Create a custom axios instance with the API URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage if it exists
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData?.token) {
          config.headers.Authorization = `Bearer ${userData.token}`;
        }
      } catch (err) {
        console.error('Error parsing user data from localStorage:', err);
        localStorage.removeItem('user');
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 (Unauthorized) by clearing the user from localStorage
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('user');
      // Could redirect to login page here if needed
    }
    
    // Customize error message based on server response
    if (error.response && error.response.data && error.response.data.message) {
      return Promise.reject(error.response.data.message);
    }
    
    return Promise.reject(error.message || 'An error occurred');
  }
);

export default api;