import apiClient from './axiosInstance';

export interface LiteratureReviewResponse {
  id: string;
  jobId: string;
  title: string;
  content: string;
  documentIds: string[];
  citations: {
    id: string;
    documentId: string;
    pageNumber: number | null;
    claimText: string;
    positionInReview: number;
    isVerified: boolean;
    userNotes: string | null;
  }[];
  createdAt: string;
  updatedAt: string;
}

export const getLiteratureReview = async (
  reviewId: string,
): Promise<LiteratureReviewResponse> => {
  const response = await apiClient.get<LiteratureReviewResponse>(
    `/literature-reviews/${reviewId}`,
  );
  return response.data;
};

export const updateLiteratureReview = async (
  reviewId: string,
  data: { title?: string; content?: string },
): Promise<LiteratureReviewResponse> => {
  const response = await apiClient.put<LiteratureReviewResponse>(
    `/literature-reviews/${reviewId}`,
    data,
  );
  return response.data;
};

export type { BibliographyExportResponse } from '@repo/types';
import type { BibliographyExportResponse } from '@repo/types';

export const exportBibliography = async (
  reviewId: string,
  format: string,
): Promise<BibliographyExportResponse> => {
  const response = await apiClient.get<BibliographyExportResponse>(
    `/literature-reviews/${reviewId}/bibliography`,
    { params: { format } },
  );
  return response.data;
};

export const downloadAsFile = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const copyToClipboard = async (content: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(content);
    return true;
  } catch {
    return false;
  }
};
