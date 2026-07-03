import { describe, expect, it } from 'vitest'
import { formatHtml, prettifyHtml } from '../../utils/builder/prettify-html'

describe('formatHtml', () => {
  it('formats minified element html with indentation', () => {
    const input =
      '<div class="pbx-py-4"><div class="pbx-mx-auto"><div class="pbx-break-words"><h2>Demo Content</h2></div></div></div>'
    const result = formatHtml(input)

    expect(result).toContain('<div class="pbx-py-4">')
    expect(result).toContain('  <div class="pbx-mx-auto">')
    expect(result).toContain('      <h2>')
    expect(result).toContain('        Demo Content')
    expect(result.split('\n').length).toBeGreaterThan(3)
  })
})

describe('prettifyHtml', () => {
  it('splits minified tags onto separate lines', () => {
    const result = prettifyHtml('<div><p>Hi</p></div>')

    expect(result).toContain('html-tag-name')
    expect(result.split('\n').length).toBeGreaterThan(3)
  })

  it('highlights closing tags correctly', () => {
    const result = prettifyHtml('<section></section>')

    expect(result).toContain('&lt;/</span><span class="html-tag-name">section</span>')
  })

  it('highlights attributes on tags', () => {
    const result = prettifyHtml('<div id="pagebuilder"></div>')

    expect(result).toContain('html-attribute-name">id</span>')
    expect(result).toContain('html-attribute-value">&quot;pagebuilder&quot;</span>')
  })
})
