import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ThesisQuestionsPage from '../app/thesis-questions/page';
import * as thesisApi from '@/src/lib/api/thesis-questions';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('@/src/components/Header', () => () => <div>Header</div>);
jest.mock('@/src/components/molecules/Toast/ToastContainer', () => ({
  ToastContainer: () => <div>ToastContainer</div>,
}));

const addToast = jest.fn();
jest.mock('@/src/lib/store/toastStore', () => ({
  useToastStore: (selector: (state: { addToast: typeof addToast }) => unknown) =>
    selector({ addToast }),
}));

jest.mock('@/src/lib/api/thesis-questions', () => ({
  bootstrapThesisQuestions: jest.fn(),
  generateThesisAnswer: jest.fn(),
  generateThesisEbscoQueries: jest.fn(),
  getThesisDraft: jest.fn(),
  saveThesisDraft: jest.fn(),
  updateThesisQuestion: jest.fn(),
}));

const mockApi = thesisApi as jest.Mocked<typeof thesisApi>;

describe('ThesisQuestionsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockApi.bootstrapThesisQuestions.mockResolvedValue([
      {
        id: 'question-1',
        userId: 'user-1',
        researchScopeId: 'scope-1',
        code: 'Q1',
        section: 'S1',
        title: 'Question title',
        questionText: 'Question text',
        targetReferences: ['Vial (2019)'],
        status: 'a_traiter',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
    mockApi.getThesisDraft.mockResolvedValue(null);
    mockApi.updateThesisQuestion.mockResolvedValue({
      id: 'question-1',
      status: 'a_traiter',
    });
    mockApi.saveThesisDraft.mockResolvedValue({
      id: 'draft-1',
      questionId: 'question-1',
      answerMarkdown: 'draft',
      evidenceRows: [],
      gaps: [],
      confidenceScore: 0,
      generatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  });

  it('generates a thesis answer for the selected question', async () => {
    mockApi.generateThesisAnswer.mockResolvedValue({
      id: 'draft-1',
      questionId: 'question-1',
      answerMarkdown: '## Reponse\nTexte',
      evidenceRows: [],
      gaps: [],
      confidenceScore: 75,
      generatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    render(<ThesisQuestionsPage />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Question title' }),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Generer reponse'));

    await waitFor(() => {
      expect(mockApi.generateThesisAnswer).toHaveBeenCalledWith('question-1');
    });

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('La reponse generee apparaitra ici...'),
      ).toHaveValue('## Reponse\nTexte');
    });
  });

  it('generates EBSCO queries for the selected question', async () => {
    mockApi.generateThesisEbscoQueries.mockResolvedValue({
      generatedAt: new Date().toISOString(),
      basedOn: {
        documentCount: 1,
        analyzedDocumentCount: 1,
        citationCount: 2,
      },
      queries: [
        {
          label: 'Query angle',
          query: '"digital transformation" AND "industry 4.0"',
          rationale: 'Useful query',
          intent: 'deepen',
        },
      ],
    });

    render(<ThesisQuestionsPage />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Question title' }),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Requetes EBSCO'));
    fireEvent.click(screen.getByText('Generer requetes EBSCO'));

    await waitFor(() => {
      expect(mockApi.generateThesisEbscoQueries).toHaveBeenCalledWith(
        'question-1',
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Query angle')).toBeInTheDocument();
    });
  });
});
