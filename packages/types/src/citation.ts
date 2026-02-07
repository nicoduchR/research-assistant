export interface Citation {
  id: string;
  literatureReviewId: string;
  documentId: string;
  pageNumber: number | null;
  claimText: string;
  positionInReview: number;
  isVerified: boolean;
  userNotes: string | null;
  createdAt: Date;
}

export interface CitationResponse {
  id: string;
  literatureReviewId: string;
  documentId: string;
  pageNumber: number | null;
  claimText: string;
  positionInReview: number;
  isVerified: boolean;
  userNotes: string | null;
  createdAt: string;
}
