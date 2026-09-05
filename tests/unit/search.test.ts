import { describe, expect, it } from 'vitest';
import { SEARCH_INDEX, search } from '@/lib/search';
import { LESSONS } from '@/data/curriculum';
import { RECIPES } from '@/data/recipes';

describe('search', () => {
  it('indexes every lesson and recipe', () => {
    const lessonDocs = SEARCH_INDEX.filter((doc) => doc.kind === 'lesson');
    const recipeDocs = SEARCH_INDEX.filter((doc) => doc.kind === 'recipe');
    expect(lessonDocs).toHaveLength(LESSONS.length);
    expect(recipeDocs).toHaveLength(RECIPES.length);
  });

  it('ignores queries that are too short', () => {
    expect(search('')).toEqual([]);
    expect(search('a')).toEqual([]);
  });

  it('finds a lesson by a word in its title', () => {
    const hits = search('permissions');
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.some((hit) => hit.href.includes('permissions-sandboxing-security'))).toBe(true);
  });

  it('ranks a title match above a body-only match', () => {
    const hits = search('prompt injection');
    expect(hits.length).toBeGreaterThan(1);
    const scores = hits.map((hit) => hit.score);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });

  it('requires every token to appear somewhere', () => {
    expect(search('worktree zzzznotaword')).toEqual([]);
  });

  it('finds glossary terms', () => {
    const hits = search('compaction');
    expect(hits.some((hit) => hit.kind === 'glossary')).toBe(true);
  });

  it('finds safety scenarios by their content', () => {
    const hits = search('migration');
    expect(hits.some((hit) => hit.kind === 'safety')).toBe(true);
  });

  it('respects the result limit', () => {
    expect(search('the', 5).length).toBeLessThanOrEqual(5);
  });

  it('produces hrefs that all start at the site root', () => {
    for (const doc of SEARCH_INDEX) {
      expect(doc.href.startsWith('/')).toBe(true);
    }
  });
});
