// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import {
  buildHistoryHint,
  describeHistoryChange,
  formatHistoryRelativeTime,
  formatHistorySectionCount,
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

  it('describes section and content changes vs previous snapshot', () => {
    const previous = {
      components: [{ title: 'Hero', html_code: '<section><p>One</p></section>' }],
      pageSettings: { classes: '', style: '' },
    }
    const added = {
      components: [
        { title: 'Hero', html_code: '<section><p>One</p></section>' },
        { title: 'CTA', html_code: '<section><p>Two</p></section>' },
      ],
      pageSettings: { classes: '', style: '' },
    }
    const textUpdated = {
      components: [{ title: 'Hero', html_code: '<section><p>Changed</p></section>' }],
      pageSettings: { classes: '', style: '' },
    }
    const stylesUpdated = {
      components: [{ title: 'Hero', html_code: '<section><p>One</p></section>' }],
      pageSettings: { classes: 'pbx-bg-rose-400', style: '' },
    }

    expect(describeHistoryChange(added, previous, translate)).toBe('+1 section')
    expect(describeHistoryChange(textUpdated, previous, translate)).toBe('Text updated')
    expect(describeHistoryChange(stylesUpdated, previous, translate)).toBe('Page styles')
    expect(describeHistoryChange(previous, null, translate)).toBe('Starting point')
  })

  it('builds a combined hint line', () => {
    const now = new Date(2026, 6, 18, 16, 30, 0)
    const previous = {
      components: [{ title: 'Hero', html_code: '<section><p>One</p></section>' }],
      pageSettings: { classes: '', style: '', meta: { title: '' } },
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
  })
})
