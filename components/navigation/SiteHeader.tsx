'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { SearchDialog } from './SearchDialog';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { CourseNav } from './CourseNav';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const LINKS = [
  { href: '/learn/', label: 'Learn' },
  { href: '/clinic/', label: 'Prompt clinic' },
  { href: '/recipes/', label: 'Recipes' },
  { href: '/safety/', label: 'Safety lab' },
  { href: '/reference/', label: 'Reference' },
  { href: '/progress/', label: 'Progress' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const inCourse = pathname.startsWith('/learn');

  return (
    <header className="ca-no-print sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[90rem] items-center gap-3 px-4">
        {inCourse ? (
          <Dialog.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
            <Dialog.Trigger className="rounded-chip border border-line bg-surface-2 px-2.5 py-1.5 text-sm text-ink-muted lg:hidden">
              <span aria-hidden="true">☰</span>
              <span className="sr-only">Open course navigation</span>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 lg:hidden" />
              <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-[min(20rem,85vw)] overflow-y-auto border-r border-line bg-surface p-4 lg:hidden">
                <Dialog.Title className="mb-3 text-sm font-semibold text-ink">
                  Course modules
                </Dialog.Title>
                <Dialog.Description className="sr-only">
                  Navigate between the ten lessons in the learning path.
                </Dialog.Description>
                <CourseNav onNavigate={() => setDrawerOpen(false)} />
                <Dialog.Close className="mt-4 w-full rounded-chip border border-line bg-surface-2 px-3 py-1.5 text-sm font-medium text-ink">
                  Close
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        ) : null}

        <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold text-ink">
          <span
            aria-hidden="true"
            className="grid h-6 w-6 place-items-center rounded-[7px] border border-accent-line bg-accent-soft text-[13px] text-accent"
          >
            ⌘
          </span>
          <span className="hidden sm:inline">Claude Code Academy</span>
          <span className="sm:hidden">Academy</span>
        </Link>

        <nav aria-label="Main" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {LINKS.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={`rounded-chip px-2.5 py-1.5 text-sm transition-colors ${
                      active
                        ? 'bg-surface-2 font-medium text-ink'
                        : 'text-ink-muted hover:bg-surface-2 hover:text-ink'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <SearchDialog />
          <KeyboardShortcuts />
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-line px-4 py-1.5 lg:hidden">
        <nav aria-label="Main, compact" className="min-w-0 flex-1">
          <ul className="flex items-center gap-1 overflow-x-auto">
            {LINKS.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <li key={link.href} className="shrink-0">
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={`rounded-chip px-2.5 py-1 text-sm transition-colors ${
                      active ? 'bg-surface-2 font-medium text-ink' : 'text-ink-muted'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="shrink-0 sm:hidden">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
