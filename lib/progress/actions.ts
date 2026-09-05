/**
 * Pure reducers over ProgressState.
 *
 * Keeping them free of React and of storage makes each rule directly
 * testable and keeps the provider a thin shell.
 */

import type { ProgressState, QuizResult, ThemeChoice } from './schema';

function touch(state: ProgressState): ProgressState {
  return { ...state, updatedAt: new Date().toISOString() };
}

function toggleIn(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((entry) => entry !== id) : [...list, id];
}

export function setLessonComplete(
  state: ProgressState,
  slug: string,
  complete: boolean,
): ProgressState {
  const completedLessons = complete
    ? state.completedLessons.includes(slug)
      ? state.completedLessons
      : [...state.completedLessons, slug]
    : state.completedLessons.filter((entry) => entry !== slug);
  return touch({ ...state, completedLessons });
}

export function setLabComplete(state: ProgressState, id: string, complete: boolean): ProgressState {
  const completedLabs = complete
    ? state.completedLabs.includes(id)
      ? state.completedLabs
      : [...state.completedLabs, id]
    : state.completedLabs.filter((entry) => entry !== id);
  return touch({ ...state, completedLabs });
}

/** Quiz scores are kept at their best value so retaking a quiz is never punished. */
export function recordQuiz(state: ProgressState, slug: string, result: QuizResult): ProgressState {
  const previous = state.quizzes[slug];
  const keep =
    previous && previous.total === result.total && previous.correct >= result.correct
      ? previous
      : result;
  return touch({ ...state, quizzes: { ...state.quizzes, [slug]: keep } });
}

export function toggleBookmark(state: ProgressState, id: string): ProgressState {
  return touch({ ...state, bookmarks: toggleIn(state.bookmarks, id) });
}

export function setLastLesson(state: ProgressState, slug: string): ProgressState {
  if (state.lastLessonSlug === slug) return state;
  return touch({ ...state, lastLessonSlug: slug });
}

export function setTheme(state: ProgressState, theme: ThemeChoice): ProgressState {
  return touch({ ...state, theme });
}

export interface ProgressSummary {
  lessonsCompleted: number;
  lessonsTotal: number;
  percent: number;
  labsCompleted: number;
  labsTotal: number;
  quizCorrect: number;
  quizTotal: number;
  quizAccuracy: number | null;
  bookmarks: number;
}

export function summarize(
  state: ProgressState,
  lessonSlugs: readonly string[],
  labIds: readonly string[],
): ProgressSummary {
  const lessonsCompleted = lessonSlugs.filter((slug) =>
    state.completedLessons.includes(slug),
  ).length;
  const labsCompleted = labIds.filter((id) => state.completedLabs.includes(id)).length;

  let quizCorrect = 0;
  let quizTotal = 0;
  for (const slug of lessonSlugs) {
    const result = state.quizzes[slug];
    if (!result) continue;
    quizCorrect += result.correct;
    quizTotal += result.total;
  }

  return {
    lessonsCompleted,
    lessonsTotal: lessonSlugs.length,
    percent:
      lessonSlugs.length === 0 ? 0 : Math.round((lessonsCompleted / lessonSlugs.length) * 100),
    labsCompleted,
    labsTotal: labIds.length,
    quizCorrect,
    quizTotal,
    quizAccuracy: quizTotal === 0 ? null : Math.round((quizCorrect / quizTotal) * 100),
    bookmarks: state.bookmarks.length,
  };
}

/** The next lesson a learner should open, given curriculum order. */
export function nextLessonSlug(
  state: ProgressState,
  lessonSlugs: readonly string[],
): string | null {
  const unfinished = lessonSlugs.find((slug) => !state.completedLessons.includes(slug));
  if (unfinished) return unfinished;
  return lessonSlugs[0] ?? null;
}
