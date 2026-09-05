'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { LESSONS, LESSON_SLUGS, getLesson } from '@/data/curriculum';
import { RECIPES, getRecipe } from '@/data/recipes';
import { SAFETY_SCENARIOS } from '@/content/safety';
import { summarize } from '@/lib/progress/actions';
import { useProgress } from '@/components/progress/ProgressProvider';
import { useAnnounce } from '@/components/ui/Announcer';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Stamp } from '@/components/ui/Stamp';
import { ContinueLearning } from '@/components/learning/ContinueLearning';

const LAB_IDS = [
  ...SAFETY_SCENARIOS.map((scenario) => `safety:${scenario.id}`),
  'lab:permission-decision',
  'lab:diff-review',
  'lab:guided-fix',
];

const LAB_LABELS: Record<string, string> = {
  'lab:permission-decision': 'Permission decision lab',
  'lab:diff-review': 'Diff review exercise',
  'lab:guided-fix': 'Guided lab: fix a failing function',
  ...Object.fromEntries(
    SAFETY_SCENARIOS.map((scenario) => [`safety:${scenario.id}`, `Safety: ${scenario.title}`]),
  ),
};

export function ProgressDashboard() {
  const { state, ready, storage, reset, exportJson, importJson } = useProgress();
  const announce = useAnnounce();
  const fileInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const summary = summarize(state, LESSON_SLUGS, LAB_IDS);
  const bookmarkedLessons = state.bookmarks.filter((id) => id.startsWith('lesson:'));
  const bookmarkedRecipes = state.bookmarks.filter((id) => id.startsWith('recipe:'));

  function download() {
    const blob = new Blob([exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'claude-code-academy-progress.json';
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    announce('Progress exported as a JSON file.');
    setMessage({ tone: 'ok', text: 'Exported claude-code-academy-progress.json.' });
  }

  async function onFile(file: File) {
    const text = await file.text();
    const result = importJson(text);
    if (result.ok) {
      const notes = result.notes.length > 0 ? ` ${result.notes.join(' ')}` : '';
      setMessage({ tone: 'ok', text: `Progress imported.${notes}` });
      announce('Progress imported successfully.');
    } else {
      setMessage({ tone: 'error', text: result.error });
      announce('Import failed. The file could not be read as progress data.');
    }
  }

  if (!ready) {
    return (
      <p className="rounded-card border border-line bg-surface-2 px-4 py-6 text-sm text-ink-muted">
        Reading your saved progress…
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {storage === 'unavailable' ? (
        <p className="rounded-card border border-warning-line bg-warning-soft px-4 py-3 text-sm text-warning">
          <span aria-hidden="true">▲</span> Browser storage is unavailable in this context — a
          private window, or site data blocked. The site works normally, but progress will not
          survive a reload.
        </p>
      ) : null}

      <section aria-labelledby="overall" className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <div className="ca-card p-5">
          <h2 id="overall" className="text-lg font-semibold text-ink">
            Overall
          </h2>
          <p className="mt-3 text-4xl font-semibold text-ink">{summary.percent}%</p>
          <p className="text-sm text-ink-muted">
            {summary.lessonsCompleted} of {summary.lessonsTotal} lessons complete
          </p>
          <div className="mt-3">
            <ProgressBar value={summary.percent} label="Course completion" />
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink-subtle">Quiz accuracy</dt>
              <dd className="mt-0.5 text-xl font-semibold text-ink">
                {summary.quizAccuracy === null ? '—' : `${summary.quizAccuracy}%`}
              </dd>
              <dd className="text-xs text-ink-subtle">
                {summary.quizTotal === 0
                  ? 'No quizzes taken yet'
                  : `${summary.quizCorrect} of ${summary.quizTotal} questions`}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink-subtle">Labs completed</dt>
              <dd className="mt-0.5 text-xl font-semibold text-ink">
                {summary.labsCompleted}
                <span className="text-sm font-normal text-ink-subtle">/{summary.labsTotal}</span>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink-subtle">Bookmarks</dt>
              <dd className="mt-0.5 text-xl font-semibold text-ink">{summary.bookmarks}</dd>
            </div>
          </dl>
        </div>

        <ContinueLearning />
      </section>

      <section aria-labelledby="modules">
        <h2 id="modules" className="text-lg font-semibold text-ink">
          Modules
        </h2>
        <ul className="mt-3 space-y-2">
          {LESSONS.map((lesson) => {
            const done = state.completedLessons.includes(lesson.slug);
            const quiz = state.quizzes[lesson.slug];
            return (
              <li
                key={lesson.slug}
                className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-line bg-surface px-4 py-3"
              >
                <span className="min-w-0">
                  <Link
                    href={`/learn/${lesson.slug}/`}
                    className="font-medium text-ink hover:text-accent"
                  >
                    <span className="font-mono text-xs text-ink-subtle">
                      {String(lesson.moduleNumber).padStart(2, '0')}
                    </span>{' '}
                    {lesson.title}
                  </Link>
                  {quiz ? (
                    <span className="mt-0.5 block text-sm text-ink-muted">
                      Knowledge check: {quiz.correct}/{quiz.total}
                    </span>
                  ) : null}
                </span>
                {done ? <Stamp /> : <span className="text-sm text-ink-subtle">Not started</span>}
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="labs">
        <h2 id="labs" className="text-lg font-semibold text-ink">
          Labs and scenarios
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {LAB_IDS.map((id) => {
            const done = state.completedLabs.includes(id);
            return (
              <li
                key={id}
                className="flex items-center justify-between gap-3 rounded-card border border-line bg-surface px-3 py-2 text-sm"
              >
                <span className="min-w-0 text-ink-muted">{LAB_LABELS[id] ?? id}</span>
                <span
                  className={`shrink-0 text-xs font-medium ${done ? 'text-success' : 'text-ink-subtle'}`}
                >
                  <span aria-hidden="true">{done ? '✓' : '·'}</span> {done ? 'Done' : 'Not yet'}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="bookmarks">
        <h2 id="bookmarks" className="text-lg font-semibold text-ink">
          Bookmarks
        </h2>
        {state.bookmarks.length === 0 ? (
          <p className="mt-2 rounded-card border border-line bg-surface-2 px-4 py-3 text-sm text-ink-muted">
            Nothing bookmarked yet. Use the star on any{' '}
            <Link href="/recipes/" className="text-accent underline underline-offset-[3px]">
              recipe
            </Link>{' '}
            or lesson to keep it here.
          </p>
        ) : (
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-ink">Lessons</h3>
              <ul className="mt-1.5 space-y-1 text-sm">
                {bookmarkedLessons.length === 0 ? (
                  <li className="text-ink-subtle">None</li>
                ) : (
                  bookmarkedLessons.map((id) => {
                    const slug = id.slice('lesson:'.length);
                    return (
                      <li key={id}>
                        <Link href={`/learn/${slug}/`} className="text-ink-muted hover:text-ink">
                          ★ {getLesson(slug)?.title ?? slug}
                        </Link>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-ink">Recipes</h3>
              <ul className="mt-1.5 space-y-1 text-sm">
                {bookmarkedRecipes.length === 0 ? (
                  <li className="text-ink-subtle">None</li>
                ) : (
                  bookmarkedRecipes.map((id) => {
                    const slug = id.slice('recipe:'.length);
                    return (
                      <li key={id}>
                        <Link href={`/recipes/${slug}/`} className="text-ink-muted hover:text-ink">
                          ★ {getRecipe(slug)?.title ?? slug}
                        </Link>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          </div>
        )}
        <p className="mt-2 text-xs text-ink-subtle">
          {RECIPES.length} recipes available to bookmark.
        </p>
      </section>

      <section aria-labelledby="data" className="ca-card p-5">
        <h2 id="data" className="text-lg font-semibold text-ink">
          Your data
        </h2>
        <p className="mt-2 max-w-[64ch] text-sm text-ink-muted">
          Progress lives in this browser&rsquo;s local storage and nowhere else. There is no
          account, no server, and no analytics. Export it to move to another browser, or to keep a
          copy before clearing site data.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={download}
            className="rounded-chip border border-accent bg-accent px-3.5 py-1.5 text-sm font-medium text-accent-ink"
          >
            Export progress
          </button>

          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="rounded-chip border border-line bg-surface px-3.5 py-1.5 text-sm font-medium text-ink"
          >
            Import progress
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            aria-label="Choose a progress JSON file to import"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void onFile(file);
              event.target.value = '';
            }}
          />

          {confirmReset ? (
            <>
              <button
                type="button"
                onClick={() => {
                  reset();
                  setConfirmReset(false);
                  setMessage({ tone: 'ok', text: 'All progress cleared.' });
                  announce('All progress has been cleared.');
                }}
                className="rounded-chip border border-danger bg-danger-soft px-3.5 py-1.5 text-sm font-medium text-danger"
              >
                Yes, delete everything
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="rounded-chip border border-line bg-surface px-3.5 py-1.5 text-sm font-medium text-ink-muted"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="rounded-chip border border-line bg-surface px-3.5 py-1.5 text-sm font-medium text-ink-muted"
            >
              Reset progress
            </button>
          )}
        </div>

        <div aria-live="polite" className="mt-3">
          {message ? (
            <p
              className={`rounded-card border px-3 py-2 text-sm ${
                message.tone === 'ok'
                  ? 'border-success-line bg-success-soft text-success'
                  : 'border-danger-line bg-danger-soft text-danger'
              }`}
            >
              <span aria-hidden="true">{message.tone === 'ok' ? '✓' : '■'}</span> {message.text}
            </p>
          ) : null}
        </div>

        <p className="mt-3 text-xs text-ink-subtle">
          The export is readable JSON with a <code>version</code> field. Importing a file from an
          older release upgrades it; a file that is not progress data is rejected without touching
          what you have.
        </p>
      </section>
    </div>
  );
}
