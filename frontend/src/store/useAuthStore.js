import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      login: (userData) => set({ user: userData }),
      logout: () => set({ user: null }),
      isAuthenticated: () => get().user !== null,
    }),
    { 
      name: 'auth-storage',
      version: 1,
    }
  )
);

export default useAuthStore;
