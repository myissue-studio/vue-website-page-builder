const EMPTY_PARAGRAPH_PATTERN = /<p(?:\s[^>]*)?>(?:\s|&nbsp;|<br\s*\/?>|<br[^>]*>)*<\/p>\s*$/i

const INLINE_TIPTAP_BLOCK_SELECTOR = 'h1,h2,h3,h4,h5,h6,p,li,blockquote,pre'

const INLINE_TIPTAP_HOST_ATTRIBUTES = [
  'data-pbx-inline-tiptap',
  'data-pbx-inline-original-html',
  'data-pbx-inline-original-class',
  'contenteditable',
  'role',
  'translate',
  'tabindex',
  'spellcheck',
] as const

const INLINE_TIPTAP_HOST_CLASSES = ['tiptap', 'ProseMirror', 'pbx-inline-tiptap-editor'] as const

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

  return (
    trimmed
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/gi, ' ')
      .trim().length === 0
  )
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

function normalizeInlineHtmlForComparison(html: string): string {
  const sanitized = sanitizeInlineTipTapHtml(html)

  if (typeof document === 'undefined') {
    return canonicalizeInlineHtmlString(sanitized)
  }

  const template = document.createElement('template')
  template.innerHTML = sanitized

  template.content.querySelectorAll('.ProseMirror-trailingBreak').forEach((element) => {
    element.remove()
  })

  template.content.querySelectorAll('*').forEach((element) => {
    INLINE_TIPTAP_HOST_ATTRIBUTES.forEach((attributeName) => {
      element.removeAttribute(attributeName)
    })
    if (element.getAttribute('class') === '') {
      element.removeAttribute('class')
    }

    // TipTap Link may reorder or drop/add rel tokens; compare a stable set.
    if (element.tagName === 'A') {
      const rel = element.getAttribute('rel')
      if (rel) {
        const tokens = Array.from(
          new Set(
            rel
              .split(/\s+/)
              .map((token) => token.trim())
              .filter(Boolean),
          ),
        ).sort()
        if (tokens.length > 0) {
          element.setAttribute('rel', tokens.join(' '))
        } else {
          element.removeAttribute('rel')
        }
      }
    }

    // TipTap often reorders attributes (href/target/rel); normalize for compare.
    const attributeEntries = Array.from(element.attributes).map((attribute) => [
      attribute.name,
      attribute.value,
    ])
    if (attributeEntries.length > 1) {
      attributeEntries.sort(([left], [right]) => left.localeCompare(right))
      attributeEntries.forEach(([name]) => element.removeAttribute(name))
      attributeEntries.forEach(([name, value]) => element.setAttribute(name, value))
    }
  })

  const textWalker = document.createTreeWalker(template.content, NodeFilter.SHOW_TEXT)
  const textNodes: Text[] = []
  while (textWalker.nextNode()) {
    textNodes.push(textWalker.currentNode as Text)
  }
  textNodes.forEach((node) => {
    if (!node.textContent) {
      node.parentNode?.removeChild(node)
      return
    }
    const collapsed = node.textContent.replace(/\s+/g, ' ').trim()
    if (!collapsed) {
      node.parentNode?.removeChild(node)
      return
    }
    node.textContent = collapsed
  })

  return canonicalizeInlineHtmlString(template.innerHTML)
}

/** Collapse insignificant markup whitespace so indented source matches TipTap output. */
function canonicalizeInlineHtmlString(html: string): string {
  return html
    .replace(/>\s+/g, '>')
    .replace(/\s+</g, '<')
    .replace(/\s+/g, ' ')
    .trim()
}

export function preserveOriginalInlineHtmlIfUnchanged(html: string, originalHtml: string): string {
  const finalized = finalizeInlineTipTapHtml(html, originalHtml)
  if (!originalHtml) return finalized

  return normalizeInlineHtmlForComparison(finalized) ===
    normalizeInlineHtmlForComparison(originalHtml)
    ? originalHtml
    : finalized
}

/**
 * TipTap mutates the host element (contenteditable, role, ProseMirror classes).
 * Capture the pre-edit class list so we can restore it on close.
 */
export function rememberInlineTipTapHostClass(element: HTMLElement): void {
  element.setAttribute('data-pbx-inline-original-class', element.getAttribute('class') ?? '')
}

/**
 * Restore the canvas host element after TipTap closes so open/close without edits
 * does not rewrite classes/attributes and inflate undo history.
 */
export function restoreInlineTipTapHostElement(element: HTMLElement): void {
  const originalClass = element.getAttribute('data-pbx-inline-original-class')

  INLINE_TIPTAP_HOST_ATTRIBUTES.forEach((attributeName) => {
    element.removeAttribute(attributeName)
  })

  if (originalClass !== null) {
    if (originalClass.length > 0) {
      element.setAttribute('class', originalClass)
    } else {
      element.removeAttribute('class')
    }
    return
  }

  INLINE_TIPTAP_HOST_CLASSES.forEach((className) => {
    element.classList.remove(className)
  })
  if (element.getAttribute('class') === '') {
    element.removeAttribute('class')
  }
}

/** Strip TipTap host chrome from a cloned section before persistence. */
export function stripInlineTipTapHostArtifacts(root: ParentNode): void {
  const elements =
    root instanceof Element
      ? [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))]
      : Array.from(root.querySelectorAll<HTMLElement>('*'))

  elements.forEach((element) => {
    if (!(element instanceof HTMLElement)) return

    INLINE_TIPTAP_HOST_ATTRIBUTES.forEach((attributeName) => {
      element.removeAttribute(attributeName)
    })
    INLINE_TIPTAP_HOST_CLASSES.forEach((className) => {
      element.classList.remove(className)
    })
    if (element.getAttribute('class') === '') {
      element.removeAttribute('class')
    }
  })
}
