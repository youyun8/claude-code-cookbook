'use client';

import Link from 'next/link';
import { LESSONS, LESSON_SLUGS, getLesson } from '@/data/curriculum';
import { nextLessonSlug, summarize } from '@/lib/progress/actions';
import { useProgress } from '@/components/progress/ProgressProvider';
import { ProgressBar } from '@/components/ui/ProgressBar';

/**
 * The resume affordance. Before progress loads it renders the neutral
 * "start the course" state, so there is no flash of the wrong call to
 * action and no layout shift.
 */
export function ContinueLearning({ variant = 'card' }: { variant?: 'card' | 'inline' }) {
  const { state, ready } = useProgress();
  const summary = summarize(state, LESSON_SLUGS, []);
  const started = ready && summary.lessonsCompleted > 0;
  const target = ready ? nextLessonSlug(state, LESSON_SLUGS) : LESSON_SLUGS[0];
  const lesson = target ? getLesson(target) : LESSONS[0];

  if (!lesson) return null;

  const label = started ? 'Continue where you left off' : 'Start the learning path';

  if (variant === 'inline') {
    return (
      <Link
        href={`/learn/${lesson.slug}/`}
        className="inline-flex items-center gap-2 rounded-chip border border-accent bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-hover"
      >
        {label}
        <span aria-hidden="true">→</span>
      </Link>
    );
  }

  return (
    <div className="ca-card p-5">
      <p className="text-[11px] uppercase tracking-wide text-ink-subtle">
        {started ? 'Your next lesson' : 'Begin here'}
      </p>
      <h2 className="mt-1 text-lg font-semibold text-ink">
        {lesson.moduleNumber}. {lesson.title}
      </h2>
      <p className="mt-1.5 text-sm text-ink-muted">{lesson.summary}</p>

      {started ? (
        <div className="mt-4">
          <ProgressBar
            value={summary.lessonsCompleted}
            max={summary.lessonsTotal}
            label="Course progress"
            size="sm"
          />
          <p className="mt-1.5 text-xs text-ink-subtle">
            {summary.lessonsCompleted} of {summary.lessonsTotal} lessons complete
          </p>
        </div>
      ) : null}

      <Link
        href={`/learn/${lesson.slug}/`}
        className="mt-4 inline-flex items-center gap-2 rounded-chip border border-accent bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-hover"
      >
        {label}
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
