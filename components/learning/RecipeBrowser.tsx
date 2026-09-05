'use client';
import { DIFFICULTY_LABELS } from '@/data/recipes';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Recipe, RecipeFeature, RecipeTask, RiskLevel } from '@/content/types';
import {
  AVAILABLE_FEATURES,
  AVAILABLE_TASKS,
  FEATURE_LABELS,
  RISK_LABELS,
  TASK_LABELS,
} from '@/data/recipes';
import { Chip, riskIcon, riskTone } from '@/components/ui/Chip';
import { useProgress } from '@/components/progress/ProgressProvider';

const DIFFICULTIES: Recipe['difficulty'][] = ['beginner', 'intermediate', 'advanced'];
const RISKS: RiskLevel[] = ['low', 'medium', 'high'];

export function RecipeBrowser({ recipes }: { recipes: readonly Recipe[] }) {
  const [query, setQuery] = useState('');
  const [task, setTask] = useState<RecipeTask | 'all'>('all');
  const [difficulty, setDifficulty] = useState<Recipe['difficulty'] | 'all'>('all');
  const [risk, setRisk] = useState<RiskLevel | 'all'>('all');
  const [feature, setFeature] = useState<RecipeFeature | 'all'>('all');
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);

  const { state, toggleBookmark, ready } = useProgress();

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return recipes.filter((recipe) => {
      if (task !== 'all' && recipe.task !== task) return false;
      if (difficulty !== 'all' && recipe.difficulty !== difficulty) return false;
      if (risk !== 'all' && recipe.risk !== risk) return false;
      if (feature !== 'all' && !recipe.features.includes(feature)) return false;
      if (bookmarkedOnly && !state.bookmarks.includes(`recipe:${recipe.slug}`)) return false;
      if (needle.length > 0) {
        const haystack =
          `${recipe.title} ${recipe.summary} ${recipe.whenToUse.join(' ')} ${recipe.template}`.toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });
  }, [recipes, query, task, difficulty, risk, feature, bookmarkedOnly, state.bookmarks]);

  function reset() {
    setQuery('');
    setTask('all');
    setDifficulty('all');
    setRisk('all');
    setFeature('all');
    setBookmarkedOnly(false);
  }

  return (
    <>
      <section aria-labelledby="filters" className="ca-card ca-no-print p-4">
        <h2 id="filters" className="sr-only">
          Filter recipes
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-1">
            <label htmlFor="recipe-search" className="mb-1 block text-xs font-medium text-ink">
              Search
            </label>
            <input
              id="recipe-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="e.g. migration, benchmark"
              className="w-full rounded-chip border border-line bg-surface-2 px-2.5 py-1.5 text-sm text-ink"
            />
          </div>

          <div>
            <label htmlFor="filter-task" className="mb-1 block text-xs font-medium text-ink">
              Task
            </label>
            <select
              id="filter-task"
              value={task}
              onChange={(event) => setTask(event.target.value as RecipeTask | 'all')}
              className="w-full rounded-chip border border-line bg-surface-2 px-2.5 py-1.5 text-sm text-ink"
            >
              <option value="all">All tasks</option>
              {AVAILABLE_TASKS.map((option) => (
                <option key={option} value={option}>
                  {TASK_LABELS[option]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-difficulty" className="mb-1 block text-xs font-medium text-ink">
              Difficulty
            </label>
            <select
              id="filter-difficulty"
              value={difficulty}
              onChange={(event) =>
                setDifficulty(event.target.value as Recipe['difficulty'] | 'all')
              }
              className="w-full rounded-chip border border-line bg-surface-2 px-2.5 py-1.5 text-sm text-ink"
            >
              <option value="all">Any difficulty</option>
              {DIFFICULTIES.map((option) => (
                <option key={option} value={option}>
                  {DIFFICULTY_LABELS[option]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-risk" className="mb-1 block text-xs font-medium text-ink">
              Risk
            </label>
            <select
              id="filter-risk"
              value={risk}
              onChange={(event) => setRisk(event.target.value as RiskLevel | 'all')}
              className="w-full rounded-chip border border-line bg-surface-2 px-2.5 py-1.5 text-sm text-ink"
            >
              <option value="all">Any risk</option>
              {RISKS.map((option) => (
                <option key={option} value={option}>
                  {RISK_LABELS[option]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-feature" className="mb-1 block text-xs font-medium text-ink">
              Feature
            </label>
            <select
              id="filter-feature"
              value={feature}
              onChange={(event) => setFeature(event.target.value as RecipeFeature | 'all')}
              className="w-full rounded-chip border border-line bg-surface-2 px-2.5 py-1.5 text-sm text-ink"
            >
              <option value="all">Any feature</option>
              {AVAILABLE_FEATURES.map((option) => (
                <option key={option} value={option}>
                  {FEATURE_LABELS[option]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-ink-muted">
            <input
              type="checkbox"
              checked={bookmarkedOnly}
              onChange={(event) => setBookmarkedOnly(event.target.checked)}
              className="h-4 w-4 accent-[var(--ca-accent)]"
            />
            Bookmarked only
          </label>
          <button
            type="button"
            onClick={reset}
            className="rounded-chip border border-line bg-surface px-2.5 py-1 text-xs font-medium text-ink-muted"
          >
            Reset filters
          </button>
          <p aria-live="polite" className="text-sm text-ink-subtle">
            {filtered.length} of {recipes.length} recipes
          </p>
        </div>
      </section>

      {filtered.length === 0 ? (
        <p className="mt-6 rounded-card border border-line bg-surface-2 px-4 py-6 text-center text-sm text-ink-muted">
          No recipes match those filters.{' '}
          <button
            type="button"
            onClick={reset}
            className="text-accent underline underline-offset-[3px]"
          >
            Reset them
          </button>{' '}
          to see all {recipes.length}.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {filtered.map((recipe) => {
            const bookmarked = ready && state.bookmarks.includes(`recipe:${recipe.slug}`);
            return (
              <li key={recipe.slug}>
                <article className="ca-card flex h-full flex-col p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold">
                      <Link
                        href={`/recipes/${recipe.slug}/`}
                        className="text-ink hover:text-accent"
                      >
                        {recipe.title}
                      </Link>
                    </h3>
                    <button
                      type="button"
                      onClick={() => toggleBookmark(`recipe:${recipe.slug}`)}
                      aria-pressed={bookmarked}
                      className="ca-no-print shrink-0 rounded-chip border border-line bg-surface px-2 py-0.5 text-sm text-ink-subtle hover:text-ink"
                    >
                      <span aria-hidden="true">{bookmarked ? '★' : '☆'}</span>
                      <span className="sr-only">
                        {bookmarked ? 'Remove bookmark from' : 'Bookmark'} {recipe.title}
                      </span>
                    </button>
                  </div>

                  <p className="mt-1.5 flex-1 text-sm text-ink-muted">{recipe.summary}</p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <Chip>{TASK_LABELS[recipe.task]}</Chip>
                    <Chip tone={riskTone(recipe.risk)} icon={riskIcon(recipe.risk)}>
                      {RISK_LABELS[recipe.risk]}
                    </Chip>
                    <Chip>{DIFFICULTY_LABELS[recipe.difficulty]}</Chip>
                    {recipe.features.map((entry) => (
                      <Chip key={entry} tone="violet">
                        {FEATURE_LABELS[entry]}
                      </Chip>
                    ))}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
