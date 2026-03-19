import apiClient, { API_BASE_URL } from './axiosInstance';
import { Document, DocumentAnalysis } from '@repo/types';

export const uploadDocument = async (
  file: File,
  onProgress?: (progress: number) => void,
): Promise<Document> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<Document>('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (event.total && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    },
  });

  return response.data;
};

export const listDocuments = async (): Promise<Document[]> => {
  const response = await apiClient.get<Document[]>('/documents');
  return response.data;
};

export const deleteDocument = async (id: string): Promise<void> => {
  await apiClient.delete(`/documents/${id}`);
};

export const getDocumentAnalysis = async (id: string): Promise<DocumentAnalysis> => {
  const response = await apiClient.get<DocumentAnalysis>(`/documents/${id}/analysis`);
  return response.data;
};

export const discardDocumentCitation = async (
  documentId: string,
  citationIndex: number,
): Promise<DocumentAnalysis> => {
  const response = await apiClient.delete<DocumentAnalysis>(
    `/documents/${documentId}/analysis/citations/${citationIndex}`,
  );
  return response.data;
};

export const getDocumentFileUrl = (documentId: string): string => {
  return `${API_BASE_URL}/api/v1/documents/${documentId}/file`;
};
