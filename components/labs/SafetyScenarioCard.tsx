'use client';

import { useState } from 'react';
import type { SafetyScenario } from '@/content/types';
import { useProgress } from '@/components/progress/ProgressProvider';
import { useAnnounce } from '@/components/ui/Announcer';
import { Chip, riskIcon, riskTone } from '@/components/ui/Chip';
import { SourceList } from '@/components/ui/SourceList';

const VERDICT = {
  safest: {
    label: 'Safest productive response',
    className: 'border-success-line bg-success-soft',
    icon: '●',
  },
  defensible: {
    label: 'Defensible, but not the best move',
    className: 'border-warning-line bg-warning-soft',
    icon: '▲',
  },
  risky: { label: 'Risky', className: 'border-danger-line bg-danger-soft', icon: '■' },
} as const;

export function SafetyScenarioCard({
  scenario,
  index,
  total,
}: {
  scenario: SafetyScenario;
  index: number;
  total: number;
}) {
  const [chosen, setChosen] = useState<string | null>(null);
  const { setLabComplete, state } = useProgress();
  const announce = useAnnounce();

  const labId = `safety:${scenario.id}`;
  const done = state.completedLabs.includes(labId);
  const selection = scenario.choices.find((choice) => choice.id === chosen);

  function choose(choiceId: string) {
    if (chosen) return;
    setChosen(choiceId);
    setLabComplete(labId, true);
    const choice = scenario.choices.find((entry) => entry.id === choiceId);
    announce(
      choice?.verdict === 'safest'
        ? 'That is the safest productive response.'
        : 'Read the explanation — there is a narrower option.',
    );
  }

  return (
    <article
      id={scenario.id}
      className="ca-card scroll-mt-24 p-5"
      aria-labelledby={`scenario-${scenario.id}`}
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-ink-subtle">
            Scenario {index} of {total}
          </p>
          <h2 id={`scenario-${scenario.id}`} className="mt-1 text-xl font-semibold text-ink">
            {scenario.title}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip tone={riskTone(scenario.risk)} icon={riskIcon(scenario.risk)}>
            {scenario.risk === 'high'
              ? 'High risk'
              : scenario.risk === 'medium'
                ? 'Medium risk'
                : 'Low risk'}
          </Chip>
          {done ? (
            <Chip tone="success" icon="✓">
              Attempted
            </Chip>
          ) : null}
        </div>
      </header>

      <p className="mt-3 text-[0.95rem] text-ink-muted">{scenario.situation}</p>

      <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words rounded-card border border-line bg-surface-2 px-3 py-2.5 font-mono text-[12.5px] leading-relaxed text-ink">
        {scenario.evidence.code}
      </pre>

      <fieldset className="mt-4">
        <legend className="mb-2 text-[0.95rem] font-medium text-ink">{scenario.question}</legend>
        <ul className="space-y-2">
          {scenario.choices.map((choice) => {
            const selected = chosen === choice.id;
            const settled = chosen !== null;
            const verdict = VERDICT[choice.verdict];
            const tone = !settled
              ? 'border-line bg-surface hover:bg-surface-2'
              : choice.verdict === 'safest'
                ? verdict.className
                : selected
                  ? verdict.className
                  : 'border-line bg-surface opacity-70';
            return (
              <li key={choice.id}>
                <label className={`flex cursor-pointer gap-3 rounded-card border p-3 ${tone}`}>
                  <input
                    type="radio"
                    name={`scenario-${scenario.id}`}
                    checked={selected}
                    disabled={settled}
                    onChange={() => choose(choice.id)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--ca-accent)]"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm text-ink">{choice.label}</span>
                    {settled && (selected || choice.verdict === 'safest') ? (
                      <>
                        <span className="mt-1.5 block text-xs font-semibold text-ink">
                          <span aria-hidden="true">{verdict.icon}</span> {verdict.label}
                        </span>
                        <span className="mt-1 block text-sm text-ink-muted">{choice.feedback}</span>
                      </>
                    ) : null}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      {chosen ? (
        <>
          <div className="mt-4 rounded-card border border-violet-line bg-violet-soft/50 px-3 py-2.5">
            <p className="text-sm font-semibold text-violet">The principle</p>
            <p className="mt-1 text-sm text-ink-muted">{scenario.principle}</p>
          </div>
          <SourceList ids={scenario.sources} />
          {selection && selection.verdict !== 'safest' ? (
            <button
              type="button"
              onClick={() => setChosen(null)}
              className="ca-no-print mt-2 rounded-chip border border-line bg-surface px-3 py-1 text-sm font-medium text-ink-muted"
            >
              Try this scenario again
            </button>
          ) : null}
        </>
      ) : null}
    </article>
  );
}
