import { describe, expect, it } from 'vitest'
import { extractClassesFromHtml } from '../../utils/builder/extract-classes-from-html'

describe('extractClassesFromHtml', () => {
  it('returns classes from the root element class attribute', () => {
    const html =
      '<section class="pbx-py-8 pbx-px-4 pbx-bg-black"><div>Content</div></section>'

    expect(extractClassesFromHtml(html)).toEqual([
      'pbx-py-8',
      'pbx-px-4',
      'pbx-bg-black',
    ])
  })

  it('returns an empty array when no class attribute is present', () => {
    expect(extractClassesFromHtml('<section><div>Content</div></section>')).toEqual([])
    expect(extractClassesFromHtml('')).toEqual([])
  })
})
