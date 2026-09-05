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
    var raw = localStorage.getItem('claude-code-cookbook:progress:v1');
    if (!raw) {
      for (var index = 0; index < localStorage.length; index += 1) {
        var key = localStorage.key(index);
        if (key && key !== 'claude-code-cookbook:progress:v1' && key.indexOf('claude-code-') === 0 && key.slice(-12) === ':progress:v1') {
          raw = localStorage.getItem(key);
          break;
        }
      }
    }
    var preferences = raw ? (JSON.parse(raw) || {}) : {};
    var theme = preferences.theme;
    if (theme === 'light' || theme === 'dark') {
      document.documentElement.setAttribute('data-theme', theme);
    }
    if (['normal', 'large', 'larger'].includes(preferences.fontSize)) {
      document.documentElement.dataset.fontSize = preferences.fontSize;
    }
    if (['compact', 'comfortable', 'wide'].includes(preferences.readingWidth)) {
      document.documentElement.dataset.readingWidth = preferences.readingWidth;
    }
    var basePath = ${JSON.stringify(process.env.NEXT_PUBLIC_BASE_PATH ?? '')};
    if (location.pathname === basePath + '/' && preferences.language === 'zh-TW') {
      location.replace(basePath + '/zh-TW/' + location.search + location.hash);
    }
  } catch (e) {}
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
