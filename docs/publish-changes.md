---
title: Publish Changes — Vue Page Builder Events
description: Wire the Publish button in your Vue page builder admin. showPublishButton prop and handlePublishPageBuilder for SaaS and CMS workflows.
---

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
  // Retrieve the latest full page HTML saved by the builder.
  // Save this full string to your backend so global pageSettings can be restored later.
  const latestHtml = pageBuilderService.getSavedPageHtml()
  // Example:
  // await api.updatePost(post.id, { content: latestHtml })
}

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

`latestHtml` includes the outer `#pagebuilder` wrapper:

```html
<div id="pagebuilder" class="pbx-bg-red-500" style="letter-spacing: 2px;">
  <section data-component-title="Header">...</section>
  <section data-component-title="Content">...</section>
</div>
```

Keep that wrapper when saving to your backend. On edit, use `parsePageBuilderHTML(latestHtml)` to recover both `components` and `pageSettings`.

> **Tip:**
> You can name your handler function anything you like. This pattern makes it easy to embed the builder in modals, dialogs, or overlays in any Vue app.
