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
  Set user preferences such as theme, language, or auto-save.
- **`brandColor` (optional):**
  Set your brand’s primary color for key UI elements (inside the `settings` config).

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
    theme: 'light',
    language: 'en',
    autoSave: true,
  },
  settings: {
    brandColor: '#DB93B0',
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
