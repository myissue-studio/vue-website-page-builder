import { describe, expect, it } from 'vitest'
import {
  resolveBrandColorCssValue,
  resolveBrandColorRgbChannels,
} from '../../utils/builder/apply-brand-color'

describe('apply-brand-color', () => {
  it('normalizes hex brand colors', () => {
    expect(resolveBrandColorCssValue('#DB93B0')).toBe('#db93b0')
    expect(resolveBrandColorCssValue('DB93B0')).toBe('#db93b0')
  })

  it('returns null for empty values', () => {
    expect(resolveBrandColorCssValue('')).toBeNull()
    expect(resolveBrandColorCssValue(undefined)).toBeNull()
  })

  it('resolves RGB channels for Tailwind opacity utilities', () => {
    expect(resolveBrandColorRgbChannels('#DB93B0')).toBe('219 147 176')
    expect(resolveBrandColorRgbChannels('#16a34a')).toBe('22 163 74')
  })
})
