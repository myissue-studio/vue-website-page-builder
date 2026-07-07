---
title: Troubleshooting — Vue Page Builder
description: Common fixes for fonts, icons, CSS conflicts, and integration issues when embedding the Vue 3 page builder in admin and SaaS apps.
---

## Troubleshooting

If you run into any issues while using the Page Builder, this section will help you diagnose and solve them.
Check the tips below to quickly identify common problems and their solutions.

## Fonts or Icons Not Displaying

If fonts or Material Icons are not displaying correctly, verify that:

**CSS Import**: You are importing the CSS file:

```typescript
// Import the Page Builder styles once in your application entry, not in individual components.
import '@myissue/vue-website-page-builder/style.css'
```

## Global Styles Missing When Editing Existing Content

Global page styles are stored on the outer `#pagebuilder` wrapper in the saved HTML:

```html
<div id="pagebuilder" class="pbx-bg-red-500" style="letter-spacing: 2px;">
  <section data-component-title="Header">...</section>
</div>
```

When restoring existing content, parse the full saved HTML and pass both values back into the builder:

```ts
const { components, pageSettings } = pageBuilderService.parsePageBuilderHTML(post.content)

await pageBuilderService.startBuilder(
  {
    updateOrCreate: {
      formType: 'update',
      formName: 'article',
    },
    pageSettings,
  },
  components,
)
```

If your saved HTML only contains `<section>...</section>` elements, the builder can recover the components but not the global page styles. Save the full HTML returned by `getSavedPageHtml()` to avoid this.

## Published HTML Renders Without Styling

Import the package stylesheet once in the app that renders saved content:

```ts
import '@myissue/vue-website-page-builder/style.css'
```

You do not need to mount the Page Builder component just to render saved HTML.

## Components Not Editable After Closing And Reopening Builder

If sections render but you cannot click/select/edit them after closing and reopening the modal, the issue is usually a stale singleton lifecycle state.

This was fixed by resetting internal mount guards on each `startBuilder()` call, so deferred mounting can run again when `#pagebuilder` is recreated.

An additional fix now also resets transient interaction state on `startBuilder()` (inline editor mode, image settings panel state, and stale selected element references). If these singleton flags leak between sessions, clicks can be ignored until another modal action re-initializes state.

If you still observe this behavior, make sure you are on a version that includes this fix and that `startBuilder()` is called every time the builder is reopened.

## Use with `onMounted`

Initialize Page Builder with `onMounted` Troubleshooting.
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

## Vitest: Inline TipTap Double-Click Test Fails Intermittently

If this assertion fails in `src/tests/service/pageBuilderService.test.ts`:

```text
expected "spy" to be called with arguments: [ true ]
```

make sure your branch includes the latest `PageBuilderService` inline-edit listener handling.
The service now uses `stopPropagation()` (not `stopImmediatePropagation()`) for canvas inline-edit capture, so older/stale listeners from earlier test instances do not block the active one.

Then re-run:

```bash
npx vitest run src/tests/service/pageBuilderService.test.ts --reporter=dot
```
