import { describe, expect, it } from 'vitest'
import {
  getTipTapHeadingLevels,
  isTipTapH1Disabled,
} from '../../utils/builder/tiptap-heading-levels'
import type { PageBuilderConfig } from '../../types'

describe('tiptap-heading-levels', () => {
  it('enables H1–H6 by default', () => {
    expect(isTipTapH1Disabled(null)).toBe(false)
    expect(getTipTapHeadingLevels(undefined)).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('disables H1 when userSettings.disableH1 is true', () => {
    const config = {
      updateOrCreate: { formType: 'update', formName: 'page' },
      userSettings: { disableH1: true },
    } as PageBuilderConfig

    expect(isTipTapH1Disabled(config)).toBe(true)
    expect(getTipTapHeadingLevels(config)).toEqual([2, 3, 4, 5, 6])
  })

  it('keeps H1 when disableH1 is false or omitted', () => {
    const config = {
      updateOrCreate: { formType: 'update', formName: 'page' },
      userSettings: { disableH1: false, autoSave: true },
    } as PageBuilderConfig

    expect(isTipTapH1Disabled(config)).toBe(false)
    expect(getTipTapHeadingLevels(config)).toEqual([1, 2, 3, 4, 5, 6])
  })
})
