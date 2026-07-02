const EMPTY_PARAGRAPH_PATTERN =
  /<p(?:\s[^>]*)?>(?:\s|&nbsp;|<br\s*\/?>|<br[^>]*>)*<\/p>\s*$/i

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
