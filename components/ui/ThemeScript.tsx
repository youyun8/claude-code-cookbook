/**
 * Applies the stored theme before first paint.
 *
 * Without this, a reader who chose dark would see a light flash on every
 * navigation. The script is deliberately tiny and defensive: if storage
 * throws or holds nothing, the stylesheet's prefers-color-scheme rules take
 * over and the page is still correct.
 */
const SCRIPT = `
(function () {
  try {
    var raw = localStorage.getItem('claude-code-academy:progress:v1');
    var theme = raw ? (JSON.parse(raw) || {}).theme : null;
    if (theme === 'light' || theme === 'dark') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  } catch (e) {}
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
