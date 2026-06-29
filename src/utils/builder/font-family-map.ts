/**
 * Maps the short font key names (matching tailwind.config.ts fontFamily keys and
 * the pbx-font-* class suffixes) to their CSS font-family strings.
 *
 * Used to resolve element-level font overrides (elementFonts config) into the
 * CSS custom properties that style.css targets with var(--pbx-el-{tag}-font).
 */
const fontFamilyMap: Record<string, string> = {
  sans: "Jost, Raleway, 'Cormorant', sans-serif",
  serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
  mono: '"Courier New", Courier, monospace',
  jost: 'Jost, sans-serif',
  raleway: 'Raleway, sans-serif',
  arial: 'Arial, sans-serif',
  helvetica: 'Helvetica, Arial, sans-serif',
  georgia: 'Georgia, serif',
  times: 'Times, serif',
  'times-new-roman': '"Times New Roman", Times, serif',
  courier: 'Courier, monospace',
  'courier-new': '"Courier New", Courier, monospace',
  verdana: 'Verdana, Geneva, sans-serif',
  tahoma: 'Tahoma, Geneva, sans-serif',
  trebuchet: '"Trebuchet MS", Geneva, sans-serif',
  garamond: 'Garamond, serif',
  palantino: 'Palatino, serif',
  bookman: 'Bookman, serif',
  'comic-sans': '"Comic Sans MS", cursive, sans-serif',
  impact: 'Impact, Charcoal, sans-serif',
  lucida: '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
  'lucida-console': '"Lucida Console", Monaco, monospace',
  'lucida-sans': '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
  candara: 'Candara, sans-serif',
  optima: 'Optima, sans-serif',
  avenir: 'Avenir, sans-serif',
  futura: 'Futura, sans-serif',
  calibri: 'Calibri, sans-serif',
  cambria: 'Cambria, serif',
  didot: 'Didot, serif',
  'franklin-gothic': '"Franklin Gothic Medium", "Franklin Gothic", Arial, sans-serif',
  rockwell: 'Rockwell, serif',
  baskerville: 'Baskerville, serif',
}

/**
 * CSS generic font-family keywords that are valid CSS values on their own.
 * When a token is not found in fontFamilyMap, these are accepted as-is so that
 * e.g. `'fantasy'` resolves to the CSS value `fantasy` rather than being skipped.
 */
const CSS_GENERIC_FAMILIES = new Set([
  'serif',
  'sans-serif',
  'monospace',
  'cursive',
  'fantasy',
  'system-ui',
  'ui-serif',
  'ui-sans-serif',
  'ui-monospace',
  'ui-rounded',
  'emoji',
  'math',
  'fangsong',
])

/**
 * Resolves a font config value to a CSS font-family string.
 *
 * Accepts a short name ("jost"), a pbx-font- prefixed class name ("pbx-font-jost"),
 * a CSS generic keyword ("fantasy"), or a comma-separated list in any of those
 * formats. The first recognised entry wins:
 *   1. Known font in fontFamilyMap  →  returns its CSS font-family stack
 *   2. CSS generic keyword          →  returned as-is (e.g. "fantasy")
 *   3. Anything else                →  skipped
 *
 * Returns undefined when no recognised font is found in the entire list.
 */
export function resolveFontFamily(fontConfig: string): string | undefined {
  const tokens = fontConfig.split(',').map((t) => t.trim()).filter(Boolean)
  for (const token of tokens) {
    // Normalise to lowercase so 'Arial', 'ARIAL', and 'arial' all match correctly.
    const key = (token.startsWith('pbx-font-') ? token.slice('pbx-font-'.length) : token).toLowerCase()
    if (fontFamilyMap[key]) return fontFamilyMap[key]
    if (CSS_GENERIC_FAMILIES.has(key)) return key
  }
  return undefined
}

export default fontFamilyMap
