import type { SnippetRequest, SnippetResponse } from '@/src/types/snippet';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function createSnippet(
  data: SnippetRequest
): Promise<SnippetResponse> {
  const url = `${API_BASE_URL}/snippets`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || 'Falha ao criar o snippet',
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Erro de conexão',
      0
    );
  }
}

export async function getSnippets(): Promise<SnippetResponse[]> {
  const url = `${API_BASE_URL}/snippets`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || 'Failed to fetch snippets',
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      throw new ApiError(
        'Sem rsposta do servidor. Verifique se o backend está rodando corretamente.',
        500
      );
    }
    
    throw new ApiError(
      error instanceof Error ? error.message : 'Erro de conexão',
      500
    );
  }
}

