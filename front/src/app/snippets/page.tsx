'use client';

import { useState, useEffect } from 'react';
import SnippetResult from '@/src/components/SnippetResult';
import type { SnippetResponse } from '@/src/types/snippet';
import { getSnippets } from '@/src/api/client';

export default function SnippetsPage() {
  const [snippets, setSnippets] = useState<SnippetResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSnippets();
        setSnippets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar snippets');
        console.error('Erro ao carregar snippets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSnippets();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center py-16 px-4 sm:px-8 lg:px-16 bg-white dark:bg-black">
        <div className="w-full space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-black dark:text-zinc-50">
              Meus Snippets
            </h1>
            <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              Visualize todos os seus snippets criados
            </p>
          </div>

          {loading && (
            <div className="text-center py-8">
              <p className="text-zinc-600 dark:text-zinc-400">Carregando...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {!loading && !error && snippets.length === 0 && (
            <div className="text-center py-8">
              <p className="text-zinc-600 dark:text-zinc-400">
                Nenhum snippet encontrado. Crie seu primeiro snippet!
              </p>
            </div>
          )}

          {!loading && !error && snippets.length > 0 && (
            <div className="w-full space-y-6">
              {snippets.map((snippet) => (
                <div key={snippet.id} className="w-full">
                  <SnippetResult snippet={snippet} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

