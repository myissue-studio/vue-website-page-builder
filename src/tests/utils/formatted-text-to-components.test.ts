// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import type { PageBuilderConfig } from '../../types'
import {
  buildComponentsFromFormattedText,
  formatAddedBlocksMessage,
  formattedTextToTipTapHtml,
  parseFormattedText,
  resolveFormattedTextPasteSource,
  shouldTransformFormattedTextPaste,
} from '../../utils/builder/formatted-text-to-components'
import { shouldCreatePageComponentsFromPaste } from '../../utils/builder/tiptap-formatted-text-paste'

const JOB_AD = `Team Leadership & Development

Recruit, develop, and retain a highly motivated team in collaboration with the Store Manager.
Set individual and team objectives and actively manage performance against expectations.
Coach team members through regular feedback, on-the-floor support, and development plans.
Secure succession planning and talent pipeline development.
Client Experience & Business Development

Ensure the team consistently delivers the Louis Vuitton promise to every client.
Support the team in building strong and long-term client relationships through Clienteling.
Foster a strong client-centric mindset and proactively manage client-related situations.`

describe('parseFormattedText', () => {
  it('turns job-ad plain text into H2 + paragraph blocks', () => {
    const blocks = parseFormattedText(JOB_AD)
    expect(blocks).toHaveLength(4)
    expect(blocks[0]).toMatchObject({ kind: 'heading', level: 2 })
    expect(blocks[0].kind === 'heading' && blocks[0].html).toContain('Team Leadership')
    expect(blocks[1].kind).toBe('paragraphs')
    expect(blocks[1].kind === 'paragraphs' && blocks[1].html).toContain('<p>Recruit')
    expect(blocks[1].kind === 'paragraphs' && blocks[1].html.match(/<p>/g)?.length).toBe(4)
    expect(blocks[2]).toMatchObject({ kind: 'heading', level: 2 })
    expect(blocks[3].kind).toBe('paragraphs')
  })

  it('maps HTML headings and paragraphs to helper blocks', () => {
    const blocks = parseFormattedText(
      '<h2>Role</h2><p>Lead the team.</p><h3>Details</h3><p>Work in store.</p>',
    )
    expect(blocks.map((block) => block.kind)).toEqual(['heading', 'paragraphs', 'heading', 'paragraphs'])
    expect(blocks[2]).toMatchObject({ kind: 'heading', level: 3 })
  })

  it('collects list items from HTML', () => {
    const blocks = parseFormattedText('<ul><li>One</li><li>Two</li></ul>')
    expect(blocks).toEqual([{ kind: 'list', ordered: false, items: ['One', 'Two'] }])
  })

  it('parses ChatGPT Markdown headings, bold, and lists', () => {
    const blocks = parseFormattedText(`# B2B Sales Executive – Fashion Industry

**UAE · Remote · Dubai strongly preferred**

## Build your own sales business with myself.ae

We are looking for an ambitious and experienced **B2B Sales Executive**.

## What will you sell?

You will also have opportunities, including:

* Business and store listings
* Subscription plans

## Why myself.ae?

myself.ae is a UAE-focused platform.`)

    expect(blocks[0]).toMatchObject({ kind: 'heading', level: 1 })
    expect(blocks[0].kind === 'heading' && blocks[0].html).toBe(
      '<h1>B2B Sales Executive – Fashion Industry</h1>',
    )
    expect(blocks[0].kind === 'heading' && blocks[0].html).not.toContain('#')

    expect(blocks[1]).toMatchObject({ kind: 'heading', level: 2 })
    expect(blocks[1].kind === 'heading' && blocks[1].html).toBe(
      '<h2>UAE · Remote · Dubai strongly preferred</h2>',
    )
    expect(blocks[1].kind === 'heading' && blocks[1].html).not.toContain('**')

    expect(blocks[2]).toMatchObject({ kind: 'heading', level: 2 })
    expect(blocks[2].kind === 'heading' && blocks[2].html).toBe(
      '<h2>Build your own sales business with myself.ae</h2>',
    )
    expect(blocks[2].kind === 'heading' && blocks[2].html).not.toContain('##')

    expect(blocks[3].kind === 'paragraphs' && blocks[3].html).toContain(
      '<strong>B2B Sales Executive</strong>',
    )
    expect(blocks[3].kind === 'paragraphs' && blocks[3].html).not.toContain('**')

    expect(blocks[4]).toMatchObject({ kind: 'heading', level: 2 })
    expect(blocks[4].kind === 'heading' && blocks[4].html).toBe('<h2>What will you sell?</h2>')

    expect(blocks[5].kind).toBe('paragraphs')
    expect(blocks[6]).toEqual({
      kind: 'list',
      ordered: false,
      items: ['Business and store listings', 'Subscription plans'],
    })

    expect(blocks[7]).toMatchObject({ kind: 'heading', level: 2 })
    expect(blocks[7].kind === 'heading' && blocks[7].html).toBe('<h2>Why myself.ae?</h2>')
  })

  it('keeps list lead-ins like "You should:" as paragraphs, not H2', () => {
    const blocks = parseFormattedText(`## What we're looking for

We are looking for an experienced B2B salesperson.

You should:

- Have proven B2B sales experience
- Be comfortable with cold calling

## This opportunity is for you if...

You are someone who:

- Wants to be your own boss
- Knows how to close deals`)

    expect(blocks.map((block) => block.kind)).toEqual([
      'heading',
      'paragraphs',
      'list',
      'heading',
      'paragraphs',
      'list',
    ])
    expect(blocks[1].kind === 'paragraphs' && blocks[1].html).toContain('You should:')
    expect(blocks[4].kind === 'paragraphs' && blocks[4].html).toContain('You are someone who:')
  })

  it('treats section titles before bullet lists as H2', () => {
    const blocks = parseFormattedText(`Requirements

- 2+ years of marketing experience
- Good communication skills

Nice to Have

Experience with Google Ads.`)

    expect(blocks[0]).toMatchObject({ kind: 'heading', level: 2 })
    expect(blocks[0].kind === 'heading' && blocks[0].html).toContain('Requirements')
    expect(blocks[1]).toMatchObject({ kind: 'list', ordered: false })
    expect(blocks[2]).toMatchObject({ kind: 'heading', level: 2 })
  })

  it('keeps website job-ad HTML lists (ul/li) instead of turning items into H2', () => {
    const html = `<div id="job-description-container">
      <h2>Description</h2>
      <p>We are looking for a Paid Media Executive.</p>
      <p><strong>About The Role</strong></p>
      <ul>
        <li>Manage and execute Instagram content calendars.</li>
        <li>Lead monthly content calendar briefings and execution with Brand teams to align on:</li>
        <li>New launch focuses</li>
        <li>Hero products</li>
        <li>Offers &amp; retail moments</li>
        <li>Collaborations (including influencer and media partnerships)</li>
        <li>Define key content pillars for upcoming launches.</li>
      </ul>
      <h2>Qualifications</h2>
      <p><strong role="heading" aria-level="3">What We Are Looking For:</strong></p>
      <ul type="disc">
        <li>Fluency in Arabic (spoken &amp; written)</li>
        <li>Degree (or equivalent) in Marketing, Media, Communications, or Digital</li>
        <li>Hands-on, detail-driven, highly organized, and collaborative</li>
      </ul>
    </div>`

    const blocks = parseFormattedText(html)
    expect(blocks.map((block) => block.kind)).toEqual([
      'heading',
      'paragraphs',
      'heading',
      'list',
      'heading',
      'paragraphs',
      'list',
    ])
    expect(blocks[0]).toMatchObject({ kind: 'heading', level: 2 })
    expect(blocks[2]).toMatchObject({ kind: 'heading', level: 2 })
    expect(blocks[2].kind === 'heading' && blocks[2].html).toContain('About The Role')
    expect(blocks[3]).toMatchObject({ kind: 'list', ordered: false })
    expect(blocks[3].kind === 'list' && blocks[3].items).toEqual([
      'Manage and execute Instagram content calendars.',
      'Lead monthly content calendar briefings and execution with Brand teams to align on:',
      'New launch focuses',
      'Hero products',
      'Offers &amp; retail moments',
      'Collaborations (including influencer and media partnerships)',
      'Define key content pillars for upcoming launches.',
    ])
    expect(blocks[5].kind === 'paragraphs' && blocks[5].html).toContain('What We Are Looking For:')
    expect(blocks[6].kind === 'list' && blocks[6].items).toHaveLength(3)
    expect(blocks[6].kind === 'list' && blocks[6].items[0]).toContain('Fluency in Arabic')
  })

  it('treats lost-bullet short lines after a colon lead-in as a list (plain paste)', () => {
    const blocks = parseFormattedText(`About The Role

Manage and execute Instagram content calendars across multiple brands including MAC Cosmetics.
Lead monthly content calendar briefings and execution with Brand teams to align on:
New launch focuses
Hero products
Offers & retail moments
Collaborations (including influencer and media partnerships)
Define key content pillars for upcoming launches and translate them into social-first executions.

Qualifications

What We Are Looking For:

Fluency in Arabic (spoken & written)
Degree (or equivalent) in Marketing, Media, Communications, or Digital
Hands-on, detail-driven, highly organized, and collaborative`)

    expect(blocks.map((block) => block.kind)).toEqual([
      'heading',
      'paragraphs',
      'list',
      'paragraphs',
      'heading',
      'paragraphs',
      'list',
    ])
    expect(blocks[0].kind === 'heading' && blocks[0].html).toContain('About The Role')
    expect(blocks[2].kind === 'list' && blocks[2].items).toEqual([
      'New launch focuses',
      'Hero products',
      'Offers &amp; retail moments',
      'Collaborations (including influencer and media partnerships)',
    ])
    expect(blocks[6].kind === 'list' && blocks[6].items).toEqual([
      'Fluency in Arabic (spoken &amp; written)',
      'Degree (or equivalent) in Marketing, Media, Communications, or Digital',
      'Hands-on, detail-driven, highly organized, and collaborative',
    ])
  })
})

describe('formattedTextToTipTapHtml', () => {
  it('converts Markdown job ads into TipTap headings and lists', () => {
    const html = formattedTextToTipTapHtml(`# Marketing Specialist

## About the Role

We need a creative **Marketing Specialist**.

### What You’ll Do

- Create social media content
- Manage marketing campaigns`)

    expect(html).toContain('<h1>Marketing Specialist</h1>')
    expect(html).toContain('<h2>About the Role</h2>')
    expect(html).toContain('<strong>Marketing Specialist</strong>')
    expect(html).toContain('<h3>What You’ll Do</h3>')
    expect(html).toContain('<ul>')
    expect(html).toContain('<li><p>Create social media content</p></li>')
    expect(html).not.toContain('# Marketing')
    expect(html).not.toContain('**Marketing')
  })

  it('maps H1 to H2 in TipTap HTML when disableH1 is true', () => {
    const html = formattedTextToTipTapHtml('# Title\n\nBody', {
      userSettings: { disableH1: true },
    } as PageBuilderConfig)
    expect(html).toContain('<h2>Title</h2>')
    expect(html).not.toContain('<h1>')
  })

  it('keeps HTML job-ad structure for TipTap', () => {
    const html = formattedTextToTipTapHtml(`<h1>Marketing Specialist</h1>
<h2>About the Role</h2>
<p>We are looking for a creative <strong>Marketing Specialist</strong>.</p>
<ul><li>Create social media content</li><li>Manage marketing campaigns</li></ul>`)

    expect(html).toContain('<h1>Marketing Specialist</h1>')
    expect(html).toContain('<strong>Marketing Specialist</strong>')
    expect(html).toContain('<li><p>Create social media content</p></li>')
  })
})

describe('shouldTransformFormattedTextPaste', () => {
  it('ignores short single-line pastes', () => {
    expect(shouldTransformFormattedTextPaste('hello')).toBe(false)
  })

  it('intercepts Markdown and multi-line job ads', () => {
    expect(shouldTransformFormattedTextPaste('# Title')).toBe(true)
    expect(shouldTransformFormattedTextPaste('- item one')).toBe(true)
    expect(shouldTransformFormattedTextPaste('Line one\n\nLine two')).toBe(true)
    expect(shouldTransformFormattedTextPaste('', '<h2>Role</h2><p>Body</p>')).toBe(true)
  })

  it('intercepts raw HTML source pasted as plain text', () => {
    expect(shouldTransformFormattedTextPaste('<h1>Marketing Specialist</h1>')).toBe(true)
    expect(
      shouldTransformFormattedTextPaste(
        '<h2>About the Role</h2><ul><li>Create social media content</li></ul>',
      ),
    ).toBe(true)
  })
})

describe('resolveFormattedTextPasteSource', () => {
  it('prefers plain HTML source over escaped browser text/html', () => {
    const plain = `<h1>Marketing Specialist</h1>

<h2>About the Role</h2>

<p>We are looking for a creative <strong>Marketing Specialist</strong>.</p>

<ul>
  <li>Create social media content</li>
  <li>Manage marketing campaigns</li>
</ul>`

    const rich =
      '<html><body><!--StartFragment--><span style="white-space:pre">&lt;h1&gt;Marketing Specialist&lt;/h1&gt;</span><!--EndFragment--></body></html>'

    expect(resolveFormattedTextPasteSource(plain, rich)).toBe(plain.trim())
    expect(formattedTextToTipTapHtml(resolveFormattedTextPasteSource(plain, rich))).toContain(
      '<h1>Marketing Specialist</h1>',
    )
    expect(formattedTextToTipTapHtml(resolveFormattedTextPasteSource(plain, rich))).toContain(
      '<li><p>Create social media content</p></li>',
    )
  })

  it('prefers real rich HTML when plain text has no tags', () => {
    const plain = 'Marketing Specialist\n\nAbout the Role'
    const rich = '<h1>Marketing Specialist</h1><h2>About the Role</h2>'
    expect(resolveFormattedTextPasteSource(plain, rich)).toBe(rich)
  })
})

describe('shouldCreatePageComponentsFromPaste', () => {
  it('uses page components for multi-block HTML job ads', () => {
    expect(
      shouldCreatePageComponentsFromPaste(`<h1>Marketing Specialist</h1>

<h2>About the Role</h2>

<p>We are looking for a creative <strong>Marketing Specialist</strong>.</p>`),
    ).toBe(true)
  })

  it('keeps single-block paste in TipTap', () => {
    expect(shouldCreatePageComponentsFromPaste('<p>Just one paragraph.</p>')).toBe(false)
    expect(shouldCreatePageComponentsFromPaste('# Only a title')).toBe(false)
  })
})

describe('formatAddedBlocksMessage', () => {
  const translate = (key: string) => key

  it('formats singular and plural toasts', () => {
    expect(formatAddedBlocksMessage(translate, 1)).toBe('Added 1 block to the page')
    expect(formatAddedBlocksMessage(translate, 12)).toBe('Added 12 blocks to the page')
    expect(formatAddedBlocksMessage(translate, 12, { replacedPage: true })).toBe(
      'Page replaced with 12 blocks',
    )
  })
})

describe('buildComponentsFromFormattedText', () => {
  it('builds Header H2 and Text helpers from a job ad', () => {
    const components = buildComponentsFromFormattedText(JOB_AD)
    expect(components.map((component) => component.title)).toEqual([
      'Header H2',
      'Text',
      'Header H2',
      'Text',
    ])
    expect(components[0].html_code).toContain('<h2>')
    expect(components[0].html_code).toContain('Team Leadership')
    expect(components[1].html_code).toContain('<p>Recruit')
    expect(components[1].html_code).not.toContain('Start customizing')
  })

  it('maps H1 to H2 when disableH1 is true', () => {
    const components = buildComponentsFromFormattedText('<h1>Page title</h1><p>Body copy.</p>', {
      userSettings: { disableH1: true },
    } as PageBuilderConfig)
    expect(components[0].title).toBe('Header H2')
    expect(components[0].html_code).toContain('<h2>')
    expect(components[0].html_code).not.toContain('<h1>')
  })

  it('maps Markdown # headings to H2 when disableH1 is true', () => {
    const components = buildComponentsFromFormattedText('# Page title\n\nBody copy.', {
      userSettings: { disableH1: true },
    } as PageBuilderConfig)
    expect(components[0].title).toBe('Header H2')
    expect(components[0].html_code).toContain('<h2>')
    expect(components[0].html_code).toContain('Page title')
    expect(components[0].html_code).not.toContain('# Page')
  })
})
