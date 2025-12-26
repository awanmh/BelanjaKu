import axios from 'axios';
import { useUserStore } from '@/store/user.store';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const state = localStorage.getItem('belanjaku-storage');
      if (state) {
        try {
          const parsed = JSON.parse(state);
          const token = parsed.state?.token;
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (e) {
          console.error("Error parsing token", e);
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if error is 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        // Clear store and redirect
        // We can't use hooks here easily, but we can access the store directly or clear localStorage
        // accessing store getState() is safer if we want to trigger actions
        const { logout } = useUserStore.getState();
        logout();

        // Optionally redirect to login if not already there
        if (!window.location.pathname.startsWith('/auth/login')) {
          window.location.href = '/auth/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;