// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import {
  buildHistoryHint,
  buildHistoryHintParts,
  describeHistoryChange,
  formatHistoryRelativeTime,
  formatHistorySectionCount,
  getHistoryChangePreview,
  getHistoryPageTitle,
} from '../../utils/builder/history-snapshot-summary'

const translate = (key: string) => key

describe('history-snapshot-summary', () => {
  it('reads page title from meta when set', () => {
    expect(
      getHistoryPageTitle({
        pageSettings: { meta: { title: '  Landing  ' } },
      }),
    ).toBe('Landing')
    expect(getHistoryPageTitle({ pageSettings: { meta: { title: '' } } })).toBe('')
  })

  it('formats section counts', () => {
    expect(formatHistorySectionCount(1, translate)).toBe('1 section')
    expect(formatHistorySectionCount(11, translate)).toBe('11 sections')
  })

  it('formats relative time for recent and today snapshots', () => {
    const now = new Date(2026, 6, 18, 16, 30, 0)
    const twoMinutesAgo = new Date(2026, 6, 18, 16, 28, 0)
    const earlierToday = new Date(2026, 6, 18, 10, 15, 0)

    expect(formatHistoryRelativeTime(twoMinutesAgo.toISOString(), translate, now)).toContain(
      'ago',
    )
    expect(formatHistoryRelativeTime(earlierToday.toISOString(), translate, now)).toBe(
      'Today · 10:15',
    )
  })

  it('describes section, text, image, and combined changes', () => {
    const previous = {
      components: [
        {
          title: 'Hero',
          html_code: '<section><p>One</p><img src="a.jpg" /></section>',
        },
      ],
      pageSettings: { classes: '', style: '' },
    }
    const added = {
      components: [
        {
          title: 'Hero',
          html_code: '<section><p>One</p><img src="a.jpg" /></section>',
        },
        { title: 'CTA', html_code: '<section><p>Two</p></section>' },
      ],
      pageSettings: { classes: '', style: '' },
    }
    const textUpdated = {
      components: [
        {
          title: 'Hero',
          html_code: '<section><p>Changed</p><img src="a.jpg" /></section>',
        },
      ],
      pageSettings: { classes: '', style: '' },
    }
    const imageUpdated = {
      components: [
        {
          title: 'Hero',
          html_code: '<section><p>One</p><img src="b.jpg" /></section>',
        },
      ],
      pageSettings: { classes: '', style: '' },
    }
    const textAndImage = {
      components: [
        {
          title: 'Hero',
          html_code: '<section><p>Changed</p><img src="b.jpg" /></section>',
        },
      ],
      pageSettings: { classes: '', style: '' },
    }
    const stylesUpdated = {
      components: [
        {
          title: 'Hero',
          html_code: '<section><p>One</p><img src="a.jpg" /></section>',
        },
      ],
      pageSettings: { classes: 'pbx-bg-rose-400', style: '' },
    }

    expect(describeHistoryChange(added, previous, translate)).toBe('+1 section')
    expect(describeHistoryChange(textUpdated, previous, translate)).toBe('Text updated')
    expect(describeHistoryChange(imageUpdated, previous, translate)).toBe('Image updated')
    expect(describeHistoryChange(textAndImage, previous, translate)).toBe(
      'Image updated · Text updated',
    )
    expect(describeHistoryChange(stylesUpdated, previous, translate)).toBe('Page styles')
    expect(describeHistoryChange(previous, null, translate)).toBe('Starting point')
  })

  it('builds a short text preview from the first changed section', () => {
    const previous = {
      components: [{ title: 'Hero', html_code: '<section><p>One</p></section>' }],
    }
    const current = {
      components: [
        {
          title: 'Hero',
          html_code: '<section><p>Layouts and Visuals for the landing page hero</p></section>',
        },
      ],
    }

    expect(getHistoryChangePreview(current, previous)).toBe(
      'Layouts and Visuals for the landing page…',
    )
  })

  it('builds a combined hint line with preview', () => {
    const now = new Date(2026, 6, 18, 16, 30, 0)
    const previous = {
      components: [{ title: 'Hero', html_code: '<section><p>One</p></section>' }],
      pageSettings: { classes: '', style: '', meta: { title: 'Demo' } },
      pageBuilderContentSavedAt: new Date(2026, 6, 18, 16, 0, 0).toISOString(),
    }
    const current = {
      components: [{ title: 'Hero', html_code: '<section><p>Two</p></section>' }],
      pageSettings: { classes: '', style: '', meta: { title: 'Demo' } },
      pageBuilderContentSavedAt: new Date(2026, 6, 18, 16, 28, 0).toISOString(),
    }

    const hint = buildHistoryHint(current, previous, translate, now)
    expect(hint).toContain('ago')
    expect(hint).toContain('1 section')
    expect(hint).toContain('Text updated')
    expect(hint).toContain('“Two”')

    const parts = buildHistoryHintParts(current, previous, translate, now)
    expect(parts.meta).toContain('ago')
    expect(parts.meta).toContain('1 section')
    expect(parts.change).toBe('Text updated')
    expect(parts.preview).toBe('Two')
  })
})
