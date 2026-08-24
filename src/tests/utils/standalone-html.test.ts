// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  buildStandaloneHtml,
  collectDocumentStyles,
  downloadStandaloneHtml,
  extractStandalonePageContent,
} from '../../utils/builder/standalone-html'

describe('standalone HTML', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    document.body.innerHTML = ''
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
