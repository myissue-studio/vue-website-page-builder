const EMPTY_PARAGRAPH_PATTERN =
  /<p(?:\s[^>]*)?>(?:\s|&nbsp;|<br\s*\/?>|<br[^>]*>)*<\/p>\s*$/i

const INLINE_TIPTAP_BLOCK_SELECTOR = 'h1,h2,h3,h4,h5,h6,p,li,blockquote,pre'

/**
 * TipTap/ProseMirror may append an empty trailing paragraph while editing
 * (e.g. `<p><br class="ProseMirror-trailingBreak"></p>` after a heading).
 * Strip those artifacts before writing HTML back to the page builder canvas.
 */
export function sanitizeInlineTipTapHtml(html: string): string {
  let result = html.trim()

  while (EMPTY_PARAGRAPH_PATTERN.test(result)) {
    result = result.replace(EMPTY_PARAGRAPH_PATTERN, '').trimEnd()
  }

  return result
}

export function isEffectivelyEmptyInlineHtml(html: string): boolean {
  const trimmed = html.trim()
  if (!trimmed) return true

  if (typeof document !== 'undefined') {
    const template = document.createElement('template')
    template.innerHTML = trimmed
    const text = template.content.textContent?.replace(/\u00a0/g, ' ').trim() ?? ''
    return text.length === 0
  }

  return trimmed.replace(/<[^>]+>/g, '').replace(/&nbsp;/gi, ' ').trim().length === 0
}

export function buildEditableFallbackInlineHtml(fallbackHtml: string): string {
  const trimmed = fallbackHtml.trim()
  if (!trimmed) return '<p><br></p>'

  if (typeof document !== 'undefined') {
    const template = document.createElement('template')
    template.innerHTML = trimmed
    const blocks = template.content.querySelectorAll(INLINE_TIPTAP_BLOCK_SELECTOR)

    if (blocks.length > 0) {
      return Array.from(blocks)
        .map((block) => {
          const tag = block.tagName.toLowerCase()
          return `<${tag}><br></${tag}>`
        })
        .join('')
    }
  }

  return '<p><br></p>'
}

/**
 * Sanitizes TipTap output and preserves an editable block structure when the
 * user clears all text (e.g. keep an empty `<h2>` inside a text wrapper div).
 */
export function finalizeInlineTipTapHtml(html: string, fallbackHtml = ''): string {
  const sanitized = sanitizeInlineTipTapHtml(html)
  if (!isEffectivelyEmptyInlineHtml(sanitized)) return sanitized
  return buildEditableFallbackInlineHtml(fallbackHtml)
}
