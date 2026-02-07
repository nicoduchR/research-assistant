export interface LiteratureReview {
  id: string;
  userId: string;
  jobId: string;
  title: string;
  content: string;
  documentIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LiteratureReviewResponse {
  id: string;
  jobId: string;
  title: string;
  content: string;
  documentIds: string[];
  createdAt: string;
  updatedAt: string;
}
