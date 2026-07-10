// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick } from 'vue'
import ProductPickerPanel from '../../Components/PageBuilder/ProductPicker/ProductPickerPanel.vue'
import { setBuilderInstance } from '../../composables/usePageBuilder'
import type { PageBuilderProduct } from '../../types'

async function mountProductPicker(products: PageBuilderProduct[]) {
  const container = document.createElement('div')
  document.body.appendChild(container)

  const app = createApp(
    defineComponent({
      render() {
        return h(ProductPickerPanel, { products })
      },
    }),
  )

  app.mount(container)
  await nextTick()

  return {
    app,
    container,
    unmount() {
      app.unmount()
      container.remove()
    },
  }
}

describe('ProductPickerPanel regressions', () => {
  beforeEach(() => {
    setBuilderInstance({
      insertProducts: vi.fn().mockResolvedValue(undefined),
    } as never)
  })

  it('always shows product section settings groups, even with minimal product data', async () => {
    const minimalProducts: PageBuilderProduct[] = [{ id: 'p1', title: 'Minimal product' }]

    const mounted = await mountProductPicker(minimalProducts)
    const text = mounted.container.textContent || ''

    expect(text).toContain('Card content')
    expect(text).toContain('Hide prices')
    expect(text).toContain('Hide buy button')
    expect(text).toContain('Product links')
    expect(text).toContain('Open in new tab')
    expect(text).toContain('Product images')
    expect(text).toContain('Hide images')
    expect(text).toContain('Rounded images')

    mounted.unmount()
  })

  it('renders mobile selected-product editable fields after selecting a product', async () => {
    const products: PageBuilderProduct[] = [
      {
        id: 'p2',
        title: 'Selectable Product',
        image: 'https://example.com/product.jpg',
      },
    ]

    const mounted = await mountProductPicker(products)

    const productCards = mounted.container.querySelectorAll('button.pbx-group[aria-pressed]')
    expect(productCards.length).toBeGreaterThan(0)
    ;(productCards[0] as HTMLButtonElement).click()
    await nextTick()
    await nextTick()

    expect(mounted.container.querySelector('#pbx-mobile-selected-product-0-title')).not.toBeNull()
    expect(
      mounted.container.querySelector('#pbx-mobile-selected-product-0-description'),
    ).not.toBeNull()
    expect(
      mounted.container.querySelector('#pbx-mobile-selected-product-0-old-price'),
    ).not.toBeNull()
    expect(mounted.container.querySelector('#pbx-mobile-selected-product-0-tag')).not.toBeNull()

    // These are conditional in the UI and should be present by default.
    const newPriceField = mounted.container.querySelector(
      '#pbx-mobile-selected-product-0-new-price',
    )
    const buttonTextField = mounted.container.querySelector(
      '#pbx-mobile-selected-product-0-button-text',
    )
    expect(newPriceField || buttonTextField).not.toBeNull()

    mounted.unmount()
  })

  it('requires link by default and shows hide-links toggle in settings', async () => {
    const products: PageBuilderProduct[] = [
      {
        id: 'p3',
        title: 'No Link Product',
      },
    ]

    const mounted = await mountProductPicker(products)

    const productCards = mounted.container.querySelectorAll('button.pbx-group[aria-pressed]')
    expect(productCards.length).toBeGreaterThan(0)
    ;(productCards[0] as HTMLButtonElement).click()
    await nextTick()

    expect(mounted.container.querySelector('#pbx-selected-product-0-url')).not.toBeNull()
    expect(mounted.container.textContent || '').toContain('Link is required')

    expect(mounted.container.textContent || '').toContain('Hide product links')

    mounted.unmount()
  })
})
