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
  Pass user information (such as `name` and `image`) to display the logged-in user’s details in the builder.
- **`pageBuilderLogo` (optional):**
  Display your company logo in the builder toolbar.
- **`userSettings` (optional):**
  Set user preferences such as language, font family, or auto-save.
- **`brandColor` (optional):**
  Set your brand’s primary color for key UI elements (inside the `settings` config).
- **`themeColorPresets` (optional):**
  Pass primary, secondary, and up to six custom hex colors from your backend. Enabled presets appear in the text color and background color menus.
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
  userForPageBuilder: { name: 'John Doe', image: '/jon_doe.jpg' },
  pageBuilderLogo: {
    src: '/logo/logo.svg',
  },
  userSettings: {
    language: {
      default: 'en',
      enable: ['en', 'zh-Hans', 'fr'],
    },
    // Available fonts: jost, raleway, palantino, arial, helvetica, georgia, times, times-new-roman,
    // courier, courier-new, verdana, tahoma, trebuchet, garamond, bookman, comic-sans, impact,
    // lucida, lucida-console, lucida-sans, candara, optima, avenir, futura, calibri, cambria,
    // didot, franklin-gothic, rockwell, baskerville, sans, serif, mono
    fontFamily: 'raleway',
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

### Theme Color Presets

Use `settings.themeColorPresets` when your app stores brand colors in a database and needs to make them available in the Page Builder color menus.

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

Supported preset IDs are `primary`, `secondary`, and `custom1` through `custom6`. Disabled presets are saved but hidden from the text color and background color dropdowns. If no presets are passed, the builder uses locally saved presets from the browser.

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
//   style: 'background:#CBDF90',
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
