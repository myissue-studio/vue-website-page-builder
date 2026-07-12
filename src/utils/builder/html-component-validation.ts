import {
  findNonListenerTagClassViolations,
  type NonListenerTagClassViolation,
} from './non-listener-tags'

/**
 * Canonical English messages for reusable HTML / mount validation.
 * Used as i18n keys in PageBuilderService and as assertion text in tests.
 */
export const HTML_VALIDATION_MESSAGES = {
  NO_HTML_CONTENT:
    'No HTML content was provided. Please ensure a valid HTML string is passed.',
  UNEVEN_SECTIONS:
    'Uneven <section> tags detected in the provided HTML. Each component must be wrapped in its own properly paired <section>...</section>. Ensure that all <section> tags have a matching closing </section> tag.',
  NESTED_SECTIONS:
    'Nested <section> tags are not allowed. Please ensure that no <section> is placed inside another <section>.',
  NO_SECTIONS_FOUND:
    'No <section> tags found. Each component must be wrapped in a <section> tag.',
  SECTION_NOT_ALLOWED_IN_ELEMENT_HTML:
    'Error: The <section> tag cannot be used as it is already included inside this component.',
  JSON_NOT_HTML:
    'Brackets [] or curly braces {} are not valid HTML. They are used for data formats like JSON.',
  COULD_NOT_PARSE_ELEMENT: 'Could not parse element from HTML string.',
} as const

export type HtmlValidationMessage =
  (typeof HTML_VALIDATION_MESSAGES)[keyof typeof HTML_VALIDATION_MESSAGES]

export type HtmlValidationResult = {
  message: HtmlValidationMessage
}

export function formatNonListenerTagClassViolationMessage(
  violation: NonListenerTagClassViolation,
): string {
  return `[PageBuilder] A non-editable <${violation.tagName.toLowerCase()}> tag was inserted with classes: "${violation.className}". Move these classes to an editable wrapper element instead.`
}

/**
 * Developer-facing console errors for bad reusable HTML (classes on non-editable tags).
 * Safe to call on insert and on mount so authors catch issues early.
 */
export function reportNonListenerTagClassViolations(root: ParentNode): void {
  const violations = findNonListenerTagClassViolations(root)
  if (!violations.length) return

  violations.forEach((violation) => {
    console.error(formatNonListenerTagClassViolationMessage(violation), violation.outerHTML)
  })
}

export function countSectionTags(htmlString: string): {
  opening: number
  closing: number
} {
  return {
    opening: (htmlString.match(/<section\b[^>]*>/gi) || []).length,
    closing: (htmlString.match(/<\/section>/gi) || []).length,
  }
}

export function hasNestedSections(htmlString: string): boolean {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = htmlString.trim()
  return Boolean(tempDiv.querySelector('section section'))
}

/**
 * Structural checks shared by mount / apply flows and reusable-HTML tests.
 * Returns the first failed rule as a message key, or null when valid.
 */
export function validateMountingHtmlStructure(htmlString: string): HtmlValidationResult | null {
  const trimmedData = htmlString.trim()
  const { opening, closing } = countSectionTags(htmlString)

  if (!htmlString || trimmedData.length === 0) {
    return { message: HTML_VALIDATION_MESSAGES.NO_HTML_CONTENT }
  }

  if (opening !== closing) {
    return { message: HTML_VALIDATION_MESSAGES.UNEVEN_SECTIONS }
  }

  if (hasNestedSections(trimmedData)) {
    return { message: HTML_VALIDATION_MESSAGES.NESTED_SECTIONS }
  }

  if (trimmedData.startsWith('[') || trimmedData.startsWith('{')) {
    return { message: HTML_VALIDATION_MESSAGES.JSON_NOT_HTML }
  }

  return null
}

export function validateRequiresSectionWrapper(htmlString: string): HtmlValidationResult | null {
  const { opening } = countSectionTags(htmlString)
  if (opening === 0) {
    return { message: HTML_VALIDATION_MESSAGES.NO_SECTIONS_FOUND }
  }
  return null
}

export function validateSectionNotAllowedInElementHtml(
  htmlString: string,
): HtmlValidationResult | null {
  if (/<section[\s>]/i.test(htmlString)) {
    return { message: HTML_VALIDATION_MESSAGES.SECTION_NOT_ALLOWED_IN_ELEMENT_HTML }
  }
  return null
}

export {
  findNonListenerTagClassViolations,
  type NonListenerTagClassViolation,
} from './non-listener-tags'
