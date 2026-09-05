import type { Metadata } from 'next';
import Link from 'next/link';
import { GLOSSARY, getTerm } from '@/content/glossary';
import { SourceList } from '@/components/ui/SourceList';

export const metadata: Metadata = {
  title: 'Glossary',
  description:
    'Definitions for the vocabulary of agentic coding: agentic loop, context window, compaction, CLAUDE.md, hooks, MCP, permission modes, sandboxing, subagents, worktrees, and more.',
  alternates: { canonical: '/reference/glossary/' },
};

export default function GlossaryPage() {
  const sorted = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term));

  return (
    <div className="mx-auto max-w-[70rem] px-4 py-10">
      <nav aria-label="Breadcrumb" className="ca-no-print mb-4 text-sm">
        <Link href="/reference/" className="text-ink-subtle hover:text-ink">
          Reference
        </Link>
      </nav>

      <header className="max-w-[64ch]">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Glossary</h1>
        <p className="mt-3 text-ink-muted">
          {sorted.length} terms, defined the way they are used in practice rather than the way they
          appear in a feature list.
        </p>
      </header>

      <nav aria-label="Terms" className="ca-no-print mt-6">
        <ul className="flex flex-wrap gap-1.5">
          {sorted.map((term) => (
            <li key={term.slug}>
              <a
                href={`#${term.slug}`}
                className="inline-block rounded-chip border border-line bg-surface-2 px-2 py-0.5 text-xs font-medium text-ink-muted hover:text-ink"
              >
                {term.term}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <dl className="mt-8 space-y-6">
        {sorted.map((term) => (
          <div key={term.slug} id={term.slug} className="ca-card scroll-mt-24 p-5">
            <dt className="text-lg font-semibold text-ink">{term.term}</dt>
            <dd className="mt-1.5 text-[0.95rem] text-ink-muted">
              {term.definition}
              {term.seeAlso.length > 0 ? (
                <p className="mt-2 text-sm">
                  <span className="text-ink-subtle">See also: </span>
                  {term.seeAlso.map((slug, index) => (
                    <span key={slug}>
                      {index > 0 ? ', ' : ''}
                      <a href={`#${slug}`} className="text-accent underline underline-offset-[3px]">
                        {getTerm(slug)?.term ?? slug}
                      </a>
                    </span>
                  ))}
                </p>
              ) : null}
              <div className="mt-2">
                <SourceList ids={term.sources} />
              </div>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
