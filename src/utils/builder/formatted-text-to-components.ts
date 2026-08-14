import type { ComponentObject, PageBuilderConfig } from '../../types'
import componentHelpers from '../html-elements/componentHelpers'
import { isTipTapH1Disabled } from './tiptap-heading-levels'

export type FormattedTextHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export type FormattedTextBlock =
  | { kind: 'heading'; level: FormattedTextHeadingLevel; html: string }
  | { kind: 'paragraphs'; html: string }
  | { kind: 'list'; ordered: boolean; items: string[] }

const HEADING_TITLE: Record<FormattedTextHeadingLevel, string> = {
  1: 'Header H1',
  2: 'Header H2',
  3: 'Header H3',
  4: 'Header H4',
  5: 'Header H5',
  6: 'Header H6',
}

const ALLOWED_INLINE = new Set(['STRONG', 'B', 'EM', 'I', 'A', 'BR', 'SPAN'])

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function looksLikeHtml(input: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(input)
}

/** Convert ChatGPT-style Markdown emphasis and links, after HTML-escaping. */
function inlineMarkdownToHtml(text: string): string {
  let html = escapeHtml(text)
  html = html.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2">$1</a>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>')
  html = html.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>')
  html = html.replace(/(^|[^_])_([^_\n]+)_(?!_)/g, '$1<em>$2</em>')
  return html
}

function unwrapWholeLineMarkdown(line: string): string {
  const trimmed = line.trim()
  const bold = /^\*\*(.+)\*\*$/.exec(trimmed)
  if (bold) return bold[1]
  const italic = /^\*(.+)\*$/.exec(trimmed)
  if (italic && !trimmed.startsWith('**')) return italic[1]
  return trimmed
}

function plainTextForHeuristics(line: string): string {
  return unwrapWholeLineMarkdown(line)
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .trim()
}

function parseAtxHeading(line: string): FormattedTextBlock | null {
  const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line.trim())
  if (!match) return null
  const level = match[1].length as FormattedTextHeadingLevel
  const html = inlineMarkdownToHtml(unwrapWholeLineMarkdown(match[2]))
  if (!html) return null
  return { kind: 'heading', level, html: `<h${level}>${html}</h${level}>` }
}

function serializeAllowedInline(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return escapeHtml(node.textContent ?? '')
  }
  if (!(node instanceof HTMLElement)) return ''

  const tag = node.tagName
  if (tag === 'BR') return '<br>'
  if (tag === 'SPAN' || !ALLOWED_INLINE.has(tag)) {
    return Array.from(node.childNodes).map(serializeAllowedInline).join('')
  }
  if (tag === 'A') {
    const href = node.getAttribute('href')?.trim() ?? ''
    const inner = Array.from(node.childNodes).map(serializeAllowedInline).join('')
    if (!href || /^javascript:/i.test(href)) return inner
    return `<a href="${escapeHtml(href)}">${inner}</a>`
  }

  const inner = Array.from(node.childNodes).map(serializeAllowedInline).join('')
  let mapped = tag.toLowerCase()
  if (tag === 'B') mapped = 'strong'
  if (tag === 'I') mapped = 'em'
  return `<${mapped}>${inner}</${mapped}>`
}

function innerAllowedHtml(element: HTMLElement): string {
  return Array.from(element.childNodes).map(serializeAllowedInline).join('').trim()
}

function looksLikeHeadingLine(line: string): boolean {
  const trimmed = line.trim()
  if (!trimmed || trimmed.length > 90) return false
  if (/[.!?]$/.test(trimmed)) return false
  if (/,$/.test(trimmed)) return false
  const words = trimmed.split(/\s+/).length
  if (/:$/.test(trimmed) && words > 4) return false
  if (words > 12) return false
  return true
}

function isListLine(line: string): boolean {
  return /^\s*(?:[-*•]|\d+[.)])\s+\S/.test(line)
}

function stripListPrefix(line: string): string {
  return line.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, '').trim()
}

function mergeAdjacentParagraphs(blocks: FormattedTextBlock[]): FormattedTextBlock[] {
  const merged: FormattedTextBlock[] = []
  for (const block of blocks) {
    const prev = merged[merged.length - 1]
    if (block.kind === 'paragraphs' && prev?.kind === 'paragraphs') {
      prev.html = `${prev.html}${block.html}`
    } else {
      merged.push(block)
    }
  }
  return merged
}

function collectHtmlBlocks(root: ParentNode): FormattedTextBlock[] {
  const blocks: FormattedTextBlock[] = []

  Array.from(root.childNodes).forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent?.replace(/\s+/g, ' ').trim()
      if (text) {
        blocks.push({ kind: 'paragraphs', html: `<p>${escapeHtml(text)}</p>` })
      }
      return
    }
    if (!(child instanceof HTMLElement)) return

    const tag = child.tagName
    const headingMatch = tag.match(/^H([1-6])$/)
    if (headingMatch) {
      const level = Number(headingMatch[1]) as FormattedTextHeadingLevel
      const html = innerAllowedHtml(child)
      if (html) {
        blocks.push({ kind: 'heading', level, html: `<h${level}>${html}</h${level}>` })
      }
      return
    }
    if (tag === 'P') {
      const html = innerAllowedHtml(child)
      if (html) blocks.push({ kind: 'paragraphs', html: `<p>${html}</p>` })
      return
    }
    if (tag === 'UL' || tag === 'OL') {
      const items = Array.from(child.querySelectorAll(':scope > li'))
        .map((item) => innerAllowedHtml(item as HTMLElement))
        .filter(Boolean)
      if (items.length) {
        blocks.push({ kind: 'list', ordered: tag === 'OL', items })
      }
      return
    }
    if (tag === 'BR' || tag === 'SCRIPT' || tag === 'STYLE') return

    blocks.push(...collectHtmlBlocks(child))
  })

  return mergeAdjacentParagraphs(blocks)
}

function lineToBlock(line: string): FormattedTextBlock {
  const atx = parseAtxHeading(line)
  if (atx) return atx

  if (isListLine(line)) {
    return {
      kind: 'list',
      ordered: /^\s*\d+[.)]/.test(line),
      items: [inlineMarkdownToHtml(stripListPrefix(line))],
    }
  }

  if (looksLikeHeadingLine(plainTextForHeuristics(line))) {
    return {
      kind: 'heading',
      level: 2,
      html: `<h2>${inlineMarkdownToHtml(unwrapWholeLineMarkdown(line))}</h2>`,
    }
  }

  return { kind: 'paragraphs', html: `<p>${inlineMarkdownToHtml(line)}</p>` }
}

function parsePlainText(input: string): FormattedTextBlock[] {
  const lines = input.replace(/\r\n/g, '\n').split('\n')
  const blocks: FormattedTextBlock[] = []
  let canMergeList = false

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) {
      canMergeList = false
      continue
    }

    const block = lineToBlock(line)
    const prev = blocks[blocks.length - 1]
    if (
      block.kind === 'list' &&
      canMergeList &&
      prev?.kind === 'list' &&
      prev.ordered === block.ordered
    ) {
      prev.items.push(...block.items)
    } else {
      blocks.push(block)
    }
    canMergeList = block.kind === 'list'
  }

  return mergeAdjacentParagraphs(blocks)
}

/** Parse pasted HTML or plain text into heading / paragraph / list blocks. */
export function parseFormattedText(input: string): FormattedTextBlock[] {
  const trimmed = input.trim()
  if (!trimmed) return []

  if (looksLikeHtml(trimmed) && typeof DOMParser !== 'undefined') {
    const doc = new DOMParser().parseFromString(trimmed, 'text/html')
    const blocks = collectHtmlBlocks(doc.body)
    if (blocks.length) return blocks
  }

  return parsePlainText(trimmed)
}

function findHelper(title: string): { html_code: string; title: string } | undefined {
  return componentHelpers.find((helper) => helper.title === title)
}

function sectionHtmlFromTemplate(templateHtml: string, mutate: (doc: Document) => void): string {
  const doc = new DOMParser().parseFromString(templateHtml, 'text/html')
  mutate(doc)
  const section = doc.body.querySelector('section')
  return section ? section.outerHTML : templateHtml
}

function mapHeadingLevel(
  level: FormattedTextHeadingLevel,
  disableH1: boolean,
): FormattedTextHeadingLevel {
  if (disableH1 && level === 1) return 2
  return level
}

function headingInner(html: string, level: FormattedTextHeadingLevel): string {
  const match = html.match(new RegExp(`^<h${level}>([\\s\\S]*)</h${level}>$`, 'i'))
  return match ? match[1] : html.replace(/<\/?h[1-6]>/gi, '')
}

function paragraphsInner(html: string): string {
  return html
}

function buildFromBlock(block: FormattedTextBlock, disableH1: boolean): ComponentObject | null {
  if (block.kind === 'heading') {
    const level = mapHeadingLevel(block.level, disableH1)
    const title = HEADING_TITLE[level]
    const helper = findHelper(title)
    if (!helper) return null
    const inner = headingInner(block.html, block.level)
    return {
      id: null,
      title,
      html_code: sectionHtmlFromTemplate(helper.html_code, (doc) => {
        const heading = doc.querySelector('h1,h2,h3,h4,h5,h6')
        if (!heading) return
        const next = doc.createElement(`h${level}`)
        next.innerHTML = inner
        heading.replaceWith(next)
      }),
    }
  }

  if (block.kind === 'paragraphs') {
    const helper = findHelper('Text')
    if (!helper) return null
    return {
      id: null,
      title: 'Text',
      html_code: sectionHtmlFromTemplate(helper.html_code, (doc) => {
        const host = doc.querySelector('section div.pbx-mx-auto > div') ?? doc.querySelector('p')?.parentElement
        if (host) host.innerHTML = paragraphsInner(block.html)
      }),
    }
  }

  const helper = findHelper('Numbered List')
  if (!helper) return null
  return {
    id: null,
    title: 'Numbered List',
    html_code: sectionHtmlFromTemplate(helper.html_code, (doc) => {
      const list = doc.querySelector('ol, ul')
      if (!list) return
      const tag = block.ordered ? 'ol' : 'ul'
      const next = doc.createElement(tag)
      next.innerHTML = block.items.map((item) => `<li><p>${item}</p></li>`).join('')
      list.replaceWith(next)
    }),
  }
}

/** Turn pasted text into existing helper components (Header H2–H6, Text, lists). */
export function buildComponentsFromFormattedText(
  input: string,
  config?: PageBuilderConfig | null,
): ComponentObject[] {
  const disableH1 = isTipTapH1Disabled(config)
  return parseFormattedText(input)
    .map((block) => buildFromBlock(block, disableH1))
    .filter((component): component is ComponentObject => component !== null)
}

export function previewFormattedTextBlocks(input: string): string[] {
  return parseFormattedText(input).map((block) => {
    if (block.kind === 'heading') return HEADING_TITLE[block.level]
    if (block.kind === 'list') return 'Numbered List'
    return 'Text'
  })
}
