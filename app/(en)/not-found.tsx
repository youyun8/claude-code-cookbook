import Link from 'next/link';
import type { Metadata } from 'next';
import { LESSONS } from '@/data/curriculum';

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'That page does not exist. Here is the way back into the curriculum.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <p className="text-[11px] uppercase tracking-wide text-ink-subtle">Error 404</p>
      <h1 className="mt-2 text-3xl font-semibold text-ink">That page does not exist</h1>
      <p className="mt-3 text-ink-muted">
        The link may be out of date, or the address may have a typo. Everything on this site is
        reachable from the sections below, and search is in the header.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {[
          {
            href: '/learn/',
            title: 'Learning path',
            blurb: 'Ten modules, foundations to automation.',
          },
          { href: '/clinic/', title: 'Prompt clinic', blurb: 'Score and improve a task prompt.' },
          {
            href: '/recipes/',
            title: 'Workflow recipes',
            blurb: 'Fifteen copyable prompts with checks.',
          },
          {
            href: '/reference/',
            title: 'Reference',
            blurb: 'Commands, files, permissions, glossary.',
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="ca-card p-4 transition-colors hover:border-line-strong"
          >
            <p className="font-medium text-ink">{item.title}</p>
            <p className="mt-1 text-sm text-ink-muted">{item.blurb}</p>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-sm text-ink-muted">
        Or start at the beginning:{' '}
        <Link
          href={`/learn/${LESSONS[0]?.slug ?? ''}/`}
          className="text-accent underline underline-offset-[3px]"
        >
          {LESSONS[0]?.title}
        </Link>
        .
      </p>
    </div>
  );
}
