---
title: Restore Content — Vue Page Builder & CMS
description: Load existing page HTML from your database into the Vue page builder. parsePageBuilderHTML() and startBuilder() for ecommerce and multi-tenant SaaS editing.
---

## Loading Existing Content or Components into the Page Builder

The Page Builder makes it simple to load previously published content—including both your page’s global styles and all components—from any backend source, such as your database or API.

The most reliable integration is a two-step loop:

1. Save the full HTML returned by `pageBuilderService.getSavedPageHtml()` to your backend.
2. When editing later, parse that same full HTML with `pageBuilderService.parsePageBuilderHTML()`.

Do not save only the component array if you need global page styles. Global styles live on the outer `#pagebuilder` wrapper.

## Restoring Full Page Content (Global Styles & Components)

If you have previously saved or published HTML content (for example, from your database), you can easily restore both the global page styles (classes, inline styles) and all builder components for seamless editing.

The important detail is that a saved page has two parts:

- The outer `<div id="pagebuilder">` stores global page styles.
- The inner `<section>...</section>` elements store the editable components.

For example, if your saved HTML contains this outer wrapper:

```html
<div
  id="pagebuilder"
  class="pbx-text-2xl lg:pbx-text-4xl pbx-font-light pbx-font-rockwell pbx-italic pbx-text-amber-200 pbx-rounded-full"
  style="background:#CBDF90"
>
  <section data-component-title="Hero">...</section>
  <section data-component-title="Content">...</section>
</div>
```

`parsePageBuilderHTML()` extracts the wrapper styles into:

```ts
pageSettings: {
  classes:
    'pbx-text-2xl lg:pbx-text-4xl pbx-font-light pbx-font-rockwell pbx-italic pbx-text-amber-200 pbx-rounded-full',
  style: {
    background: '#CBDF90',
  },
}
```

Then you pass those extracted `pageSettings` back into the config when opening the builder again.

**Recommended Workflow:**

1. **Parse your saved HTML** using the builder’s helper method to extract both the components and the global page settings:

   ```typescript
   // yourPageHTML: the full HTML string previously saved from the builder
   const { components, pageSettings } = pageBuilderService.parsePageBuilderHTML(yourPageHTML)
   ```

2. **Pass `pageSettings` directly** in your config object, and pass the `components` array as the second argument to `startBuilder`:

   ```vue
   <script setup>
   import { onMounted } from 'vue'
   import { PageBuilder, getPageBuilder } from '@myissue/vue-website-page-builder'

   // Retrieve the Page Builder service instance
   const pageBuilderService = getPageBuilder()

   // Parse your saved HTML to extract both components and global page settings
   const { components, pageSettings } = pageBuilderService.parsePageBuilderHTML(yourPageHTML)

   // Prepare the config, passing pageSettings directly
   const configPageBuilder = {
     updateOrCreate: {
       formType: 'update', // important: set to update
       formName: 'article',
     },
     // pass directly, not nested
     pageSettings: pageSettings,
   }

   // Initialize the Page Builder with `onMounted`
   onMounted(async () => {
     const result = await pageBuilderService.startBuilder(configPageBuilder, components)
     console.info('You may inspect this result for message, status, or error:', result)
   })
   </script>

   <template>
     <PageBuilder />
   </template>
   ```

> **Note:**
>
> - Each component’s `html_code` must be wrapped in a `<section>...</section>` tag. This is how the Page Builder defines and separates individual components.
> - Always pass `pageSettings` directly in the config object (not as `{ pageSettings: { pageSettings } }`).
> - Always pass the parsed `components` array as the second argument to `startBuilder(configPageBuilder, components)`.
> - Set `formType: 'update'` to ensure the builder loads your provided content for editing.

This approach ensures your users can seamlessly restore and edit previously published content—including all global styles and layout—providing a smooth and reliable editing experience for existing pages.

## Full Update Example

This is the common pattern for editing an existing post. The saved `post.content` should be the full HTML string returned by `getSavedPageHtml()`.

```vue
<script setup>
import { onMounted } from 'vue'
import { PageBuilder, getPageBuilder } from '@myissue/vue-website-page-builder'

const props = defineProps({
  post: {
    type: Object,
    default: null,
  },
})

const pageBuilderService = getPageBuilder()

onMounted(async () => {
  let components = []
  let pageSettings = null

  if (props.post?.content) {
    const parsed = pageBuilderService.parsePageBuilderHTML(props.post.content)
    components = parsed.components
    pageSettings = parsed.pageSettings
  }

  const configPageBuilder = {
    updateOrCreate: {
      formType: props.post ? 'update' : 'create',
      formName: 'article',
    },
    resourceData: props.post
      ? {
          id: props.post.id,
          title: props.post.title,
        }
      : null,
    pageSettings,
  }

  await pageBuilderService.startBuilder(configPageBuilder, components)
})
</script>

<template>
  <PageBuilder />
</template>
```

## Common Mistakes

- Passing only `components` back to `startBuilder()` and forgetting `pageSettings`.
- Saving only `<section>...</section>` markup to the backend. This loses global styles because the `#pagebuilder` wrapper is missing.
- Nesting the parsed settings incorrectly, such as `pageSettings: { pageSettings }`. Pass it directly as `pageSettings`.
- Using `formType: 'create'` when editing existing content. Use `formType: 'update'`.

## If You Already Have Old Section-Only HTML

If your database contains only sections and no outer wrapper, the builder can still parse the components:

```ts
const { components } = pageBuilderService.parsePageBuilderHTML(oldSectionOnlyHtml)
```

But `pageSettings` will be empty because there is no `#pagebuilder` wrapper to read from. In that case, pass default settings manually:

```ts
const configPageBuilder = {
  updateOrCreate: {
    formType: 'update',
    formName: 'article',
  },
  pageSettings: {
    classes: 'pbx-bg-white',
    style: '',
  },
}

await pageBuilderService.startBuilder(configPageBuilder, components)
```
