---
title: Display Products — Vue Ecommerce Page Builder Integration
description: Connect your product catalog to the Vue page builder. DisplayProducts hook, insertProducts(), responsive grids, card styles, and toolbar editing for ecommerce admin panels.
---

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

### Step-by-step: implement your product modal

**What the Page Builder provides**

- The **Products** button in the navbar and between sections
- The modal shell (“Add Products to Page”) — your component renders inside it
- `insertProducts()` / `insertProductHtml()` to add sections to the canvas
- **Product section settings** on the toolbar after insert (grid, mobile columns, card style, rounded images) — no extra work from you

**What you implement in `YourDisplayProducts.vue`**

1. **Load products** — static list, REST API, CMS, etc. (your data layer)
2. **Browse & select** — search, filters, multi-select, pagination — whatever your catalog needs
3. **Layout options (optional)** — grid, mobile columns, card style, rounded images before insert; copy the pattern from `DemoDisplayProductsTest.vue` or use your own UI
4. **Insert** — on confirm, call `insertProducts()` then close the modal

**Minimum insert code** (required when the editor confirms):

```vue
<script setup lang="ts">
import { getPageBuilder, usePageBuilderModal } from '@myissue/vue-website-page-builder'
import type { PageBuilderProduct } from '@myissue/vue-website-page-builder'

const pageBuilderService = getPageBuilder()
const { closeProductLibraryModal } = usePageBuilderModal()

async function onInsertSelected(products: PageBuilderProduct[]) {
  if (!products.length) return

  await pageBuilderService.insertProducts(products, {
    layout: 'grid-3',           // grid-1 | grid-2 | grid-3 | grid-4 | grid-6
    mobileColumns: 1,           // 1 or 2
    cardStyle: 'minimal',       // minimal | bordered | shadow | elevated
    roundedImages: false,
    sectionTitle: 'Products',
  })

  closeProductLibraryModal()
}
</script>
```

**Reference implementation in this repo**

| File | Purpose |
|------|---------|
| `src/tests/TestComponents/DemoDisplayProductsTest.vue` | Full picker UI — search, multi-select, section settings, insert |
| `src/tests/productsArray.test.json` | Sample product data |
| `src/tests/PageBuilderTest.vue` | Wiring `:DisplayProducts="DemoDisplayProductsTest"` |

Start by copying `DemoDisplayProductsTest.vue` into your project as `YourDisplayProducts.vue`, then replace the static JSON load with your API.

**After insert:** editors change layout and card style from the canvas toolbar (grid icon) — you do not need to rebuild that in your picker unless you want those controls before the first insert.

When the user confirms a selection, call one of these APIs:

## Large catalogs (1,000+ products)

**The package does not ship pagination, search, or catalog loading for products.** That is intentional — the same pattern as `:CustomMediaLibraryComponent`.

| Responsibility | Who owns it |
|----------------|-------------|
| Opening the Products modal | Page Builder |
| Loading products (API, DB, CMS) | **Your** `:DisplayProducts` component |
| Pagination, infinite scroll, search | **Your** component |
| Categories, permissions, variants UI | **Your** component |
| Multi-select across pages | **Your** component |
| Inserting HTML on the page | Page Builder (`insertProducts` / `insertProductHtml`) |
| Cart, checkout, inventory | **Your** backend / ecommerce platform |

You can implement all of this **today** — no extra package feature is required. The builder only needs the final selection when the editor clicks insert.

### Typical production flow

```
Editor opens Products modal
  → Your component: GET /api/products?page=1&limit=24&q=ring
  → Editor selects 3 products (possibly across multiple pages)
  → insertProducts([productA, productB, productC], { layout: 'grid-3' })
  → closeProductLibraryModal()
```

Only the **selected** products become page HTML — not your full catalog. A company with 10,000 SKUs still inserts small sections (often 1–6 cards per block).

### Recommendations at scale

- **Server-side pagination** or infinite scroll inside your picker modal
- **Server-side search** — avoid loading thousands of rows into the browser
- **Selection basket** that persists while the editor browses pages
- **Map your API** to `PageBuilderProduct` before calling `insertProducts()`

### Demo vs production

The repository demo (`DemoDisplayProductsTest.vue`) loads a small static JSON file (`productsArray.test.json`) with client-side search. That is a **UI reference**, not the recommended pattern for large catalogs.

For production, replace the demo with `YourDisplayProducts.vue` that talks to your API.

Hosts that call `insertProducts()` can pass `cardStyle` and `roundedImages` — the built-in HTML helper applies them automatically. Your picker UI (chips, toggles, defaults) is up to you; see the demo for a reference. For full control, use `insertProductHtml()` with your own markup instead.

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
    cardStyle: 'bordered',
    roundedImages: true,
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

const html = buildProductSectionHtml(products, 'grid-4', 'Sale', {
  cardStyle: 'bordered',
  roundedImages: true,
})
```

Layouts: `grid-1` | `grid-2` | `grid-3` | `grid-4` | `grid-6`

Card styles (`cardStyle`): `minimal` | `bordered` | `shadow` | `elevated`

Optional `roundedImages: true` adds rounded corners to product photos.

### TypeScript — avoiding type errors

Product types follow the same flexibility rules as `PageBuilderConfig`:

- Use **`PageBuilderProductInput`** when passing products to `insertProducts()` — map from your API without `as const` or casts.
- Use **`PageBuilderProduct`** when you need custom fields (`rating`, `variantId`, etc.) on the object.
- **`layout`**, **`cardStyle`**, and **`method`** accept string variables (e.g. `layout: userChoice`) without widening errors.

```ts
import type {
  PageBuilderProductInput,
  InsertProductsOptions,
} from '@myissue/vue-website-page-builder'

interface ShopRow { id: string; name: string; price: number }

const selected: ShopRow[] = await fetchSelected()

await pageBuilderService.insertProducts(
  selected.map((row) => ({
    id: row.id,
    title: row.name,
    price: row.price,
  })),
  { layout: 'grid-3', cardStyle: 'bordered' },
)
```

`:DisplayProducts` itself is a Vue component prop (`Object`) — no product types are required on `<PageBuilder>`; types matter inside your picker when calling `insertProducts()`.

Pass the same options to `insertProducts()`:

```ts
await pageBuilderService.insertProducts(products, {
  layout: 'grid-3',
  mobileColumns: 1, // or 2 for two products per row on small screens
  cardStyle: 'elevated',
  roundedImages: true,
})
```

### Edit layout after insert (toolbar)

Click a product section on the canvas, then use the **grid** icon in the floating toolbar (`#pbxEditToolbar`) to change grid layout, mobile columns, card style, and rounded images — without deleting and re-inserting.

Settings are stored on the section as `data-pbx-product-layout`, `data-pbx-product-mobile-cols`, etc.

After insertion, editors can still tweak borders, shadows, and spacing visually in the builder.

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

### Is this suitable for enterprise / large companies?

**Yes**, when you provide the product picker integration:

- The builder handles **layout, visual editing, and inserting product sections**
- Your app handles **catalog scale** (API paging, search, auth, business rules)
- Checkout and inventory stay on **your** platform

The package is **not** a product database or storefront. It is a page editor with a hook for your catalog UI — which is what most large teams want so they can keep their existing ecommerce stack.
