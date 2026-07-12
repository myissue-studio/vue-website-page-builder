// @vitest-environment jsdom
import { describe, expect, it, afterEach } from 'vitest'
import { shouldPreserveInlineEditorForToolbarPopover } from '../../utils/builder/should-preserve-inline-editor-for-toolbar-popover'

describe('shouldPreserveInlineEditorForToolbarPopover', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('does not preserve TipTap for the right style sidebar (styles must commit first)', () => {
    const sidebar = document.createElement('aside')
    sidebar.id = 'pagebuilder-right-menu'
    const btn = document.createElement('button')
    btn.type = 'button'
    sidebar.appendChild(btn)
    document.body.appendChild(sidebar)

    expect(shouldPreserveInlineEditorForToolbarPopover(btn)).toBe(false)
  })

  it('preserves TipTap for the floating edit toolbar', () => {
    const toolbar = document.createElement('div')
    toolbar.id = 'pbxEditToolbar'
    const btn = document.createElement('button')
    toolbar.appendChild(btn)
    document.body.appendChild(toolbar)

    expect(shouldPreserveInlineEditorForToolbarPopover(btn)).toBe(true)
  })

  it('does not preserve TipTap for plain canvas clicks', () => {
    const pagebuilder = document.createElement('div')
    pagebuilder.id = 'pagebuilder'
    const el = document.createElement('div')
    pagebuilder.appendChild(el)
    document.body.appendChild(pagebuilder)

    expect(shouldPreserveInlineEditorForToolbarPopover(el)).toBe(false)
  })
})
