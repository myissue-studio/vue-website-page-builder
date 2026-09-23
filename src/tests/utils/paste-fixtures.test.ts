// @vitest-environment jsdom
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  buildComponentsFromFormattedText,
  parseFormattedText,
} from '../../utils/builder/formatted-text-to-components'

const FIXTURES_DIR = join(process.cwd(), 'testing/paste-fixtures')

function readFixture(name: string): string {
  const path = join(FIXTURES_DIR, name)
  if (!existsSync(path)) {
    throw new Error(`Missing fixture: ${path}`)
  }
  return readFileSync(path, 'utf8')
}

/** Prefer the dashed “copy-me” region (browser-copy target); else full file. */
function copyTargetHtml(fileHtml: string): string {
  const doc = new DOMParser().parseFromString(fileHtml, 'text/html')
  const box = doc.querySelector('.copy-me')
  return box ? box.innerHTML.trim() : fileHtml.trim()
}

describe.skipIf(!existsSync(FIXTURES_DIR))('paste fixtures (testing/paste-fixtures)', () => {
  it('01 Word/Outlook MSO job ad → headings + two lists (no H2 spam)', () => {
    const html = copyTargetHtml(readFixture('01-word-mso-job-ad.html'))
    const blocks = parseFormattedText(html)
    const kinds = blocks.map((b) => b.kind)

    expect(kinds).toEqual([
      'heading',
      'paragraphs',
      'heading',
      'list',
      'heading',
      'paragraphs',
      'list',
    ])

    expect(blocks[0].kind === 'heading' && blocks[0].html).toContain('Description')
    expect(blocks[2].kind === 'heading' && blocks[2].html).toContain('About The Role')
    expect(blocks[5].kind === 'paragraphs' && blocks[5].html).toContain('What We Are Looking For:')
    expect(blocks[3].kind === 'list' && blocks[3].items.some((i) => i.includes('Hero products'))).toBe(
      true,
    )
    // Short list labels must not become separate headings
    expect(
      blocks.filter((b) => b.kind === 'heading' && b.html.includes('Hero products')),
    ).toHaveLength(0)

    const components = buildComponentsFromFormattedText(html)
    expect(components.some((c) => c.title === 'Numbered List')).toBe(true)
    expect(components.filter((c) => c.title === 'Header H2').length).toBeGreaterThanOrEqual(2)
  })

  it('02 Google Docs spans → real headings + list + link text', () => {
    const html = copyTargetHtml(readFixture('02-google-docs-spans.html'))
    const blocks = parseFormattedText(html)

    expect(blocks.map((b) => b.kind)).toEqual([
      'heading',
      'heading',
      'paragraphs',
      'heading',
      'list',
      'paragraphs',
    ])
    expect(blocks[0]).toMatchObject({ kind: 'heading', level: 1 })
    expect(blocks[0].kind === 'heading' && blocks[0].html).toContain('Marketing Specialist')
    expect(blocks[4]).toMatchObject({ kind: 'list', ordered: false })
    expect(blocks[4].kind === 'list' && blocks[4].items).toHaveLength(3)
    expect(blocks[5].kind === 'paragraphs' && blocks[5].html).toContain('example.com/jobs/marketing')
  })

  it('03 nested lists → top-level list items (nesting flattened into item text)', () => {
    const html = copyTargetHtml(readFixture('03-nested-lists.html'))
    const blocks = parseFormattedText(html)

    expect(blocks.map((b) => b.kind)).toEqual(['heading', 'list', 'heading', 'list'])
    expect(blocks[1]).toMatchObject({ kind: 'list', ordered: false })
    expect(blocks[1].kind === 'list' && blocks[1].items.length).toBe(2)
    // Nested bullets are unwrapped into the parent item HTML/text, not separate blocks
    expect(blocks[1].kind === 'list' && blocks[1].items[0]).toContain('Own the content calendar')
    expect(blocks[1].kind === 'list' && blocks[1].items[0]).toContain('Weekly planning with brand')
    expect(blocks[3]).toMatchObject({ kind: 'list', ordered: true })
  })

  it('04 table mixed → heading + paragraph + list; table cells become loose text blocks', () => {
    const html = copyTargetHtml(readFixture('04-table-mixed.html'))
    const blocks = parseFormattedText(html)

    expect(blocks[0]).toMatchObject({ kind: 'heading', level: 2 })
    expect(blocks.some((b) => b.kind === 'list')).toBe(true)
    // No dedicated table block — cell text shows up as paragraphs
    expect(blocks.some((b) => b.kind === 'paragraphs' && /Paid Media|Dubai|6 months/i.test(
      b.kind === 'paragraphs' ? b.html : '',
    ))).toBe(true)
  })

  it('05 blockquote + hr → headings and list; quote usually becomes paragraph', () => {
    const html = copyTargetHtml(readFixture('05-blockquote-and-hr.html'))
    const blocks = parseFormattedText(html)

    expect(blocks[0]).toMatchObject({ kind: 'heading', level: 2 })
    expect(blocks.some((b) => b.kind === 'paragraphs' && /Creativity is intelligence/i.test(
      b.kind === 'paragraphs' ? b.html : '',
    ))).toBe(true)
    expect(blocks.some((b) => b.kind === 'heading' && b.html.includes('How we work'))).toBe(true)
    expect(blocks.some((b) => b.kind === 'list' && b.ordered)).toBe(true)
  })

  it('06 plain lost bullets → lists after colon / short-line runs', () => {
    const text = readFixture('06-plain-lost-bullets.txt')
    const blocks = parseFormattedText(text)
    const kinds = blocks.map((b) => b.kind)

    expect(kinds).toContain('list')
    expect(kinds.filter((k) => k === 'heading').length).toBeGreaterThanOrEqual(1)
    const lists = blocks.filter((b) => b.kind === 'list')
    expect(lists.some((b) => b.kind === 'list' && b.items.includes('Hero products'))).toBe(true)
    expect(
      lists.some(
        (b) =>
          b.kind === 'list' &&
          b.items.some((i) => i.includes('Fluency in Arabic')),
      ),
    ).toBe(true)
    expect(
      blocks.filter((b) => b.kind === 'heading' && b.html.includes('Hero products')),
    ).toHaveLength(0)
  })

  it('07 ChatGPT markdown → headings + lists + bold', () => {
    const md = readFixture('07-chatgpt-markdown.md')
    const blocks = parseFormattedText(md)

    expect(blocks[0]).toMatchObject({ kind: 'heading', level: 1 })
    expect(blocks.some((b) => b.kind === 'list' && b.items.includes('Business and store listings'))).toBe(
      true,
    )
    expect(
      blocks.some(
        (b) => b.kind === 'paragraphs' && b.html.includes('<strong>B2B Sales Executive</strong>'),
      ),
    ).toBe(true)
    expect(
      blocks.some(
        (b) =>
          b.kind === 'list' &&
          b.items.some((i) => i.includes('Have proven B2B sales experience')),
      ),
    ).toBe(true)
  })
})
