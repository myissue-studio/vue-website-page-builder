## Publish Changes

Publish Changes Using the Save Button.
To allow users to use the Publish button from inside the builder, use the `showPublishButton` prop and listen for the `@handlePublishPageBuilder` event.

> **Note:**
> When the Publish button is clicked, the Page Builder will automatically save the latest changes to local storage before emitting the `@handlePublishPageBuilder` event. This ensures you always receive the most up-to-date content.

```vue
<script setup>
import { onMounted } from 'vue'
import { PageBuilder, getPageBuilder } from '@myissue/vue-website-page-builder'

const pageBuilderService = getPageBuilder()

const handlePublish = () => {
  // Retrieve the latest HTML content (saved by the builder)
  const latestHtml = pageBuilderService.getSavedPageHtml()
  // Submit, publish, or process the content as needed
  // e.g., send latestHtml to your API or update your form
}

const pageBuilderService = getPageBuilder()

// Initialize the Page Builder with `onMounted`
onMounted(async () => {
  const result = await pageBuilderService.startBuilder(configPageBuilder)
  console.info('You may inspect this result for message, status, or error:', result)
})
</script>

<template>
  <PageBuilder :showPublishButton="true" @handlePublishPageBuilder="handlePublish" />
</template>
```

- `:showPublishButton="true"` — shows a publish button in the Page Builder toolbar.
- `@handlePublishPageBuilder="handlePublish"` — emits after the builder auto-saves, so you always get the latest content.

> **Tip:**
> You can name your handler function anything you like. This pattern makes it easy to embed the builder in modals, dialogs, or overlays in any Vue app.
