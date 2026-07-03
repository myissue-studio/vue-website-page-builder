import type { PageBuilderConfig } from '../../types'
import tailwindFontStyles from './tailwind-font-styles'
import fontFamilyMap, { resolveFontFamily } from './font-family-map'

const FONT_FAMILY_CLASSES = tailwindFontStyles.fontFamily.filter((cls) => cls !== 'none')
const TEXT_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'])

export function formatFontFamily(value: string): string {
  return value.split(',')[0]?.trim().replace(/^["']|["']$/g, '') ?? ''
}

export function getFontTargetElement(element: HTMLElement): HTMLElement {
  return (
    element.querySelector<HTMLElement>('h1,h2,h3,h4,h5,h6,p,li,blockquote,span,a') ?? element
  )
}

function findFontFamilyClass(element: HTMLElement): string | undefined {
  return FONT_FAMILY_CLASSES.find((cls) => element.classList.contains(cls))
}

function formatFontFamilyFromClass(className: string): string {
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

/**
 * Resolves the font family label shown as "Inherited: …" in typography controls.
 * Uses page-builder config and explicit pbx-font-* family classes — not getComputedStyle,
 * which can report the browser's fallback (e.g. Garamond for CSS `fantasy`) instead of
 * the configured Jost default.
 */
export function resolveInheritedFontFamily(
  element: HTMLElement,
  config: PageBuilderConfig | null | undefined,
): string {
  const target = getFontTargetElement(element)
  const pagebuilder = element.closest('#pagebuilder')

  let current: HTMLElement | null = target
  while (current && pagebuilder && current !== pagebuilder) {
    const cls = findFontFamilyClass(current)
    if (cls) return formatFontFamilyFromClass(cls)
    current = current.parentElement
  }

  if (pagebuilder instanceof HTMLElement) {
    const canvasClass = findFontFamilyClass(pagebuilder)
    if (canvasClass) return formatFontFamilyFromClass(canvasClass)
  }

  return resolveConfiguredFontFamily(target.tagName.toLowerCase(), config)
}
