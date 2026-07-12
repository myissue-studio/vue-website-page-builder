// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import {
  buildEditableFallbackInlineHtml,
  finalizeInlineTipTapHtml,
  sanitizeInlineTipTapHtml,
} from '../../utils/builder/sanitize-inline-tiptap-html'
import { InlineTipTapLink } from '../../utils/builder/inline-tiptap-link'

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

describe('InlineTipTapLink', () => {
  it('preserves inline styles on button-like anchors while editing', () => {
    const editor = new Editor({
      content:
        '<p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com" class="pbx-inline-flex pbx-bg-myPrimaryLinkColor" style="background-color: rgb(240, 11, 11);">Link to landing page</a></p>',
      extensions: [StarterKit.configure({ link: false }), InlineTipTapLink],
    })

    try {
      const html = editor.getHTML()
      expect(html).toContain('style="background-color: rgb(240, 11, 11);"')
      expect(html).toContain('class="pbx-inline-flex pbx-bg-myPrimaryLinkColor"')
      expect(html).toContain('href="https://www.google.com"')
    } finally {
      editor.destroy()
    }
  })
})
