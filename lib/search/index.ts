/**
 * Client-side search over lessons, recipes, glossary terms, and reference
 * entries.
 *
 * The index is built at module load from the same typed content the pages
 * render, so nothing can drift out of sync. Scoring is a small, explainable
 * function rather than a ranking library: title matches beat summary
 * matches, which beat body matches, and a phrase match beats scattered
 * tokens.
 */

import type { Block } from '@/content/types';
import { LESSONS } from '@/data/curriculum';
import { RECIPES } from '@/data/recipes';
import { GLOSSARY } from '@/content/glossary';
import { REFERENCE } from '@/content/reference/entries';
import { SAFETY_SCENARIOS } from '@/content/safety';

export type SearchKind = 'lesson' | 'recipe' | 'glossary' | 'reference' | 'safety';

export interface SearchDocument {
  id: string;
  kind: SearchKind;
  title: string;
  summary: string;
  href: string;
  /** Lowercased haystack built from the document's own text. */
  body: string;
}

export interface SearchHit extends SearchDocument {
  score: number;
}

export const KIND_LABEL: Record<SearchKind, string> = {
  lesson: 'Lesson',
  recipe: 'Recipe',
  glossary: 'Glossary',
  reference: 'Reference',
  safety: 'Safety lab',
};

function blockText(block: Block): string {
  switch (block.kind) {
    case 'p':
    case 'h2':
    case 'h3':
      return block.text;
    case 'ul':
    case 'ol':
      return block.items.join(' ');
    case 'code':
      return [block.label, block.caption, block.code].filter(Boolean).join(' ');
    case 'callout':
      return [block.title, ...block.body].join(' ');
    case 'table':
      return [block.caption ?? '', ...block.head, ...block.rows.flat()].join(' ');
    case 'compare':
      return [
        block.title,
        ...block.sides.flatMap((side) => [side.label, side.code, ...side.notes]),
      ].join(' ');
    case 'checklist':
      return [block.title, ...block.items].join(' ');
    case 'lab':
      return [block.title, block.description].join(' ');
    case 'definition':
      return [block.term, block.body].join(' ');
    case 'sources':
      return block.note ?? '';
    default:
      return '';
  }
}

function buildIndex(): SearchDocument[] {
  const documents: SearchDocument[] = [];

  for (const lesson of LESSONS) {
    documents.push({
      id: `lesson:${lesson.slug}`,
      kind: 'lesson',
      title: `${lesson.moduleNumber}. ${lesson.title}`,
      summary: lesson.summary,
      href: `/learn/${lesson.slug}/`,
      body: [
        lesson.title,
        lesson.summary,
        lesson.level,
        ...lesson.objectives,
        ...lesson.blocks.map(blockText),
        ...lesson.checklist,
        ...lesson.quiz.map((question) => `${question.prompt} ${question.explanation}`),
      ]
        .join(' ')
        .toLowerCase(),
    });
  }

  for (const recipe of RECIPES) {
    documents.push({
      id: `recipe:${recipe.slug}`,
      kind: 'recipe',
      title: recipe.title,
      summary: recipe.summary,
      href: `/recipes/${recipe.slug}/`,
      body: [
        recipe.title,
        recipe.summary,
        recipe.task,
        recipe.risk,
        ...recipe.features,
        ...recipe.whenToUse,
        recipe.template,
        ...recipe.whyItWorks,
        ...recipe.expectedBehavior,
        ...recipe.verification,
        ...recipe.failureSignals.flatMap((entry) => [entry.signal, entry.recovery]),
      ]
        .join(' ')
        .toLowerCase(),
    });
  }

  for (const term of GLOSSARY) {
    documents.push({
      id: `glossary:${term.slug}`,
      kind: 'glossary',
      title: term.term,
      summary: term.definition,
      href: `/reference/glossary/#${term.slug}`,
      body: `${term.term} ${term.definition}`.toLowerCase(),
    });
  }

  for (const entry of REFERENCE) {
    documents.push({
      id: `reference:${entry.slug}`,
      kind: 'reference',
      title: entry.title,
      summary: entry.summary,
      href: `/reference/${entry.slug}/`,
      body: [entry.title, entry.summary, ...entry.blocks.map(blockText)].join(' ').toLowerCase(),
    });
  }

  for (const scenario of SAFETY_SCENARIOS) {
    documents.push({
      id: `safety:${scenario.id}`,
      kind: 'safety',
      title: scenario.title,
      summary: scenario.principle,
      href: `/safety/#${scenario.id}`,
      body: [
        scenario.title,
        scenario.situation,
        scenario.evidence.code,
        scenario.question,
        scenario.principle,
        ...scenario.choices.flatMap((choice) => [choice.label, choice.feedback]),
      ]
        .join(' ')
        .toLowerCase(),
    });
  }

  return documents;
}

export const SEARCH_INDEX: readonly SearchDocument[] = buildIndex();

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^\p{L}\p{N}.\-/]+/u)
    .filter((token) => token.length > 1);
}

export function search(query: string, limit = 20): SearchHit[] {
  const trimmed = query.trim().toLowerCase();
  if (trimmed.length < 2) return [];

  const tokens = tokenize(trimmed);
  if (tokens.length === 0) return [];

  const hits: SearchHit[] = [];

  for (const document of SEARCH_INDEX) {
    const title = document.title.toLowerCase();
    const summary = document.summary.toLowerCase();
    let score = 0;

    // Whole-phrase matches are the strongest signal.
    if (title.includes(trimmed)) score += 120;
    else if (summary.includes(trimmed)) score += 60;
    else if (document.body.includes(trimmed)) score += 30;

    let matchedTokens = 0;
    for (const token of tokens) {
      if (title.includes(token)) {
        score += 20;
        matchedTokens += 1;
      } else if (summary.includes(token)) {
        score += 8;
        matchedTokens += 1;
      } else if (document.body.includes(token)) {
        score += 3;
        matchedTokens += 1;
      }
    }

    // Require every token to appear somewhere, so results stay relevant.
    if (matchedTokens < tokens.length) continue;
    if (score === 0) continue;

    hits.push({ ...document, score });
  }

  return hits.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title)).slice(0, limit);
}
