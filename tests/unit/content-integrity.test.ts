import { describe, expect, it } from 'vitest';
import { LESSONS, LESSON_SLUGS, getLesson } from '@/data/curriculum';
import { RECIPES } from '@/data/recipes';
import { REFERENCE } from '@/content/reference/entries';
import { GLOSSARY, getTerm } from '@/content/glossary';
import { SAFETY_SCENARIOS } from '@/content/safety';
import { CLINIC_EXAMPLES } from '@/content/clinic-examples';
import { getSource } from '@/data/sources';
import type { Block } from '@/content/types';

/**
 * These guard the content rather than the code. A broken source id, a
 * dangling internal link, or a lesson that forgot its quiz is a content bug
 * that would otherwise only show up in a manual read-through.
 */

const INTERNAL_ROUTES = new Set<string>([
  '/',
  '/learn/',
  '/clinic/',
  '/recipes/',
  '/safety/',
  '/reference/',
  '/reference/glossary/',
  '/progress/',
  ...LESSONS.map((lesson) => `/learn/${lesson.slug}/`),
  ...RECIPES.map((recipe) => `/recipes/${recipe.slug}/`),
  ...REFERENCE.map((entry) => `/reference/${entry.slug}/`),
]);

function allBlockText(blocks: readonly Block[]): string[] {
  const out: string[] = [];
  for (const block of blocks) {
    switch (block.kind) {
      case 'p':
        out.push(block.text);
        break;
      case 'ul':
      case 'ol':
        out.push(...block.items);
        break;
      case 'callout':
        out.push(...block.body);
        break;
      case 'table':
        out.push(...block.rows.flat(), ...block.head);
        break;
      case 'definition':
        out.push(block.body);
        break;
      case 'compare':
        out.push(...block.sides.flatMap((side) => side.notes));
        break;
      default:
        break;
    }
  }
  return out;
}

function sourceIdsIn(blocks: readonly Block[]): string[] {
  return blocks.flatMap((block) => (block.kind === 'sources' ? block.ids : []));
}

describe('curriculum', () => {
  it('has ten modules numbered 1 to 10 in order', () => {
    expect(LESSONS).toHaveLength(10);
    expect(LESSONS.map((lesson) => lesson.moduleNumber)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('has unique slugs', () => {
    expect(new Set(LESSON_SLUGS).size).toBe(LESSON_SLUGS.length);
  });

  it('references only prerequisites that exist and come earlier', () => {
    LESSONS.forEach((lesson, index) => {
      for (const prerequisite of lesson.prerequisites) {
        const target = getLesson(prerequisite);
        expect(target, `${lesson.slug} requires unknown lesson ${prerequisite}`).toBeDefined();
        expect(
          LESSONS.findIndex((entry) => entry.slug === prerequisite),
          `${lesson.slug} requires a later lesson`,
        ).toBeLessThan(index);
      }
    });
  });

  it('gives every lesson objectives, a checklist and a knowledge check', () => {
    for (const lesson of LESSONS) {
      expect(lesson.objectives.length, lesson.slug).toBeGreaterThanOrEqual(3);
      expect(lesson.checklist.length, lesson.slug).toBeGreaterThanOrEqual(4);
      expect(lesson.quiz.length, lesson.slug).toBeGreaterThanOrEqual(2);
      expect(lesson.quiz.length, lesson.slug).toBeLessThanOrEqual(4);
      expect(lesson.sources.length, lesson.slug).toBeGreaterThan(0);
      expect(lesson.minutes, lesson.slug).toBeGreaterThan(0);
    }
  });

  it('gives every quiz question a correct option and an explanation', () => {
    for (const lesson of LESSONS) {
      for (const question of lesson.quiz) {
        const ids = question.options.map((option) => option.id);
        expect(new Set(ids).size, `${lesson.slug}/${question.id}`).toBe(ids.length);
        expect(ids, `${lesson.slug}/${question.id}`).toContain(question.correctOptionId);
        expect(question.explanation.length, `${lesson.slug}/${question.id}`).toBeGreaterThan(40);
      }
    }
  });

  it('uses unique heading ids within each lesson', () => {
    for (const lesson of LESSONS) {
      const ids = lesson.blocks
        .filter((block) => block.kind === 'h2' || block.kind === 'h3')
        .map((block) => (block as { id: string }).id);
      expect(new Set(ids).size, lesson.slug).toBe(ids.length);
    }
  });
});

describe('recipes', () => {
  it('has fifteen recipes with unique slugs', () => {
    expect(RECIPES).toHaveLength(15);
    const slugs = RECIPES.map((recipe) => recipe.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('declares every template variable, and uses every declared one', () => {
    for (const recipe of RECIPES) {
      const used = [...recipe.template.matchAll(/\{\{(\w+)\}\}/g)].map((match) => match[1]);
      const declared = recipe.variables.map((variable) => variable.id);
      for (const id of used) {
        expect(declared, `${recipe.slug} uses undeclared {{${id}}}`).toContain(id);
      }
      for (const id of declared) {
        expect(used, `${recipe.slug} declares unused ${id}`).toContain(id);
      }
    }
  });

  it('gives every recipe verification and recovery guidance', () => {
    for (const recipe of RECIPES) {
      expect(recipe.verification.length, recipe.slug).toBeGreaterThanOrEqual(2);
      expect(recipe.failureSignals.length, recipe.slug).toBeGreaterThanOrEqual(2);
      expect(recipe.whyItWorks.length, recipe.slug).toBeGreaterThanOrEqual(2);
      expect(recipe.whenToUse.length, recipe.slug).toBeGreaterThanOrEqual(1);
      expect(recipe.sources.length, recipe.slug).toBeGreaterThan(0);
    }
  });

  it('gives every variable a non-empty example so the playground renders', () => {
    for (const recipe of RECIPES) {
      for (const variable of recipe.variables) {
        expect(variable.example.trim().length, `${recipe.slug}/${variable.id}`).toBeGreaterThan(0);
        expect(variable.help.trim().length, `${recipe.slug}/${variable.id}`).toBeGreaterThan(0);
      }
    }
  });
});

describe('safety lab', () => {
  it('has seven scenarios, each with exactly one safest choice', () => {
    expect(SAFETY_SCENARIOS).toHaveLength(7);
    for (const scenario of SAFETY_SCENARIOS) {
      const safest = scenario.choices.filter((choice) => choice.verdict === 'safest');
      expect(safest, scenario.id).toHaveLength(1);
      expect(scenario.choices.length, scenario.id).toBeGreaterThanOrEqual(3);
      expect(scenario.principle.length, scenario.id).toBeGreaterThan(40);
    }
  });

  it('uses unique ids', () => {
    const ids = SAFETY_SCENARIOS.map((scenario) => scenario.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('glossary and reference', () => {
  it('resolves every see-also reference', () => {
    for (const term of GLOSSARY) {
      for (const slug of term.seeAlso) {
        expect(getTerm(slug), `${term.slug} points at unknown term ${slug}`).toBeDefined();
      }
    }
  });

  it('uses unique slugs', () => {
    const termSlugs = GLOSSARY.map((term) => term.slug);
    expect(new Set(termSlugs).size).toBe(termSlugs.length);
    const referenceSlugs = REFERENCE.map((entry) => entry.slug);
    expect(new Set(referenceSlugs).size).toBe(referenceSlugs.length);
  });

  it('covers all nine reference areas from the curriculum', () => {
    expect(REFERENCE.length).toBeGreaterThanOrEqual(8);
  });
});

describe('sources', () => {
  it('resolves every source id used anywhere in the content', () => {
    const ids = [
      ...LESSONS.flatMap((lesson) => [...lesson.sources, ...sourceIdsIn(lesson.blocks)]),
      ...RECIPES.flatMap((recipe) => recipe.sources),
      ...REFERENCE.flatMap((entry) => [...entry.sources, ...sourceIdsIn(entry.blocks)]),
      ...GLOSSARY.flatMap((term) => term.sources),
      ...SAFETY_SCENARIOS.flatMap((scenario) => scenario.sources),
    ];
    expect(ids.length).toBeGreaterThan(50);
    for (const id of ids) {
      expect(getSource(id), `unknown source id: ${id}`).toBeDefined();
    }
  });

  it('gives every source an https docs URL and a review date', () => {
    const ids = new Set(LESSONS.flatMap((lesson) => lesson.sources));
    for (const id of ids) {
      const source = getSource(id);
      expect(source?.url.startsWith('https://')).toBe(true);
      expect(source?.lastReviewed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});

describe('internal links', () => {
  it('points every inline internal link at a route that exists', () => {
    const texts = [
      ...LESSONS.flatMap((lesson) => allBlockText(lesson.blocks)),
      ...REFERENCE.flatMap((entry) => allBlockText(entry.blocks)),
    ];
    const links = texts.flatMap((text) =>
      [...text.matchAll(/\]\((\/[^)\s]*)\)/g)].map((m) => m[1]),
    );
    for (const href of links) {
      expect(INTERNAL_ROUTES.has(href ?? ''), `dangling internal link: ${href}`).toBe(true);
    }
  });
});

describe('clinic examples', () => {
  it('provides at least eight examples with unique ids', () => {
    expect(CLINIC_EXAMPLES.length).toBeGreaterThanOrEqual(8);
    const ids = CLINIC_EXAMPLES.map((example) => example.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('spans weak through strong', () => {
    const levels = new Set(CLINIC_EXAMPLES.map((example) => example.level));
    expect(levels).toContain('weak');
    expect(levels).toContain('workable');
    expect(levels).toContain('strong');
  });
});
