import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { LESSONS, getLesson, neighbours } from '@/data/curriculum';
import { BlockRenderer } from '@/components/learning/BlockRenderer';
import { Quiz } from '@/components/learning/Quiz';
import { LessonActions } from '@/components/learning/LessonActions';
import { TableOfContents } from '@/components/navigation/TableOfContents';
import { SourceList } from '@/components/ui/SourceList';
import { Chip } from '@/components/ui/Chip';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return LESSONS.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) return { title: 'Lesson not found' };

  return {
    title: `${lesson.title} — Module ${lesson.moduleNumber}`,
    description: lesson.summary,
    alternates: { canonical: `/learn/${lesson.slug}/` },
    openGraph: {
      type: 'article',
      title: `${lesson.title} — Module ${lesson.moduleNumber}`,
      description: lesson.summary,
      url: `/learn/${lesson.slug}/`,
    },
  };
}

export default async function LessonPage({ params }: PageProps) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  const { previous, next } = neighbours(lesson.slug);

  return (
    <div className="flex gap-8 py-10">
      <article className="min-w-0 flex-1">
        <nav aria-label="Breadcrumb" className="ca-no-print mb-4 text-sm">
          <Link href="/learn/" className="text-ink-subtle hover:text-ink">
            Learning path
          </Link>
          <span aria-hidden="true" className="mx-2 text-ink-subtle">
            /
          </span>
          <span className="text-ink-muted">{lesson.level}</span>
        </nav>

        <header className="ca-prose">
          <p className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide text-ink-subtle">
            <span className="font-mono">Module {String(lesson.moduleNumber).padStart(2, '0')}</span>
            <span aria-hidden="true">·</span>
            <span>{lesson.minutes} min</span>
          </p>
          <h1 className="mt-1.5 text-[2.1rem] font-semibold leading-tight tracking-tight text-ink">
            {lesson.title}
          </h1>
          <p className="mt-3 text-lg text-ink-muted">{lesson.summary}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Chip tone={lesson.level === 'Advanced systems' ? 'violet' : 'neutral'}>
              {lesson.level}
            </Chip>
            {lesson.prerequisites.length > 0 ? (
              <Chip icon="←">
                Follows{' '}
                {lesson.prerequisites
                  .map((prerequisite) => getLesson(prerequisite)?.title ?? prerequisite)
                  .join(', ')}
              </Chip>
            ) : (
              <Chip icon="●">No prerequisites</Chip>
            )}
          </div>

          <section
            aria-labelledby="objectives"
            className="mt-6 rounded-panel border border-line bg-surface-2 p-4"
          >
            <h2 id="objectives" className="!mt-0 !mb-2 text-base font-semibold text-ink">
              After this lesson you will be able to
            </h2>
            <ul className="!mb-0 space-y-1 text-[0.95rem] text-ink-muted">
              {lesson.objectives.map((objective) => (
                <li key={objective}>{objective}</li>
              ))}
            </ul>
          </section>
        </header>

        <div className="ca-prose mt-2">
          <BlockRenderer blocks={lesson.blocks} />
        </div>

        <section
          aria-labelledby="review-checklist"
          className="my-8 rounded-panel border border-success-line bg-success-soft/40 p-5"
        >
          <h2
            id="review-checklist"
            className="flex items-center gap-2 text-xl font-semibold text-ink"
          >
            <span aria-hidden="true" className="text-success">
              ✓
            </span>
            Review checklist
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Work through this before you call the lesson done — or before your next real session.
          </p>
          <ul className="mt-3 space-y-2">
            {lesson.checklist.map((item) => (
              <li key={item} className="flex gap-2.5 text-[0.95rem] text-ink-muted">
                <span aria-hidden="true" className="mt-0.5 text-success">
                  ☐
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <Quiz lessonSlug={lesson.slug} questions={lesson.quiz} />

        <SourceList
          ids={lesson.sources}
          note="Every version-sensitive claim in this lesson links to one of these pages. Check them before relying on a command, flag, or schema."
        />

        <LessonActions slug={lesson.slug} title={lesson.title} />

        <nav aria-label="Lesson navigation" className="ca-no-print mt-8 grid gap-3 sm:grid-cols-2">
          {previous ? (
            <Link
              href={`/learn/${previous.slug}/`}
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
              href={`/learn/${next.slug}/`}
              className="ca-card p-4 text-right hover:border-line-strong"
            >
              <span className="text-[11px] uppercase tracking-wide text-ink-subtle">Next</span>
              <span className="mt-1 block font-medium text-ink">
                {next.title}
                <span aria-hidden="true"> →</span>
              </span>
            </Link>
          ) : (
            <Link href="/recipes/" className="ca-card p-4 text-right hover:border-line-strong">
              <span className="text-[11px] uppercase tracking-wide text-ink-subtle">
                You have reached the end
              </span>
              <span className="mt-1 block font-medium text-ink">
                Workflow recipes
                <span aria-hidden="true"> →</span>
              </span>
            </Link>
          )}
        </nav>
      </article>

      <aside className="ca-no-print sticky top-20 hidden h-fit w-52 shrink-0 py-2 xl:block">
        <TableOfContents blocks={lesson.blocks} />
      </aside>
    </div>
  );
}
