import type { Metadata } from 'next';
import Link from 'next/link';
import { SAFETY_SCENARIOS } from '@/content/safety';
import { SafetyScenarioCard } from '@/components/labs/SafetyScenarioCard';

export const metadata: Metadata = {
  title: 'Safety lab',
  description:
    'Seven scenarios in agent safety — broad deletes, prompt injection, install scripts, production infrastructure, irreversible migrations, wide allowlists, and disabled tests.',
  alternates: { canonical: '/safety/' },
};

export default function SafetyPage() {
  return (
    <div className="mx-auto max-w-[70rem] px-4 py-10">
      <header className="max-w-[64ch]">
        <p className="text-[11px] uppercase tracking-wide text-ink-subtle">Judgement practice</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">Safety lab</h1>
        <p className="mt-3 text-ink-muted">
          Seven decisions you will actually face. In almost none of them is the right answer
          &ldquo;refuse&rdquo; — it is to narrow the scope, get the evidence, and choose the
          reversible option while keeping the work moving.
        </p>
        <p className="mt-2 text-sm text-ink-subtle">
          Choose before reading the feedback; the value is in comparing your instinct to the
          reasoning. Background is in{' '}
          <Link
            href="/learn/permissions-sandboxing-security/"
            className="text-accent underline underline-offset-[3px]"
          >
            module 6
          </Link>
          .
        </p>
      </header>

      <nav aria-label="Scenarios" className="ca-no-print mt-6">
        <ul className="flex flex-wrap gap-2">
          {SAFETY_SCENARIOS.map((scenario, index) => (
            <li key={scenario.id}>
              <a
                href={`#${scenario.id}`}
                className="inline-block rounded-chip border border-line bg-surface-2 px-2.5 py-1 text-xs font-medium text-ink-muted hover:text-ink"
              >
                {index + 1}. {scenario.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-8 space-y-6">
        {SAFETY_SCENARIOS.map((scenario, index) => (
          <SafetyScenarioCard
            key={scenario.id}
            scenario={scenario}
            index={index + 1}
            total={SAFETY_SCENARIOS.length}
          />
        ))}
      </div>

      <aside className="ca-card mt-8 p-5">
        <h2 className="text-lg font-semibold text-ink">What these have in common</h2>
        <ul className="mt-3 space-y-2 text-[0.95rem] text-ink-muted">
          <li className="flex gap-2.5">
            <span aria-hidden="true" className="text-accent">
              →
            </span>
            <span>
              The scope of the action was wider than the scope of the task. That mismatch is the
              signal in five of the seven.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span aria-hidden="true" className="text-accent">
              →
            </span>
            <span>
              Isolation removes whole categories of risk that would otherwise be assessed case by
              case.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span aria-hidden="true" className="text-accent">
              →
            </span>
            <span>
              Reversibility is worth more than speed. Backfill before drop, plan before apply,
              branch before edit.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span aria-hidden="true" className="text-accent">
              →
            </span>
            <span>
              Content an agent reads is data. An instruction found in data is a finding to report,
              never a task to perform.
            </span>
          </li>
        </ul>
      </aside>
    </div>
  );
}
