import type { PageBuilderConfig } from '../../types'
import fontFamilyMap, {
  findFontFamilyClassOnElement,
  findFontTokenByCustomClass,
  hasUserPageCanvasFontOverride,
  isPassThroughFontStackClass,
  resolveFontFamily,
  resolveFontFamilyFromToken,
} from './font-family-map'
const TEXT_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'])

export function formatFontFamily(value: string): string {
  return (
    value
      .split(',')[0]
      ?.trim()
      .replace(/^["']|["']$/g, '') ?? ''
  )
}

export function getFontTargetElement(element: HTMLElement): HTMLElement {
  return element.querySelector<HTMLElement>('h1,h2,h3,h4,h5,h6,p,li,blockquote,span,a') ?? element
}

function findFontFamilyClass(element: HTMLElement): string | undefined {
  return findFontFamilyClassOnElement(element)
}

function findExplicitFontFamilyClass(element: HTMLElement): string | undefined {
  const cls = findFontFamilyClass(element)
  if (!cls || isPassThroughFontStackClass(cls)) return undefined
  return cls
}

function formatFontFamilyFromClass(className: string, config?: PageBuilderConfig | null): string {
  const customToken = findFontTokenByCustomClass(className, config?.userSettings)
  if (customToken) {
    const resolved = resolveFontFamilyFromToken(customToken)
    return resolved ? formatFontFamily(resolved) : formatFontFamily(customToken)
  }

  const key = className.startsWith('pbx-font-') ? className.slice('pbx-font-'.length) : className
  const fromMap = fontFamilyMap[key]
  if (fromMap) return formatFontFamily(fromMap)
  return key
}

function resolveConfiguredFontFamily(
  tag: string,
  config: PageBuilderConfig | null | undefined,
): string {
  if (TEXT_TAGS.has(tag)) {
    const tagKey = tag as keyof NonNullable<
      NonNullable<PageBuilderConfig['userSettings']>['elementFonts']
    >
    const elementFontConfig = config?.userSettings?.elementFonts?.[tagKey]
    if (elementFontConfig) {
      const resolved = resolveFontFamily(elementFontConfig)
      if (resolved) return formatFontFamily(resolved)
    }
  }

  const canvasFontConfig = config?.userSettings?.fontFamily
  if (canvasFontConfig) {
    const resolved = resolveFontFamily(canvasFontConfig)
    if (resolved) return formatFontFamily(resolved)
  }

  return ''
}

export interface ResolveInheritedFontFamilyOptions {
  globalPageDesignMode?: boolean
  selectedFontClass?: string | null
}

/**
 * Resolves the font family label shown as "Inherited: …" in typography controls.
 * Matches config `elementFonts` / `fontFamily` CSS defaults before stale canvas classes.
 */
export function resolveInheritedFontFamily(
  element: HTMLElement,
  config: PageBuilderConfig | null | undefined,
  options?: ResolveInheritedFontFamilyOptions,
): string {
  const target = getFontTargetElement(element)
  const pagebuilder = element.closest('#pagebuilder')
  const tag = target.tagName.toLowerCase()

  let current: HTMLElement | null = target
  while (current && pagebuilder && current !== pagebuilder) {
    const cls = findExplicitFontFamilyClass(current)
    if (cls) return formatFontFamilyFromClass(cls, config)
    current = current.parentElement
  }

  const pageDesignOverride =
    pagebuilder instanceof HTMLElement &&
    hasUserPageCanvasFontOverride(pagebuilder, config?.userSettings, options)

  if (!pageDesignOverride && TEXT_TAGS.has(tag)) {
    const fromConfig = resolveConfiguredFontFamily(tag, config)
    if (fromConfig) return fromConfig
  }

  if (pagebuilder instanceof HTMLElement) {
    const canvasClass = findExplicitFontFamilyClass(pagebuilder)
    if (canvasClass) return formatFontFamilyFromClass(canvasClass, config)
  }

  return resolveConfiguredFontFamily(tag, config)
}
