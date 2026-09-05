'use client';

import Link from 'next/link';
import type { Lesson } from '@/content/types';
import { getLesson } from '@/data/curriculum';
import { useProgress } from '@/components/progress/ProgressProvider';
import { Stamp } from '@/components/ui/Stamp';

export function LessonCard({ lesson }: { lesson: Lesson }) {
  const { state, ready } = useProgress();
  const done = ready && state.completedLessons.includes(lesson.slug);
  const quiz = state.quizzes[lesson.slug];

  return (
    <article className="ca-card p-4 transition-colors hover:border-line-strong">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide text-ink-subtle">
            <span className="font-mono">Module {String(lesson.moduleNumber).padStart(2, '0')}</span>
            <span aria-hidden="true">·</span>
            <span>{lesson.minutes} min</span>
          </p>
          <h3 className="mt-1 text-lg font-semibold">
            <Link href={`/learn/${lesson.slug}/`} className="text-ink hover:text-accent">
              {lesson.title}
            </Link>
          </h3>
          <p className="mt-1 max-w-[68ch] text-sm text-ink-muted">{lesson.summary}</p>
        </div>
        {done ? <Stamp /> : null}
      </div>

      <details className="mt-3">
        <summary className="cursor-pointer text-sm font-medium text-ink-muted hover:text-ink">
          Learning objectives and prerequisites
        </summary>
        <div className="mt-2 space-y-2 text-sm text-ink-muted">
          <div>
            <p className="font-medium text-ink">After this lesson you will be able to:</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-5">
              {lesson.objectives.map((objective) => (
                <li key={objective}>{objective}</li>
              ))}
            </ul>
          </div>
          <p>
            <span className="font-medium text-ink">Prerequisites: </span>
            {lesson.prerequisites.length === 0
              ? 'None.'
              : lesson.prerequisites.map((slug) => getLesson(slug)?.title ?? slug).join(', ')}
          </p>
          {quiz ? (
            <p>
              <span className="font-medium text-ink">Knowledge check: </span>
              {quiz.correct} of {quiz.total} correct.
            </p>
          ) : null}
        </div>
      </details>
    </article>
  );
}
