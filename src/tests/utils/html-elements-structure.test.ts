// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import components from '../../utils/html-elements/component'
import componentHelpers from '../../utils/html-elements/componentHelpers'
import themes from '../../utils/html-elements/themes'
import {
  countSectionTags,
  findNonListenerTagClassViolations,
  HTML_VALIDATION_MESSAGES,
  validateMountingHtmlStructure,
  validateRequiresSectionWrapper,
} from '../../utils/builder/html-component-validation'

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
      expect(html, entry.title).toMatch(/^<section\b/i)

      const sectionRequirement = validateRequiresSectionWrapper(html)
      expect(sectionRequirement, entry.title).toBeNull()

      const structure = validateMountingHtmlStructure(html)
      expect(structure, entry.title).toBeNull()

      const { opening, closing } = countSectionTags(html)
      expect(opening, entry.title).toBeGreaterThan(0)
      expect(opening, entry.title).toBe(closing)
    }
  })

  it('ensures each helper block starts with a section wrapper', () => {
    const entries = getHelperEntries()
    expect(entries.length).toBeGreaterThan(0)

    for (const entry of entries) {
      const html = normalizeHtml(entry.html_code)
      expect(html, entry.title).toMatch(/^<section\b/i)

      const sectionRequirement = validateRequiresSectionWrapper(html)
      expect(sectionRequirement, entry.title).toBeNull()

      const structure = validateMountingHtmlStructure(html)
      expect(structure, entry.title).toBeNull()
    }
  })

  it('ensures each theme includes section blocks', () => {
    const entries = getThemeEntries()
    expect(entries.length).toBeGreaterThan(0)

    for (const entry of entries) {
      const html = normalizeHtml(entry.html_code)
      const sectionRequirement = validateRequiresSectionWrapper(html)
      expect(sectionRequirement, entry.title).toBeNull()

      const structure = validateMountingHtmlStructure(
        // Themes may wrap multiple top-level sections; only check pairing/nesting.
        html.includes('<section') ? html : `<section>${html}</section>`,
      )
      expect(structure, `${entry.title}: ${structure?.message ?? ''}`).toBeNull()
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

  it('keeps classes off non-listener tags in reusable HTML entries', () => {
    const entries = [...getComponentEntries(), ...getHelperEntries()]

    for (const entry of entries) {
      const template = document.createElement('template')
      template.innerHTML = entry.html_code
      const violations = findNonListenerTagClassViolations(template.content)

      expect(violations, entry.title).toEqual([])
    }
  })

  it('exposes shared uneven-section message for service + tests', () => {
    expect(validateMountingHtmlStructure('<section><div>x</div>')).toEqual({
      message: HTML_VALIDATION_MESSAGES.UNEVEN_SECTIONS,
    })
  })
})
