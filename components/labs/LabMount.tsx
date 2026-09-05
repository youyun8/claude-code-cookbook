'use client';

import dynamic from 'next/dynamic';
import type { LabId } from '@/content/types';

/**
 * Labs are the heaviest interactive parts of the site and are irrelevant to
 * reading, so each one is code-split and loaded only when its lesson is
 * open. Reading content is server-rendered and unaffected.
 */

const loading = () => (
  <p className="rounded-card border border-line bg-surface-2 p-4 text-sm text-ink-subtle">
    Loading the interactive exercise…
  </p>
);

const LABS: Record<LabId, React.ComponentType> = {
  'terminal-walkthrough': dynamic(
    () => import('./TerminalWalkthrough').then((m) => m.TerminalWalkthrough),
    { loading },
  ),
  'prompt-anatomy': dynamic(() => import('./PromptAnatomy').then((m) => m.PromptAnatomy), {
    loading,
  }),
  'context-budget': dynamic(
    () => import('./ContextBudgetSimulator').then((m) => m.ContextBudgetSimulator),
    { loading },
  ),
  'claude-md-linter': dynamic(
    () => import('./ClaudeMdLinterLab').then((m) => m.ClaudeMdLinterLab),
    {
      loading,
    },
  ),
  'permission-lab': dynamic(
    () => import('./PermissionDecisionLab').then((m) => m.PermissionDecisionLab),
    { loading },
  ),
  'diff-review': dynamic(() => import('./DiffReviewExercise').then((m) => m.DiffReviewExercise), {
    loading,
  }),
  'guided-fix': dynamic(() => import('./GuidedFixLab').then((m) => m.GuidedFixLab), { loading }),
};

export function LabMount({ lab }: { lab: LabId }) {
  const Component = LABS[lab];
  return <Component />;
}
