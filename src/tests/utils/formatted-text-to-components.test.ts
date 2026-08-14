// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import type { PageBuilderConfig } from '../../types'
import {
  buildComponentsFromFormattedText,
  parseFormattedText,
} from '../../utils/builder/formatted-text-to-components'

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
