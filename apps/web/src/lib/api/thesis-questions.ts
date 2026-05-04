import apiClient from './axiosInstance';
import type {
  EbscoQueryResponse,
  ThesisAnswerDraft,
  ThesisQuestion,
  ThesisQuestionStatus,
  EvidenceRow,
} from '@repo/types';

export const bootstrapThesisQuestions = async (): Promise<ThesisQuestion[]> => {
  const response = await apiClient.post<ThesisQuestion[]>('/thesis-questions/bootstrap');
  return response.data;
};

export const listThesisQuestions = async (): Promise<ThesisQuestion[]> => {
  const response = await apiClient.get<ThesisQuestion[]>('/thesis-questions');
  return response.data;
};

export const updateThesisQuestion = async (
  questionId: string,
  data: {
    status?: ThesisQuestionStatus;
    title?: string;
    questionText?: string;
  },
): Promise<ThesisQuestion> => {
  const response = await apiClient.patch<ThesisQuestion>(
    `/thesis-questions/${questionId}`,
    data,
  );
  return response.data;
};

export const generateThesisAnswer = async (
  questionId: string,
): Promise<ThesisAnswerDraft> => {
  const response = await apiClient.post<ThesisAnswerDraft>(
    `/thesis-questions/${questionId}/generate-answer`,
  );
  return response.data;
};

export const getThesisDraft = async (
  questionId: string,
): Promise<ThesisAnswerDraft | null> => {
  const response = await apiClient.get<ThesisAnswerDraft | null>(
    `/thesis-questions/${questionId}/draft`,
  );
  return response.data;
};

export const saveThesisDraft = async (
  questionId: string,
  data: {
    answerMarkdown?: string;
    evidenceRows?: EvidenceRow[];
    gaps?: string[];
    confidenceScore?: number;
    status?: ThesisQuestionStatus;
  },
): Promise<ThesisAnswerDraft> => {
  const response = await apiClient.put<ThesisAnswerDraft>(
    `/thesis-questions/${questionId}/draft`,
    data,
  );
  return response.data;
};

export const generateThesisEbscoQueries = async (
  questionId: string,
): Promise<EbscoQueryResponse> => {
  const response = await apiClient.post<EbscoQueryResponse>(
    `/thesis-questions/${questionId}/ebsco-queries`,
  );
  return response.data;
};
