'use client';

import { useState, FormEvent } from 'react';
import { createSnippet, ApiError } from '@/src/api/client';
import type { SnippetResponse } from '@/src/types/snippet';

interface SnippetFormProps {
  onSuccess?: (response: SnippetResponse) => void;
  onError?: (error: Error) => void;
}

export default function SnippetForm({ onSuccess, onError }: SnippetFormProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Por favor, escreva algum texto');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await createSnippet({ text: text.trim() });
      setText('');
      onSuccess?.(response);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : 'Ocorreu um erro inesperado';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div>
        <label
          htmlFor="snippet-text"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Escreva seu texto
        </label>
        <textarea
          id="snippet-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escreva seu texto aqui..."
          rows={6}
          disabled={loading}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !text.trim()}
        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {loading ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
}

