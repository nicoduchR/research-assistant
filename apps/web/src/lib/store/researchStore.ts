import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ResearchScope, CreateResearchScopeDto } from '@repo/types';
import { fetchResearchScope, createOrUpdateResearchScope } from '../api/research';

// Research store state
interface ResearchState {
  scope: ResearchScope | null;
  hasCompletedSetup: boolean;
  isLoading: boolean;
  error: string | null;
}

// Research store actions
interface ResearchActions {
  fetchScope: () => Promise<void>;
  createScope: (data: CreateResearchScopeDto) => Promise<ResearchScope>;
  clearScope: () => void;
  setError: (error: string | null) => void;
}

// Combined research store type
type ResearchStore = ResearchState & ResearchActions;

export const useResearchStore = create<ResearchStore>()(
  persist(
    (set, get) => ({
      // Initial state
      scope: null,
      hasCompletedSetup: false,
      isLoading: false,
      error: null,

      // Fetch user's research scope
      fetchScope: async () => {
        set({ isLoading: true, error: null });
        try {
          const scope = await fetchResearchScope();
          set({
            scope,
            hasCompletedSetup: !!scope,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          console.error('Failed to fetch research scope:', error);
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to load research scope',
          });
        }
      },

      // Create or update research scope
      createScope: async (data: CreateResearchScopeDto): Promise<ResearchScope> => {
        set({ isLoading: true, error: null });
        try {
          const scope = await createOrUpdateResearchScope(data);
          set({
            scope,
            hasCompletedSetup: true,
            isLoading: false,
            error: null,
          });
          return scope;
        } catch (error: any) {
          console.error('Failed to create research scope:', error);
          const errorMessage =
            error.response?.data?.message || 'Failed to save research scope';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw new Error(errorMessage);
        }
      },

      // Clear scope (e.g., on logout)
      clearScope: () => {
        set({
          scope: null,
          hasCompletedSetup: false,
          isLoading: false,
          error: null,
        });
      },

      // Set error
      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: 'research-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        scope: state.scope,
        hasCompletedSetup: state.hasCompletedSetup,
      }),
    }
  )
);
