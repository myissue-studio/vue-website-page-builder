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

/** Success toast after multi-block insert (supports `{count}`). */
export function formatAddedBlocksMessage(
  translate: (key: string) => string,
  count: number,
  options?: { replacedPage?: boolean },
): string {
  if (options?.replacedPage) {
    return translate('Page replaced with {count} blocks').replace('{count}', String(count))
  }
  const key = count === 1 ? 'Added {count} block to the page' : 'Added {count} blocks to the page'
  return translate(key).replace('{count}', String(count))
}

/** True when clipboard plain text itself is HTML source (tags not escaped). */
export function looksLikeHtmlSource(input: string): boolean {
  return /<\/?(?:h[1-6]|ul|ol|li|p|strong|em|b|i|a|div|section|br)\b/i.test(String(input || ''))
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

function isShortLineCandidate(line: string): boolean {
  if (parseAtxHeading(line) || isListLine(line)) return false
  const trimmed = plainTextForHeuristics(line)
  if (!trimmed || trimmed.length > 90) return false
  if (/[.!?,:]$/.test(trimmed)) return false
  if (trimmed.split(/\s+/).length > 12) return false
  return true
}

function looksLikeHeadingLine(line: string, nextNonEmpty?: string): boolean {
  if (!isShortLineCandidate(line)) return false
  const trimmed = plainTextForHeuristics(line)
  // Keep conversational list lead-ins as paragraphs ("You should", "We need").
  // Real section titles before bullets (e.g. "Requirements") stay headings.
  if (
    nextNonEmpty &&
    isListLine(nextNonEmpty) &&
    /^(you|we|they|i|candidates?|applicants?)\b/i.test(trimmed)
  ) {
    return false
  }
  return true
}

function isListLine(line: string): boolean {
  return /^\s*(?:[-*•]|\d+[.)])\s+\S/.test(line)
}

function stripListPrefix(line: string): string {
  return line.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, '').trim()
}

/** True when a short line should stay a list item, not become an H2. */
function isPlainListItemLine(
  line: string,
  nextNonEmpty: string | undefined,
  prevNonEmpty: string | undefined,
): boolean {
  if (!isShortLineCandidate(line) || isListLine(line) || parseAtxHeading(line)) return false
  // Lead-in ending with ":" → following short lines are bullets (markers often lost on paste).
  if (prevNonEmpty && /:\s*$/.test(prevNonEmpty.trim())) return true
  // Runs of short lines (lost bullets from web/Word) are lists, not a stack of H2s.
  if (nextNonEmpty && isShortLineCandidate(nextNonEmpty) && !isListLine(nextNonEmpty)) return true
  if (
    prevNonEmpty &&
    isShortLineCandidate(prevNonEmpty) &&
    !isListLine(prevNonEmpty) &&
    !parseAtxHeading(prevNonEmpty)
  ) {
    return true
  }
  return false
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
      if (!html) return
      // Short bold-only paragraphs (common on job boards) → heading.
      const boldOnly = /^<(strong|b)>([\s\S]+)<\/\1>$/i.exec(html)
      const boldText = boldOnly?.[2]?.replace(/<[^>]+>/g, '').trim() ?? ''
      if (boldOnly && boldText && looksLikeHeadingLine(boldText)) {
        const level = 2 as FormattedTextHeadingLevel
        blocks.push({
          kind: 'heading',
          level,
          html: `<h${level}>${boldOnly[2]}</h${level}>`,
        })
        return
      }
      blocks.push({ kind: 'paragraphs', html: `<p>${html}</p>` })
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

function lineToBlock(
  line: string,
  nextNonEmpty?: string,
  prevNonEmpty?: string,
): FormattedTextBlock {
  const atx = parseAtxHeading(line)
  if (atx) return atx

  if (isListLine(line)) {
    return {
      kind: 'list',
      ordered: /^\s*\d+[.)]/.test(line),
      items: [inlineMarkdownToHtml(stripListPrefix(line))],
    }
  }

  if (isPlainListItemLine(line, nextNonEmpty, prevNonEmpty)) {
    return {
      kind: 'list',
      ordered: false,
      items: [inlineMarkdownToHtml(unwrapWholeLineMarkdown(line))],
    }
  }

  if (looksLikeHeadingLine(line, nextNonEmpty)) {
    return {
      kind: 'heading',
      level: 2,
      html: `<h2>${inlineMarkdownToHtml(unwrapWholeLineMarkdown(line))}</h2>`,
    }
  }

  return { kind: 'paragraphs', html: `<p>${inlineMarkdownToHtml(line)}</p>` }
}

function nextNonEmptyLine(lines: string[], index: number): string | undefined {
  for (let i = index + 1; i < lines.length; i++) {
    const next = lines[i].trim()
    if (next) return next
  }
  return undefined
}

function prevNonEmptyLine(lines: string[], index: number): string | undefined {
  for (let i = index - 1; i >= 0; i--) {
    const prev = lines[i].trim()
    if (prev) return prev
  }
  return undefined
}

function parsePlainText(input: string): FormattedTextBlock[] {
  const lines = input.replace(/\r\n/g, '\n').split('\n')
  const blocks: FormattedTextBlock[] = []
  let canMergeList = false

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index].trim()
    if (!line) {
      canMergeList = false
      continue
    }

    const block = lineToBlock(
      line,
      nextNonEmptyLine(lines, index),
      prevNonEmptyLine(lines, index),
    )
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
  return previewFormattedTextItems(input).map((item) => item.title)
}

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

export type FormattedTextPreviewItem = {
  kind: FormattedTextBlock['kind']
  title: string
  excerpt: string
  headingLevel?: FormattedTextHeadingLevel
  symbol?: string
}

export function previewFormattedTextItems(input: string): FormattedTextPreviewItem[] {
  return parseFormattedText(input).map((block) => {
    if (block.kind === 'heading') {
      return {
        kind: 'heading',
        title: HEADING_TITLE[block.level],
        headingLevel: block.level,
        excerpt: stripTags(block.html),
      }
    }
    if (block.kind === 'list') {
      return {
        kind: 'list',
        title: 'Numbered List',
        symbol: block.ordered ? 'format_list_numbered' : 'format_list_bulleted',
        excerpt: block.items.map(stripTags).filter(Boolean).join(', '),
      }
    }
    return {
      kind: 'paragraphs',
      title: 'Text',
      excerpt: stripTags(block.html),
    }
  })
}

/** Convert parsed blocks into TipTap-friendly HTML (same schema as the inline editor). */
export function blocksToTipTapHtml(
  blocks: FormattedTextBlock[],
  config?: PageBuilderConfig | null,
): string {
  const disableH1 = isTipTapH1Disabled(config)

  return (blocks || [])
    .map((block) => {
      if (block.kind === 'heading') {
        const level = mapHeadingLevel(block.level, disableH1)
        const inner = headingInner(block.html, block.level)
        return `<h${level}>${inner}</h${level}>`
      }
      if (block.kind === 'list') {
        const tag = block.ordered ? 'ol' : 'ul'
        const items = block.items.map((item) => `<li><p>${item}</p></li>`).join('')
        return `<${tag}>${items}</${tag}>`
      }
      return block.html
    })
    .join('')
}

/** Parse Markdown / HTML / plain job-ad text into TipTap HTML. */
export function formattedTextToTipTapHtml(
  input: string,
  config?: PageBuilderConfig | null,
): string {
  return blocksToTipTapHtml(parseFormattedText(input), config)
}

/**
 * True when clipboard content looks structured enough that TipTap's default
 * paste would leave Markdown markers or lose heading/list structure.
 */
export function shouldTransformFormattedTextPaste(text: string, html = ''): boolean {
  const plain = String(text || '').trim()
  const rich = String(html || '').trim()
  if (!plain && !rich) return false

  if (plain) {
    if (/\n/.test(plain)) return true
    if (/^(#{1,6})\s+\S/.test(plain)) return true
    if (/^\s*(?:[-*•]|\d+[.)])\s+\S/.test(plain)) return true
    if (looksLikeHtmlSource(plain)) return true
  }

  if (/<\/?(?:h[1-6]|ul|ol|li)\b/i.test(rich)) return true
  return false
}

/**
 * Prefer plain text when it carries Markdown or raw HTML source.
 * Browsers often wrap those pastes in nearly-useless / escaped text/html.
 */
export function resolveFormattedTextPasteSource(text: string, html = ''): string {
  const plain = String(text || '').trim()
  const rich = String(html || '').trim()
  if (!plain) return rich
  if (!rich) return plain

  const plainLooksStructured =
    /^(#{1,6})\s+\S/m.test(plain) ||
    /^\s*(?:[-*•]|\d+[.)])\s+\S/m.test(plain) ||
    looksLikeHtmlSource(plain)

  return plainLooksStructured ? plain : rich
}
