import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import apiClient from '../api/axiosInstance';

// User interface matching backend JWT payload
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
}

// Auth store state
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Auth store actions
interface AuthActions {
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// Combined auth store type
type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      // Set user action
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
          error: null,
        }),

      // Logout action
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          // Call backend logout endpoint to clear cookie
          // Backend will redirect to /?loggedOut=true
          await apiClient.get('/auth/logout');

          // Clear auth state
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });

          // No redirect here - let backend's 302 redirect handle it
        } catch (error) {
          console.error('Logout failed:', error);
          // Clear state anyway (best effort)
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Logout failed, but session cleared locally',
          });
          // Force redirect even if backend failed
          window.location.href = '/';
        }
      },

      // Initialize auth state from backend
      initializeAuth: async () => {
        try {
          // Call /api/v1/auth/profile to validate JWT and get user data
          const response = await apiClient.get('/auth/profile');

          // Map backend user data to frontend User interface
          set({
            user: {
              id: response.data.id,
              email: response.data.email,
              name: response.data.name,
              avatarUrl: response.data.avatarUrl || '',
            },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          // Not authenticated or session expired (401 handled by axios interceptor)
          console.error('Auth initialization failed:', error);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      // Set error
      setError: (error) => set({ error }),

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage', // Storage key
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage for security
      partialize: (state) => ({
        // Only persist user data, not loading/error states
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
