export function prettifyHtml(html: string | undefined | null): string {
  if (!html) return ''

  const tab = '  '
  let indentLevel = 0
  let result = ''

  const escapedHtml = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

  const tokens = escapedHtml.split(/(&lt;[^&gt;]+&gt;)/g)

  const selfClosingTags = [
    '&lt;area',
    '&lt;base',
    '&lt;br',
    '&lt;col',
    '&lt;embed',
    '&lt;hr',
    '&lt;img',
    '&lt;input',
    '&lt;link',
    '&lt;meta',
    '&lt;param',
    '&lt;source',
    '&lt;track',
    '&lt;wbr',
  ]

  tokens.forEach((token: string) => {
    const trimmed = token.trim()
    if (!trimmed) return

    const isTag = trimmed.startsWith('&lt;') && trimmed.endsWith('&gt;')
    const isClosingTag = isTag && trimmed.startsWith('&lt;/')

    if (isClosingTag) {
      indentLevel = Math.max(0, indentLevel - 1)
    }

    let line = tab.repeat(indentLevel) + trimmed

    if (isTag) {
      line = line.replace(/(&lt;\/?[[\w\s="/.':;#-\/\?]+&gt;)/g, (match) => {
        const tagName = match.match(/&lt;\/?([\w-]+)/)?.[1]
        let highlighted = match.replace(
          /(&lt;\/?[\w-]+)/g,
          `<span class="html-tag-symbol">&lt;</span><span class="html-tag-name">${tagName}</span>`,
        )

        highlighted = highlighted.replace(
          /([\w-]+)=(&quot;[^&quot;]*&quot;)/g,
          '<span class="html-attribute-name">$1</span><span class="html-operator">=</span><span class="html-attribute-value">$2</span>',
        )

        return highlighted + '<span class="html-tag-symbol">&gt;</span>'
      })
    }

    result += line + '\n'

    if (isTag && !isClosingTag) {
      const isSelfClosing =
        trimmed.endsWith('/&gt;') || selfClosingTags.some((tag) => trimmed.startsWith(tag))
      if (!isSelfClosing) {
        indentLevel++
      }
    }
  })

  return result
}
