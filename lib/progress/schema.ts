/**
 * Versioned schema for locally stored learning progress.
 *
 * Everything the site remembers about a learner lives in this one object and
 * never leaves the browser. `SCHEMA_VERSION` is bumped whenever the shape
 * changes; `migrate()` upgrades older payloads so a stored value (or an
 * imported file) from a previous release is never silently discarded.
 */

export const SCHEMA_VERSION = 1;
export const STORAGE_KEY = 'claude-code-academy:progress:v1';

export type ThemeChoice = 'light' | 'dark' | 'system';

export interface QuizResult {
  /** Number of questions answered correctly on the first attempt. */
  correct: number;
  total: number;
  completedAt: string;
}

export interface ProgressState {
  version: number;
  /** Lesson slugs the learner marked complete. */
  completedLessons: string[];
  /** Lab ids the learner finished (safety scenarios, diff review, labs). */
  completedLabs: string[];
  /** Quiz results keyed by lesson slug. */
  quizzes: Record<string, QuizResult>;
  /** Bookmarked recipe and lesson slugs. */
  bookmarks: string[];
  /** The last lesson opened, used by "continue learning". */
  lastLessonSlug: string | null;
  theme: ThemeChoice;
  updatedAt: string;
}

export function createEmptyProgress(): ProgressState {
  return {
    version: SCHEMA_VERSION,
    completedLessons: [],
    completedLabs: [],
    quizzes: {},
    bookmarks: [],
    lastLessonSlug: null,
    theme: 'system',
    updatedAt: new Date(0).toISOString(),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  for (const entry of value) {
    if (typeof entry === 'string' && entry.length > 0 && entry.length <= 200) seen.add(entry);
  }
  return [...seen];
}

function quizRecord(value: unknown): Record<string, QuizResult> {
  if (!isRecord(value)) return {};
  const out: Record<string, QuizResult> = {};
  for (const [key, raw] of Object.entries(value)) {
    if (!isRecord(raw)) continue;
    const correct = raw.correct;
    const total = raw.total;
    if (typeof correct !== 'number' || typeof total !== 'number') continue;
    if (!Number.isFinite(correct) || !Number.isFinite(total) || total <= 0) continue;
    out[key] = {
      correct: Math.max(0, Math.min(Math.round(correct), Math.round(total))),
      total: Math.round(total),
      completedAt: typeof raw.completedAt === 'string' ? raw.completedAt : new Date().toISOString(),
    };
  }
  return out;
}

function themeChoice(value: unknown): ThemeChoice {
  return value === 'light' || value === 'dark' || value === 'system' ? value : 'system';
}

export interface MigrationResult {
  state: ProgressState;
  /** Human-readable notes about anything that was repaired or dropped. */
  notes: string[];
}

/**
 * Coerce an unknown payload into a valid ProgressState.
 *
 * Returns `null` only when the payload cannot plausibly be progress data at
 * all — callers surface that to the user as a malformed import rather than
 * overwriting good local state with garbage.
 */
export function migrate(input: unknown): MigrationResult | null {
  if (!isRecord(input)) return null;

  const notes: string[] = [];
  const rawVersion = input.version;

  if (typeof rawVersion !== 'number' || !Number.isFinite(rawVersion)) {
    return null;
  }

  if (rawVersion > SCHEMA_VERSION) {
    notes.push(
      `File was written by a newer version of the site (schema ${rawVersion}). Unknown fields were dropped.`,
    );
  }

  const state: ProgressState = {
    version: SCHEMA_VERSION,
    completedLessons: stringArray(input.completedLessons),
    completedLabs: stringArray(input.completedLabs),
    quizzes: quizRecord(input.quizzes),
    bookmarks: stringArray(input.bookmarks),
    lastLessonSlug: typeof input.lastLessonSlug === 'string' ? input.lastLessonSlug : null,
    theme: themeChoice(input.theme),
    updatedAt: typeof input.updatedAt === 'string' ? input.updatedAt : new Date(0).toISOString(),
  };

  if (rawVersion < SCHEMA_VERSION) {
    notes.push(`Upgraded progress from schema ${rawVersion} to ${SCHEMA_VERSION}.`);
  }

  return { state, notes };
}

/** Parse a JSON string exported by this site. */
export function parseExport(text: string): MigrationResult | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return null;
  }
  return migrate(parsed);
}

export function serializeExport(state: ProgressState): string {
  return JSON.stringify({ ...state, version: SCHEMA_VERSION }, null, 2);
}
