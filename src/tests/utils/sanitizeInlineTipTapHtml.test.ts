// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import {
  buildEditableFallbackInlineHtml,
  finalizeInlineTipTapHtml,
  sanitizeInlineTipTapHtml,
} from '../../utils/builder/sanitize-inline-tiptap-html'

describe('sanitizeInlineTipTapHtml', () => {
  it('removes a trailing empty paragraph with ProseMirror trailing break', () => {
    expect(
      sanitizeInlineTipTapHtml(
        '<h2>Demo Content</h2><p><br class="ProseMirror-trailingBreak"></p>',
      ),
    ).toBe('<h2>Demo Content</h2>')
  })

  it('removes trailing empty paragraphs but keeps meaningful content', () => {
    expect(
      sanitizeInlineTipTapHtml('<h2>Title</h2><p>Body copy</p><p><br></p>'),
    ).toBe('<h2>Title</h2><p>Body copy</p>')
  })

  it('leaves non-empty trailing paragraphs untouched', () => {
    expect(sanitizeInlineTipTapHtml('<h2>Title</h2><p>Second line</p>')).toBe(
      '<h2>Title</h2><p>Second line</p>',
    )
  })
})

describe('finalizeInlineTipTapHtml', () => {
  it('preserves an empty heading when all inline text is cleared', () => {
    expect(finalizeInlineTipTapHtml('', '<h2>Demo Content</h2>')).toBe('<h2><br></h2>')
  })

  it('preserves multiple block types from the original content', () => {
    expect(finalizeInlineTipTapHtml('<p></p>', '<h2>Title</h2><p>Body</p>')).toBe(
      '<h2><br></h2><p><br></p>',
    )
  })

  it('returns sanitized content when text remains', () => {
    expect(finalizeInlineTipTapHtml('<h2>Still here</h2>', '<h2>Demo Content</h2>')).toBe(
      '<h2>Still here</h2>',
    )
  })

  it('falls back to a paragraph when the original had no block tags', () => {
    expect(buildEditableFallbackInlineHtml('plain text')).toBe('<p><br></p>')
  })
})
