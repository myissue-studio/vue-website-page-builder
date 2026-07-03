// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import {
  isPrimarilyRtlScript,
  isRtlContentContext,
  isRtlLang,
} from '../../utils/builder/is-rtl-content'

describe('isRtlLang', () => {
  it('detects Arabic locale codes', () => {
    expect(isRtlLang('ar')).toBe(true)
    expect(isRtlLang('ar-SA')).toBe(true)
  })

  it('treats LTR locale codes as not RTL', () => {
    expect(isRtlLang('en')).toBe(false)
    expect(isRtlLang('fr')).toBe(false)
  })
})

describe('isPrimarilyRtlScript', () => {
  it('detects Arabic text', () => {
    expect(isPrimarilyRtlScript('مرحبا')).toBe(true)
  })

  it('does not treat English as RTL', () => {
    expect(isPrimarilyRtlScript('Demo Content')).toBe(false)
  })
})

describe('isRtlContentContext', () => {
  it('respects dir="rtl" on the editable element', () => {
    document.body.innerHTML = '<div id="target" dir="rtl">English text</div>'
    const target = document.getElementById('target') as HTMLElement
    expect(isRtlContentContext(target)).toBe(true)
  })

  it('uses builder language when element direction is neutral', () => {
    document.body.innerHTML = '<div id="target">English text</div>'
    const target = document.getElementById('target') as HTMLElement
    expect(isRtlContentContext(target, { lang: 'ar' })).toBe(true)
    expect(isRtlContentContext(target, { lang: 'en' })).toBe(false)
  })
})
