'use client';

import * as Dialog from '@radix-ui/react-dialog';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { KIND_LABEL, search } from '@/lib/search';

/**
 * Global search over lessons, recipes, glossary terms, reference entries,
 * and safety scenarios.
 *
 * Radix supplies the focus trap, escape handling, and aria wiring; only the
 * `/` shortcut is ours, and it deliberately does nothing while the reader
 * is typing in a field.
 */
export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const results = useMemo(() => search(query), [query]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target !== null &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable === true);
      if (event.key === '/' && !typing && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="flex items-center gap-2 rounded-chip border border-line bg-surface-2 px-3 py-1.5 text-sm text-ink-subtle transition-colors hover:border-line-strong hover:text-ink">
        <span aria-hidden="true">⌕</span>
        <span className="hidden sm:inline">Search</span>
        <kbd className="ml-1 hidden rounded border border-line bg-surface px-1 font-mono text-[10px] sm:inline">
          /
        </kbd>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed left-1/2 top-[10vh] z-50 w-[min(38rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-panel border border-line-strong bg-surface shadow-raised">
          <Dialog.Title className="sr-only">Search Claude Code Cookbook</Dialog.Title>
          <Dialog.Description className="sr-only">
            Search lessons, recipes, glossary terms, reference entries, and safety scenarios.
          </Dialog.Description>

          <div className="flex items-center gap-2 border-b border-line px-4 py-3">
            <span aria-hidden="true" className="text-ink-subtle">
              ⌕
            </span>
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search lessons, recipes, glossary…"
              aria-label="Search"
              className="w-full bg-transparent text-[0.95rem] text-ink outline-none placeholder:text-ink-subtle"
            />
          </div>

          <div className="max-h-[55vh] overflow-y-auto">
            {query.trim().length < 2 ? (
              <p className="px-4 py-6 text-sm text-ink-subtle">
                Type at least two characters. Try “verification”, “hook”, “context window”, or
                “prompt injection”.
              </p>
            ) : results.length === 0 ? (
              <p className="px-4 py-6 text-sm text-ink-subtle" role="status">
                No matches for “{query}”.
              </p>
            ) : (
              <ul role="list" className="divide-y divide-[color:var(--ca-border)]">
                {results.map((hit) => (
                  <li key={hit.id}>
                    <Link
                      href={hit.href}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-3 transition-colors hover:bg-surface-2"
                    >
                      <span className="flex items-baseline gap-2">
                        <span className="rounded-chip border border-line bg-surface-2 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-ink-subtle">
                          {KIND_LABEL[hit.kind]}
                        </span>
                        <span className="text-sm font-medium text-ink">{hit.title}</span>
                      </span>
                      <span className="mt-1 block line-clamp-2 text-sm text-ink-muted">
                        {hit.summary}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-line bg-surface-2 px-4 py-2 text-[11px] text-ink-subtle">
            <span aria-hidden="true">↑↓</span> to move · <span aria-hidden="true">↵</span> to open ·
            <span aria-hidden="true"> Esc</span> to close
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
