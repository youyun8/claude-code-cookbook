/**
 * A deterministic rubric for engineering task prompts.
 *
 * This is a structure checker, not a judge of correctness. It looks for
 * signals that a prompt states its goal, points at real code, bounds its
 * scope, and names a check that can pass or fail. It cannot know whether the
 * request is a good idea, and the UI says so.
 *
 * Every criterion is a plain function over the prompt text, so the results
 * are reproducible and unit-testable, and no network call is involved.
 */

export type TaskType =
  | 'bug'
  | 'feature'
  | 'refactor'
  | 'test'
  | 'investigation'
  | 'documentation'
  | 'performance'
  | 'review';

export const TASK_TYPES: { id: TaskType; label: string; blurb: string }[] = [
  { id: 'bug', label: 'Bug fix', blurb: 'A reproducible defect with a known symptom.' },
  { id: 'feature', label: 'Feature', blurb: 'New behavior added to existing code.' },
  { id: 'refactor', label: 'Refactor', blurb: 'Structure changes with behavior held constant.' },
  { id: 'test', label: 'Tests', blurb: 'Coverage for code that already exists.' },
  {
    id: 'investigation',
    label: 'Investigation',
    blurb: 'Understanding before any edit is made.',
  },
  { id: 'documentation', label: 'Documentation', blurb: 'Explaining code to future readers.' },
  {
    id: 'performance',
    label: 'Performance',
    blurb: 'A measured regression or a measured target.',
  },
  { id: 'review', label: 'Review', blurb: 'Reading a change for correctness and risk.' },
];

export type CriterionId =
  | 'goal'
  | 'context'
  | 'scope'
  | 'constraints'
  | 'examples'
  | 'edgeCases'
  | 'verification'
  | 'deliverable';

export interface Criterion {
  id: CriterionId;
  label: string;
  /** What the checker is looking for, stated plainly for the learner. */
  looksFor: string;
  /** Why this matters for agentic coding work. */
  why: string;
  /** Weight in the overall score. Verification is weighted highest on purpose. */
  weight: number;
}

export const CRITERIA: readonly Criterion[] = [
  {
    id: 'goal',
    label: 'Goal',
    looksFor: 'An explicit action and outcome, not just a topic.',
    why: 'Without a stated outcome, Claude has to guess what "done" means and often picks a broader job than you wanted.',
    weight: 2,
  },
  {
    id: 'context',
    label: 'Context',
    looksFor: 'A file path, module, symbol, URL, log line, or error message.',
    why: 'Concrete anchors let Claude read the right code first instead of searching the whole repository.',
    weight: 2,
  },
  {
    id: 'scope',
    label: 'Scope',
    looksFor: 'A boundary: smallest change, only this module, do not touch X.',
    why: 'Agents will happily widen a change. A stated boundary keeps the diff reviewable.',
    weight: 2,
  },
  {
    id: 'constraints',
    label: 'Constraints and non-goals',
    looksFor: 'Words like "do not", "without changing", "preserve", "must keep".',
    why: 'Non-goals are usually cheaper to state than to undo after the fact.',
    weight: 1,
  },
  {
    id: 'examples',
    label: 'Examples or evidence',
    looksFor: 'A pasted error, a code block, sample input/output, or a reproduction.',
    why: 'Evidence turns a guess into a diagnosis and shortens the explore phase.',
    weight: 1,
  },
  {
    id: 'edgeCases',
    label: 'Expected behavior and edge cases',
    looksFor: 'Mentions of edge cases, empty/null input, errors, or concurrency.',
    why: 'Stating the boundary conditions is how you get a fix that survives review.',
    weight: 1,
  },
  {
    id: 'verification',
    label: 'Verification',
    looksFor: 'A command or check that produces a pass/fail result.',
    why: 'This is the single strongest signal in the rubric. An agent that can run a check can tell whether it is done; one that cannot is guessing.',
    weight: 3,
  },
  {
    id: 'deliverable',
    label: 'Deliverable',
    looksFor: 'A request for a summary, root cause, list of files changed, or a report.',
    why: 'A stated deliverable makes the result reviewable in a minute instead of ten.',
    weight: 1,
  },
];

export interface CriterionResult {
  id: CriterionId;
  met: boolean;
  /** The phrase in the prompt that satisfied the criterion, when there is one. */
  evidence: string | null;
  /** Concrete, copyable advice when the criterion is unmet. */
  suggestion: string;
}

export interface RubricResult {
  score: number;
  maxScore: number;
  percent: number;
  band: 'thin' | 'workable' | 'strong';
  results: CriterionResult[];
  /** Notes that are not scored but worth saying, e.g. prompt is very long. */
  notes: string[];
}

interface Matcher {
  pattern: RegExp;
}

const matchers: Record<CriterionId, Matcher[]> = {
  goal: [
    {
      pattern:
        /(?:目標[：:]|修正|修復|新增|實作|重構|重新命名|移除|遷移|調查|解釋|診斷|審查|撰寫|更新|升級|分析)/,
    },
    {
      pattern:
        /\b(fix|implement|add|refactor|rename|remove|migrate|investigate|explain|diagnose|review|document|optimi[sz]e|reproduce|write|update|extract|replace|upgrade|profile|benchmark|audit)\b/i,
    },
    { pattern: /^\s*goal\s*:/im },
  ],
  context: [
    { pattern: /(?:上下文|相關檔案|錯誤訊息|堆疊追蹤|日誌輸出|模組|函式|元件)[^。\n]{0,30}/ },
    // A path-like token: src/auth/session.ts, app/api/route.js, lib\parser.rb
    { pattern: /(^|[\s"'`(])[\w.@-]+[\\/][\w.@/\\-]*\.[a-z0-9]{1,5}\b/i },
    // A directory reference
    { pattern: /(^|\s)(?:src|lib|app|packages|services|internal|pkg|tests?)[\\/][\w.@/\\-]+/i },
    {
      pattern:
        /\b(?:in|inside|under|within)\s+(?:the\s+)?[\w-]+\s+(?:module|package|service|component|handler|directory|folder)\b/i,
    },
    { pattern: /https?:\/\/\S+/ },
    { pattern: /\b(?:stack trace|traceback|error message|log output|screenshot)\b/i },
    { pattern: /^\s*(?:context|relevant files?)\s*:/im },
  ],
  scope: [
    {
      pattern:
        /(?:最小(?:修改|修正|變更)|只(?:能|修改|編輯|處理|讀取)|範圍[：:]|不要(?:改|碰|編輯|新增))/,
    },
    {
      pattern:
        /\b(smallest|minimal|only (?:change|touch|edit|modify)|scoped? to|limit(?:ed)? to|confine[d]? to|stay within|nothing else)\b/i,
    },
    { pattern: /\bdo not (?:change|touch|edit|modify|refactor|rename|add)\b/i },
    { pattern: /^\s*(?:scope|non-goals?)\s*:/im },
  ],
  constraints: [
    { pattern: /(?:不要|不得|禁止|保留|維持|不改變|不新增)[^。\n]{1,40}/ },
    // Capture the object of the prohibition too, so the evidence shown to the
    // learner is the actual rule rather than a bare "do not".
    { pattern: /\b(?:do not|don't|never|must not|avoid)\s+\S+(?:\s+\S+){0,3}/i },
    { pattern: /\bwithout (?:changing|breaking|touching)\s+\S+(?:\s+\S+){0,2}/i },
    { pattern: /\b(?:preserve|keep)\s+\S+(?:\s+\S+){0,3}\s+unchanged/i },
    { pattern: /\b(?:backward[- ]compatible|no new dependenc\w*)/i },
    { pattern: /^\s*(?:constraints?|non-goals?)\s*:/im },
  ],
  examples: [
    { pattern: /(?:例如|範例|證據|症狀|重現|預期輸出|實際輸出|失敗斷言)[^。\n]{0,40}/ },
    { pattern: /```/ },
    {
      pattern:
        /\b(?:for example|e\.g\.|sample (?:input|output|payload)|given .* expect|reproduce with|repro steps?)\b/i,
    },
    {
      pattern:
        /\b(?:Error|Exception|Traceback|TypeError|NullPointerException|panic:|assertion|\b[45]\d{2}\b (?:error|response|status))/,
    },
    { pattern: /^\s*(?:examples?|symptoms?)\s*:/im },
  ],
  edgeCases: [
    { pattern: /(?:邊界|空值|空陣列|空字串|過期|逾時|並行|同時呼叫|負數|無效輸入|錯誤路徑)/ },
    {
      pattern:
        /\b(?:edge case|corner case|boundary|empty|null|undefined|nil|zero|negative|unicode|timeout|expired|concurrent|race condition|malformed|invalid input|off[- ]by[- ]one)\b/i,
    },
    { pattern: /^\s*(?:expected behavio(?:u)?r|edge cases?)\s*:/im },
  ],
  verification: [
    { pattern: /(?:執行|跑|新增|補上)[^。\n]{0,30}(?:測試|檢查|建置|基準)|(?:驗證[：:]|回歸測試)/ },
    {
      pattern:
        /\b(?:npm|pnpm|yarn|bun|pytest|go|cargo|make|mvn|gradle|dotnet|bundle|rake|tox|composer|swift|ctest|bazel)\s+[\w:.-]+/i,
    },
    {
      pattern:
        /\b(?:run|running|execute)\b[^.\n]{0,60}\b(?:tests?|test suite|linter|lint|type ?check|typecheck|build|benchmark|suite)\b/i,
    },
    {
      pattern:
        /\b(?:tests? (?:must|should) pass|until (?:the )?tests? pass|green|passes? (?:the )?(?:tests?|build|lint))\b/i,
    },
    {
      pattern:
        /\b(?:regression test|add a test|failing test|screenshot|before[- ]and[- ]after (?:numbers|timings|benchmark))\b/i,
    },
    { pattern: /^\s*verification\s*:/im },
  ],
  deliverable: [
    { pattern: /(?:回報|摘要|列出|交付[：:]|說明(?:原因|根因|修改|結果))/ },
    {
      pattern:
        /\b(?:report|summari[sz]e|summary|tell me|list (?:the )?(?:files|changes)|explain (?:the )?(?:root cause|what|why)|finish with|end with|when (?:you'?re )?(?:finished|done))\b/i,
    },
    { pattern: /^\s*deliverable\s*:/im },
  ],
};

const suggestions: Record<CriterionId, string> = {
  goal: 'Open with a verb and an outcome: "Fix the 500 returned when a refresh token has expired."',
  context:
    'Point at the code: name a path (`src/features/auth/session.ts`), a symbol, a failing test, or paste the error.',
  scope:
    'Add a boundary: "Make the smallest change that fixes this" or "Only touch files under src/features/auth."',
  constraints:
    'State a non-goal: "Do not change the API response schema" or "No new dependencies."',
  examples:
    'Paste the evidence: the stack trace, the failing assertion, or a short input/output pair.',
  edgeCases:
    'Name the boundaries that must keep working: expired tokens, empty lists, concurrent callers.',
  verification:
    'Name a command Claude can run and read: "Run `npm test -- auth` and the repo type check, and report the results."',
  deliverable:
    'Ask for a report: "Finish with the root cause, the files changed, and the verification output."',
};

/** Task types where a criterion is not merely nice to have. */
const emphasis: Record<TaskType, CriterionId[]> = {
  bug: ['context', 'examples', 'verification'],
  feature: ['scope', 'edgeCases', 'verification'],
  refactor: ['constraints', 'verification'],
  test: ['context', 'edgeCases'],
  investigation: ['context', 'constraints', 'deliverable'],
  documentation: ['context', 'deliverable'],
  performance: ['examples', 'verification'],
  review: ['context', 'edgeCases', 'deliverable'],
};

export function emphasisFor(task: TaskType): readonly CriterionId[] {
  return emphasis[task];
}

function firstMatch(text: string, list: Matcher[]): string | null {
  for (const { pattern } of list) {
    const found = text.match(pattern);
    if (found && typeof found[0] === 'string') {
      const trimmed = found[0].trim().replace(/\s+/g, ' ');
      return trimmed.length > 90 ? `${trimmed.slice(0, 87)}…` : trimmed;
    }
  }
  return null;
}

export function scorePrompt(rawText: string, task: TaskType): RubricResult {
  const text = rawText ?? '';
  const results: CriterionResult[] = CRITERIA.map((criterion) => {
    const evidence = text.trim().length === 0 ? null : firstMatch(text, matchers[criterion.id]);
    return {
      id: criterion.id,
      met: evidence !== null,
      evidence,
      suggestion: suggestions[criterion.id],
    };
  });

  const maxScore = CRITERIA.reduce((sum, criterion) => sum + criterion.weight, 0);
  const score = results.reduce((sum, result) => {
    if (!result.met) return sum;
    const criterion = CRITERIA.find((entry) => entry.id === result.id);
    return sum + (criterion?.weight ?? 0);
  }, 0);

  const percent = maxScore === 0 ? 0 : Math.round((score / maxScore) * 100);
  const band: RubricResult['band'] = percent >= 75 ? 'strong' : percent >= 45 ? 'workable' : 'thin';

  const notes: string[] = [];
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (words > 0 && words < 8) {
    notes.push(
      'This prompt is very short. For anything beyond a trivial edit, add a target and a check.',
    );
  }
  if (words > 400) {
    notes.push(
      'This prompt is long. Length is not the goal — trim anything that does not change what Claude does or how the result is checked.',
    );
  }
  const emphasized = emphasis[task].filter(
    (id) => !results.find((result) => result.id === id)?.met,
  );
  if (emphasized.length > 0) {
    const labels = emphasized
      .map((id) => CRITERIA.find((criterion) => criterion.id === id)?.label ?? id)
      .join(', ');
    notes.push(`For a ${task} task, these matter more than usual and are missing: ${labels}.`);
  }

  return { score, maxScore, percent, band, results, notes };
}
