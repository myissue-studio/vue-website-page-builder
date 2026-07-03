export function extractClassesFromHtml(html: string): string[] {
  if (!html?.trim()) return []

  const classMatch = html.match(/class\s*=\s*(["'])(.*?)\1/i)
  if (!classMatch?.[2]) return []

  return classMatch[2].split(/\s+/).filter(Boolean)
}
