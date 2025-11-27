# Free Click & Drop Page Builder

- [Free Click \& Drop Page Builder](#free-click--drop-page-builder)
	- [Retrieving the Latest HTML Content for Form Submission](#retrieving-the-latest-html-content-for-form-submission)
	- [Close Page Builder Without Saving in a Modal or Dialog](#close-page-builder-without-saving-in-a-modal-or-dialog)
	- [Publish Changes Using the Save Button](#publish-changes-using-the-save-button)
	- [Styling the Main Page Builder Container](#styling-the-main-page-builder-container)
	- [Download HTML File](#download-html-file)
	- [Custom Components](#custom-components)
		- [Custom Media Library Component](#custom-media-library-component)
		- [Integrate Unsplash Library](#integrate-unsplash-library)
		- [Custom Layout Builder Component](#custom-layout-builder-component)
	- [Troubleshooting](#troubleshooting)
		- [1. Fonts or Icons Not Displaying](#1-fonts-or-icons-not-displaying)
		- [2. Initialize Page Builder with `onMounted` Troubleshooting](#2-initialize-page-builder-with-onmounted-troubleshooting)
	- [Page Builder Architecture](#page-builder-architecture)
		- [How the Page Builder Works](#how-the-page-builder-works)
	- [Contributing](#contributing)
	- [Security Vulnerabilities](#security-vulnerabilities)
	- [Get in Touch for Customization or Any Questions](#get-in-touch-for-customization-or-any-questions)
	- [Report Issues or Request Features](#report-issues-or-request-features)
	- [Feedback](#feedback)
	- [Support the Project](#support-the-project)
	- [License](#license)

---

## Retrieving the Latest HTML Content for Form Submission

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

## Close Page Builder Without Saving in a Modal or Dialog

You can easily use the Page Builder inside a modal or dialog.
To close the page builder without saving, or to allow users to close the modal from inside the builder, use the `showCloseButton` prop and listen for the `@handleClosePageBuilder` event:

```vue
<script setup>
import { onMounted, ref } from 'vue'
import { PageBuilder, getPageBuilder } from '@myissue/vue-website-page-builder'

const configPageBuilder = {
  updateOrCreate: {
    formType: 'update',
    formName: 'article',
  },
}
const showModal = ref(true)

function closePageBuilder() {
  showModal.value = false
}

const pageBuilderService = getPageBuilder()

// Initialize the Page Builder with `onMounted`
onMounted(async () => {
  const result = await pageBuilderService.startBuilder(configPageBuilder)
  console.info('You may inspect this result for message, status, or error:', result)
})
</script>

<template>
  <Modal v-if="showModal" @close="showModal = false">
    <PageBuilder :showCloseButton="true" @handleClosePageBuilder="closePageBuilder" />
  </Modal>
</template>
```

## Publish Changes Using the Save Button

To allow users to use the Publish button from inside the builder, use the `showPublishButton` prop and listen for the `@handlePublishPageBuilder` event.

> **Note:**
> When the Publish button is clicked, the Page Builder will automatically save the latest changes to local storage before emitting the `@handlePublishPageBuilder` event. This ensures you always receive the most up-to-date content.

```vue
<script setup>
import { onMounted } from 'vue'
import { PageBuilder, getPageBuilder } from '@myissue/vue-website-page-builder'

const pageBuilderService = getPageBuilder()

const handlePublish = () => {
  // Retrieve the latest HTML content (saved by the builder)
  const latestHtml = pageBuilderService.getSavedPageHtml()
  // Submit, publish, or process the content as needed
  // e.g., send latestHtml to your API or update your form
}

const pageBuilderService = getPageBuilder()

// Initialize the Page Builder with `onMounted`
onMounted(async () => {
  const result = await pageBuilderService.startBuilder(configPageBuilder)
  console.info('You may inspect this result for message, status, or error:', result)
})
</script>

<template>
  <PageBuilder :showPublishButton="true" @handlePublishPageBuilder="handlePublish" />
</template>
```

- `:showPublishButton="true"` — shows a publish button in the Page Builder toolbar.
- `@handlePublishPageBuilder="handlePublish"` — emits after the builder auto-saves, so you always get the latest content.

> **Tip:**
> You can name your handler function anything you like. This pattern makes it easy to embed the builder in modals, dialogs, or overlays in any Vue app.

## Styling the Main Page Builder Container

The Page Builder allows you to define and update global styles for the main wrapper (`#pagebuilder`) at any time. These settings control the overall appearance, including font family, text color, background color, and more. Whether you set them initially in your config or update them dynamically at runtime, your changes are instantly reflected across all sections.

Use the `pageSettings` config to apply custom CSS classes and inline styles to the Page Builder’s main wrapper.
The Page Builder renders all components wrapped inside a single parent container, `<div id="pagebuilder">`.
You can pass global CSS `classes` and `style` to this wrapper by adding a `pageSettings` object in your config:

```ts
const configPageBuilder = {
  // other config options...

  pageSettings: {
    classes: 'max-w-screen-lg mx-auto px-4 bg-white',
    style: {
      backgroundColor: 'red',
      border: '6px solid yellow',
    },
  },
} as const
```

You have full control over the page’s appearance at any time—instantly override or clear global styles for the entire page, ensuring a seamless and dynamic user experience.

## Download HTML File

Export the entire page as a standalone HTML file. This includes all sections, content, and applied styles, making the file ready for use or integration elsewhere.

- Images may not display correctly in the exported HTML unless their URLs are properly prefixed or fully qualified.

To ensure images render properly after export, you must specify a URL prefix in your Page Builder configuration. This prefix will be prepended to all relative image URLs during the export process.

```ts
const configPageBuilder = {
  imageUrlPrefix: 'https://your-domain.com/uploads/',
  // other config options...
} as const
```

## Custom Components

If you want to use your own components—whether custom-designed or tailored to your application's needs—you can inject them directly into the builder.

### Custom Media Library Component

By default, the Page Builder does not include a built-in media library.

This is intentional—without a custom media library, layout components that rely on images (such as Image Blocks, Hero Sections, and similar) are disabled by default. Only helper components like containers, headings, text, and buttons are available in this state.

You may extend the Page Builder by adding your own media library.
Inject your media library component easily to tailor the builder to your application's needs.

📚 **[Custom Components Setup Guide](./CUSTOM_COMPONENTS_SETUP.md)**
Learn how to create and integrate your own components step by step.

### Integrate Unsplash Library

Easily add Unsplash image search to your media library modal—just like in the demo!
A code example is provided so you can copy-paste to get started.

See the full step-by-step guide and working demo code here:
📚 **[Unsplash Integration Guide](./UNSPLASH_INTEGRATION.md)**

### Custom Layout Builder Component

The Page Builder comes with a growing collection of built-in components, including both layout and helper components. These defaults are continuously improved and expanded.

📚 **[Custom Components Setup Guide](./CUSTOM_COMPONENTS_SETUP.md)**
Learn how to create and integrate your own components step by step.

## Troubleshooting

### 1. Fonts or Icons Not Displaying

If fonts or Material Icons are not displaying correctly, verify that:

**CSS Import**: You are importing the CSS file:

```typescript
// Import the Page Builder styles once in your application entry, not in individual components.
import '@myissue/vue-website-page-builder/style.css'
```

### 2. Initialize Page Builder with `onMounted` Troubleshooting

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

## Page Builder Architecture

The Page Builder is designed as a modular, state-driven editor for dynamic page content. Its architecture separates configuration, state management, and `DOM` interaction, ensuring flexibility and maintainability.

### How the Page Builder Works

The Page Builder is designed to be easy to use and flexible for any web project. Here’s how it works behind the scenes:

- **Configuration First:**
  When you start the builder, you pass in your configuration (such as what type of page you’re building, user info, branding, and any existing content).
  The builder saves this configuration immediately—even if the editing interface `DOM` isn’t loaded yet. This means you can safely set up the builder in advance, and it will be ready as soon as the editor appears on the page.

- **Loading Content:**
  If you have existing content (like a published page), the builder loads it so you can continue editing. If not, you start with a blank page.

- **Editing Experience:**
  As you add, move, or edit components (like text, images, or sections), the builder keeps everything in sync—both in the app’s memory and in your browser’s local storage. This means your work is always saved, even if you close the browser.

**In short:**
The Page Builder handles all the technical details of editing, saving, and loading pages, so your users can focus on creating great content—without worrying about losing their work or dealing with a complicated setup.

<img style="max-width: 100%;" src="./public/home/for_read_me/page_builder_architecture.svg" alt="Vue Website Page Builder - the editor" />

## Contributing

1. Fork the repository.
2. Create your feature branch.
3. Make your changes.
4. Build and test locally.
5. Submit a pull request.

## Security Vulnerabilities

If you discover a security vulnerability, please send us a message.

## Get in Touch for Customization or Any Questions

If you have any questions or if you're looking for customization, feel free to connect with our developer.

- [Email](mailto:qais.wardag@outlook.com)
- [LinkedIn](https://www.linkedin.com/in/qaiswardag)

## Report Issues or Request Features

Encountered a bug, have suggestions, or need a new feature? Create a GitHub issue:

- [Submit an Issue](https://github.com/myissue-studio/vue-website-page-builder/issues)

## Feedback

Feedback, suggestions or any issues you encounter while using this app. Feel free to reach out.

- [Submit your testimonial here](https://github.com/myissue-studio/vue-website-page-builder/issues)

## Support the Project

We would greatly appreciate it if you could star the GitHub repository. Starring the project helps to boost its visibility.

## License

[MIT License](./LICENSE)
