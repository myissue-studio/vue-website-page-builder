## Vue Integration

To use `@myissue/vue-website-page-builder` in your Vue project, follow these steps:

## Import

Import the `pageBuilder` Plugin and register it in your application entry point (e.g., `main.ts` or `main.js`). This sets up a single, shared Page Builder instance for your entire app.

Import the CSS file once in your `main.js`, `main.ts`, or root component. This ensures proper styling and automatic icon loading. You do **not** need to import it in individual components.

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import { pageBuilder } from '@myissue/vue-website-page-builder'
import '@myissue/vue-website-page-builder/style.css'

const app = createApp(App)
app.use(pageBuilder)
app.mount('#app')
```

## Use

Now anywhere in your application, use the `getPageBuilder()` composable to interact with the Page Builder’s shared instance.

You’re now ready to use the Page Builder in your Vue pages or components with the `getPageBuilder()` composable.

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

<template>
  <PageBuilder />
</template>
```

## Initialize Page Builder

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
