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

## Built-in sample catalog (no setup required)

The **Products** button is available by default in the navbar and between sections. If you do not pass `:DisplayProducts`, the builder opens a **built-in sample catalog** with placeholder products so editors can:

- Try product grids, card styles, and section settings immediately
- Prototype page layouts before your API is wired
- Learn the insert → toolbar edit workflow without backend work

The sample picker includes search, multi-select, layout options, and the same **Insert products** flow as a custom integration. A banner in the modal makes it clear these are placeholders — not your live storefront.

**When to pass `:DisplayProducts`**

| Your need | What to do |
| --------- | ---------- |
| Layout exploration, demos, first integration | Omit `:DisplayProducts` — use the built-in sample catalog (default) |
| No product sections at all | `:enableDefaultProducts="false"` |
| Real SKUs from Shopify, WooCommerce, Medusa, or your API | Pass `:DisplayProducts` with your own picker component |
| Pagination, infinite scroll, categories, ERP filters | **Required** — implement these in your picker; the default catalog is a small static list |
| Production admin panels | **Required** — replace the sample catalog so editors never publish placeholder products |

Your custom component **fully replaces** the default picker when provided. The modal shell, **Products** entry points, `insertProducts()`, and toolbar section settings stay the same.

Sample data ships in the package as `src/data/sample-products.json` (10 editorial placeholder items with `DEMO-001`–style SKUs). Hosts are not required to load or ship this file — it is bundled for the default picker only.

### Disable the built-in sample catalog

Use `:enableDefaultProducts="false"` when you do not want placeholder products — for example, a blog-only admin, a CMS without ecommerce, or while your catalog integration is still in progress and you prefer no **Products** button at all.

```vue
<PageBuilder :enableDefaultProducts="false" />
```

| Configuration | Products button | Catalog source |
| ------------- | --------------- | -------------- |
| Default (nothing passed) | Shown | Built-in sample catalog |
| `:enableDefaultProducts="false"` | Hidden | — |
| `:DisplayProducts="YourPicker"` | Shown | Your component only (sample catalog not used) |
| Both props set | Shown | Your component only — `:DisplayProducts` wins |

`:enableDefaultProducts` defaults to `true`. It only gates the built-in sample catalog. Passing `:DisplayProducts` always enables the **Products** flow with your own data source.

## Quick setup (custom catalog)

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

When `:DisplayProducts` is provided, your component replaces the built-in sample catalog inside the same modal. The **Products** button is shown when either `:DisplayProducts` is set or the built-in sample catalog is enabled (default).

## Your product picker component

Design the modal however you want: API search, categories, Shopify sync, ERP feed, etc.

### Step-by-step: implement your product modal

**What the Page Builder provides**

- The **Products** button in the navbar and between sections
- The modal shell (“Add Products to Page”) — your component renders inside it
- `insertProducts()` / `insertProductHtml()` to add sections to the canvas
- **Product section settings** on the toolbar after insert (grid, mobile columns, card style, rounded images, open in new tab) — no extra work from you

**What you implement in `YourDisplayProducts.vue`**

1. **Load products** — static list, REST API, CMS, etc. (your data layer)
2. **Browse & select** — search, filters, multi-select, pagination — whatever your catalog needs
3. **Layout options (optional)** — grid, mobile columns, card style, rounded images, open in new tab before insert; copy the pattern from `DemoDisplayProductsTest.vue` or use your own UI
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
    layout: 'grid-3', // grid-1 | grid-2 | grid-3 | grid-4 | grid-6
    mobileColumns: 1, // 1 or 2
    cardStyle: 'minimal', // minimal | bordered | shadow | elevated
    roundedImages: false,
    openInNewTab: false, // target="_blank" on product image, title, and CTA links
    hidePrice: false, // hide price row when products include prices
    hideImage: false, // hide photos when products include images
    hideButton: false, // hide CTA when products include url + buttonText
    sectionTitle: 'Products',
  })

  closeProductLibraryModal()
}
</script>
```

**Reference implementation in this repo**

| File                                                   | Purpose                                                         |
| ------------------------------------------------------ | --------------------------------------------------------------- |
| `src/data/sample-products.json`                        | Built-in default and dev demo — placeholder products bundled with the package |
| `src/Components/PageBuilder/ProductPicker/`            | Default picker (`ProductPickerPanel`, `DefaultDisplayProducts`) |
| `src/tests/TestComponents/DemoDisplayProductsTest.vue` | Dev demo — same sample catalog for local `PageBuilderTest`      |
| `src/tests/PageBuilderTest.vue`                        | Optional `:DisplayProducts="DemoDisplayProductsTest"` wiring      |

Start by copying `DemoDisplayProductsTest.vue` into your project as `YourDisplayProducts.vue`, then replace the static JSON load with your API. Until then, omit `:DisplayProducts` and use the built-in sample catalog.

**After insert:** editors change layout and card style from the canvas toolbar (grid icon) — you do not need to rebuild that in your picker unless you want those controls before the first insert.

### Open in new tab

When `openInNewTab: true`, the built-in product HTML adds `target="_blank" rel="noopener noreferrer"` to every product link (image, title, and button) that has a `url` on the product object.

**No extra setup is required** — enable the toggle in the Add Products modal (or pass `openInNewTab: true` to `insertProducts()`). Your products still need a `url` field; links without a URL are unchanged.

Editors can toggle this later from the product section settings on the canvas toolbar (same panel as rounded images).

The setting is stored on the section as `data-pbx-product-open-in-new-tab="true"` or `"false"`.

### Hide prices / hide images / hide buy button

When your products include prices, images, or a CTA (`url` + `buttonText`), the Add Products modal and toolbar settings show the relevant toggles. Each toggle only appears when your catalog (on insert) or the canvas section (on edit) actually has that data.

Pass `hidePrice: true`, `hideImage: true`, or `hideButton: true` to `insertProducts()`. Content stays in the HTML (with a `hidden` class) so editors can turn visibility back on from the toolbar.

Use **Hide buy button** with **Hide prices** for catalog-style grids where title/image still link to the product but you do not want a “Shop now” CTA without a visible price.

Stored as `data-pbx-product-hide-price`, `data-pbx-product-hide-image`, and `data-pbx-product-hide-button` on the section.

When the user confirms a selection, call one of these APIs:

## Large catalogs (1,000+ products)

**Production catalogs** (pagination, API search, categories, ERP feeds) belong in **your** `:DisplayProducts` component — the same pattern as `:CustomMediaLibraryComponent`. The built-in sample catalog is a small static list with client-side search for layout exploration only.

| Responsibility                       | Who owns it                                           |
| ------------------------------------ | ----------------------------------------------------- |
| Opening the Products modal           | Page Builder                                          |
| Loading products (API, DB, CMS)      | **Your** `:DisplayProducts` component                 |
| Pagination, infinite scroll, search  | **Your** component                                    |
| Categories, permissions, variants UI | **Your** component                                    |
| Multi-select across pages            | **Your** component                                    |
| Inserting HTML on the page           | Page Builder (`insertProducts` / `insertProductHtml`) |
| Cart, checkout, inventory            | **Your** backend / ecommerce platform                 |

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

The repository demo (`DemoDisplayProductsTest.vue`) loads the same bundled `sample-products.json` with client-side search. That is a **UI reference**, not the recommended pattern for large catalogs.

For production, replace the demo with `YourDisplayProducts.vue` that talks to your API.

Hosts that call `insertProducts()` can pass `cardStyle`, `roundedImages`, and `openInNewTab` — the built-in HTML helper applies them automatically. Your picker UI (chips, toggles, defaults) is up to you; see the demo for a reference. For full control, use `insertProductHtml()` with your own markup instead.

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

## Custom fields in the product picker and canvas

`PageBuilderProduct` includes an index signature (`[key: string]: unknown`), so you can attach **any extra fields** from your data source. Both the demo picker and the built-in card HTML automatically surface non-standard fields — no configuration needed.

This means if your product objects look like this (a GIS/geodata or B2B catalog, for example):

```json
{
  "sku": "A1614",
  "title": "Multiupdate Water",
  "description": "...",
  "city": "New York",
  "name": "Freja",
  "status": "inactive",
  "expiryDate": "2026-11-11"
}
```

The builder will automatically show `city`, `name`, `status`, and `expiryDate` — because they are not in the standard field set (`id`, `title`, `description`, `image`, `imageAlt`, `price`, `compareAtPrice`, `badge`, `url`, `buttonText`, `sku`).

**No changes are needed in the builder or the package** — you just pass your enriched product objects to `insertProducts()`.

### Custom fields in the picker

The demo picker (`DemoDisplayProductsTest.vue`) shows custom field **values** (without keys) as small gray text below the title and price in each product card. This gives editors enough context to identify a product without cluttering the card.

### Custom fields in the rendered canvas HTML

`insertProducts()` renders custom fields into the page HTML below the description. Each field uses a `<strong>` key label so editors can edit the text inline without losing the key/value structure:

```html
<div class="product-card-custom-field product-card-custom-field-city">
  <p><strong>city</strong>: New York</p>
</div>
<div class="product-card-custom-field product-card-custom-field-expiry-date">
  <p><strong>expiryDate</strong>: 2026-11-11</p>
</div>
```

Each field div gets two classes:

- `product-card-custom-field` — targets all custom fields
- `product-card-custom-field-{slug}` — targets a specific field, where `slug` is the key lowercased with non-alphanumeric characters replaced by hyphens (`expiryDate` → `expiry-date`, `city` → `city`)

This lets you style individual fields from your own CSS:

```css
.product-card-custom-field-status {
  color: #6b7280;
}
.product-card-custom-field-expiry-date {
  font-size: 0.75rem;
}
```

The `<strong>` tag is a TipTap StarterKit mark — it survives the editor's parse/serialize cycle, so the bold key label is preserved when editors click to edit a field inline.

If you need custom fields with completely custom markup (e.g. `data-product-status` attributes, icons, or conditional styling), use `insertProductHtml()` with your own HTML instead.

### How the demo picker detects custom fields

```ts
const STANDARD_PRODUCT_FIELDS = new Set([
  'id',
  'title',
  'description',
  'image',
  'imageAlt',
  'price',
  'compareAtPrice',
  'badge',
  'url',
  'buttonText',
  'sku',
])

function customFieldEntries(product: PageBuilderProduct): [string, unknown][] {
  return Object.entries(product).filter(
    ([key, value]) => !STANDARD_PRODUCT_FIELDS.has(key) && value != null && value !== '',
  )
}
```

Copy this pattern into `YourDisplayProducts.vue` to render whatever metadata your catalog provides.

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
  url?: string // product or checkout URL on your site
  buttonText?: string
  sku?: string
  [key: string]: unknown // custom fields for your templates
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

| Prop                       | Purpose                                                               |
| -------------------------- | --------------------------------------------------------------------- |
| `:CustomBuilderComponents` | Extra **layout blocks** in the Add modal (heroes, grids, etc.)        |
| `:DisplayProducts`         | **Optional.** Your catalog picker — replaces the built-in sample catalog when set |
| `:enableDefaultProducts` | **Optional.** `true` by default — built-in sample catalog when `:DisplayProducts` is omitted; set `false` to hide **Products** entirely |
| Built-in sample catalog    | Used when `:DisplayProducts` is omitted and `:enableDefaultProducts` is not `false` |
| Built-in components        | Default blocks when `CustomBuilderComponents` is omitted              |

These do not conflict:

- **Add** → structural/page blocks
- **Products** → product sections (sample catalog by default, or your catalog when `:DisplayProducts` is set)

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
import { buildProductSectionHtml, type PageBuilderProduct } from '@myissue/vue-website-page-builder'

const html = buildProductSectionHtml(products, 'grid-4', 'Sale', {
  cardStyle: 'bordered',
  roundedImages: true,
  openInNewTab: true,
})
```

Layouts: `grid-1` | `grid-2` | `grid-3` | `grid-4` | `grid-6`

Card styles (`cardStyle`): `minimal` | `bordered` | `shadow` | `elevated`

Optional `roundedImages: true` adds rounded corners to product photos.

Optional `openInNewTab: true` opens product links in a new browser tab (`target="_blank"`).

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

interface ShopRow {
  id: string
  name: string
  price: number
}

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
  openInNewTab: true,
})
```

### Edit layout after insert (toolbar)

Click a product section on the canvas, then use the **grid** icon in the floating toolbar (`#pbxEditToolbar`) to change grid layout, mobile columns, card style, rounded images, and open in new tab — without deleting and re-inserting.

Settings are stored on the section as `data-pbx-product-layout`, `data-pbx-product-mobile-cols`, `data-pbx-product-open-in-new-tab`, etc.

After insertion, editors can still tweak borders, shadows, and spacing visually in the builder.

## Demo in this repository

See `src/tests/PageBuilderTest.vue` and `src/tests/TestComponents/DemoDisplayProductsTest.vue` with sample data in `src/data/sample-products.json`.

## How other page builders handle this

| Approach                       | Examples                               | Trade-off                          |
| ------------------------------ | -------------------------------------- | ---------------------------------- |
| **Injected app / data source** | Webflow CMS, Builder.io content models | Flexible; host connects API        |
| **Commerce widgets**           | Shopify Buy Button, Squarespace        | Easy checkout; less layout freedom |
| **Shortcodes / blocks**        | WordPress WooCommerce blocks           | Fast defaults; hard to customize   |
| **Manual blocks only**         | Many landing-page builders             | Flexible design; no catalog sync   |

`:DisplayProducts` follows the **injected data source** model (like your media library) — a strong fit for Vue apps, corporations, and custom storefronts that need both design freedom and real product data.

### Is this suitable for enterprise / large companies?

**Yes**, when you provide the product picker integration:

- The builder handles **layout, visual editing, and inserting product sections**
- Your app handles **catalog scale** (API paging, search, auth, business rules)
- Checkout and inventory stay on **your** platform

The package is **not** a product database or storefront. It is a page editor with a hook for your catalog UI — which is what most large teams want so they can keep their existing ecommerce stack.
