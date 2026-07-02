import { describe, expect, it } from 'vitest'
import { sanitizeInlineTipTapHtml } from '../../utils/builder/sanitize-inline-tiptap-html'

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
