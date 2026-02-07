import { create } from 'zustand';
import {
  getLiteratureReview,
  updateLiteratureReview,
  LiteratureReviewResponse,
} from '../api/literature-reviews';

interface LiteratureReviewState {
  review: LiteratureReviewResponse | null;
  isLoading: boolean;
  error: string | null;
  isEditing: boolean;
  editContent: string;
  editTitle: string;
  isSaving: boolean;
}

interface LiteratureReviewActions {
  fetchReview: (reviewId: string) => Promise<void>;
  startEditing: () => void;
  cancelEditing: () => void;
  setEditContent: (content: string) => void;
  setEditTitle: (title: string) => void;
  saveEdits: (reviewId: string) => Promise<void>;
  reset: () => void;
}

type LiteratureReviewStore = LiteratureReviewState & LiteratureReviewActions;

const initialState: LiteratureReviewState = {
  review: null,
  isLoading: false,
  error: null,
  isEditing: false,
  editContent: '',
  editTitle: '',
  isSaving: false,
};

export const useLiteratureReviewStore = create<LiteratureReviewStore>()(
  (set, get) => ({
    ...initialState,

    fetchReview: async (reviewId: string) => {
      set({ isLoading: true, error: null });
      try {
        const review = await getLiteratureReview(reviewId);
        set({ review, isLoading: false, error: null });
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : 'Failed to load literature review';
        set({ isLoading: false, error: message });
      }
    },

    startEditing: () => {
      const { review } = get();
      if (review) {
        set({
          isEditing: true,
          editContent: review.content,
          editTitle: review.title,
        });
      }
    },

    cancelEditing: () => {
      set({
        isEditing: false,
        editContent: '',
        editTitle: '',
      });
    },

    setEditContent: (content: string) => {
      set({ editContent: content });
    },

    setEditTitle: (title: string) => {
      set({ editTitle: title });
    },

    saveEdits: async (reviewId: string) => {
      set({ isSaving: true });
      try {
        const { editTitle, editContent, review } = get();
        const changes: { title?: string; content?: string } = {};
        if (editTitle !== review?.title) changes.title = editTitle;
        if (editContent !== review?.content) changes.content = editContent;
        const updated = await updateLiteratureReview(reviewId, changes);
        set({
          review: updated,
          isEditing: false,
          editContent: '',
          editTitle: '',
          isSaving: false,
        });
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : 'Failed to save changes';
        set({ isSaving: false, error: message });
        throw error;
      }
    },

    reset: () => {
      set(initialState);
    },
  }),
);
