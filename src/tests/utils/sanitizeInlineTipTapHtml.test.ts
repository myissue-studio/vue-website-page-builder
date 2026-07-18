// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import {
  buildEditableFallbackInlineHtml,
  finalizeInlineTipTapHtml,
  preserveOriginalInlineHtmlIfUnchanged,
  rememberInlineTipTapHostClass,
  restoreInlineTipTapHostElement,
  sanitizeInlineTipTapHtml,
  stripInlineTipTapHostArtifacts,
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
    expect(sanitizeInlineTipTapHtml('<h2>Title</h2><p>Body copy</p><p><br></p>')).toBe(
      '<h2>Title</h2><p>Body copy</p>',
    )
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

describe('preserveOriginalInlineHtmlIfUnchanged', () => {
  it('returns the original html when TipTap only adds editor artifacts', () => {
    const originalHtml = '<h2 class="pbx-text-2xl">Demo Content</h2>'
    const tiptapHtml =
      '<h2 class="pbx-text-2xl">Demo Content<br class="ProseMirror-trailingBreak"></h2>'

    expect(preserveOriginalInlineHtmlIfUnchanged(tiptapHtml, originalHtml)).toBe(originalHtml)
  })

  it('returns finalized html when inline text changed', () => {
    expect(
      preserveOriginalInlineHtmlIfUnchanged(
        '<h2 class="pbx-text-2xl">Updated Content</h2>',
        '<h2 class="pbx-text-2xl">Demo Content</h2>',
      ),
    ).toBe('<h2 class="pbx-text-2xl">Updated Content</h2>')
  })

  it('REGRESSION (link CTA): ignores indentation whitespace TipTap collapses', () => {
    const originalHtml = `
            <p>
              <a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">
                Layouts and Visuals
              </a>
            </p>
          `
    const tiptapHtml =
      '<p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and Visuals</a></p>'

    expect(preserveOriginalInlineHtmlIfUnchanged(tiptapHtml, originalHtml)).toBe(originalHtml)
  })

  it('REGRESSION (link CTA): ignores rel token order differences from TipTap', () => {
    const originalHtml =
      '<p><a href="https://www.google.com" target="_blank" rel="noopener noreferrer nofollow">Layouts and Visuals</a></p>'
    const tiptapHtml =
      '<p><a target="_blank" rel="nofollow noopener noreferrer" href="https://www.google.com">Layouts and Visuals</a></p>'

    expect(preserveOriginalInlineHtmlIfUnchanged(tiptapHtml, originalHtml)).toBe(originalHtml)
  })
})

describe('restoreInlineTipTapHostElement', () => {
  it('restores the pre-edit host class and strips TipTap editor attributes', () => {
    const host = document.createElement('div')
    host.className = 'pbx-break-words pbx-text-xl'
    rememberInlineTipTapHostClass(host)

    host.className = 'tiptap ProseMirror pbx-inline-tiptap-editor'
    host.setAttribute('contenteditable', 'true')
    host.setAttribute('role', 'textbox')
    host.setAttribute('translate', 'no')
    host.setAttribute('tabindex', '0')
    host.setAttribute('data-pbx-inline-tiptap', '')
    host.setAttribute('data-pbx-inline-original-html', '<h2>Title</h2>')

    restoreInlineTipTapHostElement(host)

    expect(host.className).toBe('pbx-break-words pbx-text-xl')
    expect(host.hasAttribute('contenteditable')).toBe(false)
    expect(host.hasAttribute('role')).toBe(false)
    expect(host.hasAttribute('data-pbx-inline-tiptap')).toBe(false)
    expect(host.hasAttribute('data-pbx-inline-original-html')).toBe(false)
    expect(host.hasAttribute('data-pbx-inline-original-class')).toBe(false)
  })

  it('strips TipTap host artifacts from cloned section html', () => {
    const section = document.createElement('section')
    section.innerHTML = `
      <div class="tiptap ProseMirror pbx-inline-tiptap-editor pbx-text-xl" contenteditable="true" role="textbox">
        <h2>Title</h2>
      </div>
    `

    stripInlineTipTapHostArtifacts(section)

    const host = section.querySelector('div')
    expect(host?.className).toBe('pbx-text-xl')
    expect(host?.hasAttribute('contenteditable')).toBe(false)
    expect(host?.hasAttribute('role')).toBe(false)
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
