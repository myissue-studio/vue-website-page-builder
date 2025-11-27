- [Custom Components](#custom-components)
  - [Custom Media Library Component](#custom-media-library-component)
  - [Integrate Unsplash Library](#integrate-unsplash-library)
  - [Custom Layout Builder Component](#custom-layout-builder-component)

---

yles for the entire page, ensuring a seamless and dynamic user experience.

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

# Custom Components

If you want to use your own components—whether custom-designed or tailored to your application's needs—you can inject them directly into the builder.

## Custom Media Library Component

By default, the Page Builder does not include a built-in media library.

This is intentional—without a custom media library, layout components that rely on images (such as Image Blocks, Hero Sections, and similar) are disabled by default. Only helper components like containers, headings, text, and buttons are available in this state.

You may extend the Page Builder by adding your own media library.
Inject your media library component easily to tailor the builder to your application's needs.

📚 **[Custom Components Setup Guide](./CUSTOM_COMPONENTS_SETUP.md)**
Learn how to create and integrate your own components step by step.

## Integrate Unsplash Library

Easily add Unsplash image search to your media library modal—just like in the demo!
A code example is provided so you can copy-paste to get started.

See the full step-by-step guide and working demo code here:
📚 **[Unsplash Integration Guide](./UNSPLASH_INTEGRATION.md)**

## Custom Layout Builder Component

The Page Builder comes with a growing collection of built-in components, including both layout and helper components. These defaults are continuously improved and expanded.

📚 **[Custom Components Setup Guide](./CUSTOM_COMPONENTS_SETUP.md)**
Learn how to create and integrate your own components step by step.
