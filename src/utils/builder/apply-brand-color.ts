import { hexToRgb, normalizeCssColorToHex } from './color-utils'

export const PAGE_BUILDER_BRAND_COLOR_VAR = '--pbx-brand-color'
export const PAGE_BUILDER_BRAND_COLOR_RGB_VAR = '--pbx-brand-color-rgb'

/** Default myPrimaryLinkColor (#16a34a) as space-separated RGB channels. */
export const DEFAULT_BRAND_COLOR_RGB = '22 163 74'

export function resolveBrandColorCssValue(brandColor?: string | null): string | null {
  if (!brandColor?.trim()) return null
  return normalizeCssColorToHex(brandColor) ?? brandColor.trim()
}

export function resolveBrandColorRgbChannels(brandColor?: string | null): string | null {
  const hex = resolveBrandColorCssValue(brandColor)
  if (!hex) return null
  const rgb = hexToRgb(hex)
  if (!rgb) return null
  return `${rgb.r} ${rgb.g} ${rgb.b}`
}

/** Applies settings.brandColor to the document for Tailwind `myPrimaryLinkColor` utilities. */
export function applyPageBuilderBrandColor(brandColor?: string | null): void {
  if (typeof document === 'undefined') return

  const resolved = resolveBrandColorCssValue(brandColor)
  const rgbChannels = resolveBrandColorRgbChannels(brandColor)

  if (resolved && rgbChannels) {
    document.documentElement.style.setProperty(PAGE_BUILDER_BRAND_COLOR_VAR, resolved)
    document.documentElement.style.setProperty(PAGE_BUILDER_BRAND_COLOR_RGB_VAR, rgbChannels)
    return
  }

  clearPageBuilderBrandColor()
}

export function clearPageBuilderBrandColor(): void {
  if (typeof document === 'undefined') return
  document.documentElement.style.removeProperty(PAGE_BUILDER_BRAND_COLOR_VAR)
  document.documentElement.style.removeProperty(PAGE_BUILDER_BRAND_COLOR_RGB_VAR)
}
