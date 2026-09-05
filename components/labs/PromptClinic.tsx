'use client';

import { useMemo, useState } from 'react';
import {
  CRITERIA,
  TASK_TYPES,
  emphasisFor,
  scorePrompt,
  type CriterionId,
  type TaskType,
} from '@/lib/prompt-rubric';
import { CLINIC_EXAMPLES } from '@/content/clinic-examples';
import { CopyButton } from '@/components/ui/CopyButton';
import { ProgressBar } from '@/components/ui/ProgressBar';

/**
 * The clinic scores structure, not correctness.
 *
 * The whole rubric is deterministic and runs locally, so the criteria are
 * inspectable and the result is reproducible. No API key, no network call,
 * and nothing the learner types leaves the browser.
 */

const DEFAULT_PROMPT = 'Fix the login bug.';

/** Scaffold lines appended by the improvement walkthrough. */
const SCAFFOLD: Record<CriterionId, string> = {
  goal: 'Goal: <what should be true when this is done>',
  context: 'Context: <file path, symbol, or the error you saw>',
  scope: 'Scope: make the smallest change that achieves this; only touch <path>',
  constraints: 'Non-goals: do not <the thing you would reject in review>',
  examples: 'Evidence: <paste the stack trace, failing assertion, or input/output pair>',
  edgeCases: 'Edge cases that must keep working: <empty input, error path, concurrent callers>',
  verification:
    'Verification: run `<focused test command>`, then `<broader check>`, and report the output',
  deliverable:
    'Deliverable: finish with the root cause, the files changed, the verification results, and anything you did not do',
};

const BAND_STYLE = {
  thin: { label: 'Thin', className: 'border-danger-line bg-danger-soft text-danger', icon: '■' },
  workable: {
    label: 'Workable',
    className: 'border-warning-line bg-warning-soft text-warning',
    icon: '▲',
  },
  strong: {
    label: 'Strong',
    className: 'border-success-line bg-success-soft text-success',
    icon: '●',
  },
} as const;

export function PromptClinic() {
  const [text, setText] = useState(DEFAULT_PROMPT);
  const [task, setTask] = useState<TaskType>('bug');
  const [revealed, setRevealed] = useState(0);

  const result = useMemo(() => scorePrompt(text, task), [text, task]);
  const emphasis = emphasisFor(task);
  const missing = useMemo(() => result.results.filter((entry) => !entry.met), [result]);

  const improved = useMemo(() => {
    if (revealed === 0) return text;
    const additions = missing.slice(0, revealed).map((entry) => SCAFFOLD[entry.id]);
    return `${text.trim()}\n\n${additions.join('\n')}`;
  }, [text, missing, revealed]);

  const band = BAND_STYLE[result.band];

  function loadExample(id: string) {
    const example = CLINIC_EXAMPLES.find((entry) => entry.id === id);
    if (!example) return;
    setText(example.text);
    setTask(example.task);
    setRevealed(0);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
      {/* Editor */}
      <section aria-labelledby="clinic-editor" className="min-w-0">
        <h2 id="clinic-editor" className="text-lg font-semibold text-ink">
          Your prompt
        </h2>

        <fieldset className="mt-3">
          <legend className="mb-1.5 text-sm font-medium text-ink">Task type</legend>
          <div className="flex flex-wrap gap-1.5">
            {TASK_TYPES.map((option) => {
              const active = task === option.id;
              return (
                <label
                  key={option.id}
                  title={option.blurb}
                  className={`cursor-pointer rounded-chip border px-2.5 py-1 text-xs font-medium transition-colors ${
                    active
                      ? 'border-accent-line bg-accent-soft text-accent'
                      : 'border-line bg-surface-2 text-ink-muted hover:text-ink'
                  }`}
                >
                  <input
                    type="radio"
                    name="task-type"
                    value={option.id}
                    checked={active}
                    onChange={() => {
                      setTask(option.id);
                      setRevealed(0);
                    }}
                    className="sr-only"
                  />
                  {option.label}
                </label>
              );
            })}
          </div>
          <p className="mt-1.5 text-xs text-ink-subtle">
            {TASK_TYPES.find((option) => option.id === task)?.blurb}
          </p>
        </fieldset>

        <div className="mt-4">
          <label htmlFor="clinic-input" className="mb-1.5 block text-sm font-medium text-ink">
            Task prompt
          </label>
          <textarea
            id="clinic-input"
            aria-describedby="clinic-privacy"
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              setRevealed(0);
            }}
            rows={12}
            spellCheck
            className="w-full resize-y rounded-card border border-line bg-surface-2 p-3 font-mono text-[13px] leading-relaxed text-ink"
          />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <CopyButton value={text} label="Your prompt" />
            <button
              type="button"
              onClick={() => {
                setText('');
                setRevealed(0);
              }}
              className="rounded-chip border border-line bg-surface px-2.5 py-1 text-xs font-medium text-ink-muted"
            >
              Clear
            </button>
            <span className="text-xs text-ink-subtle">
              {text.trim().split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
        </div>

        <p
          id="clinic-privacy"
          className="mt-3 rounded-card border border-warning-line bg-warning-soft px-3 py-2 text-sm text-warning"
        >
          <span aria-hidden="true">▲</span>{' '}
          <span className="font-medium">Everything here runs in your browser.</span>{' '}
          <span className="text-ink-muted">
            Nothing is uploaded and no AI service is involved. Even so, treat any unfamiliar
            deployment of this page with the caution you would apply to any web form: do not paste
            secrets, credentials, or confidential production data.
          </span>
        </p>

        {/* Examples */}
        <section aria-labelledby="clinic-examples" className="mt-6">
          <h3 id="clinic-examples" className="text-sm font-semibold text-ink">
            Curated examples
          </h3>
          <p className="mt-1 text-sm text-ink-muted">
            Load one to see how the rubric responds, from barely-a-request to unambiguous brief.
          </p>
          <ul className="mt-3 space-y-2">
            {CLINIC_EXAMPLES.map((example) => (
              <li key={example.id}>
                <button
                  type="button"
                  onClick={() => loadExample(example.id)}
                  className="w-full rounded-card border border-line bg-surface p-3 text-left transition-colors hover:border-line-strong"
                >
                  <span className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-chip border px-1.5 py-0.5 text-[11px] font-medium ${
                        example.level === 'weak'
                          ? 'border-danger-line bg-danger-soft text-danger'
                          : example.level === 'workable'
                            ? 'border-warning-line bg-warning-soft text-warning'
                            : 'border-success-line bg-success-soft text-success'
                      }`}
                    >
                      {example.label}
                    </span>
                  </span>
                  <span className="mt-1.5 block text-sm text-ink-muted">{example.note}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </section>

      {/* Analysis */}
      <section aria-labelledby="clinic-analysis" className="min-w-0">
        <h2 id="clinic-analysis" className="text-lg font-semibold text-ink">
          Structure check
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          This checks whether the parts of a well-formed task are present. It cannot judge whether
          the request is a good idea, whether the file paths exist, or whether the fix you are
          asking for is the right one.
        </p>

        <div className="ca-card mt-4 p-4" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-ink">
              {result.score} of {result.maxScore} weighted points
            </p>
            <span
              className={`rounded-chip border px-2 py-0.5 text-xs font-semibold ${band.className}`}
            >
              <span aria-hidden="true">{band.icon}</span> {band.label}
            </span>
          </div>
          <div className="mt-2">
            <ProgressBar value={result.percent} label="Prompt structure score" />
          </div>
          {result.notes.length > 0 ? (
            <ul className="mt-3 space-y-1.5 text-sm text-ink-muted">
              {result.notes.map((note) => (
                <li key={note} className="flex gap-2">
                  <span aria-hidden="true" className="text-ink-subtle">
                    →
                  </span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <ul className="mt-4 space-y-2">
          {CRITERIA.map((criterion) => {
            const entry = result.results.find((item) => item.id === criterion.id);
            if (!entry) return null;
            const emphasised = emphasis.includes(criterion.id);
            return (
              <li
                key={criterion.id}
                className={`rounded-card border p-3 ${
                  entry.met ? 'border-success-line bg-success-soft/40' : 'border-line bg-surface'
                }`}
              >
                <p className="flex flex-wrap items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={`grid h-4 w-4 place-items-center rounded-full border text-[9px] leading-none ${
                      entry.met
                        ? 'border-success bg-success-soft text-success'
                        : 'border-line-strong text-ink-subtle'
                    }`}
                  >
                    {entry.met ? '✓' : '·'}
                  </span>
                  <span className="text-sm font-semibold text-ink">{criterion.label}</span>
                  <span className="sr-only">{entry.met ? ' — present' : ' — missing'}</span>
                  {emphasised ? (
                    <span className="rounded-chip border border-violet-line bg-violet-soft px-1.5 py-0.5 text-[10px] font-medium text-violet">
                      matters more for this task type
                    </span>
                  ) : null}
                  <span className="ml-auto text-[10px] uppercase tracking-wide text-ink-subtle">
                    weight {criterion.weight}
                  </span>
                </p>
                <p className="mt-1.5 text-sm text-ink-muted">
                  <span className="font-medium text-ink">Looks for: </span>
                  {criterion.looksFor}
                </p>
                {entry.met && entry.evidence ? (
                  <p className="mt-1.5 truncate rounded-[6px] bg-surface-2 px-2 py-1 font-mono text-[12px] text-ink-muted">
                    matched: {entry.evidence}
                  </p>
                ) : (
                  <p className="mt-1.5 text-sm text-ink">
                    <span className="font-semibold">Add: </span>
                    {entry.suggestion}
                  </p>
                )}
                <p className="mt-1.5 text-xs text-ink-subtle">{criterion.why}</p>
              </li>
            );
          })}
        </ul>

        {/* Improvement walkthrough */}
        {missing.length > 0 ? (
          <section aria-labelledby="clinic-improve" className="mt-6">
            <h3 id="clinic-improve" className="text-base font-semibold text-ink">
              Improve this prompt
            </h3>
            <p className="mt-1 text-sm text-ink-muted">
              One suggestion at a time, most important first. Each step appends a scaffold line you
              then fill in with your own specifics — the scaffold is a reminder, not the answer.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setRevealed((value) => Math.min(missing.length, value + 1))}
                disabled={revealed >= missing.length}
                className="rounded-chip border border-accent bg-accent px-3.5 py-1.5 text-sm font-medium text-accent-ink disabled:opacity-45"
              >
                {revealed === 0 ? 'Show the first suggestion' : 'Next suggestion'}
              </button>
              {revealed > 0 ? (
                <button
                  type="button"
                  onClick={() => setRevealed(0)}
                  className="rounded-chip border border-line bg-surface px-3 py-1.5 text-sm font-medium text-ink-muted"
                >
                  Reset
                </button>
              ) : null}
              <span className="text-sm text-ink-subtle">
                {revealed} of {missing.length} shown
              </span>
            </div>

            {revealed > 0 ? (
              <div className="mt-4 grid gap-3">
                <div className="rounded-card border border-danger-line bg-surface">
                  <p className="border-b border-danger-line bg-danger-soft px-3 py-1.5 text-xs font-semibold text-danger">
                    ✕ Before
                  </p>
                  <pre className="overflow-x-auto whitespace-pre-wrap break-words px-3 py-2.5 font-mono text-[12.5px] text-ink">
                    {text}
                  </pre>
                </div>
                <div className="rounded-card border border-success-line bg-surface">
                  <p className="flex items-center justify-between gap-2 border-b border-success-line bg-success-soft px-3 py-1.5 text-xs font-semibold text-success">
                    <span>✓ After — fill in the angle brackets</span>
                    <CopyButton value={improved} label="Improved prompt" />
                  </p>
                  <pre className="overflow-x-auto whitespace-pre-wrap break-words px-3 py-2.5 font-mono text-[12.5px] text-ink">
                    {improved}
                  </pre>
                </div>
                <ol className="space-y-2">
                  {missing.slice(0, revealed).map((entry, index) => {
                    const criterion = CRITERIA.find((item) => item.id === entry.id);
                    return (
                      <li
                        key={entry.id}
                        className="rounded-card border border-line bg-surface-2 px-3 py-2.5"
                      >
                        <p className="text-sm font-semibold text-ink">
                          {index + 1}. {criterion?.label}
                        </p>
                        <p className="mt-1 text-sm text-ink-muted">{entry.suggestion}</p>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ) : null}
          </section>
        ) : (
          <p className="mt-6 rounded-card border border-success-line bg-success-soft px-3 py-2.5 text-sm text-success">
            ● Every element the rubric looks for is present. That means the prompt is well formed —
            not that it asks for the right thing. Read it once more and ask whether the goal is
            actually what you want.
          </p>
        )}
      </section>
    </div>
  );
}
