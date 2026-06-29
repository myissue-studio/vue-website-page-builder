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
