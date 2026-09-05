import type { Recipe, RecipeFeature, RecipeTask, RiskLevel } from '@/content/types';
import { recipes as exploreAndDiagnose } from '@/content/recipes/explore-and-diagnose';
import { recipes as buildAndImprove } from '@/content/recipes/build-and-improve';
import { recipes as configureAndAutomate } from '@/content/recipes/configure-and-automate';

export const RECIPES: readonly Recipe[] = [
  ...exploreAndDiagnose,
  ...buildAndImprove,
  ...configureAndAutomate,
];

export function getRecipe(slug: string): Recipe | undefined {
  return RECIPES.find((recipe) => recipe.slug === slug);
}

export const TASK_LABELS: Record<RecipeTask, string> = {
  explore: 'Explore',
  debug: 'Debug',
  implement: 'Implement',
  refactor: 'Refactor',
  test: 'Test',
  review: 'Review',
  performance: 'Performance',
  maintenance: 'Maintenance',
  configure: 'Configure',
  automate: 'Automate',
};

export const DIFFICULTY_LABELS: Record<Recipe['difficulty'], string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export const FEATURE_LABELS: Record<RecipeFeature, string> = {
  'plan-mode': 'Plan mode',
  'claude-md': 'CLAUDE.md',
  hooks: 'Hooks',
  subagents: 'Subagents',
  mcp: 'MCP',
  worktrees: 'Worktrees',
  headless: 'Headless',
  permissions: 'Permissions',
  git: 'Git',
};

export const RISK_LABELS: Record<RiskLevel, string> = {
  low: 'Low risk',
  medium: 'Review needed',
  high: 'High risk',
};

export const RISK_DESCRIPTION: Record<RiskLevel, string> = {
  low: 'Read-only or trivially reversible.',
  medium: 'Changes code. Review the diff before committing.',
  high: 'Wide blast radius or hard to reverse. Verify thoroughly.',
};

/** Every filter dimension actually present in the library. */
export const AVAILABLE_TASKS: RecipeTask[] = [...new Set(RECIPES.map((recipe) => recipe.task))];
export const AVAILABLE_FEATURES: RecipeFeature[] = [
  ...new Set(RECIPES.flatMap((recipe) => recipe.features)),
];
