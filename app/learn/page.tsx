import Link from 'next/link';
import type { Metadata } from 'next';
import { LESSONS, LEVELS, LEVEL_BLURB, TOTAL_MINUTES, getLesson } from '@/data/curriculum';
import { LessonCard } from '@/components/learning/LessonCard';
import { CourseProgressSummary } from '@/components/learning/CourseProgressSummary';

export const metadata: Metadata = {
  title: 'Learning path',
  description:
    'Ten modules from installation to team-scale automation: prompting, verification, context, project instructions, permissions, extension mechanisms, and daily workflows.',
  alternates: { canonical: '/learn/' },
};

export default function LearnHubPage() {
  return (
    <div className="py-10">
      <header className="max-w-[62ch]">
        <p className="text-[11px] uppercase tracking-wide text-ink-subtle">The curriculum</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">Learning path</h1>
        <p className="mt-3 text-ink-muted">
          Ten modules, in order. Each one ends with a review checklist and a short knowledge check,
          and several contain interactive labs. The whole path is about{' '}
          {Math.round(TOTAL_MINUTES / 60)} hours if you do the exercises.
        </p>
        <p className="mt-2 text-sm text-ink-subtle">
          Working through them in sequence is recommended — later modules assume the vocabulary of
          earlier ones — but every lesson is self-contained enough to read on its own. The three
          levels below are thematic, so a module&rsquo;s number and its level do not always line up:
          module 8 is everyday git work, while module 7 covers extension mechanisms.
        </p>
      </header>

      <div className="my-8">
        <CourseProgressSummary />
      </div>

      {LEVELS.map((level) => {
        const lessons = LESSONS.filter((lesson) => lesson.level === level);
        return (
          <section key={level} aria-labelledby={`level-${level}`} className="mb-10">
            <div className="mb-4 border-b border-line pb-2">
              <h2 id={`level-${level}`} className="text-xl font-semibold text-ink">
                {level}
              </h2>
              <p className="mt-1 text-sm text-ink-muted">{LEVEL_BLURB[level]}</p>
            </div>
            <ul className="space-y-3">
              {lessons.map((lesson) => (
                <li key={lesson.slug}>
                  <LessonCard lesson={lesson} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <aside className="ca-card p-5">
        <h2 className="text-lg font-semibold text-ink">Alongside the modules</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-3">
          <li>
            <Link
              href="/clinic/"
              className="block rounded-card border border-line p-3 hover:border-line-strong"
            >
              <span className="font-medium text-ink">Prompt clinic</span>
              <span className="mt-1 block text-sm text-ink-muted">
                Score a task prompt against a transparent rubric and improve it step by step.
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/recipes/"
              className="block rounded-card border border-line p-3 hover:border-line-strong"
            >
              <span className="font-medium text-ink">Workflow recipes</span>
              <span className="mt-1 block text-sm text-ink-muted">
                Fifteen copyable prompts, each with verification and recovery steps.
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/safety/"
              className="block rounded-card border border-line p-3 hover:border-line-strong"
            >
              <span className="font-medium text-ink">Safety lab</span>
              <span className="mt-1 block text-sm text-ink-muted">
                Seven scenarios where the right answer is narrower scope, not refusal.
              </span>
            </Link>
          </li>
        </ul>
        <p className="mt-4 text-sm text-ink-subtle">
          Module 1 starts with{' '}
          <Link
            href={`/learn/${LESSONS[0]?.slug}/`}
            className="text-accent underline underline-offset-[3px]"
          >
            {getLesson(LESSONS[0]?.slug ?? '')?.title}
          </Link>
          .
        </p>
      </aside>
    </div>
  );
}
