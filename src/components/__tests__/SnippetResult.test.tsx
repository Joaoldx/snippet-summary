import { render, screen } from '@testing-library/react';
import SnippetResult from '../SnippetResult';
import type { SnippetResponse } from '@/src/types/snippet';

describe('SnippetResult', () => {
  const mockSnippet: SnippetResponse = {
    id: '123e4567-e68b-12d3-a456-426614174000',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    summary: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  };

  it('should render the component with snippet data', () => {
    render(<SnippetResult snippet={mockSnippet} />);

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText(mockSnippet.id)).toBeInTheDocument();
    expect(screen.getByText('Texto')).toBeInTheDocument();
    expect(screen.getByText(mockSnippet.text)).toBeInTheDocument();
    expect(screen.getByText('Resumo')).toBeInTheDocument();
    expect(screen.getByText(mockSnippet.summary)).toBeInTheDocument();
  });

  it('should render the ID correctly', () => {
    render(<SnippetResult snippet={mockSnippet} />);

    const idElement = screen.getByText(mockSnippet.id);
    expect(idElement).toBeInTheDocument();
    expect(idElement.closest('p')).toHaveClass('font-mono', 'break-all');
  });

  it('should render the Texto with preserved line breaks', () => {
    const snippetWithNewlines: SnippetResponse = {
      ...mockSnippet,
      text: 'Linha 1\nLinha 2\nLinha 3',
    };

    render(<SnippetResult snippet={snippetWithNewlines} />);

    const textElement = screen.getByText((content, element) => {
      return element?.textContent === snippetWithNewlines.text;
    });
    expect(textElement).toBeInTheDocument();
    expect(textElement.closest('p')).toHaveClass('whitespace-pre-wrap');
    expect(textElement.textContent).toBe('Linha 1\nLinha 2\nLinha 3');
  });

  it('should render the summary with preserved line breaks', () => {
    const snippetWithNewlines: SnippetResponse = {
      ...mockSnippet,
      summary: 'Resumo linha 1\nResumo linha 2',
    };

    render(<SnippetResult snippet={snippetWithNewlines} />);

    const summaryElement = screen.getByText((content, element) => {
      return element?.textContent === snippetWithNewlines.summary;
    });
    expect(summaryElement).toBeInTheDocument();
    expect(summaryElement.closest('p')).toHaveClass('whitespace-pre-wrap');
    expect(summaryElement.textContent).toBe('Resumo linha 1\nResumo linha 2');
  });

  it('should render with different snippet values', () => {
    const differentSnippet: SnippetResponse = {
      id: 'another-id',
      text: 'Texto diferente',
      summary: 'Resumo diferente',
    };

    render(<SnippetResult snippet={differentSnippet} />);

    expect(screen.getByText(differentSnippet.id)).toBeInTheDocument();
    expect(screen.getByText(differentSnippet.text)).toBeInTheDocument();
    expect(screen.getByText(differentSnippet.summary)).toBeInTheDocument();
  });

  it('should render with empty text', () => {
    const emptySnippet: SnippetResponse = {
      id: 'empty-id',
      text: '',
      summary: '',
    };

    render(<SnippetResult snippet={emptySnippet} />);

    expect(screen.getByText(emptySnippet.id)).toBeInTheDocument();
    const textElements = screen.getAllByText('');
    expect(textElements.length).toBeGreaterThan(0);
  });
});

