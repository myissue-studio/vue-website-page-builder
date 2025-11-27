## Automatic Draft Recovery

The Page Builder automatically checks for unsaved drafts in local storage for the current resource.
If a draft is found, users are prompted to either continue where they left off or use the version loaded from your backend.

- **`formType` (required):**
  Determines which draft to load from local storage. Set this to either `create` or `update` in the `updateOrCreate` config, depending on your use case.
- **`formName` (required):**
  Specifies the resource type (e.g., `article`, `jobPost`, `store`, etc.) in the `updateOrCreate` config. This is especially important if your platform supports multiple resource types. By providing a unique name, the Page Builder can correctly manage layouts and drafts for each resource, allowing users to pick up where they left off.

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
