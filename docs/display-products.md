## Display Products (Ecommerce)

The Page Builder does not ship a storefront, cart, or checkout. It gives you a **flexible hook** to connect your own product catalog and insert product sections into the canvas — the same pattern as `:CustomMediaLibraryComponent`.

This is intentional:

- Different businesses show different fields (price, SKU, badges, ratings, variants, etc.)
- Some sites list products without prices (B2B, quote-only, catalogs)
- Checkout belongs on **your** backend or ecommerce platform (Shopify, WooCommerce, Medusa, custom API)

## Why not WooCommerce-style shortcodes?

Shortcodes like `[featured_products]` or `[sale_products]` are convenient but rigid. They force one layout and one data shape. Host apps with custom APIs or design systems need more control.

The `:DisplayProducts` prop keeps the builder **layout-agnostic**: you own the picker UI and the HTML that lands on the page.

## Quick setup

Create a folder for your integration components:

```
your-project/
├── src/
│   └── ComponentsPageBuilder/
│       └── YourDisplayProducts.vue
```

Pass your component to the builder:

```vue
<script setup>
import PageBuilder from '@myissue/vue-website-page-builder'
import YourDisplayProducts from './ComponentsPageBuilder/YourDisplayProducts.vue'
</script>

<template>
  <PageBuilder :DisplayProducts="YourDisplayProducts" />
</template>
```

When `:DisplayProducts` is provided, a **Products** button appears in the navbar (next to **Add**). It opens your component inside a modal — separate from the component library and from `:CustomBuilderComponents`.

## Your product picker component

Design the modal however you want: API search, categories, Shopify sync, ERP feed, etc.

When the user confirms a selection, call one of these APIs:

### Option A — Built-in grid layouts (optional helper)

Use `insertProducts()` when you want quick 1/2/3/4/6-column grids without hand-writing HTML:

```vue
<script setup>
import {
  getPageBuilder,
  usePageBuilderModal,
  type PageBuilderProduct,
} from '@myissue/vue-website-page-builder'

const pageBuilderService = getPageBuilder()
const { closeProductLibraryModal } = usePageBuilderModal()

async function insertFromApi(products: PageBuilderProduct[]) {
  await pageBuilderService.insertProducts(products, {
    layout: 'grid-3',
    method: 'unshift',
    sectionTitle: 'Shop',
  })
  closeProductLibraryModal()
}
</script>
```

Only fields you provide are rendered. All fields on `PageBuilderProduct` are optional.

### Option B — Fully custom HTML (maximum flexibility)

Call `insertProductHtml()` with any markup you generate:

```vue
<script setup>
import { getPageBuilder, usePageBuilderModal } from '@myissue/vue-website-page-builder'

const pageBuilderService = getPageBuilder()
const { closeProductLibraryModal } = usePageBuilderModal()

async function insertCustomSection(html: string) {
  await pageBuilderService.insertProductHtml(html, 'Featured products')
  closeProductLibraryModal()
}
</script>
```

After insertion, users can still edit text, images, and styles visually in the builder — same as any other section.

## Product data shape

There is no required backend response format. Map your API to `PageBuilderProduct`:

```ts
interface PageBuilderProduct {
  id?: string | number
  title?: string
  description?: string
  image?: string
  imageAlt?: string
  price?: string | number
  compareAtPrice?: string | number
  badge?: string
  url?: string        // product or checkout URL on your site
  buttonText?: string
  sku?: string
  [key: string]: unknown  // custom fields for your templates
}
```

Example mapping from a REST API:

```ts
function mapApiProduct(row: YourApiProduct): PageBuilderProduct {
  return {
    id: row.uuid,
    title: row.name,
    description: row.summary,
    image: row.thumbnail_url,
    price: row.formatted_price, // or omit if not shown
    url: `/shop/${row.slug}`,
    buttonText: 'View product',
  }
}
```

Inserted sections include `data-pbx-product-section` and `data-pbx-product-id` attributes so your published site can optionally hydrate or track products.

## Relationship to other props

| Prop | Purpose |
|------|---------|
| `:CustomBuilderComponents` | Extra **layout blocks** in the Add modal (heroes, grids, etc.) |
| `:DisplayProducts` | **Catalog picker** — browse real products and insert product sections |
| Built-in components | Default blocks when `CustomBuilderComponents` is omitted |

These do not conflict:

- **Add** → structural/page blocks
- **Products** → catalog-driven sections (only when `:DisplayProducts` is set)

You can use image + text blocks manually for products, or use `:DisplayProducts` when you want live catalog integration.

## Buy / checkout flow

The builder outputs links (`url`, buttons) in HTML. **Purchasing** is handled outside the package:

- Link to your product detail page
- Link to `/cart?add=SKU`
- Open your SPA checkout route

For dynamic carts on the published page, parse `data-pbx-product-id` in your frontend or replace static HTML with your ecommerce widgets at render time.

## Advanced: `buildProductSectionHtml`

Export for use outside the service (SSR, previews, tests):

```ts
import {
  buildProductSectionHtml,
  type PageBuilderProduct,
} from '@myissue/vue-website-page-builder'

const html = buildProductSectionHtml(products, 'grid-4', 'Sale')
```

Layouts: `grid-1` | `grid-2` | `grid-3` | `grid-4` | `grid-6`

## Demo in this repository

See `src/tests/PageBuilderTest.vue` and `src/tests/TestComponents/DemoDisplayProductsTest.vue` with sample data in `src/tests/productsArray.test.json`.

## How other page builders handle this

| Approach | Examples | Trade-off |
|----------|----------|-----------|
| **Injected app / data source** | Webflow CMS, Builder.io content models | Flexible; host connects API |
| **Commerce widgets** | Shopify Buy Button, Squarespace | Easy checkout; less layout freedom |
| **Shortcodes / blocks** | WordPress WooCommerce blocks | Fast defaults; hard to customize |
| **Manual blocks only** | Many landing-page builders | Flexible design; no catalog sync |

`:DisplayProducts` follows the **injected data source** model (like your media library) — a strong fit for Vue apps, corporations, and custom storefronts that need both design freedom and real product data.
