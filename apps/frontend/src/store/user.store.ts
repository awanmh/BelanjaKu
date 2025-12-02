import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Definisi tipe User sesuai respons backend
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'user' | 'seller' | 'admin';
  isVerified: boolean;
}

// Definisi state dan action untuk User Store
interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        console.log("Login action triggered", user); // Debugging
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        console.log("Logout action triggered"); // Debugging
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (userData) => 
        set((state) => ({
            user: state.user ? { ...state.user, ...userData } : null 
        })),
    }),
    {
      name: 'belanjaku-storage', // Nama key di localStorage
      storage: createJSONStorage(() => localStorage), // Gunakan localStorage
      partialize: (state) => ({ 
          user: state.user, 
          token: state.token, 
          isAuthenticated: state.isAuthenticated 
      }), // Hanya simpan state ini
    }
  )
);