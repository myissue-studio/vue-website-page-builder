function normalizeHtml(html: string): string {
  return html.replace(/>\s*</g, '>\n<').trim()
}

const selfClosingTagNames = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]

function isSelfClosingTag(tag: string, escaped = false): boolean {
  if (escaped) {
    const escapedTags = selfClosingTagNames.map((name) => `&lt;${name}`)
    return tag.endsWith('/&gt;') || escapedTags.some((prefix) => tag.startsWith(prefix))
  }

  return tag.endsWith('/>') || selfClosingTagNames.some((name) => tag.startsWith(`<${name}`))
}

export function formatHtml(html: string | undefined | null): string {
  if (!html) return ''

  const normalized = normalizeHtml(html)
  const tab = '  '
  let indentLevel = 0
  let result = ''
  const tokens = normalized.split(/(<[\s\S]*?>)/g)

  tokens.forEach((token: string) => {
    const trimmed = token.trim()
    if (!trimmed) return

    const isTag = trimmed.startsWith('<') && trimmed.endsWith('>')
    const isClosingTag = isTag && trimmed.startsWith('</')

    if (isClosingTag) {
      indentLevel = Math.max(0, indentLevel - 1)
    }

    const indent = tab.repeat(indentLevel)

    result += `${indent}${trimmed}\n`

    if (isTag && !isClosingTag && !isSelfClosingTag(trimmed)) {
      indentLevel++
    }
  })

  return result.trimEnd()
}

function highlightTag(tag: string): string {
  const match = tag.match(/^&lt;(\/?)([\w-]+)(.*?)(\/?)&gt;$/)
  if (!match) return tag

  const [, slash, tagName, rawAttrs, selfClose] = match
  const isClosing = slash === '/'
  const attrsPart = rawAttrs.trim()

  const openPart = isClosing
    ? `<span class="html-tag-symbol">&lt;/</span><span class="html-tag-name">${tagName}</span>`
    : `<span class="html-tag-symbol">&lt;</span><span class="html-tag-name">${tagName}</span>`

  const highlightedAttrs = attrsPart.replace(
    /([\w-]+)=(&quot;[\s\S]*?&quot;)/g,
    '<span class="html-attribute-name">$1</span><span class="html-operator">=</span><span class="html-attribute-value">$2</span>',
  )

  const closePart = selfClose
    ? '<span class="html-tag-symbol"> /&gt;</span>'
    : '<span class="html-tag-symbol">&gt;</span>'

  return highlightedAttrs ? `${openPart} ${highlightedAttrs}${closePart}` : `${openPart}${closePart}`
}

export function prettifyHtml(html: string | undefined | null): string {
  if (!html) return ''

  const normalized = normalizeHtml(html)

  const tab = '  '
  let indentLevel = 0
  let result = ''

  const escapedHtml = normalized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

  const tokens = escapedHtml.split(/(&lt;[\s\S]*?&gt;)/g)

  tokens.forEach((token: string) => {
    const trimmed = token.trim()
    if (!trimmed) return

    const isTag = trimmed.startsWith('&lt;') && trimmed.endsWith('&gt;')
    const isClosingTag = isTag && trimmed.startsWith('&lt;/')

    if (isClosingTag) {
      indentLevel = Math.max(0, indentLevel - 1)
    }

    const indent = tab.repeat(indentLevel)

    if (!isTag) {
      result += `${indent}<span class="html-text-content">${trimmed}</span>\n`
      return
    }

    result += indent + highlightTag(trimmed) + '\n'

    if (!isClosingTag && !isSelfClosingTag(trimmed, true)) {
      indentLevel++
    }
  })

  return result.trimEnd()
}
