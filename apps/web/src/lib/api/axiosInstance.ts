import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Get API base URL from environment variable
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  withCredentials: true, // Enable sending httpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor for logging (development only)
apiClient.interceptors.request.use(
  (config) => {
    // Log requests in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[API Response] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`
      );
    }
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - auto-logout
    if (error.response?.status === 401) {
      console.warn('[API] Unauthorized - logging out');

      // Clear auth state
      useAuthStore.getState().setUser(null);

      // Redirect to landing page
      window.location.href = '/?error=Your session has expired. Please sign in again.';
    }

    // Log error in development mode
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        error.response?.data || error.message
      );
    }

    return Promise.reject(error);
  }
);

export default apiClient;
