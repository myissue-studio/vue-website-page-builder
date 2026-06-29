## Backend Integration

Use one database field for the saved builder output:

```ts
content: string
```

Store the full HTML returned by `pageBuilderService.getSavedPageHtml()`. Do not store only the component array if users need to edit the page later with global styles intact.

The saved HTML should include the outer `#pagebuilder` wrapper:

```html
<div id="pagebuilder" class="pbx-bg-red-500" style="letter-spacing: 2px;">
  <section data-component-title="Header">...</section>
  <section data-component-title="Content">...</section>
</div>
```

The wrapper stores global `pageSettings`. The sections store editable components.

## Create New Content

```vue
<script setup>
import { onMounted } from 'vue'
import { PageBuilder, getPageBuilder } from '@myissue/vue-website-page-builder'

const pageBuilderService = getPageBuilder()

const configPageBuilder = {
  updateOrCreate: {
    formType: 'create',
    formName: 'article',
  },
  resourceData: {
    title: 'New article',
  },
}

onMounted(async () => {
  await pageBuilderService.startBuilder(configPageBuilder)
})
</script>

<template>
  <PageBuilder />
</template>
```

## Edit Existing Content

When editing an existing post, parse the saved full HTML first. Then pass `components` as the second argument to `startBuilder()` and pass `pageSettings` directly in the config.

```vue
<script setup>
import { onMounted } from 'vue'
import { PageBuilder, getPageBuilder } from '@myissue/vue-website-page-builder'

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
})

const pageBuilderService = getPageBuilder()

onMounted(async () => {
  const { components, pageSettings } = pageBuilderService.parsePageBuilderHTML(props.post.content)

  const configPageBuilder = {
    updateOrCreate: {
      formType: 'update',
      formName: 'article',
    },
    resourceData: {
      id: props.post.id,
      title: props.post.title,
    },
    pageSettings,
  }

  await pageBuilderService.startBuilder(configPageBuilder, components)
})
</script>

<template>
  <PageBuilder />
</template>
```

## Publish or Save

When the user saves or publishes, send the full page HTML to your backend.

```ts
async function savePost() {
  const content = pageBuilderService.getSavedPageHtml()

  await api.updatePost(post.id, {
    content,
  })

  await pageBuilderService.handleFormSubmission()
}
```

`handleFormSubmission()` clears the current draft after your backend save succeeds.

## Render Saved Content

In the frontend that renders published content, import the Page Builder CSS once and render the saved HTML string.

```ts
import '@myissue/vue-website-page-builder/style.css'
```

Vue:

```vue
<template>
  <article v-html="post.content"></article>
</template>
```

React:

```jsx
function Article({ post }) {
  return <article dangerouslySetInnerHTML={{ __html: post.content }} />
}
```

## Data Contract

Recommended backend shape:

```ts
type Post = {
  id: number | string
  title: string
  content: string
}
```

`content` should be the complete builder HTML:

```html
<div id="pagebuilder" class="..." style="...">
  <section data-component-title="...">...</section>
</div>
```

## Common Mistakes

- Saving only `<section>...</section>` markup. This loses global page styles.
- Passing parsed `components` into `startBuilder()` but forgetting `pageSettings`.
- Nesting settings as `pageSettings: { pageSettings }`. Pass `pageSettings` directly.
- Calling `handleFormSubmission()` before the backend save succeeds.
- Rendering saved HTML without importing `@myissue/vue-website-page-builder/style.css`.
