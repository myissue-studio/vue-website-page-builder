import { describe, expect, it } from 'vitest'
import { buildProductSectionHtml } from '../../utils/builder/product-section-html'
import type { PageBuilderProduct } from '../../types'

describe('buildProductSectionHtml', () => {
  const sample: PageBuilderProduct[] = [
    {
      id: 'p1',
      title: 'Test Product',
      price: '$10',
      compareAtPrice: '$15',
      badge: 'Sale',
      description: 'Short description',
      image: 'https://example.com/a.jpg',
      url: '/p1',
      buttonText: 'Buy',
    },
  ]

  it('renders wrapper divs with typography classes for each product field', () => {
    const html = buildProductSectionHtml(sample, 'grid-3')
    expect(html).toContain('data-pbx-product-section="true"')
    expect(html).toContain('data-pbx-product-id="p1"')
    expect(html).toContain('product-card-title text-lg font-semibold')
    expect(html).toContain('product-card-description text-sm text-gray-600')
    expect(html).toContain('product-card-badge text-xs')
    expect(html).toContain('product-card-price text-2xl font-semibold')
    expect(html).toContain('product-card-compare text-sm line-through')
    expect(html).toContain('product-card-footer mt-auto')
    expect(html).toContain('product-card-meta flex flex-col flex-1')
    expect(html).toContain('items-stretch')
    expect(html).not.toContain('<p class="font-semibold">')
    expect(html).toContain('Test Product')
    expect(html).toContain('$10')
    expect(html).toContain('href="/p1"')
    expect(html).toContain('Buy')
  })

  it('omits price when not provided', () => {
    const html = buildProductSectionHtml([{ id: 'x', title: 'No price' }], 'grid-2')
    expect(html).toContain('No price')
    expect(html).not.toContain('product-card-price')
  })

  it('escapes HTML in product text', () => {
    const html = buildProductSectionHtml(
      [{ id: 'x', title: '<script>alert(1)</script>' }],
      'grid-3',
    )
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
  })
})
