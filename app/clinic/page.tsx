import type { Metadata } from 'next';
import Link from 'next/link';
import { PromptClinic } from '@/components/labs/PromptClinic';
import { CRITERIA } from '@/lib/prompt-rubric';

export const metadata: Metadata = {
  title: 'Prompt clinic',
  description:
    'Score an engineering task prompt against a transparent, deterministic rubric — goal, context, scope, constraints, edge cases, verification, deliverable — and improve it one suggestion at a time.',
  alternates: { canonical: '/clinic/' },
};

export default function ClinicPage() {
  return (
    <div className="mx-auto max-w-[84rem] px-4 py-10">
      <header className="max-w-[64ch]">
        <p className="text-[11px] uppercase tracking-wide text-ink-subtle">Practice</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">Prompt clinic</h1>
        <p className="mt-3 text-ink-muted">
          Paste a task you are about to give an agent, or load one of the curated examples. The
          rubric checks whether {CRITERIA.length} structural elements are present and shows you
          exactly what matched — so you can disagree with it.
        </p>
        <p className="mt-2 text-sm text-ink-subtle">
          It is a structure checker, not a judge of correctness, and it is deliberately simple
          enough to read. The reasoning behind each criterion is in{' '}
          <Link
            href="/learn/prompting-for-engineering-work/"
            className="text-accent underline underline-offset-[3px]"
          >
            module 2
          </Link>
          .
        </p>
      </header>

      <div className="mt-8">
        <PromptClinic />
      </div>
    </div>
  );
}
