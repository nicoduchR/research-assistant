import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  ResearchScope,
  CreateResearchScopeDto,
  KeywordSuggestionsResponse,
  KeywordSuggestionRunSummary,
} from '@repo/types';
import {
  fetchResearchScope,
  createOrUpdateResearchScope,
  fetchKeywordSuggestions as fetchKeywordSuggestionsApi,
  fetchLatestKeywordSuggestions as fetchLatestKeywordSuggestionsApi,
  fetchKeywordSuggestionHistory as fetchKeywordSuggestionHistoryApi,
  fetchKeywordSuggestionRun as fetchKeywordSuggestionRunApi,
  deleteKeywordSuggestionRun as deleteKeywordSuggestionRunApi,
} from '../api/research';

// Research store state
interface ResearchState {
  scope: ResearchScope | null;
  hasCompletedSetup: boolean;
  isLoading: boolean;
  error: string | null;
  keywordSuggestions: KeywordSuggestionsResponse | null;
  isKeywordSuggestionsLoading: boolean;
  keywordSuggestionsError: string | null;
  keywordSuggestionRuns: KeywordSuggestionRunSummary[];
  isKeywordSuggestionHistoryLoading: boolean;
}

// Research store actions
interface ResearchActions {
  fetchScope: () => Promise<void>;
  createScope: (data: CreateResearchScopeDto) => Promise<ResearchScope>;
  fetchKeywordSuggestions: () => Promise<KeywordSuggestionsResponse>;
  hydrateLatestKeywordSuggestions: () => Promise<void>;
  fetchKeywordSuggestionHistory: () => Promise<void>;
  selectKeywordSuggestionRun: (runId: string) => Promise<void>;
  deleteKeywordSuggestionRun: (runId: string) => Promise<void>;
  clearKeywordSuggestions: () => void;
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
      keywordSuggestions: null,
      isKeywordSuggestionsLoading: false,
      keywordSuggestionsError: null,
      keywordSuggestionRuns: [],
      isKeywordSuggestionHistoryLoading: false,

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

      fetchKeywordSuggestions: async (): Promise<KeywordSuggestionsResponse> => {
        set({ isKeywordSuggestionsLoading: true, keywordSuggestionsError: null });
        try {
          const keywordSuggestions = await fetchKeywordSuggestionsApi();
          set({
            keywordSuggestions,
            isKeywordSuggestionsLoading: false,
            keywordSuggestionsError: null,
          });
          // Refresh history in background so a new entry appears.
          void get().fetchKeywordSuggestionHistory();
          return keywordSuggestions;
        } catch (error: any) {
          console.error('Failed to fetch keyword suggestions:', error);
          const errorMessage =
            error.response?.data?.message ||
            'Failed to generate keyword suggestions';
          set({
            isKeywordSuggestionsLoading: false,
            keywordSuggestionsError: errorMessage,
          });
          throw new Error(errorMessage);
        }
      },

      hydrateLatestKeywordSuggestions: async () => {
        try {
          const latest = await fetchLatestKeywordSuggestionsApi();
          if (latest) {
            set({ keywordSuggestions: latest });
          }
        } catch (error) {
          console.error('Failed to hydrate latest keyword suggestions:', error);
        }
      },

      fetchKeywordSuggestionHistory: async () => {
        set({ isKeywordSuggestionHistoryLoading: true });
        try {
          const runs = await fetchKeywordSuggestionHistoryApi();
          set({
            keywordSuggestionRuns: runs,
            isKeywordSuggestionHistoryLoading: false,
          });
        } catch (error) {
          console.error('Failed to fetch keyword suggestion history:', error);
          set({ isKeywordSuggestionHistoryLoading: false });
        }
      },

      selectKeywordSuggestionRun: async (runId: string) => {
        set({ isKeywordSuggestionsLoading: true, keywordSuggestionsError: null });
        try {
          const run = await fetchKeywordSuggestionRunApi(runId);
          set({
            keywordSuggestions: run,
            isKeywordSuggestionsLoading: false,
          });
        } catch (error: any) {
          console.error('Failed to load keyword suggestion run:', error);
          set({
            isKeywordSuggestionsLoading: false,
            keywordSuggestionsError:
              error.response?.data?.message ||
              'Failed to load keyword suggestion run',
          });
        }
      },

      deleteKeywordSuggestionRun: async (runId: string) => {
        try {
          await deleteKeywordSuggestionRunApi(runId);
          const remaining = get().keywordSuggestionRuns.filter(
            (run) => run.id !== runId,
          );
          set({ keywordSuggestionRuns: remaining });
          // If the run we just deleted was the one being displayed, clear or fall back to the latest remaining run.
          if (get().keywordSuggestions?.id === runId) {
            if (remaining.length === 0) {
              set({ keywordSuggestions: null });
            } else {
              await get().selectKeywordSuggestionRun(remaining[0].id);
            }
          }
        } catch (error: any) {
          console.error('Failed to delete keyword suggestion run:', error);
          throw new Error(
            error.response?.data?.message ||
              'Failed to delete keyword suggestion run',
          );
        }
      },

      clearKeywordSuggestions: () => {
        set({
          keywordSuggestions: null,
          keywordSuggestionsError: null,
          isKeywordSuggestionsLoading: false,
          keywordSuggestionRuns: [],
        });
      },

      // Clear scope (e.g., on logout)
      clearScope: () => {
        set({
          scope: null,
          hasCompletedSetup: false,
          isLoading: false,
          error: null,
          keywordSuggestions: null,
          isKeywordSuggestionsLoading: false,
          keywordSuggestionsError: null,
          keywordSuggestionRuns: [],
          isKeywordSuggestionHistoryLoading: false,
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
