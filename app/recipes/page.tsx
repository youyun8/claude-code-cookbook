import type { Metadata } from 'next';
import Link from 'next/link';
import { RECIPES } from '@/data/recipes';
import { RecipeBrowser } from '@/components/learning/RecipeBrowser';

export const metadata: Metadata = {
  title: 'Workflow recipes',
  description:
    'Fifteen copyable prompts for real engineering work — exploring, debugging, implementing, refactoring, reviewing, upgrading and automating — each with verification and recovery steps.',
  alternates: { canonical: '/recipes/' },
};

export default function RecipesPage() {
  return (
    <div className="mx-auto max-w-[76rem] px-4 py-10">
      <header className="max-w-[64ch]">
        <p className="text-[11px] uppercase tracking-wide text-ink-subtle">Field guide</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">Workflow recipes</h1>
        <p className="mt-3 text-ink-muted">
          {RECIPES.length} prompts for the work you actually do. Every one names what it is for,
          what could go wrong, how to check the result, and what to do when it goes sideways.
        </p>
        <p className="mt-2 text-sm text-ink-subtle">
          Each recipe has editable variables — fill in your own paths and commands before copying. A
          recipe naming your real test command is worth far more than a generic one. The reasoning
          behind these is in{' '}
          <Link
            href="/learn/git-and-daily-workflows/"
            className="text-accent underline underline-offset-[3px]"
          >
            module 8
          </Link>
          .
        </p>
      </header>

      <div className="mt-8">
        <RecipeBrowser recipes={RECIPES} />
      </div>
    </div>
  );
}
