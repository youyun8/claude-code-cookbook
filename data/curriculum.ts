import type { Lesson, LessonLevel } from '@/content/types';
import { lesson as m01 } from '@/content/lessons/01-mental-model-and-setup';
import { lesson as m02 } from '@/content/lessons/02-prompting-for-engineering';
import { lesson as m03 } from '@/content/lessons/03-explore-plan-implement-verify';
import { lesson as m04 } from '@/content/lessons/04-context-and-sessions';
import { lesson as m05 } from '@/content/lessons/05-project-instructions';
import { lesson as m06 } from '@/content/lessons/06-permissions-and-security';
import { lesson as m07 } from '@/content/lessons/07-skills-hooks-mcp-plugins';
import { lesson as m08 } from '@/content/lessons/08-git-and-daily-workflows';
import { lesson as m09 } from '@/content/lessons/09-efficiency-cost-quality';
import { lesson as m10 } from '@/content/lessons/10-advanced-automation';

/** Curriculum order. This array is the single source of truth for sequencing. */
export const LESSONS: readonly Lesson[] = [m01, m02, m03, m04, m05, m06, m07, m08, m09, m10];

export const LESSON_SLUGS: readonly string[] = LESSONS.map((lesson) => lesson.slug);

export function getLesson(slug: string): Lesson | undefined {
  return LESSONS.find((lesson) => lesson.slug === slug);
}

export function lessonIndex(slug: string): number {
  return LESSONS.findIndex((lesson) => lesson.slug === slug);
}

export function neighbours(slug: string): { previous: Lesson | null; next: Lesson | null } {
  const index = lessonIndex(slug);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: LESSONS[index - 1] ?? null,
    next: LESSONS[index + 1] ?? null,
  };
}

export const LEVELS: readonly LessonLevel[] = ['Foundations', 'Daily workflow', 'Advanced systems'];

export const LEVEL_BLURB: Record<LessonLevel, string> = {
  Foundations: 'Install it, understand the loop, and write tasks an agent can finish.',
  'Daily workflow':
    'Context, project instructions, permissions, and the workflows you run every day.',
  'Advanced systems': 'Extension mechanisms, efficiency, automation, and team-scale practice.',
};

export function lessonsByLevel(level: LessonLevel): Lesson[] {
  return LESSONS.filter((lesson) => lesson.level === level);
}

export const TOTAL_MINUTES = LESSONS.reduce((sum, lesson) => sum + lesson.minutes, 0);
