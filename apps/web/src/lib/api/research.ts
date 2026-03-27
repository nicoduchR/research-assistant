import apiClient from './axiosInstance';
import {
  ResearchScope,
  CreateResearchScopeDto,
  KeywordSuggestionsResponse,
} from '@repo/types';

/**
 * Fetch the authenticated user's research scope
 * @returns ResearchScope or null if not found
 */
export const fetchResearchScope = async (): Promise<ResearchScope | null> => {
  try {
    const response = await apiClient.get<ResearchScope>('/research-scopes');
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404 || error.response?.data === null) {
      return null;
    }
    throw error;
  }
};

/**
 * Create or update the authenticated user's research scope
 * @param data Research scope data
 * @returns Created or updated ResearchScope
 */
export const createOrUpdateResearchScope = async (
  data: CreateResearchScopeDto
): Promise<ResearchScope> => {
  const response = await apiClient.post<ResearchScope>('/research-scopes', data);
  return response.data;
};

/**
 * Generate keyword suggestions based on user's scope, documents, and analyses
 */
export const fetchKeywordSuggestions = async (): Promise<KeywordSuggestionsResponse> => {
  const response = await apiClient.get<KeywordSuggestionsResponse>(
    '/research-scopes/keyword-suggestions',
  );
  return response.data;
};
