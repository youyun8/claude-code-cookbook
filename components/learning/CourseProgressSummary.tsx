'use client';

import { LESSON_SLUGS } from '@/data/curriculum';
import { summarize } from '@/lib/progress/actions';
import { useProgress } from '@/components/progress/ProgressProvider';
import { ProgressBar } from '@/components/ui/ProgressBar';
import Link from 'next/link';

export function CourseProgressSummary() {
  const { state, ready } = useProgress();
  const summary = summarize(state, LESSON_SLUGS, []);

  if (!ready || summary.lessonsCompleted === 0) {
    return (
      <p className="rounded-card border border-line bg-surface-2 px-4 py-3 text-sm text-ink-muted">
        Nothing completed yet. Progress is saved in this browser only — no account, and nothing sent
        anywhere.
      </p>
    );
  }

  return (
    <div className="ca-card p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-medium text-ink">
          {summary.lessonsCompleted} of {summary.lessonsTotal} lessons complete
        </p>
        <Link href="/progress/" className="text-sm text-accent underline underline-offset-[3px]">
          Progress dashboard
        </Link>
      </div>
      <div className="mt-2">
        <ProgressBar value={summary.percent} label="Course progress" />
      </div>
      {summary.quizAccuracy !== null ? (
        <p className="mt-2 text-sm text-ink-muted">
          Knowledge checks: {summary.quizCorrect}/{summary.quizTotal} correct (
          {summary.quizAccuracy}%).
        </p>
      ) : null}
    </div>
  );
}
