/**
 * Typed content model.
 *
 * Lessons, recipes and reference entries are data, not components. Pages
 * render them through a single block renderer, which keeps the educational
 * material free of layout concerns and makes it indexable for search.
 *
 * Inline text supports a deliberately tiny markup subset — `code`,
 * **strong**, and [label](href) — parsed into React elements rather than
 * injected as HTML, so no author string is ever treated as markup.
 */

export type SourceId = string;

export type CalloutTone = 'note' | 'tip' | 'warning' | 'danger' | 'verify';

export type LabId =
  | 'terminal-walkthrough'
  | 'prompt-anatomy'
  | 'context-budget'
  | 'claude-md-linter'
  | 'permission-lab'
  | 'diff-review'
  | 'guided-fix';

export interface CodeBlock {
  kind: 'code';
  lang: string;
  code: string;
  /** Short label shown on the block, e.g. a filename or "Prompt". */
  label?: string;
  caption?: string;
}

export interface CompareSide {
  label: string;
  tone: 'weak' | 'strong';
  code: string;
  notes: string[];
}

export type Block =
  | { kind: 'p'; text: string }
  | { kind: 'h2'; text: string; id: string }
  | { kind: 'h3'; text: string; id: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'ol'; items: string[] }
  | CodeBlock
  | { kind: 'callout'; tone: CalloutTone; title: string; body: string[] }
  | { kind: 'table'; caption?: string; head: string[]; rows: string[][] }
  | { kind: 'compare'; title: string; sides: [CompareSide, CompareSide] }
  | { kind: 'checklist'; title: string; items: string[] }
  | { kind: 'sources'; ids: SourceId[]; note?: string }
  | { kind: 'lab'; lab: LabId; title: string; description: string }
  | { kind: 'definition'; term: string; body: string };

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
  /** Shown after answering, whether the learner was right or wrong. */
  explanation: string;
}

export type LessonLevel = 'Foundations' | 'Daily workflow' | 'Advanced systems';

export interface Lesson {
  slug: string;
  moduleNumber: number;
  title: string;
  /** One sentence, used for cards, metadata and search. */
  summary: string;
  level: LessonLevel;
  minutes: number;
  /** Slugs of lessons a learner should finish first. */
  prerequisites: string[];
  /** "After this lesson you will be able to…" */
  objectives: string[];
  blocks: Block[];
  /** Review checklist shown before the knowledge check. */
  checklist: string[];
  quiz: QuizQuestion[];
  sources: SourceId[];
}

export type RiskLevel = 'low' | 'medium' | 'high';

export type RecipeTask =
  | 'explore'
  | 'debug'
  | 'implement'
  | 'refactor'
  | 'test'
  | 'review'
  | 'performance'
  | 'maintenance'
  | 'configure'
  | 'automate';

export type RecipeFeature =
  | 'plan-mode'
  | 'claude-md'
  | 'hooks'
  | 'subagents'
  | 'mcp'
  | 'worktrees'
  | 'headless'
  | 'permissions'
  | 'git';

export interface RecipeVariable {
  id: string;
  label: string;
  placeholder: string;
  /** Default value used to render the template before the learner edits it. */
  example: string;
  help: string;
}

export interface Recipe {
  slug: string;
  title: string;
  summary: string;
  task: RecipeTask;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  risk: RiskLevel;
  features: RecipeFeature[];
  whenToUse: string[];
  prerequisites: string[];
  /** Prompt template. `{{variableId}}` placeholders are substituted. */
  template: string;
  variables: RecipeVariable[];
  whyItWorks: string[];
  expectedBehavior: string[];
  verification: string[];
  failureSignals: { signal: string; recovery: string }[];
  sources: SourceId[];
}

export interface GlossaryTerm {
  term: string;
  slug: string;
  definition: string;
  seeAlso: string[];
  sources: SourceId[];
}

export interface ReferenceEntry {
  slug: string;
  title: string;
  summary: string;
  blocks: Block[];
  sources: SourceId[];
}

export interface SafetyChoice {
  id: string;
  label: string;
  /** 'safest' is the recommended answer; 'risky' options explain the cost. */
  verdict: 'safest' | 'defensible' | 'risky';
  feedback: string;
}

export interface SafetyScenario {
  id: string;
  title: string;
  risk: RiskLevel;
  situation: string;
  /** What Claude proposed, shown as a terminal or diff excerpt. */
  evidence: { lang: string; code: string };
  question: string;
  choices: SafetyChoice[];
  principle: string;
  sources: SourceId[];
}
