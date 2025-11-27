## Nuxt Integration

To use `@myissue/vue-website-page-builder` in your Nuxt 3 or Nuxt 4 project, follow these steps:

> **🎉 Great news:** The Page Builder now works with Nuxt 3 and Nuxt 4.  
> Follow the steps below to get started in your Nuxt project.

## Create a Nuxt Plugin

In the root, create a file named:

```plaintext
plugins/page-builder.client.js
```

Add the following code:

```javascript
import { pageBuilder } from '@myissue/vue-website-page-builder'
// Import the Page Builder styles once in your application entry, not in individual components.
import '@myissue/vue-website-page-builder/style.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(pageBuilder)
})
```

## Register the Plugin in `nuxt.config.ts`

Make sure Nuxt knows about your new Plugin by adding it to your config:

> **Note:** If your Plugin is inside the `/plugins` folder, Nuxt will auto-register it.  
> Adding it to `nuxt.config.ts` is optional, but improves clarity.

```typescript
export default defineNuxtConfig({
  devtools: { enabled: true },
  plugins: ['./plugins/page-builder.client.js'],
})
```

## Using the Page Builder Component

Now anywhere in your application, use the `getPageBuilder()` composable to interact with the Page Builder’s shared instance.

The Page Builder relies on browser APIs like `localStorage` and dynamic `DOM` manipulation, which are only available on the client side. Wrapping it in `<client-only>` ensures it is rendered exclusively in the browser, preventing SSR errors and guaranteeing a smooth editing experience.

You’re now ready to use the Page Builder in your Nuxt pages or components with the `getPageBuilder()` composable.

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
  <div>
    <client-only>
      <PageBuilder />
    </client-only>
  </div>
</template>
```

> **Tip:**  
> By initializing the builder inside `onMounted`, you ensure everything is ready and avoid hydration errors.

## Why Initialize the Page Builder with `onMounted` in Nuxt?

In a Server-Side Rendering (SSR) framework like Nuxt, any code that depends on the browser (`DOM`, `window`, `localStorage`, etc.) should only run on the client. Using `onMounted` ensures the Page Builder initializes safely after the component is mounted, avoiding SSR errors. Many popular packages follow this pattern.
