import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SnippetForm from '../SnippetForm';
import { createSnippet, ApiError } from '@/src/api/client';
import type { SnippetResponse } from '@/src/types/snippet';

jest.mock('@/src/api/client', () => ({
  createSnippet: jest.fn(),
  ApiError: class ApiError extends Error {
    constructor(message: string, public status: number) {
      super(message);
      this.name = 'ApiError';
    }
  },
}));

const mockCreateSnippet = createSnippet as jest.MockedFunction<typeof createSnippet>;

describe('SnippetForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the form correctly', () => {
    render(<SnippetForm />);

    expect(screen.getByLabelText(/escreva seu texto/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/escreva seu texto aqui/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument();
  });

  it('should allow typing text in the textarea', async () => {
    const user = userEvent.setup();
    render(<SnippetForm />);

    const textarea = screen.getByLabelText(/escreva seu texto/i);
    await user.type(textarea, 'Meu texto de teste');

    expect(textarea).toHaveValue('Meu texto de teste');
  });

  it('should disable the button when text is empty', () => {
    render(<SnippetForm />);

    const button = screen.getByRole('button', { name: /enviar/i });
    expect(button).toBeDisabled();
  });

  it('should enable the button when there is text', async () => {
    const user = userEvent.setup();
    render(<SnippetForm />);

    const textarea = screen.getByLabelText(/escreva seu texto/i);
    const button = screen.getByRole('button', { name: /enviar/i });

    await user.type(textarea, 'Texto de teste');
    expect(button).not.toBeDisabled();
  });

  it('should show error when trying to submit empty text', async () => {
    const user = userEvent.setup();
    const { container } = render(<SnippetForm />);

    const textarea = screen.getByLabelText(/escreva seu texto/i);
    const form = container.querySelector('form');

    await user.type(textarea, '   ');
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(screen.getByText(/por favor, escreva algum texto/i)).toBeInTheDocument();
    });
  });

  it('should call createSnippet when form is submitted successfully', async () => {
    const user = userEvent.setup();
    const mockResponse: SnippetResponse = {
      id: '123',
      text: 'Texto de teste',
      summary: 'Resumo do texto',
    };

    mockCreateSnippet.mockResolvedValueOnce(mockResponse);

    render(<SnippetForm />);

    const textarea = screen.getByLabelText(/escreva seu texto/i);
    const button = screen.getByRole('button', { name: /enviar/i });

    await user.type(textarea, 'Texto de teste');
    await user.click(button);

    await waitFor(() => {
      expect(mockCreateSnippet).toHaveBeenCalledWith({ text: 'Texto de teste' });
    });

    expect(mockCreateSnippet).toHaveBeenCalledTimes(1);
  });

  it('should clear the textarea after successful submission', async () => {
    const user = userEvent.setup();
    const mockResponse: SnippetResponse = {
      id: '123',
      text: 'Texto de teste',
      summary: 'Resumo',
    };

    mockCreateSnippet.mockResolvedValueOnce(mockResponse);

    render(<SnippetForm />);

    const textarea = screen.getByLabelText(/escreva seu texto/i);
    const button = screen.getByRole('button', { name: /enviar/i });

    await user.type(textarea, 'Texto de teste');
    await user.click(button);

    await waitFor(() => {
      expect(textarea).toHaveValue('');
    });
  });

  it('should show loading state during submission', async () => {
    const user = userEvent.setup();
    const mockResponse: SnippetResponse = {
      id: '123',
      text: 'Texto',
      summary: 'Resumo',
    };

    mockCreateSnippet.mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(() => resolve(mockResponse), 100))
    );

    render(<SnippetForm />);

    const textarea = screen.getByLabelText(/escreva seu texto/i);
    const button = screen.getByRole('button', { name: /enviar/i });

    await user.type(textarea, 'Texto de teste');
    await user.click(button);

    expect(screen.getByText(/enviando/i)).toBeInTheDocument();
    expect(button).toBeDisabled();
    expect(textarea).toBeDisabled();

    await waitFor(() => {
      expect(screen.queryByText(/enviando/i)).not.toBeInTheDocument();
    });
  });

  it('should show error when API returns an error', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Erro ao criar snippet';

    mockCreateSnippet.mockRejectedValueOnce(
      new ApiError(errorMessage, 400)
    );

    render(<SnippetForm />);

    const textarea = screen.getByLabelText(/escreva seu texto/i);
    const button = screen.getByRole('button', { name: /enviar/i });

    await user.type(textarea, 'Texto de teste');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should call onSuccess when snippet is created successfully', async () => {
    const user = userEvent.setup();
    const mockOnSuccess = jest.fn();
    const mockResponse: SnippetResponse = {
      id: '123',
      text: 'Texto',
      summary: 'Resumo',
    };

    mockCreateSnippet.mockResolvedValueOnce(mockResponse);

    render(<SnippetForm onSuccess={mockOnSuccess} />);

    const textarea = screen.getByLabelText(/escreva seu texto/i);
    const button = screen.getByRole('button', { name: /enviar/i });

    await user.type(textarea, 'Texto de teste');
    await user.click(button);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith(mockResponse);
    });
  });

  it('should call onError when an error occurs', async () => {
    const user = userEvent.setup();
    const mockOnError = jest.fn();
    const apiError = new ApiError('Erro na API', 500);

    mockCreateSnippet.mockRejectedValueOnce(apiError);

    render(<SnippetForm onError={mockOnError} />);

    const textarea = screen.getByLabelText(/escreva seu texto/i);
    const button = screen.getByRole('button', { name: /enviar/i });

    await user.type(textarea, 'Texto de teste');
    await user.click(button);

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalled();
    });
  });

  it('should handle error when it is not an ApiError', async () => {
    const user = userEvent.setup();
    const genericError = new Error('Erro genérico');

    mockCreateSnippet.mockRejectedValueOnce(genericError);

    render(<SnippetForm />);

    const textarea = screen.getByLabelText(/escreva seu texto/i);
    const button = screen.getByRole('button', { name: /enviar/i });

    await user.type(textarea, 'Texto de teste');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(/ocorreu um erro inesperado/i)).toBeInTheDocument();
    });
  });

  it('should remove whitespace from text before submitting', async () => {
    const user = userEvent.setup();
    const mockResponse: SnippetResponse = {
      id: '123',
      text: 'Texto',
      summary: 'Resumo',
    };

    mockCreateSnippet.mockResolvedValueOnce(mockResponse);

    render(<SnippetForm />);

    const textarea = screen.getByLabelText(/escreva seu texto/i);
    const button = screen.getByRole('button', { name: /enviar/i });

    await user.type(textarea, '   Texto com espaços   ');
    await user.click(button);

    await waitFor(() => {
      expect(mockCreateSnippet).toHaveBeenCalledWith({ text: 'Texto com espaços' });
    });
  });
});

