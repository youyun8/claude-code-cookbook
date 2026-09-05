'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LESSONS } from '@/data/curriculum';
import { useProgress } from '@/components/progress/ProgressProvider';

/**
 * The persistent course navigation.
 *
 * Deliberately a single ordered list rather than one grouped by level:
 * levels are thematic and not contiguous in module order, so grouping made
 * the numbering look shuffled. Each item carries its level as a label
 * instead. Completion is shown with a glyph and a screen-reader label as
 * well as colour, so the state is never carried by colour alone.
 */
export function CourseNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { state, ready } = useProgress();

  return (
    <nav aria-label="Course modules" className="text-sm">
      <h2 className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">
        Learning path
      </h2>
      <ol className="space-y-0.5">
        {LESSONS.map((lesson, index) => {
          const href = `/learn/${lesson.slug}/`;
          const current = pathname === href || pathname === href.slice(0, -1);
          const done = ready && state.completedLessons.includes(lesson.slug);
          const previousLevel = index === 0 ? null : LESSONS[index - 1]?.level;
          const startsLevel = lesson.level !== previousLevel;

          return (
            <li key={lesson.slug}>
              {startsLevel ? (
                <p className="mb-1 mt-4 px-2 text-[11px] font-semibold uppercase tracking-wide text-ink-subtle first:mt-0">
                  {lesson.level}
                </p>
              ) : null}
              <Link
                href={href}
                onClick={onNavigate}
                aria-current={current ? 'page' : undefined}
                className={`flex items-start gap-2 rounded-chip px-2 py-1.5 transition-colors ${
                  current
                    ? 'bg-accent-soft font-medium text-ink'
                    : 'text-ink-muted hover:bg-surface-2 hover:text-ink'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border text-[9px] leading-none ${
                    done
                      ? 'border-success bg-success-soft text-success'
                      : 'border-line-strong text-ink-subtle'
                  }`}
                >
                  {done ? '✓' : lesson.moduleNumber}
                </span>
                <span className="min-w-0">
                  {lesson.title}
                  {done ? <span className="sr-only"> (completed)</span> : null}
                  <span className="block text-[11px] text-ink-subtle">{lesson.minutes} min</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
