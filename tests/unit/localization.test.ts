import { describe, expect, it } from 'vitest';
import { LESSONS as englishLessons } from '@/data/curriculum';
import { RECIPES as englishRecipes } from '@/data/recipes';
import { LESSONS } from '@zh/data/curriculum';
import { RECIPES } from '@zh/data/recipes';
import { GLOSSARY } from '@zh/content/glossary';
import { REFERENCE } from '@zh/content/reference/entries';
import { SAFETY_SCENARIOS } from '@zh/content/safety';
import { CLINIC_EXAMPLES } from '@zh/content/clinic-examples';
import { search } from '@zh/lib/search';
import { scorePrompt } from '@/lib/prompt-rubric';
import { lintClaudeMd } from '@/lib/claude-md-linter';
import { getSource } from '@/data/sources';
import {
  createEmptyProgress,
  LEGACY_STORAGE_PREFIX,
  STORAGE_KEY,
  migrate,
} from '@/lib/progress/schema';
import { readProgress, writeProgress, clearProgress } from '@/lib/progress/storage';

describe('Traditional Chinese edition', () => {
  it('keeps every lesson and recipe route and validates their sources', () => {
    expect(LESSONS.map((item) => item.slug)).toEqual(englishLessons.map((item) => item.slug));
    expect(RECIPES.map((item) => item.slug)).toEqual(englishRecipes.map((item) => item.slug));
    for (const item of [...LESSONS, ...RECIPES, ...REFERENCE, ...SAFETY_SCENARIOS]) {
      expect(item.title).toMatch(/\p{Script=Han}/u);
      for (const source of item.sources) expect(getSource(source), source).toBeDefined();
    }
    for (const term of GLOSSARY) expect(term.definition).toMatch(/\p{Script=Han}/u);
  });

  it('searches Chinese words and keeps result links in Chinese', () => {
    const hits = search('權限');
    expect(hits.length).toBeGreaterThan(2);
    expect(hits.every((hit) => hit.href.startsWith('/zh-TW/'))).toBe(true);
    expect(search('上下文').some((hit) => hit.kind === 'lesson')).toBe(true);
  });

  it('scores Chinese evidence and distinguishes weak and strong prompts', () => {
    const weak = CLINIC_EXAMPLES.find((example) => example.id === 'weak-bug')!;
    const strong = CLINIC_EXAMPLES.find((example) => example.id === 'strong-bug')!;
    expect(scorePrompt(strong.text, 'bug').percent).toBeGreaterThan(80);
    expect(scorePrompt(weak.text, 'bug').percent).toBeLessThan(40);
    expect(
      lintClaudeMd('請撰寫乾淨的程式碼\n本專案使用 React\n目前正在遷移 API').findings.length,
    ).toBeGreaterThanOrEqual(3);
  });
});

describe('reading preference migrations', () => {
  it('migrates the old brand key without losing progress or bookmarks', () => {
    const legacyStorageKey = `${LEGACY_STORAGE_PREFIX}previous:progress:v1`;
    localStorage.setItem(
      legacyStorageKey,
      JSON.stringify({
        version: 1,
        completedLessons: ['mental-model-and-setup'],
        bookmarks: ['recipe:fix-reproducible-bug'],
        theme: 'dark',
      }),
    );
    const { state } = readProgress();
    expect(state.completedLessons).toEqual(['mental-model-and-setup']);
    expect(state.bookmarks).toEqual(['recipe:fix-reproducible-bug']);
    expect(state.theme).toBe('dark');
    expect(state.fontSize).toBe('normal');
    writeProgress(state);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).completedLessons).toEqual(
      state.completedLessons,
    );
    clearProgress();
    expect(readProgress().state.completedLessons).toEqual([]);
  });

  it('prefers current data and validates imported preference values', () => {
    localStorage.setItem(
      `${LEGACY_STORAGE_PREFIX}previous:progress:v1`,
      JSON.stringify({ version: 1, theme: 'dark' }),
    );
    writeProgress({
      ...createEmptyProgress(),
      theme: 'light',
      fontSize: 'larger',
      readingWidth: 'wide',
      language: 'zh-TW',
    });
    expect(readProgress().state).toMatchObject({
      theme: 'light',
      fontSize: 'larger',
      readingWidth: 'wide',
      language: 'zh-TW',
    });
    expect(
      migrate({ version: 1, fontSize: '999px', readingWidth: 'invalid', language: 'invalid' })
        ?.state,
    ).toMatchObject({ fontSize: 'normal', readingWidth: 'comfortable', language: 'en' });
  });
});
