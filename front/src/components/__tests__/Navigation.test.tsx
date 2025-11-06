import { render, screen } from '@testing-library/react';
import Navigation from '../Navigation';
import { usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe('Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render navigation links', () => {
    mockUsePathname.mockReturnValue('/');

    render(<Navigation />);

    expect(screen.getByText(/inserir snippet/i)).toBeInTheDocument();
    expect(screen.getByText(/meus snippets/i)).toBeInTheDocument();
  });

  it('should highlight the "Insert Snippet" link when on the home page', () => {
    mockUsePathname.mockReturnValue('/');

    render(<Navigation />);

    const insertSnippetLink = screen.getByText(/inserir snippet/i).closest('a');
    const mySnippetsLink = screen.getByText(/meus snippets/i).closest('a');

    expect(insertSnippetLink).toHaveClass('text-black', 'dark:text-zinc-50', 'border-black', 'dark:border-zinc-50');
    expect(mySnippetsLink).not.toHaveClass('text-black', 'dark:text-zinc-50');
  });

  it('should highlight the "My Snippets" link when on the snippets page', () => {
    mockUsePathname.mockReturnValue('/snippets');

    render(<Navigation />);

    const insertSnippetLink = screen.getByText(/inserir snippet/i).closest('a');
    const mySnippetsLink = screen.getByText(/meus snippets/i).closest('a');

    expect(mySnippetsLink).toHaveClass('text-black', 'dark:text-zinc-50', 'border-black', 'dark:border-zinc-50');
    expect(insertSnippetLink).not.toHaveClass('text-black', 'dark:text-zinc-50');
  });

  it('should have links with correct href attributes', () => {
    mockUsePathname.mockReturnValue('/');

    render(<Navigation />);

    const insertSnippetLink = screen.getByText(/inserir snippet/i).closest('a');
    const mySnippetsLink = screen.getByText(/meus snippets/i).closest('a');

    expect(insertSnippetLink).toHaveAttribute('href', '/');
    expect(mySnippetsLink).toHaveAttribute('href', '/snippets');
  });

  it('should apply hover styles when link is not active', () => {
    mockUsePathname.mockReturnValue('/');

    render(<Navigation />);

    const mySnippetsLink = screen.getByText(/meus snippets/i).closest('a');
    
    expect(mySnippetsLink).toHaveClass(
      'hover:text-black',
      'dark:hover:text-zinc-50',
      'hover:border-zinc-300',
      'dark:hover:border-zinc-700'
    );
  });

  it('should render correctly on different routes', () => {
    mockUsePathname.mockReturnValue('/outra-rota');

    render(<Navigation />);

    const insertSnippetLink = screen.getByText(/inserir snippet/i).closest('a');
    const mySnippetsLink = screen.getByText(/meus snippets/i).closest('a');

    expect(insertSnippetLink).not.toHaveClass('text-black', 'dark:text-zinc-50');
    expect(mySnippetsLink).not.toHaveClass('text-black', 'dark:text-zinc-50');
  });

  it('should have the correct HTML structure', () => {
    mockUsePathname.mockReturnValue('/');

    const { container } = render(<Navigation />);

    const nav = container.querySelector('nav');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass('w-full', 'border-b', 'border-zinc-200', 'dark:border-zinc-800');
  });
});

