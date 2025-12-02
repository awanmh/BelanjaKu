import axios from 'axios';
// Hapus import useUserStore jika belum ada file-nya atau belum digunakan
// import { useUserStore } from '@/store/user.store'; 

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

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
);

export default api;