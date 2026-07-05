// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import {
  buildCustomFontStylesCss,
  findFontFamilyClassOnElement,
  fontKeyToSlug,
  getEditorFontFamilyClasses,
  getFontFamilyPickerOptions,
  isStaleSavedConfigFallbackFont,
  parseFontFamilyList,
  resolveConfigDefaultFontClass,
  resolveFontFamily,
  resolveFontFamilyClassForToken,
  resolveFontFamilyFromToken,
} from '../../utils/builder/font-family-map'

describe('font-family config', () => {
  it('parses comma-separated font lists with multi-word custom names', () => {
    expect(parseFontFamilyList('Bitcount Grid Double, jost, raleway, fantasy')).toEqual([
      'Bitcount Grid Double',
      'jost',
      'raleway',
      'fantasy',
    ])
  })

  it('resolves built-in, generic, and custom font tokens', () => {
    expect(resolveFontFamilyFromToken('jost')).toBe('Jost, sans-serif')
    expect(resolveFontFamilyFromToken('fantasy')).toBe('fantasy')
    expect(resolveFontFamilyFromToken('Bitcount Grid Double')).toBe(
      "'Bitcount Grid Double', sans-serif",
    )
  })

  it('uses the first font entry from a config string', () => {
    expect(resolveFontFamily('Bitcount Grid Double, jost, raleway')).toBe(
      "'Bitcount Grid Double', sans-serif",
    )
    expect(resolveFontFamily('unknown custom, jost')).toBe("'unknown custom', sans-serif")
  })

  it('maps custom fonts to pbx-font-custom-* classes', () => {
    expect(fontKeyToSlug('Bitcount Grid Double')).toBe('bitcount-grid-double')
    expect(resolveFontFamilyClassForToken('Bitcount Grid Double')).toBe(
      'pbx-font-custom-bitcount-grid-double',
    )
    expect(resolveFontFamilyClassForToken('jost')).toBe('pbx-font-jost')
  })

  it('builds injected CSS for custom fonts', () => {
    const css = buildCustomFontStylesCss({
      fontFamily: 'Bitcount Grid Double, jost, fantasy',
      elementFonts: {
        h1: 'Bitcount Grid Double, jost',
      },
    })

    expect(css).toContain(
      "#pagebuilder.pbx-font-custom-bitcount-grid-double, #pagebuilder .pbx-font-custom-bitcount-grid-double { font-family: 'Bitcount Grid Double', sans-serif; }",
    )
    expect(css).toContain(
      '#pagebuilder.pbx-font-custom-fantasy, #pagebuilder .pbx-font-custom-fantasy { font-family: fantasy; }',
    )
    expect(css).not.toContain('pbx-font-jost')
  })

  it('lists config fonts first, then all built-in picker fonts', () => {
    const options = getFontFamilyPickerOptions({
      fontFamily: 'Bitcount Grid Double, jost, raleway, fantasy',
    })

    expect(options.map((option) => option.label).slice(0, 6)).toEqual([
      'none',
      'Bitcount Grid Double',
      'jost',
      'raleway',
      'fantasy',
      'Sans',
    ])
    expect(options.length).toBeGreaterThan(20)
    expect(options.some((option) => option.value === 'pbx-font-inter')).toBe(true)
    expect(options.some((option) => option.value === 'pbx-font-custom-bitcount-grid-double')).toBe(
      true,
    )
  })

  it('includes custom font classes for the editor class toggler', () => {
    const classes = getEditorFontFamilyClasses({
      fontFamily: 'Bitcount Grid Double, fantasy',
    })

    expect(classes).toContain('pbx-font-jost')
    expect(classes).toContain('pbx-font-custom-bitcount-grid-double')
    expect(classes).toContain('pbx-font-custom-fantasy')
  })

  it('resolves config default font class', () => {
    expect(resolveConfigDefaultFontClass({ fontFamily: 'Bitcount Grid Double, jost' })).toBe(
      'pbx-font-custom-bitcount-grid-double',
    )
    expect(resolveConfigDefaultFontClass(undefined)).toBe('pbx-font-sans')
  })

  it('finds font family classes on an element', () => {
    const element = document.createElement('div')
    element.classList.add('pbx-font-custom-fantasy', 'pbx-text-black')

    expect(findFontFamilyClassOnElement(element)).toBe('pbx-font-custom-fantasy')
  })

  it('detects stale saved config fallback fonts on the canvas', () => {
    const userSettings = {
      fontFamily: 'Bitcount Grid Double, jost, raleway, arial, fantasy',
    }

    expect(isStaleSavedConfigFallbackFont('pbx-font-jost', userSettings)).toBe(true)
    expect(isStaleSavedConfigFallbackFont('pbx-font-custom-bitcount-grid-double', userSettings)).toBe(
      false,
    )
    expect(isStaleSavedConfigFallbackFont('pbx-font-custom-fantasy', userSettings)).toBe(false)
  })
})
