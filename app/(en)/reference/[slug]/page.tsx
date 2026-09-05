import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { REFERENCE, getReferenceEntry } from '@/content/reference/entries';
import { BlockRenderer } from '@/components/learning/BlockRenderer';
import { SourceList } from '@/components/ui/SourceList';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return REFERENCE.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getReferenceEntry(slug);
  if (!entry) return { title: 'Reference entry not found' };

  return {
    title: entry.title,
    description: entry.summary,
    alternates: { canonical: `/reference/${entry.slug}/` },
    openGraph: { type: 'article', title: entry.title, description: entry.summary },
  };
}

export default async function ReferenceEntryPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getReferenceEntry(slug);
  if (!entry) notFound();

  const index = REFERENCE.findIndex((item) => item.slug === entry.slug);
  const previous = REFERENCE[index - 1];
  const next = REFERENCE[index + 1];

  return (
    <div className="mx-auto max-w-[52rem] px-4 py-10">
      <nav aria-label="Breadcrumb" className="ca-no-print mb-4 text-sm">
        <Link href="/reference/" className="text-ink-subtle hover:text-ink">
          Reference
        </Link>
      </nav>

      <header className="ca-prose">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">{entry.title}</h1>
        <p className="mt-2 text-lg text-ink-muted">{entry.summary}</p>
      </header>

      <div className="ca-prose mt-6">
        <BlockRenderer blocks={entry.blocks} />
      </div>

      <SourceList ids={entry.sources} />

      <nav aria-label="Reference navigation" className="ca-no-print mt-8 grid gap-3 sm:grid-cols-2">
        {previous ? (
          <Link
            href={`/reference/${previous.slug}/`}
            className="ca-card p-4 hover:border-line-strong"
          >
            <span className="text-[11px] uppercase tracking-wide text-ink-subtle">Previous</span>
            <span className="mt-1 block font-medium text-ink">
              <span aria-hidden="true">← </span>
              {previous.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/reference/${next.slug}/`}
            className="ca-card p-4 text-right hover:border-line-strong"
          >
            <span className="text-[11px] uppercase tracking-wide text-ink-subtle">Next</span>
            <span className="mt-1 block font-medium text-ink">
              {next.title}
              <span aria-hidden="true"> →</span>
            </span>
          </Link>
        ) : (
          <Link
            href="/reference/glossary/"
            className="ca-card p-4 text-right hover:border-line-strong"
          >
            <span className="text-[11px] uppercase tracking-wide text-ink-subtle">Next</span>
            <span className="mt-1 block font-medium text-ink">
              Glossary
              <span aria-hidden="true"> →</span>
            </span>
          </Link>
        )}
      </nav>
    </div>
  );
}
