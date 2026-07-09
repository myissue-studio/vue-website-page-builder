import type { PageBuilderConfig } from '../../types'
import tailwindFontStyles from './tailwind-font-styles'

export interface FontFamilyPickerOption {
  value: string
  label: string
}

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
  inter: 'Inter, Arial, sans-serif',
  roboto: 'Roboto, Arial, sans-serif',
  'open-sans': '"Open Sans", Arial, sans-serif',
  lato: 'Lato, Arial, sans-serif',
  montserrat: 'Montserrat, Arial, sans-serif',
  poppins: 'Poppins, Arial, sans-serif',
  nunito: 'Nunito, Arial, sans-serif',
  merriweather: 'Merriweather, Georgia, serif',
  'playfair-display': '"Playfair Display", Georgia, serif',
  'source-sans-3': '"Source Sans 3", Arial, sans-serif',
  'noto-sans': '"Noto Sans", Arial, sans-serif',
  'work-sans': '"Work Sans", Arial, sans-serif',
  quicksand: 'Quicksand, Arial, sans-serif',
  'pt-serif': '"PT Serif", Georgia, serif',
  'crimson-text': '"Crimson Text", Georgia, serif',
}

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

const BUILTIN_FONT_CLASS_SET = new Set(
  tailwindFontStyles.fontFamily.filter((cls) => cls !== 'none'),
)

const FONT_WEIGHT_CLASS_SET = new Set(tailwindFontStyles.fontWeight.filter((cls) => cls !== 'none'))

/** Splits a fontFamily / elementFonts config string into individual font entries. */
export function parseFontFamilyList(fontConfig: string): string[] {
  return fontConfig
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean)
}

export function fontKeyToSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function normalizeFontToken(token: string): string {
  const trimmed = token.trim()
  if (trimmed.startsWith('pbx-font-')) return trimmed.slice('pbx-font-'.length).toLowerCase()
  return trimmed.toLowerCase()
}

export function isBuiltinTailwindFontClass(className: string): boolean {
  return BUILTIN_FONT_CLASS_SET.has(className)
}

export function collectFontTokensFromUserSettings(
  userSettings?: PageBuilderConfig['userSettings'] | null,
): string[] {
  if (!userSettings) return []

  const tokens: string[] = []
  if (userSettings.fontFamily) {
    tokens.push(...parseFontFamilyList(userSettings.fontFamily))
  }
  if (userSettings.elementFonts) {
    for (const value of Object.values(userSettings.elementFonts)) {
      if (value) tokens.push(...parseFontFamilyList(value))
    }
  }
  return tokens
}

export function resolveFontFamilyClassForToken(token: string): string {
  const key = normalizeFontToken(token)
  const builtinClass = `pbx-font-${key}`
  if (BUILTIN_FONT_CLASS_SET.has(builtinClass)) return builtinClass
  return `pbx-font-custom-${fontKeyToSlug(token)}`
}

export function findFontTokenByCustomClass(
  className: string,
  userSettings?: PageBuilderConfig['userSettings'] | null,
): string | undefined {
  if (!className.startsWith('pbx-font-custom-')) return undefined
  const slug = className.slice('pbx-font-custom-'.length)
  return collectFontTokensFromUserSettings(userSettings).find(
    (token) => fontKeyToSlug(token) === slug,
  )
}

export function formatFontTokenLabel(token: string): string {
  return token.trim()
}

export function formatFontClassLabel(
  className: string,
  userSettings?: PageBuilderConfig['userSettings'] | null,
): string {
  if (className === 'none') return 'none'

  const customToken = findFontTokenByCustomClass(className, userSettings)
  if (customToken) return formatFontTokenLabel(customToken)

  const key = className.startsWith('pbx-font-') ? className.slice('pbx-font-'.length) : className
  if (key === 'sans') return 'Sans'
  if (key === 'serif') return 'Serif'
  if (key === 'mono') return 'Mono'
  return key
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function resolveConfigDefaultFontClass(
  userSettings?: PageBuilderConfig['userSettings'] | null,
): string {
  const fontConfig = userSettings?.fontFamily
  if (!fontConfig) return 'pbx-font-sans'
  const first = parseFontFamilyList(fontConfig)[0]
  if (!first) return 'pbx-font-sans'
  return resolveFontFamilyClassForToken(first)
}

const PASS_THROUGH_FONT_STACK_CLASSES = new Set([
  'pbx-font-sans',
  'pbx-font-serif',
  'pbx-font-mono',
])

/** Generic stack classes used as boilerplate — not treated as explicit font choices. */
export function isPassThroughFontStackClass(className: string): boolean {
  return PASS_THROUGH_FONT_STACK_CLASSES.has(className)
}

/**
 * Saved page fonts that match a built-in fallback entry in fontFamily config
 * (e.g. jost when Bitcount is primary) are usually stale auto-save noise.
 */
export function isStaleSavedConfigFallbackFont(
  className: string,
  userSettings?: PageBuilderConfig['userSettings'] | null,
): boolean {
  if (!userSettings?.fontFamily || isPassThroughFontStackClass(className)) return false

  const tokens = parseFontFamilyList(userSettings.fontFamily)
  if (tokens.length <= 1) return false

  const primaryClass = resolveFontFamilyClassForToken(tokens[0])
  if (className === primaryClass) return false

  return tokens.slice(1).some((token) => {
    const tokenClass = resolveFontFamilyClassForToken(token)
    return tokenClass === className && isBuiltinTailwindFontClass(tokenClass)
  })
}

/**
 * True when the user has applied a global page font via Page Design that should
 * override config `fontFamily` / `elementFonts` defaults.
 */
export function hasUserPageCanvasFontOverride(
  pagebuilder: HTMLElement | null | undefined,
  userSettings: PageBuilderConfig['userSettings'] | null | undefined,
  options?: {
    globalPageDesignMode?: boolean
    selectedFontClass?: string | null
  },
): boolean {
  if (
    options?.globalPageDesignMode &&
    options.selectedFontClass &&
    options.selectedFontClass !== 'none'
  ) {
    return true
  }

  if (!pagebuilder) return false

  const domFont = findFontFamilyClassOnElement(pagebuilder, userSettings)
  if (!domFont || isPassThroughFontStackClass(domFont)) return false

  const configDefault = resolveConfigDefaultFontClass(userSettings)
  if (domFont === configDefault) return false
  if (isStaleSavedConfigFallbackFont(domFont, userSettings)) return false

  return true
}

/** Returns the first pbx-font-* / pbx-font-custom-* class on an element, if any. */
export function findFontFamilyClassOnElement(
  element: HTMLElement,
  userSettings?: PageBuilderConfig['userSettings'] | null,
): string | undefined {
  for (const className of getEditorFontFamilyClasses(userSettings)) {
    if (className !== 'none' && element.classList.contains(className)) {
      return className
    }
  }

  for (const className of element.classList) {
    if (className.startsWith('pbx-font-custom-')) return className
  }

  // Support raw family classes from imported HTML (e.g. pbx-font-bitcount-grid-double)
  // even when picker options are represented as pbx-font-custom-* values.
  for (const className of element.classList) {
    if (!className.startsWith('pbx-font-')) continue
    if (FONT_WEIGHT_CLASS_SET.has(className)) continue

    const key = className.slice('pbx-font-'.length)
    const matchingToken = collectFontTokensFromUserSettings(userSettings).find(
      (token) => fontKeyToSlug(token) === key,
    )

    if (matchingToken) return resolveFontFamilyClassForToken(matchingToken)
    return className
  }

  return undefined
}

export function getEditorFontFamilyClasses(
  userSettings?: PageBuilderConfig['userSettings'] | null,
): string[] {
  const classes = [...tailwindFontStyles.fontFamily]

  for (const token of collectFontTokensFromUserSettings(userSettings)) {
    const className = resolveFontFamilyClassForToken(token)
    if (!classes.includes(className)) {
      classes.push(className)
    }
  }

  return classes
}

export function getFontFamilyPickerOptions(
  userSettings?: PageBuilderConfig['userSettings'] | null,
): FontFamilyPickerOption[] {
  const noneOption: FontFamilyPickerOption = { value: 'none', label: 'none' }
  const seen = new Set<string>(['none'])
  const options: FontFamilyPickerOption[] = [noneOption]

  const configTokens = userSettings?.fontFamily ? parseFontFamilyList(userSettings.fontFamily) : []

  for (const token of configTokens) {
    const value = resolveFontFamilyClassForToken(token)
    if (seen.has(value)) continue
    seen.add(value)
    options.push({
      value,
      label: formatFontTokenLabel(token),
    })
  }

  for (const className of tailwindFontStyles.fontFamily) {
    if (className === 'none' || seen.has(className)) continue
    seen.add(className)
    options.push({
      value: className,
      label: formatFontClassLabel(className, userSettings),
    })
  }

  return options
}

export function buildCustomFontStylesCss(
  userSettings?: PageBuilderConfig['userSettings'] | null,
): string {
  const tokens = collectFontTokensFromUserSettings(userSettings)
  const rules = new Map<string, string>()

  for (const token of tokens) {
    const className = resolveFontFamilyClassForToken(token)
    if (isBuiltinTailwindFontClass(className)) continue

    const stack = resolveFontFamilyFromToken(token)
    if (!stack || rules.has(className)) continue

    rules.set(
      className,
      `#pagebuilder.${className}, #pagebuilder .${className} { font-family: ${stack}; }`,
    )
  }

  return [...rules.values()].join('\n')
}

/** Resolves a single font token to a CSS font-family value (built-in, generic, or custom). */
export function resolveFontFamilyFromToken(token: string): string | undefined {
  const key = normalizeFontToken(token)
  if (fontFamilyMap[key]) return fontFamilyMap[key]
  if (CSS_GENERIC_FAMILIES.has(key)) return key

  const name = token.trim()
  if (!name) return undefined
  if (
    (name.startsWith("'") && name.endsWith("'")) ||
    (name.startsWith('"') && name.endsWith('"'))
  ) {
    return name
  }
  const escaped = name.replace(/'/g, "\\'")
  return `'${escaped}', sans-serif`
}

/** Resolves the first font entry from a comma-separated config string. */
export function resolveFontFamily(fontConfig: string): string | undefined {
  for (const token of parseFontFamilyList(fontConfig)) {
    const resolved = resolveFontFamilyFromToken(token)
    if (resolved) return resolved
  }
  return undefined
}

export default fontFamilyMap
