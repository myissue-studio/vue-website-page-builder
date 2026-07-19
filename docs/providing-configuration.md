---
title: Configuration — Vue Page Builder Setup
description: PageBuilderConfig options for ecommerce admin and SaaS apps — branding, autosave, fonts, theme colors, user settings, and multi-tenant resource data.
---

## Providing Configuration

The example below demonstrates the setup to start building pages, with additional options available for customization and branding.

Your `configPageBuilder` object can include:

- **`formType` (required):**
  Used to retrieve the correct content from local storage. Specify whether you are creating or updating a resource.
- **`formName` (required):**
  The resource type (e.g., `article`, `jobPost`, `store`, etc.). This is especially useful for platforms supporting multiple resource types, allowing the builder to manage layouts and storage for each resource uniquely.
- **`resourceData` (optional):**
  Prefill the builder with initial resource data (e.g., `title`, `id`).
- **`userForPageBuilder` (optional):**
  Pass user information to display in the builder. The optional `id` field scopes theme color preset storage per user — each user gets their own `localStorage` entry for their personalized colors (see [Theme Color Presets](#theme-color-presets) below).
- **`pageBuilderLogo` (optional):**
  Display your company logo in the builder toolbar.
- **`userSettings` (optional):**
  Set user preferences such as language, auto-save, default canvas font (`fontFamily`), per-element font overrides (`elementFonts`), and TipTap options like `disableH1`.
- **`brandColor` (optional):**
  Set your brand's primary color for key UI elements (inside the `settings` config).
- **`themeColorPresets` (optional):**
  Pass primary, secondary, and up to six custom hex colors. User edits to these colors persist automatically in `localStorage` and survive modal close/reopen and page reloads. Enabled presets appear in the text color and background color menus.
- **`pageSettings` (optional):**
  Apply global classes and inline styles to the main `#pagebuilder` wrapper.

```vue
<script setup>
import { onMounted } from 'vue'
import { PageBuilder, getPageBuilder } from '@myissue/vue-website-page-builder'

const configPageBuilder = {
  updateOrCreate: {
    formType: 'create', // Set to 'create' or 'update'
    // Set the resource type for better local storage and multi-resource support
    formName: 'article',
  },
  resourceData: {
    title: 'Demo Article',
    id: 1,
  },
  userForPageBuilder: {
    id: currentUser.id, // Optional — scopes theme color presets to this user in localStorage
    name: 'John Doe',
    image: '/jon_doe.jpg',
  },
  pageBuilderLogo: {
    src: '/logo/logo.svg',
  },
  userSettings: {
    language: {
      default: 'en',
      enable: ['en', 'zh-Hans', 'fr'],
    },
    // Single built-in font — canvas default; picker shows all built-in fonts.
    // fontFamily: 'raleway',
    //
    // Comma-separated list — first entry is canvas default; picker is restricted
    // to the listed fonts. Custom names (Google Fonts, @font-face, etc.) work
    // when you load the font in your app CSS. See "Font Family" below.
    fontFamily: 'raleway, jost, arial',
    // Per-element font overrides — optional, same format as fontFamily.
    elementFonts: {
      h1: 'raleway',
      h2: 'raleway',
      h3: 'raleway',
      h4: 'jost',
      h5: 'jost',
      h6: 'jost',
      p: 'arial',
    },
    // disableH1 omitted defaults to false (H1 enabled). Set true to hide TipTap H1.
    // disableH1: true,
    autoSave: true,
  },
  settings: {
    brandColor: '#DB93B0',
    themeColorPresets: {
      enabled: true,
      colors: [
        { id: 'primary', label: 'Primary', color: '#482C3D', enabled: true },
        { id: 'secondary', label: 'Secondary', color: '#E5D352', enabled: true },
        { id: 'custom1', label: 'Custom 1', color: '#AC3931', enabled: true },
        { id: 'custom2', label: 'Custom 2', color: '#623CEA', enabled: true },
        { id: 'custom3', label: 'Custom 3', color: '#54426B', enabled: true },
        { id: 'custom4', label: 'Custom 4', color: '#ffffff', enabled: false },
        { id: 'custom5', label: 'Custom 5', color: '#ffffff', enabled: false },
        { id: 'custom6', label: 'Custom 6', color: '#ffffff', enabled: false },
      ],
    },
  },
  pageSettings: {
    classes:
      'pbx-bg-white pbx-text-slate-800 pbx-rounded-xl pbx-border pbx-border-slate-200 pbx-shadow-lg pbx-p-6 pbx-font-medium pbx-ring-2 pbx-ring-sky-200',
    style:
      'background:#ffffff;color:#1e293b;border:1px solid #e2e8f0;border-radius:14px;box-shadow:0 10px 30px rgba(15,23,42,.08);padding:24px;font-family:Inter,sans-serif;font-size:16px;line-height:1.6;',
  },
}

const pageBuilderService = getPageBuilder()

onMounted(async () => {
  const result = await pageBuilderService.startBuilder(configPageBuilder)
  console.info('You may inspect this result for message, status, or error:', result)
})
</script>

<template>
  <PageBuilder />
</template>
```

### Font Family

Use `userSettings.fontFamily` to control the default canvas font and — optionally — which fonts appear in the font-family picker inside the builder.

Built-in keys (`jost`, `raleway`, `arial`, …) work out of the box. **Any other name is treated as a custom font** — including Google Fonts, self-hosted `@font-face` fonts, or Adobe Fonts. The builder applies the `font-family` name only; **you must load the font in your app CSS**.

#### Load custom fonts in your app

```css
/* Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Bitcount+Grid+Double:wght@100..900&display=swap');

/* Self-hosted */
@font-face {
  font-family: 'Brand Sans';
  src: url('/fonts/brand-sans.woff2') format('woff2');
}
```

Then pass the exact font name in config (same name as in your CSS):

```ts
userSettings: {
  fontFamily: 'Bitcount Grid Double, jost, raleway, arial, fantasy',
  elementFonts: {
    h1: 'Bitcount Grid Double, jost, raleway, arial, fantasy',
    h2: 'Bitcount Grid Double, jost, raleway, arial, fantasy',
    p: 'jost, raleway, arial',
  },
}
```

**Published pages:** your live site also needs the same `@import` / `@font-face` / `<link>` — the builder stores font choices in HTML/classes, not font files.

#### Single built-in font

Sets the canvas default. The font-family picker still shows all built-in fonts.

```ts
userSettings: {
  fontFamily: 'raleway',
}
```

#### Comma-separated list

The **first** entry becomes the canvas default. Remaining entries are **fallbacks** for that default (if the first font fails to load). The font-family picker in the toolbar still shows **all built-in fonts**, plus any custom names from your config.

```ts
userSettings: {
  // Canvas default: Bitcount Grid Double, with fallbacks if it is unavailable.
  fontFamily: 'Bitcount Grid Double, jost, raleway, arial, fantasy',
}
```

Built-in font keys: `jost`, `raleway`, `palantino`, `arial`, `helvetica`, `georgia`,
`times`, `times-new-roman`, `courier`, `courier-new`, `verdana`, `tahoma`, `trebuchet`,
`garamond`, `bookman`, `comic-sans`, `impact`, `lucida`, `lucida-console`, `lucida-sans`,
`candara`, `optima`, `avenir`, `futura`, `calibri`, `cambria`, `didot`, `franklin-gothic`,
`rockwell`, `baskerville`, `sans`, `serif`, `mono`, plus CSS generics such as `fantasy`.

**Page Design override:** When a user sets a global font in **Open page design → Typography**, that choice overrides both `fontFamily` and `elementFonts` config defaults for the live page. Config values still apply as initial defaults until the user changes the global page font.

### Element Fonts

Use `userSettings.elementFonts` to apply a default font to specific HTML elements (`h1`–`h6` and `p`) across the entire canvas. This is independent from the global `fontFamily` default — you can mix and match.

Each value accepts the same format as `fontFamily`: a built-in key, a custom font name, or a comma-separated fallback list. The **first** entry wins.

```ts
userSettings: {
  fontFamily: 'Bitcount Grid Double, jost, raleway, arial',
  elementFonts: {
    h1: 'Bitcount Grid Double, jost, raleway',
    h2: 'Bitcount Grid Double, jost, raleway',
    p:  'jost, raleway, arial',
  },
}
```

All fields are optional — omit any element to let it inherit from the global `fontFamily`.

::: tip
`elementFonts` overrides are applied via CSS custom properties on the builder's scroll container, so they never conflict with global page styles set through the builder's _Global Page Styles_ panel.
:::

### TipTap headings & `disableH1`

Inline and modal TipTap editors expose heading controls **H1–H6** by default (`disableH1` omitted or `false`).

If your host app already renders the page’s single `<h1>` outside the builder (common for SEO), set `userSettings.disableH1: true` to:

- Hide the **H1** button in TipTap toolbars
- Restrict the editor so authors can only create **H2–H6** (and paragraphs)
- Hide the **Header H1** building block in Add Components

```ts
userSettings: {
  autoSave: true,
  fontFamily: 'raleway, jost, arial',
  elementFonts: {
    h1: 'raleway', // still applies to any existing <h1> on the canvas
    h2: 'raleway',
    p: 'arial',
  },
  disableH1: true,
}
```

Existing `<h1>` content already on the canvas is not removed; authors simply cannot create new H1s via TipTap while `disableH1` is enabled.

The **Header H1** building block in Add Components is also hidden when `disableH1: true`.

SEO Check also respects this flag: when `disableH1` is **not** `true`, the SEO report includes an “Has at least one H1” check and treats H1 as the top of the heading hierarchy. When `disableH1: true`, those H1 requirements are skipped (the host page title is assumed to live outside the builder).

### Theme Color Presets

Use `settings.themeColorPresets` to provide brand colors that appear in the text color and background color menus. Supported preset IDs are `primary`, `secondary`, and `custom1` through `custom6`.

```ts
const configPageBuilder = {
  // other config options...
  settings: {
    themeColorPresets: {
      enabled: true,
      colors: [
        { id: 'primary', label: 'Primary', color: '#482C3D', enabled: true },
        { id: 'secondary', label: 'Secondary', color: '#E5D352', enabled: true },
        { id: 'custom1', label: 'Custom 1', color: '#AC3931', enabled: true },
        { id: 'custom2', label: 'Custom 2', color: '#623CEA', enabled: true },
        { id: 'custom3', label: 'Custom 3', color: '#54426B', enabled: true },
        { id: 'custom4', label: 'Custom 4', color: '#ffffff', enabled: false },
        { id: 'custom5', label: 'Custom 5', color: '#ffffff', enabled: false },
        { id: 'custom6', label: 'Custom 6', color: '#ffffff', enabled: false },
      ],
    },
  },
}
```

Disabled presets are saved but hidden from the color dropdowns. If no presets are passed, the builder uses locally saved presets from the browser.

#### User Personalization — Changes Persist Automatically

When a user changes a color or toggles a preset on/off, the change is **automatically saved to `localStorage`**. These customizations survive modal close/reopen and full page reloads.

The config values you pass serve as **initial defaults only**. Once a user has saved their own presets, the builder always loads the saved version instead of the config values.

#### User-Scoped Storage

Pass `userForPageBuilder.id` to isolate each user's presets under their own `localStorage` key. Without an `id`, all users on the same device share one preset storage entry.

```ts
const configPageBuilder = {
  userForPageBuilder: {
    id: currentUser.id, // any stable identifier — string or number
    name: currentUser.name,
    image: currentUser.avatar,
  },
  settings: {
    themeColorPresets: {
      enabled: true,
      colors: [
        { id: 'primary', label: 'Primary', color: '#482C3D', enabled: true },
        // ...
      ],
    },
  },
}
```

With a user `id` the storage key becomes `vueWebsitePageBuilderThemeColorPresets-u{id}`.
Without a user `id` the shared key `vueWebsitePageBuilderThemeColorPresets` is used.

#### Reset to Provided Defaults

The builder includes a **"Reset to provided defaults"** button at the bottom of the theme color presets panel. Clicking it shows a confirmation dialog; on confirmation, the user's saved customizations are cleared and the original colors you passed in the config are restored.

#### Clearing Presets on Sign-Out

Call `resetThemeColorPresets()` to programmatically clear the current user's stored presets and restore built-in defaults. This is useful when a user signs out so the next user starts clean.

```ts
import { resetThemeColorPresets } from '@myissue/vue-website-page-builder'

// Call when the user signs out
resetThemeColorPresets()
```

#### Advanced: Reading the Storage Key

Use `buildStorageKey(config)` to get the exact `localStorage` key the builder uses for a given config. Useful for migrating, pre-populating, or debugging stored preset data.

```ts
import { buildStorageKey } from '@myissue/vue-website-page-builder'

const key = buildStorageKey(config)
// With id 42:  'vueWebsitePageBuilderThemeColorPresets-u42'
// Without id:  'vueWebsitePageBuilderThemeColorPresets'
```

#### Type Flexibility for Consumer Configs

If your color IDs come from a database or are inferred from variables, TypeScript may raise a type error when assigning dynamic strings to the strictly-typed `ThemeColorPresetId`. Use `ThemeColorPresetSettingsInput` (or `ThemeColorPresetInput` for individual colors) to avoid this:

```ts
import type { ThemeColorPresetSettingsInput } from '@myissue/vue-website-page-builder'

// db colors have id typed as `string` — no TypeScript error with the input type
const presets: ThemeColorPresetSettingsInput = {
  enabled: true,
  colors: dbColors.map((c) => ({
    id: c.slug, // any string accepted
    label: c.name,
    color: c.hexCode,
    enabled: c.active,
  })),
}

const configPageBuilder = {
  // ...
  settings: { themeColorPresets: presets },
}
```

### Editing Saved Content Later

When a user edits an existing page, load the saved full HTML from your database and parse it before starting the builder.

The saved HTML should include the outer `#pagebuilder` wrapper because that wrapper contains the global `pageSettings`:

```html
<div
  id="pagebuilder"
  class="pbx-text-2xl lg:pbx-text-4xl pbx-font-light pbx-font-rockwell pbx-italic pbx-text-amber-200 pbx-rounded-full"
  style="background:#CBDF90"
>
  <section data-component-title="Hero">...</section>
  <section data-component-title="Content">...</section>
</div>
```

Then parse the saved HTML and pass both extracted values back into the builder:

```vue
<script setup>
import { onMounted } from 'vue'
import { PageBuilder, getPageBuilder } from '@myissue/vue-website-page-builder'

const pageBuilderService = getPageBuilder()

// Example: this value usually comes from your database or API.
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

// pageSettings now contains:
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

onMounted(async () => {
  await pageBuilderService.startBuilder(configPageBuilder, components)
})
</script>

<template>
  <PageBuilder />
</template>
```

In most projects, you do not need to manually write `pageSettings`. Let `parsePageBuilderHTML()` read it from the saved HTML, then pass `pageSettings` directly into `configPageBuilder`.
