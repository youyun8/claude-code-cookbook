import { createHighlighter, type Highlighter } from 'shiki';

/**
 * Build-time syntax highlighting.
 *
 * Shiki runs during static generation and emits dual-theme markup: light
 * colours inline, dark colours in a `--shiki-dark` custom property that the
 * stylesheet swaps in. No highlighting code reaches the browser.
 */

const LANGS = [
  'bash',
  'batch',
  'diff',
  'json',
  'markdown',
  'powershell',
  'sql',
  'text',
  'typescript',
  'tsx',
  'yaml',
] as const;

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  highlighterPromise ??= createHighlighter({
    themes: ['github-light', 'github-dark'],
    langs: [...LANGS],
  });
  return highlighterPromise;
}

export type SupportedLang = (typeof LANGS)[number];

function normalizeLang(lang: string): SupportedLang {
  return (LANGS as readonly string[]).includes(lang) ? (lang as SupportedLang) : 'text';
}

export async function highlight(code: string, lang: string): Promise<string> {
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code, {
    lang: normalizeLang(lang),
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: false,
  });
}
