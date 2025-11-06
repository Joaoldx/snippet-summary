'use client';

import type { SnippetResponse } from '@/src/types/snippet';

interface SnippetResultProps {
  snippet: SnippetResponse;
}

export default function SnippetResult({ snippet }: SnippetResultProps) {
  return (
    <div className="w-full space-y-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          ID
        </h3>
        <p className="text-sm text-gray-900 dark:text-gray-100 font-mono break-all">
          {snippet.id}
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Texto
        </h3>
        <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
          {snippet.text}
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Resumo
        </h3>
        <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
          {snippet.summary}
        </p>
      </div>
    </div>
  );
}

