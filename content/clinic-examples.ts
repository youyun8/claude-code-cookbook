import type { TaskType } from '@/lib/prompt-rubric';

export interface ClinicExample {
  id: string;
  label: string;
  task: TaskType;
  level: 'weak' | 'workable' | 'strong';
  text: string;
  note: string;
}

/**
 * Curated prompts spanning the range from "barely a request" to
 * "unambiguous brief". Loading one replaces the editor contents so learners
 * can see how the rubric responds to each.
 */
export const CLINIC_EXAMPLES: ClinicExample[] = [
  {
    id: 'weak-bug',
    label: 'Weak — bug',
    task: 'bug',
    level: 'weak',
    text: 'Fix the login bug.',
    note: 'The default starting point. No location, no symptom, nothing that can come back red.',
  },
  {
    id: 'weak-vibe',
    label: 'Weak — vibe',
    task: 'refactor',
    level: 'weak',
    text: 'Clean up the checkout code, it feels messy and hard to work with.',
    note: '"Messy" is a feeling. Without a definition of done, the agent invents a generous one.',
  },
  {
    id: 'workable-bug',
    label: 'Workable — bug',
    task: 'bug',
    level: 'workable',
    text: `In src/features/auth, expired refresh tokens cause a 500 instead of a 401.
Find the cause and fix it. Run npm test -- auth afterwards.`,
    note: 'A location and a check. Enough for a small fix; still missing scope, edge cases, and a deliverable.',
  },
  {
    id: 'strong-bug',
    label: 'Strong — bug',
    task: 'bug',
    level: 'strong',
    text: `The login form in src/features/auth returns a generic 500 when an expired
refresh token is present. Reproduce the failure using the existing auth tests,
identify the root cause, and explain it before editing. Then make the smallest
fix that preserves current behavior for valid sessions. Do not change the API
response schema. Add or update a regression test, run the focused auth tests,
then run the repository's required type check. Finish with the files changed,
the root cause, and the verification results.`,
    note: 'Location, symptom, sequence, scope, non-goal, regression requirement, two checks, and a deliverable.',
  },
  {
    id: 'strong-exploration',
    label: 'Strong — investigation',
    task: 'investigation',
    level: 'strong',
    text: `Explore the repository to explain how requests flow from the HTTP entry
point to persistence for the billing feature. Do not modify files. Cite the
relevant paths and symbols, identify the tests that cover the path, and list
uncertainties or missing coverage. Keep the final explanation under 400 words.`,
    note: 'Read-only, citation-backed, and it asks for the gaps — which is where the useful information usually is.',
  },
  {
    id: 'strong-refactor',
    label: 'Strong — refactor',
    task: 'refactor',
    level: 'strong',
    text: `In src/checkout/total.ts, calculateTotal() has four nested conditionals for
discount stacking. Extract each discount rule into a named function in the same
file, keeping behavior identical. Do not change the public signature, do not
touch tax handling, and do not add dependencies. Run npm test -- checkout before
and after; the same tests must pass and you must not modify any test file. If a
test needs to change, stop and tell me. Afterwards, report what the current
tests do not cover.`,
    note: 'The "do not modify any test file" line is what makes the passing suite meaningful evidence.',
  },
  {
    id: 'strong-tests',
    label: 'Strong — tests',
    task: 'test',
    level: 'strong',
    text: `Add tests for src/lib/parseDuration.ts using the patterns in
src/lib/parseDate.test.ts. Cover empty and null input, the largest realistic
value, every error path, negative durations, fractional units, and values above
24 hours. Do not write tests that only restate the implementation. If you find
behavior that looks like a bug, report it instead of writing an assertion that
locks it in. Run npm test -- parseDuration and report what you chose not to
test and why.`,
    note: 'Aimed at boundaries, and it explicitly blocks the failure mode where a bug gets encoded as expected behavior.',
  },
  {
    id: 'strong-performance',
    label: 'Strong — performance',
    task: 'performance',
    level: 'strong',
    text: `The /dashboard endpoint p95 went from 180ms to 1.4s after commit a1b2c3d.
Profile it with the existing benchmark in bench/dashboard.bench.ts before
changing anything, and tell me where the time goes. Then propose a fix and wait
for my approval before implementing it. Do not add caching — I want the
underlying cause. Report before and after numbers from the same benchmark.`,
    note: 'Measured, with an approval gate and the tempting workaround explicitly blocked.',
  },
  {
    id: 'strong-review',
    label: 'Strong — review',
    task: 'review',
    level: 'strong',
    text: `Review the diff on this branch as a hostile reviewer, excluding lockfiles.
Assume the author was rushing. For each file, name concrete failure scenarios:
inputs that break it, states it does not handle, errors it swallows, and
security assumptions it makes silently around authorization and input
validation. Rank findings by severity and say which ones the current tests
would miss. Do not fix anything.`,
    note: '"Do not fix anything" preserves the artifact you actually wanted: a list you can weigh.',
  },
  {
    id: 'strong-docs',
    label: 'Strong — documentation',
    task: 'documentation',
    level: 'strong',
    text: `Write a README section documenting the retry behavior of src/lib/http.ts,
derived from the code as it is now rather than from what it should be. Cover
the default backoff, which status codes are retried, and how to disable it. Do
not document behavior you cannot point at in the code — flag anything ambiguous
instead. Include one short example. Finish by listing what you were unsure of.`,
    note: 'Documentation drifts when it describes intentions. Deriving it from current code, with uncertainties flagged, is the fix.',
  },
  {
    id: 'workable-feature',
    label: 'Workable — feature',
    task: 'feature',
    level: 'workable',
    text: `Add a "copy link" button to the share dialog that copies the canonical URL.
Follow the pattern in src/components/ShareDialog.tsx. Run npm test -- ShareDialog.`,
    note: 'Good pattern reference and a check. Missing the edge cases — permission denied, screen-reader announcement — which is where this feature actually lives.',
  },
  {
    id: 'strong-feature',
    label: 'Strong — feature',
    task: 'feature',
    level: 'strong',
    text: `Add a "copy link" button to the share dialog that copies the canonical URL.
Follow the existing pattern in src/components/ShareDialog.tsx rather than
introducing a new abstraction. Only change files under src/components/ and its
tests. Handle clipboard permission being denied, and announce success to screen
readers. Do not add a dependency. Add tests covering both the success and denied
paths, run npm test -- ShareDialog, then run npm run typecheck. Report the files
changed, the decisions you made, and anything you chose not to do.`,
    note: 'The same feature with a boundary, the real edge cases named, a non-goal, and two checks.',
  },
];
