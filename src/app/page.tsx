'use client';

import { useState } from 'react';
import SnippetForm from '@/src/components/SnippetForm';
import SnippetResult from '@/src/components/SnippetResult';
import type { SnippetResponse } from '@/src/types/snippet';

export default function Home() {
  const [snippet, setSnippet] = useState<SnippetResponse | null>(null);

  const handleSuccess = (response: SnippetResponse) => {
    setSnippet(response);
  };

  const handleError = (error: Error) => {
    console.error('Error creating snippet:', error);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center py-16 px-4 sm:px-8 lg:px-16 bg-white dark:bg-black">
        <div className="w-full space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-black dark:text-zinc-50">
              Snippet
            </h1>
            <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              Digite seu texto para gerar um resumo
            </p>
          </div>

          <div className="w-full">
            <SnippetForm onSuccess={handleSuccess} onError={handleError} />
          </div>

          {snippet && (
            <div className="w-full">
              <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-4">
                Result
              </h2>
              <SnippetResult snippet={snippet} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
