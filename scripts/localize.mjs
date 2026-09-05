/**
 * Compile the Traditional Chinese edition from the shared page/component source.
 * Only AST string literals and JSX text are translated; identifiers, executable
 * examples and user input are untouched. Both editions are real static HTML.
 * Generated files are disposable build output, never a second implementation.
 */
import ts from 'typescript';
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { messages } from '../locales/zh-TW/messages.mjs';

const normalize = (value) => value.replace(/\s+/g, ' ').trim();
const dictionary = new Map(Object.entries(messages).map(([key, value]) => [normalize(key), value]));
const fragmentsOnly = new Set([
  'prompt',
  's',
  'of',
  'min',
  'minutes',
  'lines',
  'questions',
  'units',
  'line',
  'words',
  'weight',
  'matched:',
  'shown',
  'recipe',
  'recipes',
]);
const route = (value) =>
  /^\/(learn|recipes|clinic|safety|reference|progress)(\/|$)/.test(value) || value === '/'
    ? `/zh-TW${value}`
    : value;

function localize(source, filename) {
  const file = ts.createSourceFile(
    filename,
    source,
    ts.ScriptTarget.Latest,
    true,
    filename.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const edits = [];
  function visit(node) {
    if (
      ts.isStringLiteral(node) ||
      ts.isNoSubstitutionTemplateLiteral(node) ||
      ts.isJsxText(node)
    ) {
      const original = node.text;
      let translated = dictionary.get(normalize(original));
      if (!ts.isJsxText(node) && fragmentsOnly.has(normalize(original))) translated = undefined;
      if (
        ts.isJsxAttribute(node.parent) &&
        node.parent.name.getText(file) === 'lang' &&
        original === 'en' &&
        node.parent.parent.parent.tagName?.getText(file) === 'html'
      )
        translated = 'zh-TW';
      if (
        ts.isPropertyAssignment(node.parent) &&
        node.parent.name.getText(file) === 'inLanguage' &&
        original === 'en'
      )
        translated = 'zh-TW';
      if (
        original.startsWith('@/') &&
        !original.startsWith('@/styles/') &&
        !original.startsWith('@/lib/progress/') &&
        !original.startsWith('@/components/progress/')
      ) {
        translated = original.replace('@/', '@zh/');
      }
      if (route(original) !== original && !filename.endsWith('Preferences.tsx'))
        translated = route(original);
      if (translated !== undefined && translated !== original) {
        const replacement = ts.isJsxText(node)
          ? `{${JSON.stringify(translated)}}`
          : JSON.stringify(translated);
        edits.push([node.getStart(file), node.end, replacement]);
      }
    } else if (ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) {
      const text = node.text;
      let translated = dictionary.get(normalize(text));
      if (ts.isTemplateHead(node) && route(text) !== text && !filename.endsWith('Preferences.tsx'))
        translated = route(text);
      if (translated !== undefined && translated !== text) {
        const escaped = translated
          .replaceAll('\\', '\\\\')
          .replaceAll('`', '\\`')
          .replaceAll('${', '\\${');
        edits.push([
          node.getStart(file),
          node.end,
          (ts.isTemplateHead(node) ? '`' : '}') + escaped + (ts.isTemplateTail(node) ? '`' : '${'),
        ]);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
  for (const [start, end, value] of edits.sort((a, b) => b[0] - a[0]))
    source = source.slice(0, start) + value + source.slice(end);
  // Level names are domain enum values as well as labels: translate their
  // identifier keys consistently with string keys and type unions.
  if (filename.endsWith('data/curriculum.ts'))
    source = source.replace('Foundations:', '"基礎入門":');
  return source;
}

async function emit(path, source) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, source);
}

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) await walk(path);
    else if (/\.tsx?$/.test(path)) {
      let destination = `.localized/${path}`;
      if (path.startsWith('app/(en)/')) {
        const relative = path.slice('app/(en)/'.length);
        destination =
          relative === 'layout.tsx' ? 'app/(zh)/layout.tsx' : `app/(zh)/zh-TW/${relative}`;
      }
      let source;
      try {
        source = await readFile(`locales/zh-TW/${path}`, 'utf8');
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        source = await readFile(path, 'utf8');
      }
      if (path.startsWith('content/lessons/')) {
        const index = Number(entry.name.slice(0, 2)) - 1;
        source = `import { lessons } from '../zh-lessons'; export const lesson = lessons[${index}]!;`;
      }
      if (path.startsWith('content/recipes/')) {
        const offset = entry.name.startsWith('explore')
          ? 0
          : entry.name.startsWith('build')
            ? 5
            : 10;
        source = `import { recipes as all } from '../zh-recipes'; export const recipes = all.slice(${offset}, ${offset + 5});`;
      }
      await emit(destination, localize(source, path));
    }
  }
}
for (const directory of ['app/(en)', 'components', 'content', 'data', 'lib']) await walk(directory);
for (const name of ['zh-lessons', 'zh-recipes']) {
  await emit(
    `.localized/content/${name}.ts`,
    localize(await readFile(`locales/zh-TW/content/${name}.ts`, 'utf8'), `content/${name}.ts`),
  );
}
