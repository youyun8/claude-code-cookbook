import { describe, expect, it } from 'vitest';
import {
  SCHEMA_VERSION,
  createEmptyProgress,
  migrate,
  parseExport,
  serializeExport,
} from '@/lib/progress/schema';
import {
  nextLessonSlug,
  recordQuiz,
  setLabComplete,
  setLessonComplete,
  summarize,
  toggleBookmark,
} from '@/lib/progress/actions';

const LESSONS = ['a', 'b', 'c', 'd'];
const LABS = ['lab:one', 'lab:two'];

describe('progress schema', () => {
  it('creates an empty state at the current version', () => {
    const state = createEmptyProgress();
    expect(state.version).toBe(SCHEMA_VERSION);
    expect(state.completedLessons).toEqual([]);
    expect(state.theme).toBe('system');
  });

  it('round-trips through export and import', () => {
    let state = createEmptyProgress();
    state = setLessonComplete(state, 'a', true);
    state = recordQuiz(state, 'a', { correct: 3, total: 4, completedAt: '2026-01-01T00:00:00Z' });
    state = toggleBookmark(state, 'recipe:fix-reproducible-bug');

    const result = parseExport(serializeExport(state));
    expect(result).not.toBeNull();
    expect(result?.state.completedLessons).toEqual(['a']);
    expect(result?.state.quizzes.a?.correct).toBe(3);
    expect(result?.state.bookmarks).toEqual(['recipe:fix-reproducible-bug']);
  });

  it('rejects payloads that are not progress data', () => {
    expect(parseExport('not json at all')).toBeNull();
    expect(parseExport('[]')).toBeNull();
    expect(parseExport('null')).toBeNull();
    expect(parseExport('{"hello":"world"}')).toBeNull();
    expect(parseExport('{"version":"one"}')).toBeNull();
  });

  it('accepts a minimal payload and fills in defaults', () => {
    const result = migrate({ version: 1 });
    expect(result).not.toBeNull();
    expect(result?.state.completedLessons).toEqual([]);
    expect(result?.state.lastLessonSlug).toBeNull();
  });

  it('drops malformed entries rather than failing the whole import', () => {
    const result = migrate({
      version: 1,
      completedLessons: ['a', 42, null, 'a', 'b'],
      bookmarks: 'not-an-array',
      quizzes: { a: { correct: 2, total: 3 }, b: { correct: 'x' }, c: null },
      theme: 'neon',
    });
    expect(result?.state.completedLessons).toEqual(['a', 'b']);
    expect(result?.state.bookmarks).toEqual([]);
    expect(Object.keys(result?.state.quizzes ?? {})).toEqual(['a']);
    expect(result?.state.theme).toBe('system');
  });

  it('clamps a quiz score that exceeds its total', () => {
    const result = migrate({ version: 1, quizzes: { a: { correct: 99, total: 4 } } });
    expect(result?.state.quizzes.a?.correct).toBe(4);
  });

  it('notes a file written by a newer schema and normalises the version', () => {
    const result = migrate({ version: SCHEMA_VERSION + 1, completedLessons: ['a'] });
    expect(result?.state.version).toBe(SCHEMA_VERSION);
    expect(result?.notes.join(' ')).toContain('newer version');
  });
});

describe('progress actions', () => {
  it('marks lessons complete and incomplete without duplicating', () => {
    let state = createEmptyProgress();
    state = setLessonComplete(state, 'a', true);
    state = setLessonComplete(state, 'a', true);
    expect(state.completedLessons).toEqual(['a']);
    state = setLessonComplete(state, 'a', false);
    expect(state.completedLessons).toEqual([]);
  });

  it('keeps the best quiz result so retaking is never punished', () => {
    let state = createEmptyProgress();
    state = recordQuiz(state, 'a', { correct: 4, total: 4, completedAt: '2026-01-01T00:00:00Z' });
    state = recordQuiz(state, 'a', { correct: 1, total: 4, completedAt: '2026-01-02T00:00:00Z' });
    expect(state.quizzes.a?.correct).toBe(4);
  });

  it('replaces a stored result when the quiz length changed', () => {
    let state = createEmptyProgress();
    state = recordQuiz(state, 'a', { correct: 4, total: 4, completedAt: '2026-01-01T00:00:00Z' });
    state = recordQuiz(state, 'a', { correct: 2, total: 6, completedAt: '2026-01-02T00:00:00Z' });
    expect(state.quizzes.a).toEqual({
      correct: 2,
      total: 6,
      completedAt: '2026-01-02T00:00:00Z',
    });
  });

  it('toggles bookmarks', () => {
    let state = createEmptyProgress();
    state = toggleBookmark(state, 'lesson:a');
    expect(state.bookmarks).toEqual(['lesson:a']);
    state = toggleBookmark(state, 'lesson:a');
    expect(state.bookmarks).toEqual([]);
  });

  it('summarises completion, labs and quiz accuracy', () => {
    let state = createEmptyProgress();
    state = setLessonComplete(state, 'a', true);
    state = setLessonComplete(state, 'b', true);
    state = setLabComplete(state, 'lab:one', true);
    state = recordQuiz(state, 'a', { correct: 3, total: 4, completedAt: '2026-01-01T00:00:00Z' });
    state = recordQuiz(state, 'b', { correct: 4, total: 4, completedAt: '2026-01-01T00:00:00Z' });

    const summary = summarize(state, LESSONS, LABS);
    expect(summary.lessonsCompleted).toBe(2);
    expect(summary.percent).toBe(50);
    expect(summary.labsCompleted).toBe(1);
    expect(summary.quizCorrect).toBe(7);
    expect(summary.quizTotal).toBe(8);
    expect(summary.quizAccuracy).toBe(88);
  });

  it('reports null accuracy when no quiz has been taken', () => {
    expect(summarize(createEmptyProgress(), LESSONS, LABS).quizAccuracy).toBeNull();
  });

  it('picks the first unfinished lesson, in curriculum order', () => {
    let state = createEmptyProgress();
    expect(nextLessonSlug(state, LESSONS)).toBe('a');
    state = setLessonComplete(state, 'a', true);
    expect(nextLessonSlug(state, LESSONS)).toBe('b');
    // Out-of-order completion still returns the earliest gap.
    state = setLessonComplete(state, 'd', true);
    expect(nextLessonSlug(state, LESSONS)).toBe('b');
  });

  it('falls back to the first lesson once everything is complete', () => {
    let state = createEmptyProgress();
    for (const slug of LESSONS) state = setLessonComplete(state, slug, true);
    expect(nextLessonSlug(state, LESSONS)).toBe('a');
  });
});
