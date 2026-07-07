/**
 * Accepts internal CMS links and safe external link schemes.
 * Examples: /about, blog/post, #section, ?tab=seo, https://example.com, mailto:hi@example.com
 */
export function isValidHyperlinkInput(rawUrl: string): boolean {
  const value = rawUrl.trim()
  if (!value) return false

  const lower = value.toLowerCase()

  // Block dangerous schemes.
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:')
  ) {
    return false
  }

  // Safe explicit schemes.
  if (
    lower.startsWith('https://') ||
    lower.startsWith('http://') ||
    lower.startsWith('mailto:') ||
    lower.startsWith('tel:')
  ) {
    return true
  }

  // Internal links and anchor/query links.
  if (
    value.startsWith('/') ||
    value.startsWith('./') ||
    value.startsWith('../') ||
    value.startsWith('#') ||
    value.startsWith('?')
  ) {
    return true
  }

  // Relative slugs/paths like "cms/page-about".
  return /^[A-Za-z0-9][A-Za-z0-9._\-/]*([?#].*)?$/.test(value)
}
