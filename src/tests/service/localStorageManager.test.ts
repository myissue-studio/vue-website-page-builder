// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import { LocalStorageManager } from '../../services/LocalStorageManager'

describe('LocalStorageManager history', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('does not add duplicate undo states when only the saved timestamp changes', () => {
    const firstSnapshot = {
      components: [{ title: 'Text', html_code: '<section><p>Hello</p></section>' }],
      pageBuilderContentSavedAt: '2026-01-01T00:00:00.000Z',
      pageSettings: { classes: '', style: '' },
    }
    const timestampOnlySnapshot = {
      ...firstSnapshot,
      pageBuilderContentSavedAt: '2026-01-01T00:00:01.000Z',
    }

    LocalStorageManager.addToHistory('page', firstSnapshot)
    const history = LocalStorageManager.addToHistory('page', timestampOnlySnapshot)

    expect(history).toHaveLength(1)
    expect(LocalStorageManager.getHistory('page')).toHaveLength(1)
  })

  it('does not add duplicate undo states when pageSettings classes only differ by token order', () => {
    LocalStorageManager.addToHistory('page', {
      components: [{ title: 'Text', html_code: '<section><p>Hello</p></section>' }],
      pageSettings: { classes: 'pbx-bg-white pbx-font-jost', style: '' },
    })
    const history = LocalStorageManager.addToHistory('page', {
      components: [{ title: 'Text', html_code: '<section><p>Hello</p></section>' }],
      pageSettings: { classes: 'pbx-font-jost pbx-bg-white', style: '  ' },
    })

    expect(history).toHaveLength(1)
  })

  it('adds real content changes and truncates redo history from the current index', () => {
    LocalStorageManager.addToHistory('page', {
      components: [{ title: 'Text', html_code: '<section><p>One</p></section>' }],
      pageSettings: { classes: '', style: '' },
    })
    LocalStorageManager.addToHistory('page', {
      components: [{ title: 'Text', html_code: '<section><p>Two</p></section>' }],
      pageSettings: { classes: '', style: '' },
    })
    LocalStorageManager.addToHistory('page', {
      components: [{ title: 'Text', html_code: '<section><p>Three</p></section>' }],
      pageSettings: { classes: '', style: '' },
    })

    const history = LocalStorageManager.addToHistory(
      'page',
      {
        components: [{ title: 'Text', html_code: '<section><p>New branch</p></section>' }],
        pageSettings: { classes: '', style: '' },
      },
      1,
    )

    expect(history).toHaveLength(3)
    expect(JSON.stringify(history)).not.toContain('Three')
    expect(JSON.stringify(history)).toContain('New branch')
  })

  it('keeps at most 20 history states', () => {
    for (let index = 0; index < 25; index += 1) {
      LocalStorageManager.addToHistory('page', {
        components: [{ title: 'Text', html_code: `<section><p>${index}</p></section>` }],
        pageSettings: { classes: '', style: '' },
      })
    }

    const history = LocalStorageManager.getHistory('page')

    expect(history).toHaveLength(20)
    expect(JSON.stringify(history)).not.toContain('<p>0</p>')
    expect(JSON.stringify(history)).toContain('<p>24</p>')
  })

  it('REGRESSION (first edit): seeding baseline then next state leaves an undo target', () => {
    const baseline = {
      components: [{ title: 'Text', html_code: '<section><p>Before</p></section>' }],
      pageSettings: { classes: '', style: '' },
    }
    const next = {
      components: [{ title: 'Text', html_code: '<section><p>After</p></section>' }],
      pageSettings: { classes: '', style: '' },
    }

    // Mimic PageBuilderService first-undoable-save: empty history → seed previous draft.
    expect(LocalStorageManager.getHistory('page')).toHaveLength(0)
    LocalStorageManager.addToHistory('page', baseline)
    const history = LocalStorageManager.addToHistory('page', next)

    expect(history).toHaveLength(2)
    expect(JSON.stringify(history[0])).toContain('Before')
    expect(JSON.stringify(history[1])).toContain('After')
  })
})
