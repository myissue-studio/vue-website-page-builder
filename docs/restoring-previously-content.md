## Loading Existing Content or Components into the Page Builder

The Page Builder makes it simple to load previously published content—including both your page’s global styles and all components—from any backend source, such as your database or API.

## Restoring Full Page Content (Global Styles & Components)

If you have previously saved or published HTML content (for example, from your database), you can easily restore both the global page styles (classes, inline styles) and all builder components for seamless editing.

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

> **Note:**
>
> - Each component’s `html_code` must be wrapped in a `<section>...</section>` tag. This is how the Page Builder defines and separates individual components.
> - Always pass `pageSettings` directly in the config object (not as `{ pageSettings: { pageSettings } }`).
> - Set `formType: 'update'` to ensure the builder loads your provided content for editing.

This approach ensures your users can seamlessly restore and edit previously published content—including all global styles and layout—providing a smooth and reliable editing experience for existing pages.
