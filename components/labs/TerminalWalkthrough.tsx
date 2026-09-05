'use client';

import { useState } from 'react';
import { LabShell } from './LabShell';

interface Step {
  actor: 'you' | 'claude' | 'tool';
  title: string;
  lines: string[];
  note: string;
}

const STEPS: Step[] = [
  {
    actor: 'you',
    title: 'You state the task',
    lines: [
      '> formatRelative() in src/lib/date.ts renders past dates as',
      '  "in -3 days". Fix it so they render as "3 days ago".',
      '  Do not change the signature. Add tests for a past date, a',
      '  future date, and now. Run `npm test -- date` and report.',
    ],
    note: 'Goal, location, expected output, a non-goal, and a command that can pass or fail. Everything that follows depends on this last part.',
  },
  {
    actor: 'claude',
    title: 'Claude inspects before editing',
    lines: ['⏺ Read(src/lib/date.ts)', '⏺ Read(src/lib/date.test.ts)', '⏺ Grep("formatRelative")'],
    note: 'Reading first is what separates a fix from a guess. Notice it also opened the test file — that is where the conventions live.',
  },
  {
    actor: 'tool',
    title: 'It reproduces the failure',
    lines: [
      '⏺ Bash(npm test -- date)',
      '  ✕ formats a past date',
      '    expected "3 days ago", received "in -3 days"',
      '  2 passed, 1 failed',
    ],
    note: 'A red test before any edit. Now there is an objective definition of done, and Claude can tell whether its next action worked.',
  },
  {
    actor: 'claude',
    title: 'It makes a bounded edit',
    lines: [
      '⏺ Update(src/lib/date.ts)',
      '  + const past = diff < 0;',
      '  + const value = Math.abs(diff);',
      '  - return `in ${diff} days`;',
      '  + return past ? `${value} days ago` : `in ${value} days`;',
    ],
    note: 'One function, one behavior. The signature is untouched, as instructed — a small diff is a reviewable diff.',
  },
  {
    actor: 'tool',
    title: 'It observes the result',
    lines: ['⏺ Bash(npm test -- date)', '  ✓ formats a past date', '  3 passed'],
    note: 'This is the loop closing. If the test had still failed, Claude would iterate against the same signal rather than declaring success.',
  },
  {
    actor: 'claude',
    title: 'It reports what you can check',
    lines: [
      'Root cause: formatRelative() interpolated the signed difference',
      'directly, so negative values leaked into the string.',
      '',
      'Changed: src/lib/date.ts, src/lib/date.test.ts',
      'Verified: npm test -- date — 3 passed',
      'Not done: relative formatting for hours and minutes still uses',
      'the same pattern and likely has the same bug.',
    ],
    note: 'The last line is the valuable one. A report that only lists successes tells you nothing you did not already assume.',
  },
];

const ACTOR_STYLE: Record<Step['actor'], { label: string; className: string }> = {
  you: { label: 'You', className: 'border-accent-line bg-accent-soft text-accent' },
  claude: { label: 'Claude', className: 'border-violet-line bg-violet-soft text-violet' },
  tool: { label: 'Tool run', className: 'border-line bg-surface-2 text-ink-muted' },
};

export function TerminalWalkthrough() {
  const [step, setStep] = useState(0);
  const visible = STEPS.slice(0, step + 1);
  const current = STEPS[step];
  const atEnd = step === STEPS.length - 1;

  return (
    <LabShell
      title="The loop, one step at a time"
      description="A recorded example. Nothing here runs on your machine or reads your files."
    >
      <div className="rounded-card border border-line bg-[#1a1613] p-3 font-mono text-[12.5px] leading-relaxed text-[#e7ded1]">
        <p className="mb-2 select-none text-[11px] uppercase tracking-wide text-[#a2988a]">
          simulated session — src/lib/date.ts
        </p>
        <ol className="space-y-3">
          {visible.map((entry, index) => (
            <li key={index}>
              <p className="mb-1 text-[11px] uppercase tracking-wide text-[#c7a08a]">
                {ACTOR_STYLE[entry.actor].label}
              </p>
              <pre className="overflow-x-auto whitespace-pre-wrap break-words">
                {entry.lines.join('\n')}
              </pre>
            </li>
          ))}
        </ol>
      </div>

      <div aria-live="polite" className="mt-3">
        {current ? (
          <div className="rounded-card border border-line bg-surface-2 px-3 py-2.5">
            <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-ink">
              <span
                className={`rounded-chip border px-1.5 py-0.5 text-[11px] ${ACTOR_STYLE[current.actor].className}`}
              >
                Step {step + 1} of {STEPS.length}
              </span>
              {current.title}
            </p>
            <p className="text-sm text-ink-muted">{current.note}</p>
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setStep((value) => Math.max(0, value - 1))}
          disabled={step === 0}
          className="rounded-chip border border-line bg-surface px-3 py-1.5 text-sm font-medium text-ink disabled:cursor-not-allowed disabled:opacity-45"
        >
          Previous step
        </button>
        <button
          type="button"
          onClick={() => setStep((value) => Math.min(STEPS.length - 1, value + 1))}
          disabled={atEnd}
          className="rounded-chip border border-accent bg-accent px-3 py-1.5 text-sm font-medium text-accent-ink disabled:cursor-not-allowed disabled:opacity-45"
        >
          Next step
        </button>
        {atEnd ? (
          <button
            type="button"
            onClick={() => setStep(0)}
            className="rounded-chip border border-line bg-surface px-3 py-1.5 text-sm font-medium text-ink-muted"
          >
            Start again
          </button>
        ) : null}
      </div>
    </LabShell>
  );
}
