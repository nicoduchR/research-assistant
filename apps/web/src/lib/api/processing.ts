import apiClient from './axiosInstance';
import { ProcessingJobResponse } from '@repo/types';

export const createProcessingJob = async (
  documentIds: string[],
): Promise<ProcessingJobResponse> => {
  const response = await apiClient.post<ProcessingJobResponse>(
    '/processing-jobs',
    { documentIds },
  );
  return response.data;
};

export const getProcessingJob = async (
  jobId: string,
): Promise<ProcessingJobResponse> => {
  const response = await apiClient.get<ProcessingJobResponse>(
    `/processing-jobs/${jobId}`,
  );
  return response.data;
};
