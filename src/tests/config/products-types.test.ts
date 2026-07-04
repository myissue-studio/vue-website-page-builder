import { describe, expect, it } from 'vitest'
import type {
  InsertProductsOptions,
  PageBuilderProduct,
  PageBuilderProductInput,
} from '../../types'

/**
 * Product API types should be as forgiving as PageBuilderConfig —
 * especially when consumers assign pre-typed variables from their storefront API.
 */
describe('Product types flexibility', () => {
  it('accepts minimal product with only title', () => {
    const product: PageBuilderProductInput = { title: 'Ring' }
    expect(product.title).toBe('Ring')
  })

  it('accepts products from a host API interface without index signature', () => {
    interface ShopApiProduct {
      uuid: string
      name: string
      formattedPrice: string
      thumbnail: string
      slug: string
    }

    const apiRows: ShopApiProduct[] = [
      {
        uuid: 'p-1',
        name: 'Gold Ring',
        formattedPrice: '$420',
        thumbnail: 'https://cdn.example/ring.jpg',
        slug: 'gold-ring',
      },
    ]

    const selected: PageBuilderProductInput[] = apiRows.map((row) => ({
      id: row.uuid,
      title: row.name,
      price: row.formattedPrice,
      image: row.thumbnail,
      url: `/shop/${row.slug}`,
    }))

    expect(selected).toHaveLength(1)
    expect(selected[0]?.title).toBe('Gold Ring')
  })

  it('accepts assigning a typed API row when fields are structurally compatible', () => {
    interface CatalogItem {
      id: string
      title: string
      price: number
      category: string
    }

    const item: CatalogItem = {
      id: 'fs-101',
      title: 'Ivory Linen Set',
      price: 185,
      category: 'Fashion',
    }

    const product: PageBuilderProductInput = item
    expect(product.id).toBe('fs-101')
    expect(product.price).toBe(185)
  })

  it('accepts readonly product arrays from as const configs', () => {
    const products = [
      { id: 'a', title: 'A', price: '$10' },
      { id: 'b', title: 'B', price: '$20' },
    ] as const

    const typed: ReadonlyArray<PageBuilderProductInput> = products
    expect(typed).toHaveLength(2)
  })

  it('accepts insert options with dynamic layout string', () => {
    const columns: number = 3
    const layout = columns === 1 ? 'grid-1' : columns === 2 ? 'grid-2' : 'grid-3'

    const options: InsertProductsOptions = {
      layout,
      cardStyle: 'bordered',
      roundedImages: true,
      method: 'insert',
    }

    expect(options.layout).toBe('grid-3')
  })

  it('accepts insert options from variables without as const', () => {
    const cardStyle = 'elevated'
    const method = 'unshift'

    const options: InsertProductsOptions = { cardStyle, method }
    expect(options.cardStyle).toBe('elevated')
  })

  it('accepts custom fields on PageBuilderProduct via index signature', () => {
    const product: PageBuilderProduct = {
      id: 'x',
      title: 'Custom',
      rating: 4.8,
      variantId: 'var-99',
    }
    expect(product.rating).toBe(4.8)
  })

  it('accepts spread objects when building a selection basket', () => {
    const base = { id: '1', title: 'Base', price: '$10' }
    const extra = { badge: 'Sale', buttonText: 'Buy' }
    const product: PageBuilderProductInput = { ...base, ...extra }
    expect(product.badge).toBe('Sale')
  })

  it('replicates a typical YourDisplayProducts insert call', () => {
    interface StorefrontProduct {
      id: number
      name: string
      sale_price: string | null
      image_url: string
    }

    const selectedFromApi: StorefrontProduct[] = [
      { id: 42, name: 'Noir Dress', sale_price: '$245', image_url: 'https://cdn/x.jpg' },
    ]

    const layout = 'grid-3'
    const cardStyle = 'bordered'

    const products: PageBuilderProductInput[] = selectedFromApi.map((row) => ({
      id: row.id,
      title: row.name,
      price: row.sale_price ?? undefined,
      image: row.image_url,
      buttonText: 'View product',
    }))

    const options: InsertProductsOptions = {
      layout,
      cardStyle,
      roundedImages: false,
      sectionTitle: 'Shop',
    }

    expect(products[0]?.title).toBe('Noir Dress')
    expect(options.layout).toBe('grid-3')
  })
})
