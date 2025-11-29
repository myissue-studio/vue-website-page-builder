## Custom Media Library

By default, the Page Builder does not include a built-in media library.

This is intentional—without a custom media library, layout components that rely on images (such as Image Blocks, Hero Sections, and similar) are disabled by default. Only helper components like containers, headings, text, and buttons are available in this state.

You may extend the Page Builder by adding your own media library.
Inject your media library component easily to tailor the builder to your application's needs.

## Quick Setup

Begin by creating a `ComponentsPageBuilder` folder in your project to organize your customizable components:

```
your-project/
├── src/
│   └── ComponentsPageBuilder/
│       ├── YourMediaLibraryComponent.vue
```

## Custom Media Library Component

By default, the Page Builder does not include a built-in media library.

This is intentional—without a custom media library, layout components that rely on images (such as Image Blocks, Hero Sections, and similar) are disabled by default. Only helper components like containers, headings, text, and buttons are available in this state.

To enable image-related components in the builder, you must inject your own media library by passing it to the Page Builder via the `:CustomMediaLibraryComponent` prop:

- Create a `ComponentsPageBuilder` folder in your project for your media library component.
- Pass your custom component to the builder using the `:CustomMediaLibraryComponent` prop.

## Full control over your media library UI

You are free to design your media library however you wish.  
Use any UI, API, or logic for browsing, searching, and selecting images.

**The only requirement:**  
When the user selects an image and clicks "Use Image" (or similar), you must run the following code to update the builder:

```vue
<script setup>
import { getPageBuilder, usePageBuilderModal } from '@myissue/vue-website-page-builder'
import YourMediaLibraryComponent from './ComponentsPageBuilder/YourMediaLibraryComponent.vue'

// Retrieve Page Builder service instance
const pageBuilderService = getPageBuilder()
const { closeMediaLibraryModal } = usePageBuilderModal()

const applySelectedImage = async function (imageURL) {
  // Update the builder's HTML image block with the new image
  await pageBuilderService.applySelectedImage({
    src: imageURL,
  })

  // Close the Page Builder media library modal
  closeMediaLibraryModal()
}
</script>

<template>
  <div>
    <PageBuilder :CustomMediaLibraryComponent="YourMediaLibraryComponent" />
  </div>
</template>
```
