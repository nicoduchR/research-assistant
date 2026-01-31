import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ResearchScopeForm } from './ResearchScopeForm';
import { CreateResearchScopeDto } from '@repo/types';

describe('ResearchScopeForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders all form fields', () => {
    render(<ResearchScopeForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/research title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/research question.*problématique/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/research objectives/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save & continue/i })).toBeInTheDocument();
  });

  it('displays validation errors for empty required fields', async () => {
    render(<ResearchScopeForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /save & continue/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/research question is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('displays validation error when problematique is too short', async () => {
    render(<ResearchScopeForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/research title/i);
    const problematiqueInput = screen.getByLabelText(/research question.*problématique/i);

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(problematiqueInput, { target: { value: 'Short text' } });

    const submitButton = screen.getByRole('button', { name: /save & continue/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/at least 50 characters/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const validData: CreateResearchScopeDto = {
      title: 'Impact of Digital Marketing on SME Growth',
      problematique: 'This research investigates how digital marketing strategies influence the growth patterns and market reach of small and medium enterprises.',
      objectives: 'To identify key digital marketing channels used by SMEs',
    };

    render(<ResearchScopeForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/research title/i);
    const problematiqueInput = screen.getByLabelText(/research question.*problématique/i);
    const objectivesInput = screen.getByLabelText(/research objectives/i);

    fireEvent.change(titleInput, { target: { value: validData.title } });
    fireEvent.change(problematiqueInput, { target: { value: validData.problematique } });
    fireEvent.change(objectivesInput, { target: { value: validData.objectives } });

    const submitButton = screen.getByRole('button', { name: /save & continue/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: validData.title,
        problematique: validData.problematique,
        objectives: validData.objectives,
      });
    });
  });

  it('trims whitespace from input values', async () => {
    render(<ResearchScopeForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/research title/i);
    const problematiqueInput = screen.getByLabelText(/research question.*problématique/i);

    fireEvent.change(titleInput, { target: { value: '  Test Title  ' } });
    fireEvent.change(problematiqueInput, {
      target: { value: '  This is a research question with at least 50 characters in total.  ' },
    });

    const submitButton = screen.getByRole('button', { name: /save & continue/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Title',
        problematique: 'This is a research question with at least 50 characters in total.',
        objectives: undefined,
      });
    });
  });

  it('shows loading state when isLoading is true', () => {
    render(<ResearchScopeForm onSubmit={mockOnSubmit} isLoading={true} />);

    const submitButton = screen.getByRole('button', { name: /saving/i });
    expect(submitButton).toBeDisabled();
  });

  it('populates form with initial data', () => {
    const initialData: CreateResearchScopeDto = {
      title: 'Existing Title',
      problematique: 'Existing problematique with enough characters to pass validation',
      objectives: 'Existing objectives',
    };

    render(<ResearchScopeForm onSubmit={mockOnSubmit} initialData={initialData} />);

    expect(screen.getByDisplayValue(initialData.title)).toBeInTheDocument();
    expect(screen.getByDisplayValue(initialData.problematique)).toBeInTheDocument();
    expect(screen.getByDisplayValue(initialData.objectives!)).toBeInTheDocument();
  });
});
