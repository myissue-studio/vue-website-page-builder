// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  PAGE_BUILDER_BRAND_COLOR_RGB_VAR,
  PAGE_BUILDER_BUTTON_COLOR_RGB_VAR,
  PAGE_BUILDER_BUTTON_TEXT_COLOR_RGB_VAR,
  applyPageBuilderBrandColor,
  applyPageBuilderButtonColor,
  applyPageBuilderButtonTextColor,
  clearPageBuilderBrandColor,
  clearPageBuilderButtonColor,
  clearPageBuilderButtonTextColor,
} from '../../utils/builder/apply-brand-color'
import {
  buildStandaloneHtml,
  collectDocumentStyles,
  collectPageBuilderThemeColorStyle,
  downloadStandaloneHtml,
  extractStandalonePageContent,
} from '../../utils/builder/standalone-html'

describe('standalone HTML', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    document.body.innerHTML = ''
    clearPageBuilderBrandColor()
    clearPageBuilderButtonColor()
    clearPageBuilderButtonTextColor()
  })

  it('collects inline and linked document styles', () => {
    document.head.innerHTML = `
      <style>.example { color: red; }</style>
      <link rel="stylesheet" href="/theme.css">
    `

    const styles = collectDocumentStyles(document)
    expect(styles).toContain('.example { color: red; }')
    expect(styles).toContain(new URL('/theme.css', document.baseURI).href)
  })

  it('exports applied brand and button color CSS variables for standalone pages', () => {
    applyPageBuilderBrandColor('#000000')
    applyPageBuilderButtonColor('#004642', '#000000')
    applyPageBuilderButtonTextColor('#29eaa5')

    const themeStyle = collectPageBuilderThemeColorStyle(document)
    expect(themeStyle).toContain(`${PAGE_BUILDER_BRAND_COLOR_RGB_VAR}: 0 0 0`)
    expect(themeStyle).toContain(`${PAGE_BUILDER_BUTTON_COLOR_RGB_VAR}: 0 70 66`)
    expect(themeStyle).toContain(`${PAGE_BUILDER_BUTTON_TEXT_COLOR_RGB_VAR}: 41 234 165`)

    const html = buildStandaloneHtml('<section>Hello</section>', document)
    expect(html).toContain(`${PAGE_BUILDER_BUTTON_COLOR_RGB_VAR}: 0 70 66`)
    expect(html).toContain(`${PAGE_BUILDER_BUTTON_TEXT_COLOR_RGB_VAR}: 41 234 165`)
  })

  it('omits theme color style when no brand/button vars are set', () => {
    expect(collectPageBuilderThemeColorStyle(document)).toBe('')
  })

  it('removes editor-only state and produces a standalone document', () => {
    document.body.innerHTML = `
      <div id="pagebuilder">
        <section data-componentid="hero" selected hovered>Hello</section>
        <div data-pbx-insert-btn>Insert</div>
      </div>
    `
    const pagebuilder = document.getElementById('pagebuilder') as HTMLElement
    const content = extractStandalonePageContent(pagebuilder)
    const html = buildStandaloneHtml(content, document, 'A <Page>')

    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('<title>A &lt;Page&gt;</title>')
    expect(html).toContain('Hello')
    expect(html).not.toContain('selected')
    expect(html).not.toContain('hovered')
    expect(html).not.toContain('data-componentid')
    expect(html).not.toContain('Insert')
  })

  it('downloads the supplied standalone document', () => {
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    downloadStandaloneHtml('page.html', '<html>Page</html>', document)

    expect(click).toHaveBeenCalledOnce()
    expect(document.querySelector('a')).toBeNull()
  })
})
