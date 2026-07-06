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
    expect(html).toContain('product-card-title text-lg font-semibold text-gray-900')
    expect(html).toContain('product-card-description text-sm text-gray-600')
    expect(html).toContain('product-card-badge text-xs')
    expect(html).toContain('product-card-price text-2xl font-semibold text-gray-900')
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

  it('applies bordered card style and rounded images', () => {
    const html = buildProductSectionHtml(sample, 'grid-3', 'Products', {
      cardStyle: 'bordered',
      roundedImages: true,
    })
    expect(html).toContain('rounded-2xl border border-solid border-gray-200')
    expect(html).toContain('rounded-xl overflow-hidden')
    expect(html).toContain('data-pbx-product-layout="grid-3"')
    expect(html).toContain('data-pbx-product-grid="true"')
  })

  it('uses two columns on mobile when mobileColumns is 2', () => {
    const html = buildProductSectionHtml(sample, 'grid-4', 'Products', {
      mobileColumns: 2,
    })
    expect(html).toContain('grid-cols-2 sm:grid-cols-2 lg:grid-cols-4')
    expect(html).toContain('data-pbx-product-mobile-cols="2"')
  })

  it('uses six columns at large breakpoints for grid-6 layout', () => {
    const html = buildProductSectionHtml(sample, 'grid-6')
    expect(html).toContain('lg:grid-cols-6')
    expect(html).not.toContain('md:grid-cols-3')
    expect(html).toContain('data-pbx-product-layout="grid-6"')
  })

  it('adds target="_blank" to product links when openInNewTab is true', () => {
    const html = buildProductSectionHtml(sample, 'grid-3', 'Products', {
      openInNewTab: true,
    })
    expect(html).toContain('data-pbx-product-open-in-new-tab="true"')
    expect(html).toContain('target="_blank" rel="noopener noreferrer"')
    expect(html.match(/target="_blank"/g)?.length).toBe(3)
  })

  it('omits target="_blank" when openInNewTab is false', () => {
    const html = buildProductSectionHtml(sample, 'grid-3', 'Products', {
      openInNewTab: false,
    })
    expect(html).toContain('data-pbx-product-open-in-new-tab="false"')
    expect(html).not.toContain('target="_blank"')
  })

  it('hides price row when hidePrice is true', () => {
    const html = buildProductSectionHtml(sample, 'grid-3', 'Products', {
      hidePrice: true,
    })
    expect(html).toContain('data-pbx-product-hide-price="true"')
    expect(html).toContain('product-card-price-row flex flex-wrap items-baseline gap-2 pt-2 hidden')
    expect(html).toContain('$10')
  })

  it('hides image when hideImage is true', () => {
    const html = buildProductSectionHtml(sample, 'grid-3', 'Products', {
      hideImage: true,
    })
    expect(html).toContain('data-pbx-product-hide-image="true"')
    expect(html).toContain('product-card-image shrink-0 hidden')
    expect(html).toContain('https://example.com/a.jpg')
  })

  it('hides CTA when hideButton is true', () => {
    const html = buildProductSectionHtml(sample, 'grid-3', 'Products', {
      hideButton: true,
    })
    expect(html).toContain('data-pbx-product-hide-button="true"')
    expect(html).toContain('product-card-cta text-sm font-semibold text-myPrimaryLinkColor pt-3 hidden')
    expect(html).toContain('Buy')
  })
})
