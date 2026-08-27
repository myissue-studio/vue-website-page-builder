// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import {
  PAGE_BUILDER_BRAND_COLOR_RGB_VAR,
  PAGE_BUILDER_BUTTON_COLOR_RGB_VAR,
  PAGE_BUILDER_BUTTON_COLOR_VAR,
  PAGE_BUILDER_BUTTON_TEXT_COLOR_RGB_VAR,
  PAGE_BUILDER_BUTTON_TEXT_COLOR_VAR,
  applyPageBuilderBrandColor,
  applyPageBuilderButtonColor,
  applyPageBuilderButtonTextColor,
  clearPageBuilderBrandColor,
  clearPageBuilderButtonColor,
  clearPageBuilderButtonTextColor,
  resolveBrandColorCssValue,
  resolveBrandColorRgbChannels,
} from '../../utils/builder/apply-brand-color'

describe('apply-brand-color', () => {
  afterEach(() => {
    clearPageBuilderBrandColor()
    clearPageBuilderButtonColor()
    clearPageBuilderButtonTextColor()
  })

  it('normalizes hex brand colors', () => {
    expect(resolveBrandColorCssValue('#DB93B0')).toBe('#db93b0')
    expect(resolveBrandColorCssValue('DB93B0')).toBe('#db93b0')
  })

  it('returns null for empty values', () => {
    expect(resolveBrandColorCssValue('')).toBeNull()
    expect(resolveBrandColorCssValue(undefined)).toBeNull()
    expect(resolveBrandColorCssValue(null)).toBeNull()
  })

  it('resolves RGB channels for Tailwind opacity utilities', () => {
    expect(resolveBrandColorRgbChannels('#DB93B0')).toBe('219 147 176')
    expect(resolveBrandColorRgbChannels('#16a34a')).toBe('22 163 74')
  })

  it('applies brand color CSS variables on the document', () => {
    applyPageBuilderBrandColor('#000000')
    expect(document.documentElement.style.getPropertyValue(PAGE_BUILDER_BRAND_COLOR_RGB_VAR)).toBe(
      '0 0 0',
    )
  })

  it('applies button color independently from brand color', () => {
    applyPageBuilderBrandColor('#000000')
    applyPageBuilderButtonColor('#E5D352', '#000000')

    expect(document.documentElement.style.getPropertyValue(PAGE_BUILDER_BUTTON_COLOR_VAR)).toBe(
      '#e5d352',
    )
    expect(document.documentElement.style.getPropertyValue(PAGE_BUILDER_BUTTON_COLOR_RGB_VAR)).toBe(
      '229 211 82',
    )
    expect(document.documentElement.style.getPropertyValue(PAGE_BUILDER_BRAND_COLOR_RGB_VAR)).toBe(
      '0 0 0',
    )
  })

  it('falls back to brand color when button color is omitted', () => {
    applyPageBuilderButtonColor(undefined, '#2563EB')
    expect(document.documentElement.style.getPropertyValue(PAGE_BUILDER_BUTTON_COLOR_RGB_VAR)).toBe(
      '37 99 235',
    )
  })

  it('clears button color vars when neither button nor brand is set', () => {
    applyPageBuilderButtonColor('#E5D352')
    applyPageBuilderButtonColor(null, null)
    expect(document.documentElement.style.getPropertyValue(PAGE_BUILDER_BUTTON_COLOR_VAR)).toBe('')
    expect(document.documentElement.style.getPropertyValue(PAGE_BUILDER_BUTTON_COLOR_RGB_VAR)).toBe(
      '',
    )
  })

  it('applies button text color independently', () => {
    applyPageBuilderButtonTextColor('#000000')
    expect(document.documentElement.style.getPropertyValue(PAGE_BUILDER_BUTTON_TEXT_COLOR_VAR)).toBe(
      '#000000',
    )
    expect(
      document.documentElement.style.getPropertyValue(PAGE_BUILDER_BUTTON_TEXT_COLOR_RGB_VAR),
    ).toBe('0 0 0')
  })

  it('clears button text color when omitted', () => {
    applyPageBuilderButtonTextColor('#000000')
    applyPageBuilderButtonTextColor(null)
    expect(document.documentElement.style.getPropertyValue(PAGE_BUILDER_BUTTON_TEXT_COLOR_VAR)).toBe(
      '',
    )
  })
})
