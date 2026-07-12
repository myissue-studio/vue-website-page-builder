// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import {
  HTML_VALIDATION_MESSAGES,
  collectPassedComponentsHtmlWarnings,
  formatNonListenerTagClassViolationMessage,
  reportNonListenerTagClassViolations,
  validateMountingHtmlStructure,
  validateRequiresSectionWrapper,
  validateSectionNotAllowedInElementHtml,
} from '../../utils/builder/html-component-validation'

describe('html-component-validation', () => {
  it('detects uneven section tags with the shared message', () => {
    expect(validateMountingHtmlStructure('<section><div>one</div>')).toEqual({
      message: HTML_VALIDATION_MESSAGES.UNEVEN_SECTIONS,
    })
  })

  it('detects nested sections with the shared message', () => {
    expect(
      validateMountingHtmlStructure('<section><section><div>x</div></section></section>'),
    ).toEqual({
      message: HTML_VALIDATION_MESSAGES.NESTED_SECTIONS,
    })
  })

  it('detects missing section wrappers with the shared message', () => {
    expect(validateRequiresSectionWrapper('<div>no section</div>')).toEqual({
      message: HTML_VALIDATION_MESSAGES.NO_SECTIONS_FOUND,
    })
  })

  it('rejects section tags inside element-level HTML edits', () => {
    expect(validateSectionNotAllowedInElementHtml('<section><div>x</div></section>')).toEqual({
      message: HTML_VALIDATION_MESSAGES.SECTION_NOT_ALLOWED_IN_ELEMENT_HTML,
    })
  })

  it('formats and reports non-listener class violations', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      const template = document.createElement('template')
      template.innerHTML = '<section><p class="pbx-bg-red-200">bad</p></section>'

      reportNonListenerTagClassViolations(template.content)

      expect(errorSpy).toHaveBeenCalledWith(
        formatNonListenerTagClassViolationMessage({
          tagName: 'P',
          className: 'pbx-bg-red-200',
          outerHTML: '<p class="pbx-bg-red-200">bad</p>',
        }),
        '<p class="pbx-bg-red-200">bad</p>',
      )
    } finally {
      errorSpy.mockRestore()
    }
  })

  it('collects soft warnings for passed startBuilder components', () => {
    const warnings = collectPassedComponentsHtmlWarnings([
      {
        title: 'Bad Paragraph',
        html_code: '<section><p class="pbx-bg-red-200">hello</p></section>',
      },
      {
        title: 'Missing Section',
        html_code: '<div>no section wrapper</div>',
      },
    ])

    expect(warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          componentIndex: 0,
          componentTitle: 'Bad Paragraph',
          message: expect.stringContaining('non-editable <p>'),
        }),
        expect.objectContaining({
          componentIndex: 1,
          componentTitle: 'Missing Section',
          message: HTML_VALIDATION_MESSAGES.NO_SECTIONS_FOUND,
        }),
      ]),
    )
  })
})
