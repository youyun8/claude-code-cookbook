'use client';

import { useState } from 'react';
import type { QuizQuestion } from '@/content/types';
import { useProgress } from '@/components/progress/ProgressProvider';
import { useAnnounce } from '@/components/ui/Announcer';

/**
 * Knowledge check.
 *
 * The score recorded is first-attempt accuracy, so retrying to read the
 * explanations never inflates it — and the stored value keeps the best
 * result, so retaking a quiz is never punished either.
 */
export function Quiz({ lessonSlug, questions }: { lessonSlug: string; questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const { recordQuiz, state } = useProgress();
  const announce = useAnnounce();

  const answered = questions.filter((question) => answers[question.id]).length;
  const correct = questions.filter(
    (question) => answers[question.id] === question.correctOptionId,
  ).length;
  const previous = state.quizzes[lessonSlug];

  function submit() {
    setSubmitted(true);
    recordQuiz(lessonSlug, {
      correct,
      total: questions.length,
      completedAt: new Date().toISOString(),
    });
    announce(`Knowledge check submitted. ${correct} of ${questions.length} correct.`);
  }

  return (
    <section
      aria-labelledby="knowledge-check"
      className="my-8 rounded-panel border border-violet-line bg-violet-soft/40 p-5"
    >
      <h2 id="knowledge-check" className="!mt-0 flex items-center gap-2 text-xl font-semibold">
        <span aria-hidden="true" className="text-violet">
          ✦
        </span>
        Knowledge check
      </h2>
      <p className="mb-4 text-sm text-ink-muted">
        {questions.length} questions. Explanations appear after you submit, whether you were right
        or not.
        {previous ? (
          <>
            {' '}
            Your best result so far: {previous.correct}/{previous.total}.
          </>
        ) : null}
      </p>

      <ol className="space-y-5">
        {questions.map((question, index) => {
          const chosen = answers[question.id];
          return (
            <li key={question.id}>
              <fieldset>
                <legend className="mb-2 text-[0.95rem] font-medium text-ink">
                  <span className="mr-1.5 text-ink-subtle">{index + 1}.</span>
                  {question.prompt}
                </legend>
                <ul className="space-y-1.5">
                  {question.options.map((option) => {
                    const selected = chosen === option.id;
                    const isCorrect = option.id === question.correctOptionId;
                    const tone = !submitted
                      ? selected
                        ? 'border-accent-line bg-accent-soft'
                        : 'border-line bg-surface hover:bg-surface-2'
                      : isCorrect
                        ? 'border-success-line bg-success-soft'
                        : selected
                          ? 'border-danger-line bg-danger-soft'
                          : 'border-line bg-surface opacity-70';
                    return (
                      <li key={option.id}>
                        <label
                          className={`flex cursor-pointer gap-3 rounded-card border p-2.5 ${tone}`}
                        >
                          <input
                            type="radio"
                            name={question.id}
                            value={option.id}
                            checked={selected}
                            disabled={submitted}
                            onChange={() =>
                              setAnswers((previousAnswers) => ({
                                ...previousAnswers,
                                [question.id]: option.id,
                              }))
                            }
                            className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--ca-accent)]"
                          />
                          <span className="text-sm text-ink">
                            {submitted && isCorrect ? (
                              <span aria-hidden="true" className="mr-1 font-semibold text-success">
                                ✓
                              </span>
                            ) : null}
                            {submitted && selected && !isCorrect ? (
                              <span aria-hidden="true" className="mr-1 font-semibold text-danger">
                                ✕
                              </span>
                            ) : null}
                            {option.text}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
                {submitted ? (
                  <p className="mt-2 rounded-card border border-line bg-surface px-3 py-2 text-sm text-ink-muted">
                    <span className="font-semibold text-ink">Why: </span>
                    {question.explanation}
                  </p>
                ) : null}
              </fieldset>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {!submitted ? (
          <button
            type="button"
            onClick={submit}
            disabled={answered < questions.length}
            className="rounded-chip border border-accent bg-accent px-4 py-1.5 text-sm font-medium text-accent-ink disabled:cursor-not-allowed disabled:opacity-45"
          >
            Submit answers
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setAnswers({});
            }}
            className="rounded-chip border border-line bg-surface px-4 py-1.5 text-sm font-medium text-ink"
          >
            Try again
          </button>
        )}
        <p aria-live="polite" className="text-sm text-ink-muted">
          {submitted
            ? `${correct} of ${questions.length} correct.`
            : `${answered} of ${questions.length} answered.`}
        </p>
      </div>
    </section>
  );
}
