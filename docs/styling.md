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

### Runtime Font Class Support

When `pageSettings.classes` contains a font utility (for example `pbx-font-raleway`), the builder ensures a matching CSS rule exists at runtime and then loads the web font if needed.

This means your saved page can restore font classes reliably even when a specific font utility was not pre-generated in your Tailwind output.

Arbitrary page-level font classes such as `pbx-font-fantasy` are also supported at runtime. They do not need to be explicitly listed in the Tailwind safelist to render on the canvas.

Classes generated as `pbx-font-custom-*` are normalized at runtime as well, so values like `pbx-font-custom-fantasy` map to the CSS generic family `fantasy` instead of being treated as a literal custom font name.

When imported HTML uses a raw family class like `pbx-font-bitcount-grid-double`, the Page Design font picker now recognizes it as an explicit font family and resolves it to the matching configured option label/value.

This normalization also runs during style-panel initialization, so the Font Family dropdown stays selected (instead of showing only an Inherited label) when `#pagebuilder` already contains a raw imported `pbx-font-*` family class.

For nested wrapper use-cases, the canvas CSS now matches generic `pbx-font-*` classes (while excluding weight-only classes like `pbx-font-medium`), so family classes from passed HTML can cascade to common text and form controls.

This fallback applies to common text and form controls inside the canvas (including headings, paragraphs, links, list items, buttons, and inputs), so passed page-level font classes affect more than just headings/paragraphs.

When a persisted page class already includes a font-family utility, the canvas no longer injects the config default font class (for example `pbx-font-jost`). This prevents first-render class conflicts during draft resume.

When an explicit page font class exists in `pageSettings.classes`, per-element `elementFonts` CSS variables are not injected for the canvas wrapper. This ensures headings/paragraphs inherit the restored page font instead of falling back to config defaults.

When draft page settings are restored, the same values are synced back into the reactive `config.pageSettings` state. This prevents stale config classes (such as an older background color) from being re-applied by Vue bindings after resume.

When resuming from a saved draft HTML snapshot, page wrapper settings embedded in the draft (`#pagebuilder` classes/styles/meta) are now prioritized over transient live DOM defaults during remount.

Global page background color changes in Page Design now trigger an immediate autosave for `#pagebuilder` in addition to observer-based persistence, reducing the chance of losing the latest color if the page is refreshed quickly.

Builder insert controls (Add/Products section buttons inside the canvas) are now offset against page-level `#pagebuilder` padding/margin classes, so they stay anchored in the right-side control area even when global page spacing utilities like `pbx-px-*`, `pbx-py-*`, or `pbx-mx-*` are applied.

Insert controls are also isolated from inherited page typography styles. Global canvas text styles such as `letter-spacing`, `word-spacing`, `text-transform`, and `font-style` no longer alter the Add/Products insert buttons.

In Page Design, the Typography panel now opens by default and uses a clearer highlighted header style for faster access.

Typography in Page Design now keeps the main controls visible in one compact card: font family, size, weight, and font style are all directly available without opening a `More options` toggle.

In that compact card, controls are grouped as pairs for faster scanning: Font Family + Font Size together, and Font Weight + Font Style together.

The Page Design Typography card is now denser: controls are grouped into a compact visual panel and key fields are arranged in a responsive two-column layout on wider screens to reduce vertical space.

At the bottom of Page Design, a danger action is available to clear global page wrapper classes and inline styles (`#pagebuilder` only) without removing sections/components. This action now uses a confirmation modal before applying the reset.

Classes and inline styles added from Advanced controls now update immediately in the inspector list for both Page Design (`#pagebuilder`) and selected elements, without closing/reopening modals or reselecting elements.

When Page Design is open, class and style controls target the page wrapper directly in global mode, including Borders and Advanced class/style edits.

When Page Design is closed, global mode is reset so Advanced class/style controls immediately target the currently selected element again.

On reopen flows, if incoming config does not provide `pageSettings`, the builder now syncs the live `#pagebuilder` wrapper settings into runtime config to keep global classes/styles from being dropped while section content persists.

In global Page Design color pickers, built-in colors now apply the clicked color option directly (no stale previous-value fallback), so Text Color and Background Color stay aligned between visual output and page wrapper classes/styles.

Theme Color Presets apply their hex value as inline style (same behavior as custom colors) for both global Page Design and selected elements.

In the right properties panel, style accordions now stay mounted while switching between editable elements, so expanded sections remain open instead of collapsing on each selection change.

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
