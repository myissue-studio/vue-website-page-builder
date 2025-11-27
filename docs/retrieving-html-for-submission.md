## Retrieving HTML for Submission

Retrieving the Latest HTML Content for Form Submission.
The builder’s auto-save ensures that the data in local storage always reflects the latest state of your page. You can retrieve this data at any time for form submission, publishing, or preview.

To get the most up-to-date content, use the same `resourceData` (such as `formType` and `formName`) that was used when saving. If these values do not match, the builder may not find the expected content.

**Example:**

```typescript
const configPageBuilder = {
  updateOrCreate: {
    formType: 'create',
    formName: 'article',
  },
}
```

Call this logic when you need to submit or save the builder’s output—for example, when the user clicks “Save” or “Publish.” The code below safely retrieves and parses the latest data from local storage, handling errors and assigning the results to your form fields.

```vue
<script setup>
import { onMounted } from 'vue'
import { getPageBuilder } from '@myissue/vue-website-page-builder'

const configPageBuilder = {
  updateOrCreate: {
    formType: 'create',
    formName: 'article',
  },
}

const pageBuilderService = getPageBuilder()

onMounted(async () => {
  const result = await pageBuilderService.startBuilder(configPageBuilder)
  console.info('You may inspect this result for message, status, or error:', result)
})

const getComponents = function () {
  const storedComponents = pageBuilderService.getSavedPageHtml()
  yourForm.content = storedComponents
}

// Call getComponents when needed.
</script>
```

## Resetting the Builder Content

After successfully creating or updating a resource (such as a post, article, or listing) using the Page Builder, it is important to clear the `DOM` and the builder’s draft state, as well as remove the corresponding local storage entry. This ensures that old drafts do not appear the next time the builder is opened for a new or existing resource.

You can reset the Page Builder’s live `DOM`, builder state, and clear the draft with:

```typescript
await pageBuilderService.handleFormSubmission()
```

Always call this method after a successful post or resource update to ensure users start with a fresh builder the next time they create or edit a resource.
