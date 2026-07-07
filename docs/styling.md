---
title: Global Styling — Vue Page Builder pageSettings
description: Global fonts, colors, and backgrounds on the Vue page builder canvas. pageSettings for branded ecommerce and multi-tenant SaaS pages.
---

## Styling

Styling the Main Page Builder Container.
The Page Builder allows you to define and update global styles for the main wrapper (`#pagebuilder`) at any time. These settings control the overall appearance, including font family, text color, background color, and more. Whether you set them initially in your config or update them dynamically at runtime, your changes are instantly reflected across all sections.

Use the `pageSettings` config to apply custom CSS classes and inline styles to the Page Builder’s main wrapper.
The Page Builder renders all components wrapped inside a single parent container, `<div id="pagebuilder">`.
You can pass global CSS `classes` and `style` to this wrapper by adding a `pageSettings` object in your config:

```ts
const configPageBuilder = {
  // other config options...

  pageSettings: {
    classes: 'pbx-max-w-screen-lg pbx-mx-auto pbx-px-4 pbx-bg-white',
    style: 'background:#ffffff;color:#1e293b;border:1px solid #e2e8f0;border-radius:14px;',
  },
} as const
```

You may also pass `style` as an object:

```ts
pageSettings: {
  classes: 'pbx-max-w-screen-lg pbx-mx-auto pbx-px-4 pbx-bg-white',
  style: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
  },
}
```

You have full control over the page’s appearance at any time. When restoring saved content, these values usually come from the outer `#pagebuilder` wrapper in your saved HTML.

### Getting Page Settings from Saved HTML

When a user edits previously saved content, load the full saved HTML from your database and use `parsePageBuilderHTML()` to extract both the editable components and the global `pageSettings`.

```ts
import { getPageBuilder } from '@myissue/vue-website-page-builder'

const pageBuilderService = getPageBuilder()

const savedHtmlFromDatabase = `
  <div
    id="pagebuilder"
    class="pbx-text-2xl lg:pbx-text-4xl pbx-font-light pbx-font-rockwell pbx-italic pbx-text-amber-200 pbx-rounded-full"
    style="background:#CBDF90"
  >
    <section data-component-title="Hero">...</section>
    <section data-component-title="Content">...</section>
  </div>
`

const { components, pageSettings } = pageBuilderService.parsePageBuilderHTML(savedHtmlFromDatabase)

// pageSettings now contains the wrapper styles:
// {
//   classes:
//     'pbx-text-2xl lg:pbx-text-4xl pbx-font-light pbx-font-rockwell pbx-italic pbx-text-amber-200 pbx-rounded-full',
//   style: {
//     background: '#CBDF90',
//   },
// }

const configPageBuilder = {
  updateOrCreate: {
    formType: 'update',
    formName: 'article',
  },
  pageSettings,
}

await pageBuilderService.startBuilder(configPageBuilder, components)
```

The key is to save the complete builder HTML, including the outer `<div id="pagebuilder">`. That wrapper is where the Page Builder stores global classes and styles.

## Button Style Controls In Modals

The builder now uses a wider **Product section settings** modal so product layout and link controls have more room.

In **Add Components to Page** under **Helper Components → Category: Buttons**, you can now choose button link styling before insert:

- **Text link**: renders helper buttons as text-only links with brand link color.
- **Button design**: renders helper buttons with brand background and white text.
- **Rounded buttons**: toggle full-rounded vs standard rounded corners for button design.

This matches the product CTA styling behavior and keeps contrast readable on brand-colored button backgrounds.

The Buttons helper category now uses a right-side settings panel (same link controls as Product section settings):

- Text link / Button design
- Open in new tab
- Rounded buttons

Selections apply to new helper button inserts, and button-style classes are applied on the anchor element so border-radius controls in the right sidebar can be edited reliably after insert.

For Helper categories without extra options, the right-side settings area stays visible and shows a subtle placeholder message instead of collapsing.

When editing inserted product cards, border-radius controls now map to the visual wrapper where needed:

- Product CTA wrappers target the nested anchor when that anchor owns rounded classes.
- Product image selections (`img`) target the surrounding `.pbx-product-card-image` wrapper when it owns rounded classes.

This keeps right-sidebar border radius values in sync with what is rendered on the canvas.
