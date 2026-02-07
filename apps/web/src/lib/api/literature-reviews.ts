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
