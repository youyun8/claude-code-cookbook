'use client';

import { useState } from 'react';
import { LabShell } from './LabShell';

interface Segment {
  id: string;
  text: string;
  part: string;
  prevents: string;
}

const SEGMENTS: Segment[] = [
  {
    id: 'context',
    text: 'The login form in src/features/auth returns a generic 500 when an expired refresh token is present.',
    part: 'Context and symptom',
    prevents:
      'A search of the whole repository. The path narrows exploration, and the exact symptom stops Claude from fixing a different, more interesting bug it happens to notice.',
  },
  {
    id: 'sequence',
    text: 'Reproduce the failure using the existing auth tests, identify the root cause, and explain it before editing.',
    part: 'Sequence: diagnose before treating',
    prevents:
      'A plausible fix for a misdiagnosed cause. Requiring an explanation first gives you a checkpoint where a wrong theory is cheap to reject.',
  },
  {
    id: 'scope',
    text: 'Then make the smallest fix that preserves current behavior for valid sessions.',
    part: 'Scope and invariant',
    prevents:
      'A wide diff, and a fix that repairs the error path while breaking the happy path nobody thought to mention.',
  },
  {
    id: 'nongoal',
    text: 'Do not change the API response schema.',
    part: 'Non-goal',
    prevents:
      'A schema change that reaches review, may already have consumers, and costs far more to unwind than this sentence cost to write.',
  },
  {
    id: 'regression',
    text: 'Add or update a regression test.',
    part: 'Regression requirement',
    prevents:
      'The same bug returning silently in three months. It converts a one-time fix into a permanent guarantee.',
  },
  {
    id: 'verification',
    text: 'Run the focused auth tests, then run the repository’s required type check.',
    part: 'Verification',
    prevents:
      'Code that was never executed. This is the strongest line in the prompt: focused first for a tight loop, broader second for coverage.',
  },
  {
    id: 'deliverable',
    text: 'Finish with the files changed, the root cause, and the verification results.',
    part: 'Deliverable',
    prevents:
      'A ten-minute review of a two-minute change. You get the summary in the shape you need to assess it.',
  },
];

export function PromptAnatomy() {
  const [selected, setSelected] = useState<string>(SEGMENTS[0]?.id ?? '');
  const active = SEGMENTS.find((segment) => segment.id === selected);

  return (
    <LabShell
      title="Prompt anatomy"
      description="Select any part of the prompt to see which failure it prevents."
      simulated={false}
    >
      <div className="rounded-card border border-line bg-surface-2 p-3">
        <p className="mb-2 text-[11px] uppercase tracking-wide text-ink-subtle">
          A strong bug-fix task
        </p>
        <p className="font-mono text-[13.5px] leading-[1.9]">
          {SEGMENTS.map((segment) => {
            const isActive = segment.id === selected;
            return (
              <button
                key={segment.id}
                type="button"
                onClick={() => setSelected(segment.id)}
                onMouseEnter={() => setSelected(segment.id)}
                onFocus={() => setSelected(segment.id)}
                aria-pressed={isActive}
                className={`mr-1 rounded-[5px] px-1 text-left transition-colors ${
                  isActive
                    ? 'bg-accent-soft text-ink underline decoration-accent decoration-2 underline-offset-4'
                    : 'text-ink-muted hover:bg-surface-3 hover:text-ink'
                }`}
              >
                {segment.text}
              </button>
            );
          })}
        </p>
      </div>

      <div aria-live="polite" className="mt-3">
        {active ? (
          <div className="rounded-card border border-accent-line bg-accent-soft/50 px-3 py-2.5">
            <p className="text-sm font-semibold text-ink">{active.part}</p>
            <p className="mt-1 text-sm text-ink-muted">
              <span className="font-medium text-ink">Prevents: </span>
              {active.prevents}
            </p>
          </div>
        ) : null}
      </div>
    </LabShell>
  );
}
