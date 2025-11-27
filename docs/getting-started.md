# Free Click & Drop Page Builder

- [Free Click \& Drop Page Builder](#free-click--drop-page-builder)
  - [Styling the Main Page Builder Container](#styling-the-main-page-builder-container)
  - [Download HTML File](#download-html-file)
  - [Custom Components](#custom-components)
    - [Custom Media Library Component](#custom-media-library-component)
    - [Integrate Unsplash Library](#integrate-unsplash-library)
    - [Custom Layout Builder Component](#custom-layout-builder-component)
  - [Troubleshooting](#troubleshooting)
    - [1. Fonts or Icons Not Displaying](#1-fonts-or-icons-not-displaying)
    - [2. Initialize Page Builder with `onMounted` Troubleshooting](#2-initialize-page-builder-with-onmounted-troubleshooting)

---

## Styling the Main Page Builder Container

The Page Builder allows you to define and update global styles for the main wrapper (`#pagebuilder`) at any time. These settings control the overall appearance, including font family, text color, background color, and more. Whether you set them initially in your config or update them dynamically at runtime, your changes are instantly reflected across all sections.

Use the `pageSettings` config to apply custom CSS classes and inline styles to the Page Builder’s main wrapper.
The Page Builder renders all components wrapped inside a single parent container, `<div id="pagebuilder">`.
You can pass global CSS `classes` and `style` to this wrapper by adding a `pageSettings` object in your config:

```ts
const configPageBuilder = {
  // other config options...

  pageSettings: {
    classes: 'max-w-screen-lg mx-auto px-4 bg-white',
    style: {
      backgroundColor: 'red',
      border: '6px solid yellow',
    },
  },
} as const
```

You have full control over the page’s appearance at any time—instantly override or clear global styles for the entire page, ensuring a seamless and dynamic user experience.

## Download HTML File

Export the entire page as a standalone HTML file. This includes all sections, content, and applied styles, making the file ready for use or integration elsewhere.

- Images may not display correctly in the exported HTML unless their URLs are properly prefixed or fully qualified.

To ensure images render properly after export, you must specify a URL prefix in your Page Builder configuration. This prefix will be prepended to all relative image URLs during the export process.

```ts
const configPageBuilder = {
  imageUrlPrefix: 'https://your-domain.com/uploads/',
  // other config options...
} as const
```

## Custom Components

If you want to use your own components—whether custom-designed or tailored to your application's needs—you can inject them directly into the builder.

### Custom Media Library Component

By default, the Page Builder does not include a built-in media library.

This is intentional—without a custom media library, layout components that rely on images (such as Image Blocks, Hero Sections, and similar) are disabled by default. Only helper components like containers, headings, text, and buttons are available in this state.

You may extend the Page Builder by adding your own media library.
Inject your media library component easily to tailor the builder to your application's needs.

📚 **[Custom Components Setup Guide](./CUSTOM_COMPONENTS_SETUP.md)**
Learn how to create and integrate your own components step by step.

### Integrate Unsplash Library

Easily add Unsplash image search to your media library modal—just like in the demo!
A code example is provided so you can copy-paste to get started.

See the full step-by-step guide and working demo code here:
📚 **[Unsplash Integration Guide](./UNSPLASH_INTEGRATION.md)**

### Custom Layout Builder Component

The Page Builder comes with a growing collection of built-in components, including both layout and helper components. These defaults are continuously improved and expanded.

📚 **[Custom Components Setup Guide](./CUSTOM_COMPONENTS_SETUP.md)**
Learn how to create and integrate your own components step by step.

## Troubleshooting

### 1. Fonts or Icons Not Displaying

If fonts or Material Icons are not displaying correctly, verify that:

**CSS Import**: You are importing the CSS file:

```typescript
// Import the Page Builder styles once in your application entry, not in individual components.
import '@myissue/vue-website-page-builder/style.css'
```

### 2. Initialize Page Builder with `onMounted` Troubleshooting

If you encounter issues with the component not fully mounting, you can initialize the Page Builder inside Vue's `onMounted` lifecycle hook. This ensures it runs safely after the component is mounted.

```vue
<script setup>
import { onMounted } from 'vue'
import { PageBuilder, getPageBuilder } from '@myissue/vue-website-page-builder'

const configPageBuilder = {
  updateOrCreate: {
    formType: 'create',
    formName: 'article',
  },
}

// Initialize the Page Builder with `onMounted`
onMounted(async () => {
  const pageBuilderService = getPageBuilder()
  const result = await pageBuilderService.startBuilder(configPageBuilder)
  console.info('You may inspect this result for message, status, or error:', result)
})
</script>
```
