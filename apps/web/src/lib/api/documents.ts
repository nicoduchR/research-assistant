import apiClient from './axiosInstance';
import { Document } from '@repo/types';

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
