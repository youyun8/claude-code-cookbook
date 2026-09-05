import type { Metadata } from 'next';
import Link from 'next/link';
import { REFERENCE } from '@/content/reference/entries';
import { GLOSSARY } from '@/content/glossary';
import { ALL_SOURCES, CONTENT_LAST_REVIEWED } from '@/data/sources';
import { ExternalLink } from '@/components/ui/ExternalLink';

export const metadata: Metadata = {
  title: 'Reference',
  description:
    'A compact reference: the mental model, prompt checklist, session commands, project files, permissions and sandboxing, extension mechanisms, git safety, troubleshooting, and a glossary.',
  alternates: { canonical: '/reference/' },
};

export default function ReferencePage() {
  return (
    <div className="mx-auto max-w-[76rem] px-4 py-10">
      <header className="max-w-[64ch]">
        <p className="text-[11px] uppercase tracking-wide text-ink-subtle">Look it up</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">Reference</h1>
        <p className="mt-3 text-ink-muted">
          Short pages for the things you look up rather than read. Everything version-sensitive
          links to the official documentation, with the date it was last checked.
        </p>
        <p className="mt-2 text-sm text-ink-subtle">
          Technical content last reviewed{' '}
          <time dateTime={CONTENT_LAST_REVIEWED} className="font-medium text-ink">
            {CONTENT_LAST_REVIEWED}
          </time>
          . Claude Code changes frequently — treat anything undated as needing a check.
        </p>
      </header>

      <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {REFERENCE.map((entry) => (
          <li key={entry.slug}>
            <Link
              href={`/reference/${entry.slug}/`}
              className="ca-card block h-full p-4 transition-colors hover:border-line-strong"
            >
              <h2 className="font-semibold text-ink">{entry.title}</h2>
              <p className="mt-1.5 text-sm text-ink-muted">{entry.summary}</p>
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/reference/glossary/"
            className="ca-card block h-full p-4 transition-colors hover:border-line-strong"
          >
            <h2 className="font-semibold text-ink">Glossary</h2>
            <p className="mt-1.5 text-sm text-ink-muted">
              {GLOSSARY.length} terms, defined the way they are used in practice.
            </p>
          </Link>
        </li>
      </ul>

      <section aria-labelledby="sources" className="mt-12">
        <h2 id="sources" className="text-xl font-semibold text-ink">
          Every source this site cites
        </h2>
        <p className="mt-2 max-w-[64ch] text-ink-muted">
          The official documentation is the authority. Where this site and a linked page disagree,
          the linked page is right and this site needs updating.
        </p>
        <div className="mt-4 overflow-x-auto rounded-card border border-line">
          <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
            <caption className="sr-only">
              Documentation pages cited by this site, with the date each was last reviewed.
            </caption>
            <thead className="bg-surface-2">
              <tr>
                <th scope="col" className="border-b border-line px-3 py-2 font-semibold text-ink">
                  Page
                </th>
                <th scope="col" className="border-b border-line px-3 py-2 font-semibold text-ink">
                  Last reviewed
                </th>
              </tr>
            </thead>
            <tbody>
              {ALL_SOURCES.map((source) => (
                <tr key={source.id} className="even:bg-surface-2/50">
                  <td className="border-b border-line px-3 py-2">
                    <ExternalLink href={source.url}>{source.title}</ExternalLink>
                  </td>
                  <td className="border-b border-line px-3 py-2 text-ink-muted">
                    <time dateTime={source.lastReviewed}>{source.lastReviewed}</time>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
