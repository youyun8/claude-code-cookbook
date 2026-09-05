import ts from 'typescript';
import { readFile, readdir, stat } from 'node:fs/promises';
import { messages } from '../locales/zh-TW/messages.mjs';
const normalize = (value) => value.replace(/\s+/g, ' ').trim();
const seen = new Set(Object.keys(messages).map(normalize));
async function walk(path) {
  if ((await stat(path)).isDirectory()) {
    for (const entry of await readdir(path, { withFileTypes: true })) {
      if (entry.isDirectory() || /\.tsx?$/.test(entry.name)) await walk(`${path}/${entry.name}`);
    }
    return;
  }
  const source = await readFile(path, 'utf8');
  const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true);
  const values = [];
  function visit(node) {
    if (
      ts.isStringLiteral(node) ||
      ts.isNoSubstitutionTemplateLiteral(node) ||
      ts.isJsxText(node)
    ) {
      const value = normalize(node.text);
      const parent = node.parent;
      const attr = ts.isJsxAttribute(parent) ? parent.name.getText(file) : '';
      if (
        value &&
        /[A-Za-z]/.test(value) &&
        !seen.has(value) &&
        !['className', 'id', 'href', 'name', 'value', 'type', 'key', 'lang', 'dateTime'].includes(
          attr,
        ) &&
        !value.startsWith('@/') &&
        !value.startsWith('./') &&
        !value.startsWith('../') &&
        !value.startsWith('http') &&
        !/^[a-z0-9_:/.-]+$/.test(value) &&
        !/(?:^| )(?:text-|bg-|border-|grid-|flex-|rounded-|mt-|px-|py-|w-|h-|items-|ca-)/.test(
          value,
        )
      ) {
        seen.add(value);
        values.push(value);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
  if (values.length) console.log(JSON.stringify({ path, values }));
}
for (const path of process.argv.slice(2)) await walk(path);
