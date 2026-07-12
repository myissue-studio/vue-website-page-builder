import { describe, expect, it } from 'vitest'
import components from '../../utils/html-elements/component'
import componentHelpers from '../../utils/html-elements/componentHelpers'
import themes from '../../utils/html-elements/themes'

type HtmlEntry = {
  title: string
  html_code: string
}

function normalizeHtml(html: string): string {
  return html.replace(/\s+/g, ' ').trim()
}

function getComponentEntries(): HtmlEntry[] {
  return components.flatMap((group) => group.components.data)
}

function getHelperEntries(): HtmlEntry[] {
  return componentHelpers
}

function getThemeEntries(): HtmlEntry[] {
  return themes.flatMap((group) => group.themes.data)
}

describe('HTML elements structure', () => {
  it('ensures each default component block starts with a section wrapper', () => {
    const entries = getComponentEntries()
    expect(entries.length).toBeGreaterThan(0)

    for (const entry of entries) {
      const html = normalizeHtml(entry.html_code)
      expect(html).toMatch(/^<section\b/i)
      expect(html).toContain('</section>')
    }
  })

  it('ensures each helper block starts with a section wrapper', () => {
    const entries = getHelperEntries()
    expect(entries.length).toBeGreaterThan(0)

    for (const entry of entries) {
      const html = normalizeHtml(entry.html_code)
      expect(html).toMatch(/^<section\b/i)
      expect(html).toContain('</section>')
    }
  })

  it('ensures each theme includes section blocks', () => {
    const entries = getThemeEntries()
    expect(entries.length).toBeGreaterThan(0)

    for (const entry of entries) {
      const html = normalizeHtml(entry.html_code)
      expect(html).toContain('<section')
      expect(html).toContain('</section>')
    }
  })

  it('ensures linktree button wrappers keep nested anchor structure', () => {
    const entries = [...getComponentEntries(), ...getHelperEntries()].filter((entry) =>
      /id=["']linktree["']/.test(entry.html_code),
    )

    expect(entries.length).toBeGreaterThan(0)

    for (const entry of entries) {
      const html = normalizeHtml(entry.html_code)
      expect(html).toMatch(/<div[^>]*id=["']linktree["'][^>]*>\s*<p>\s*<a\b/i)
      expect(html).toMatch(/<a[^>]*href=["'][^"']+["']/i)
      expect(html).toMatch(/<a[^>]*target=["']_blank["']/i)
    }
  })
})
