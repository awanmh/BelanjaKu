import axios from 'axios';
<<<<<<< HEAD
// Hapus import useUserStore jika belum ada file-nya atau belum digunakan
// import { useUserStore } from '@/store/user.store'; 
=======
import { useUserStore } from '@/store/user.store';
>>>>>>> frontend-role

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

<<<<<<< HEAD
// Interceptor: Setiap request otomatis ditempelkan Token jika ada
api.interceptors.request.use(
  (config: any) => {
    // Kita ambil token dari localStorage secara manual untuk keamanan client-side
    if (typeof window !== 'undefined') {
        const state = localStorage.getItem('belanjaku-storage');
        if (state) {
            try {
                const parsed = JSON.parse(state);
                // Asumsi struktur zustand persist: { state: { token: '...' }, version: 0 }
                const token = parsed.state?.token;
                if (token && config.headers) {
                    // Gunakan type assertion (as any) atau casting yang aman jika TypeScript protes
                    // karena AxiosRequestConfig headers terkadang dianggap undefined di versi lama
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (e) {
                console.error("Error parsing token", e);
            }
        }
    }
    return config;
  },
  (error: any) => Promise.reject(error)
=======
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
>>>>>>> frontend-role
);

export default api;