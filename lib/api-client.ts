import axios, { AxiosError, AxiosInstance } from 'axios';

// Create axios instance with credentials support
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ✅ CRITICAL: Send cookies with requests
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Token is in HttpOnly cookie, browser sends it automatically
    // No need to manually add Authorization header
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear user data and redirect to login
      localStorage.removeItem('user_data');
      
      // Only redirect if not already on login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;