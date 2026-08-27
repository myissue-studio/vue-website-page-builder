import { hexToRgb, normalizeCssColorToHex } from './color-utils'

export const PAGE_BUILDER_BRAND_COLOR_VAR = '--pbx-brand-color'
export const PAGE_BUILDER_BRAND_COLOR_RGB_VAR = '--pbx-brand-color-rgb'

export const PAGE_BUILDER_BUTTON_COLOR_VAR = '--pbx-button-color'
export const PAGE_BUILDER_BUTTON_COLOR_RGB_VAR = '--pbx-button-color-rgb'

export const PAGE_BUILDER_BUTTON_TEXT_COLOR_VAR = '--pbx-button-text-color'
export const PAGE_BUILDER_BUTTON_TEXT_COLOR_RGB_VAR = '--pbx-button-text-color-rgb'

/** Default myPrimaryLinkColor / myPrimaryButtonColor (#16a34a) as space-separated RGB channels. */
export const DEFAULT_BRAND_COLOR_RGB = '22 163 74'

/** Default filled-button label color (#ffffff). */
export const DEFAULT_BUTTON_TEXT_COLOR_RGB = '255 255 255'

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

/**
 * Applies settings.buttonColor for Tailwind `myPrimaryButtonColor` utilities.
 * Falls back to brandColor when buttonColor is omitted, then to the default green.
 */
export function applyPageBuilderButtonColor(
  buttonColor?: string | null,
  brandColorFallback?: string | null,
): void {
  if (typeof document === 'undefined') return

  const source = buttonColor?.trim() ? buttonColor : brandColorFallback
  const resolved = resolveBrandColorCssValue(source)
  const rgbChannels = resolveBrandColorRgbChannels(source)

  if (resolved && rgbChannels) {
    document.documentElement.style.setProperty(PAGE_BUILDER_BUTTON_COLOR_VAR, resolved)
    document.documentElement.style.setProperty(PAGE_BUILDER_BUTTON_COLOR_RGB_VAR, rgbChannels)
    return
  }

  clearPageBuilderButtonColor()
}

export function clearPageBuilderButtonColor(): void {
  if (typeof document === 'undefined') return
  document.documentElement.style.removeProperty(PAGE_BUILDER_BUTTON_COLOR_VAR)
  document.documentElement.style.removeProperty(PAGE_BUILDER_BUTTON_COLOR_RGB_VAR)
}

/**
 * Applies settings.buttonTextColor for Tailwind `myPrimaryButtonTextColor` utilities.
 * When omitted, clears so CSS falls back to white.
 */
export function applyPageBuilderButtonTextColor(buttonTextColor?: string | null): void {
  if (typeof document === 'undefined') return

  const resolved = resolveBrandColorCssValue(buttonTextColor)
  const rgbChannels = resolveBrandColorRgbChannels(buttonTextColor)

  if (resolved && rgbChannels) {
    document.documentElement.style.setProperty(PAGE_BUILDER_BUTTON_TEXT_COLOR_VAR, resolved)
    document.documentElement.style.setProperty(PAGE_BUILDER_BUTTON_TEXT_COLOR_RGB_VAR, rgbChannels)
    return
  }

  clearPageBuilderButtonTextColor()
}

export function clearPageBuilderButtonTextColor(): void {
  if (typeof document === 'undefined') return
  document.documentElement.style.removeProperty(PAGE_BUILDER_BUTTON_TEXT_COLOR_VAR)
  document.documentElement.style.removeProperty(PAGE_BUILDER_BUTTON_TEXT_COLOR_RGB_VAR)
}
