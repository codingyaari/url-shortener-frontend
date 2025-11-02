import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      // Dynamically import getSession to avoid SSR issues
      const { getSession } = await import('next-auth/react');
      
      // Get session from NextAuth (client-side)
      const session = await getSession();
      
      // Add token to headers if available
      if (session?.backendToken) {
        config.headers.Authorization = `Bearer ${session.backendToken}`;
      }
      
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Check for success: false in response data
    if (response.data && response.data.success === false) {
      // Create an error object that matches axios error structure
      const error = new Error(response.data.message || 'Request failed');
      error.response = {
        ...response,
        data: {
          ...response.data,
          message: response.data.message || 'Request failed',
        },
      };
      return Promise.reject(error);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - token might be expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // You can add token refresh logic here if needed
      // For now, we'll just reject the promise
      
      // Optionally redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }

    // Extract message from error response
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    const customError = new Error(errorMessage);
    customError.response = error.response;
    customError.config = error.config;
    customError.request = error.request;
    
    return Promise.reject(customError);
  }
);

export default api;

