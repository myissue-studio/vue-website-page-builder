---
title: Draft Recovery — Vue Page Builder Autosave
description: Automatic local draft recovery in the Vue page builder. Unsaved work protection for ecommerce admin and SaaS content editors.
---

## Automatic Draft Recovery

The Page Builder automatically checks for unsaved drafts in local storage for the current resource.
If a draft is found, users are prompted to either continue where they left off or use the version loaded from your backend.

While this resume-choice modal is visible, autosave is paused so the existing draft is not overwritten by the backend version before the user chooses an option.

When users choose **Continue Where I Left Off**, page-level settings from the draft wrapper (`#pagebuilder` classes/style such as background, spacing, and global typography) are restored from the draft HTML as the source of truth.

Determines which draft to load from local storage. Set this to either `create` or `update` in the `updateOrCreate` config, depending on your use case.
Specifies the resource type (e.g., `article`, `jobPost`, `store`, etc.) in the `updateOrCreate` config. This is especially important if your platform supports multiple resource types. By providing a unique name, the Page Builder can correctly manage layouts and drafts for each resource, allowing users to pick up where they left off.

- When an empty incoming payload is mounted (wrapper-only, no sections), existing meaningful live wrapper page settings are preserved instead of being replaced by fallback default wrapper classes.

```vue
<script setup>
import { onMounted } from 'vue'
import { PageBuilder, getPageBuilder } from '@myissue/vue-website-page-builder'

const configPageBuilder = {
  updateOrCreate: {
    formType: 'update',
    formName: 'article',
  },
}

const pageBuilderService = getPageBuilder()

// Initialize the Page Builder with `onMounted`
onMounted(async () => {
  const result = await pageBuilderService.startBuilder(configPageBuilder)
  console.info('You may inspect this result for message, status, or error:', result)
})
</script>

<template>
  <PageBuilder />
</template>
```
