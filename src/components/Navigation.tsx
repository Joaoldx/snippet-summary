'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="flex items-center h-16">
          <div className="flex space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors py-4 px-1 border-b-2 ${
                pathname === '/'
                  ? 'text-black dark:text-zinc-50 border-black dark:border-zinc-50'
                  : 'text-zinc-600 dark:text-zinc-400 border-transparent hover:text-black dark:hover:text-zinc-50 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              Inserir Snippet
            </Link>
            <Link
              href="/snippets"
              className={`text-sm font-medium transition-colors py-4 px-1 border-b-2 ${
                pathname === '/snippets'
                  ? 'text-black dark:text-zinc-50 border-black dark:border-zinc-50'
                  : 'text-zinc-600 dark:text-zinc-400 border-transparent hover:text-black dark:hover:text-zinc-50 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              Meus Snippets
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

