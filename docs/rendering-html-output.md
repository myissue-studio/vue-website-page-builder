## Rendering HTML Output in Other Frameworks (React, Nuxt, etc.)

You can use the Page Builder to generate HTML and render it in any frontend framework, such as React, Nuxt, or even server-side apps.

To ensure your content is styled correctly, simply install the Page Builder package in your target project and import its CSS file. All builder and Tailwind-prefixed styles will be applied automatically.

```typescript
// Import the Page Builder styles once in your application entry, not in individual components.
import '@myissue/vue-website-page-builder/style.css'
```

This will apply all necessary styles to any HTML output from the builder, even if you render it with `dangerouslySetInnerHTML`, `v-html`, or similar methods.

**Example (React):**

```jsx
// Import the Page Builder styles once in your application entry, not in individual components.
import '@myissue/vue-website-page-builder/style.css'

function MyPage({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
```

**Example (Nuxt/Vue):**

```vue
<script setup>
import { ref } from 'vue'
// Import the Page Builder styles once in your application entry, not in individual components.
import '@myissue/vue-website-page-builder/style.css'

const rawHtml = ref('<p>This is content from the Page Builder.</p>')
</script>

<template>
  <div v-html="rawHtml"></div>
</template>
```

> **Note:**
> You do not need to import any Vue components if you only want to render the HTML. Just import the CSS file.
