<p align="center" dir="auto">
<img width="200" style="max-width: 100%;" src="./public/logo/logo.svg" alt="Vue Website Page Builder Logo" />
</p>

# Free Click & Drop Page Builder

- [Free Click \& Drop Page Builder](#free-click--drop-page-builder)
  - [Demo](#demo)
  - [Overview](#overview)
  - [Get Started in Minutes](#get-started-in-minutes)
  - [About](#about)
  - [Real-World Application Example](#real-world-application-example)
  - [Reviews, Ratings, and User Testimonials](#reviews-ratings-and-user-testimonials)
  - [Features](#features)
  - [Technical Details](#technical-details)
  - [Documentation](#documentation)
  - [Requirements](#requirements)
  - [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Quick Start](#quick-start)
  - [Nuxt Integration](#nuxt-integration)
    - [1. Create a Nuxt Plugin](#1-create-a-nuxt-plugin)
    - [2. Register the Plugin in `nuxt.config.ts`](#2-register-the-plugin-in-nuxtconfigts)
    - [3. Using the Page Builder Component](#3-using-the-page-builder-component)
    - [4. Why Initialize the Page Builder with `onMounted` in Nuxt?](#4-why-initialize-the-page-builder-with-onmounted-in-nuxt)
  - [Vue Integration](#vue-integration)
    - [1. Import and use the Page Builder Plugin](#1-import-and-use-the-page-builder-plugin)
    - [2. Using the Page Builder Component](#2-using-the-page-builder-component)
    - [3. Initialize Page Builder with `onMounted` Troubleshooting](#3-initialize-page-builder-with-onmounted-troubleshooting)
  - [Why Use the Shared Instance?](#why-use-the-shared-instance)
  - [Important: CSS Prefixing (`pbx-`)](#important-css-prefixing-pbx-)
  - [Rendering HTML Output in Other Frameworks (React, Nuxt, etc.)](#rendering-html-output-in-other-frameworks-react-nuxt-etc)
  - [Providing Configuration to the Page Builder](#providing-configuration-to-the-page-builder)
  - [Comprehensive Language Support in the Page Builder](#comprehensive-language-support-in-the-page-builder)
      - [Default language](#default-language)
      - [Disabling the Language Dropdown](#disabling-the-language-dropdown)
  - [Local Storage \& Auto-Save](#local-storage--auto-save)
  - [Retrieving the Latest HTML Content for Form Submission](#retrieving-the-latest-html-content-for-form-submission)
    - [Resetting the Builder After Successful Resource Creation or Update](#resetting-the-builder-after-successful-resource-creation-or-update)
  - [Loading Existing Content or Components into the Page Builder](#loading-existing-content-or-components-into-the-page-builder)
    - [Restoring Full Page Content (Global Styles \& Components)](#restoring-full-page-content-global-styles--components)
  - [Automatic Draft Recovery](#automatic-draft-recovery)
  - [Embedding Page Builder in a Modal or Dialog](#embedding-page-builder-in-a-modal-or-dialog)
  - [Publish Button](#publish-button)
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

## Demo

Vue 3 Page Builder component with drag-and-drop functionality for creating dynamic web pages.

Try the live demo to explore real-time visual updates and smooth content management.
<br>
[Play around with the Page Builder](https://mybuilder.dev)

Create and enhance digital experiences with Vue on any backend.
Experience the power and simplicity of the Vue Website Page Builder in action, with a live SEO analyzer for content optimization.

<img style="width: 100%;" src="./public/home/for_read_me/vue3_page_builder_myissue.gif" alt="Vue Website Page Builder - the editor" />

## Overview

If you're a Vue 3 developer, this builder feels right at home. It installs quickly via npm and supports full customization through props and configuration objects. You can even set specific user settings like image, name, theme, language, company logo, and autosave preferences, making it a personalized experience for every user.

A lightweight and minimalist Page Builder with an elegant and intuitive design, focused on simplicity and speed.

Build responsive pages like listings, jobs, or blog posts and manage content easily.

<img style="width: 100%;" src="./public/home/for_read_me/browser_boat.svg" alt="Vue Website Page Builder - the editor" />

## Get Started in Minutes

Easy setup and instant productivity.
Follow the [Quick Start](#quick-start) guide to begin building with just a few simple steps.

---

## About

A Page Builder designed for growth. Build your website pages with ready-made components that are fully customizable and always responsive, designed to fit every need. A powerful Page Builder for growing merchants, brands, and agencies. And it is totally free.

<img style="width: 100%;" src="./public/home/for_read_me/browser_components.svg" alt="Vue Website Page Builder - the editor" />

## Real-World Application Example

From solo freelancers to fast-growing startups and established enterprises, the Page Builder is trusted by teams everywhere. With its intuitive click-and-drop editor, real-time visual editing, and a rich library of reusable components, you can turn ideas into polished pages in minutes. Built for merchants, brands, and agencies, it empowers anyone to create high-impact content.

Discover how the Vue Website Page Builder is empowering businesses to create dynamic and responsive web pages. A prime example is [myself.ae](https://www.myself.ae/stores), where the builder is utilized to create engaging and user-friendly online store pages.

## Reviews, Ratings, and User Testimonials

Here’s what users are saying about the Vue Website Page Builder:

⭐⭐⭐⭐⭐ "Game-Changer for Our Business"

_"The Vue Website Page Builder has completely transformed how we create and manage our website pages. The click-and-drop functionality is intuitive, and the real-time editing saves us so much time. Highly recommended!"_
— **Sarah L., Marketing Manager**

---

⭐⭐⭐⭐⭐ "Perfect for Agencies"

_"As an agency, we needed a tool that was flexible, fast, and easy to use for our clients. This builder ticks all the boxes. The reusable components and responsive design features are a huge plus!"_
— **James R., Founder of CreativeWorks**

---

⭐⭐⭐⭐ "Impressive Features and Support"

_"The builder is packed with features, and the support team is incredibly responsive."_
— **Emily T., Freelance Web Designer**

---

⭐⭐⭐⭐⭐ "A Must-Have for Blogs"

_"We use the builder for our blog. The ability to customize every detail while keeping the pages responsive is amazing. Our sales have increased since switching to this tool!"_
— **Ahmed K., Owner of Trendy**

---

⭐⭐⭐⭐⭐ "Great for Beginners and Experts Alike"

_"I’m not a developer, but I was able to create a professional-looking page in minutes. The interface is user-friendly, and the results are stunning."_
— **Lisa M., Small Business Owner**

---

Want to share your experience? [Submit your testimonial here](#feedback).

## Features

Includes:

- **Page Builder**: A Click & Drop Page Builder.
- **Customizable Design**: Customize the look to match your brand.

The Page Builder is packed with features:

- **Click & Drop**: Easily rearrange elements on your page.
- **Reordering**: Change the order of your content without hassle.
- **True Visual Editing**: See your changes in real-time as you make them.
- **Media Library**: Easily inject your own custom media library component.
- **Local Storage & Auto-Save**: Never lose your work—changes are saved as you go.
- **Unsplash**: Unsplash integration.
- **Responsive Editing**: Ensure your site looks great on all devices.
- **Text Editing**: Edit text content live and in real-time.
- **Font Customization**: Choose the perfect fonts to match your style.
- **SEO Score Checker**: Analyze your content live while editing for SEO optimization, including keyword density, readability, heading structure, and overall score to boost search rankings.
- **Undo & Redo**: Experiment confidently with the ability to revert changes.
- **Global Styles**: Global styles for fonts, designs, and colors.
- **YouTube Videos**: Integrate video content smoothly.
- **Download HTML**: Export the entire page as a standalone HTML file.
- **Global Page Styling**: Instantly define, update, or clear global styles for the main page wrapper at initialization or dynamically at runtime. Gain full control over fonts, colors, backgrounds, and more for a dynamic user experience.
- **Tailwind Support**: Fully compatible with Tailwind CSS (with automatic class prefixing to avoid conflicts). Tailwind installation is not required for the Page Builder to work.
- **Scoped Styles**: To ensure clean and predictable styling, the builder uses scoped style isolation. There is no risk of style conflicts between the builder and your app.
- **HTML Editor**: Access and edit raw HTML directly for full customization and developer-level control.

## Technical Details

- **Technologies**: This Page Builder is developed using TypeScript, Vue 3, the Composition API, Pinia, CSS, Tailwind CSS, and HTML.
- **Features**: Click & Drop Page Builder.

## Documentation

Find everything you need to get started, configure, and master the Vue Website Page Builder.
This section covers installation, requirements, quick start, advanced usage, and integration tips—so you can build and launch pages with confidence.

## Requirements

Please note that these instructions assume you have Node.js installed.

- Node.js ≥ 18.0.0
- Vue.js ≥ 3.0.0
- Modern browser with ES6+ support

## Getting Started

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Installation

The web builder for stunning pages. Enables users to design and publish modern pages at any scale.

```bash
npm install @myissue/vue-website-page-builder
```

## Quick Start

Get up and running with the Vue Website Page Builder in just a few minutes.  
This section walks you through the essential steps—from installation to rendering your first page—so you can start building beautiful, dynamic content right away.

## Nuxt Integration

To use `@myissue/vue-website-page-builder` in your Nuxt 3 or Nuxt 4 project, follow these steps:

> **🎉 Great news:** The Page Builder now works with Nuxt 3 and Nuxt 4.  
> Follow the steps below to get started in your Nuxt project.

### 1. Create a Nuxt Plugin

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

### 2. Register the Plugin in `nuxt.config.ts`

Make sure Nuxt knows about your new Plugin by adding it to your config:

> **Note:** If your Plugin is inside the `/plugins` folder, Nuxt will auto-register it.  
> Adding it to `nuxt.config.ts` is optional, but improves clarity.

```typescript
export default defineNuxtConfig({
  devtools: { enabled: true },
  plugins: ['./plugins/page-builder.client.js'],
})
```

### 3. Using the Page Builder Component

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

### 4. Why Initialize the Page Builder with `onMounted` in Nuxt?

In a Server-Side Rendering (SSR) framework like Nuxt, any code that depends on the browser (`DOM`, `window`, `localStorage`, etc.) should only run on the client. Using `onMounted` ensures the Page Builder initializes safely after the component is mounted, avoiding SSR errors. Many popular packages follow this pattern.

## Vue Integration

To use `@myissue/vue-website-page-builder` in your Vue project, follow these steps:

### 1. Import and use the Page Builder Plugin

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

### 2. Using the Page Builder Component

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

### 3. Initialize Page Builder with `onMounted` Troubleshooting

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

## Why Use the Shared Instance?

By always accessing the shared instance, you avoid creating multiple, isolated copies of the builder. This prevents data inconsistencies, synchronization issues, and unpredictable behavior. All components and modules interact with the same centralized service, ensuring that updates and state changes are reflected everywhere in your application.

> **Note:**  
> The Page Builder is implemented as a singleton service. All page-building logic and state are managed by a single shared instance, even if you use `<PageBuilder />` in multiple places.

## Important: CSS Prefixing (`pbx-`)

All CSS classes generated or processed by the Page Builder—including Tailwind utilities and your custom classes—are automatically prefixed with `pbx-`. This ensures the builder’s styles never conflict with your app’s existing CSS or Tailwind setup.
This prevents global styles from leaking into the builder and vice versa, which is crucial for embedding the builder into larger apps or white-label environments.

**How does this affect you?**

When a user adds a component into the Page Builder, all classes from that component are automatically prefixed with `pbx-` (e.g., `pbx-button`, `pbx-container`) to ensure style isolation and avoid conflicts.

Tailwind installation is not required. The Page Builder ships with prefixed utility classes to ensure there are no naming conflicts. If you wish to use Tailwind in your own application, you may install and configure it as usual without interfering with the Page Builder.

> **Note:**
> Simply import the builder’s CSS file once in your project. All builder styles are namespaced, so there is no risk of style conflicts.

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

## Providing Configuration to the Page Builder

The example below demonstrates the setup to start building pages, with additional options available for customization and branding.

Your `configPageBuilder` object can include:

- **`formType` (required):**
  Used to retrieve the correct content from local storage. Specify whether you are creating or updating a resource.
- **`formName` (required):**
  The resource type (e.g., `article`, `jobPost`, `store`, etc.). This is especially useful for platforms supporting multiple resource types, allowing the builder to manage layouts and storage for each resource uniquely.
- **`resourceData` (optional):**
  Prefill the builder with initial resource data (e.g., `title`, `id`).
- **`userForPageBuilder` (optional):**
  Pass user information (such as `name` and `image`) to display the logged-in user’s details in the builder.
- **`pageBuilderLogo` (optional):**
  Display your company logo in the builder toolbar.
- **`userSettings` (optional):**
  Set user preferences such as theme, language, or auto-save.
- **`brandColor` (optional):**
  Set your brand’s primary color for key UI elements (inside the `settings` config).

```vue
<script setup>
import { onMounted } from 'vue'
import { getPageBuilder } from '@myissue/vue-website-page-builder'

const configPageBuilder = {
  updateOrCreate: {
    formType: 'create', // Set to 'create' or 'update'
    // Set the resource type for better local storage and multi-resource support
    formName: 'article',
  },
  resourceData: {
    title: 'Demo Article',
    id: 1,
  },
  userForPageBuilder: { name: 'John Doe', image: '/jon_doe.jpg' },
  pageBuilderLogo: {
    src: '/logo/logo.svg',
  },
  userSettings: {
    theme: 'light',
    language: 'en',
    autoSave: true,
  },
  settings: {
    brandColor: '#DB93B0',
  },
}

const pageBuilderService = getPageBuilder()

onMounted(async () => {
  const result = await pageBuilderService.startBuilder(configPageBuilder)
  console.info('You may inspect this result for message, status, or error:', result)
})
</script>

<template>
  <PageBuilder />
</template>
```

## Comprehensive Language Support in the Page Builder

The Page Builder offers robust multilingual support, enabling you to reach a global audience with ease. By default, it supports the following languages, chosen for their widespread use and strong developer communities:

| Language             | Code    |
| -------------------- | ------- |
| English              | en      |
| Chinese (Simplified) | zh-Hans |
| French               | fr      |
| Japanese             | ja      |
| Russian              | ru      |
| Spanish              | es      |
| Portuguese (Brazil)  | pt      |
| German               | de      |
| Arabic               | ar      |
| Hindi                | hi      |

#### Default language

You can set a default language for your project:

```typescript
userSettings: {
  language: {
    default: 'en',
  },
},
```

If you prefer to offer only a subset of these languages for users to switch between, specify them using the `enable` option.

If you do not provide the `enable` array, the Page Builder will default to showing all supported languages by default.

```typescript
userSettings: {
  language: {
    default: 'en',
    enable: ['en', 'zh-Hans', 'fr'],
  },
},
```

#### Disabling the Language Dropdown

If you want to completely hide the language selector from the UI (e.g., when only one language is available or you want a fixed language), simply set `disableLanguageDropdown` to `true`.

Even when the dropdown is disabled, the default language will still be applied automatically. This gives you full control over localization while keeping the interface simple for your users.

```typescript
userSettings: {
  theme: 'light',
  language: {
    default: 'en',
    disableLanguageDropdown: true,
  },
},
```

This flexibility allows you to tailor the language experience to your audience’s needs.

## Local Storage & Auto-Save

The Page Builder automatically saves all changes to the browser’s local storage. Every time you add, edit, or delete a component, your progress is preserved—even if you close the browser or navigate away.

- **Auto-Save:** Changes are periodically saved as you work.
- **Manual Save:** Clicking the Save button also stores the current state.

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

### Resetting the Builder After Successful Resource Creation or Update

After successfully creating or updating a resource (such as a post, article, or listing) using the Page Builder, it is important to clear the `DOM` and the builder’s draft state, as well as remove the corresponding local storage entry. This ensures that old drafts do not appear the next time the builder is opened for a new or existing resource.

You can reset the Page Builder’s live `DOM`, builder state, and clear the draft with:

```typescript
await pageBuilderService.handleFormSubmission()
```

Always call this method after a successful post or resource update to ensure users start with a fresh builder the next time they create or edit a resource.

## Loading Existing Content or Components into the Page Builder

The Page Builder makes it simple to load previously published content—including both your page’s global styles and all components—from any backend source, such as your database or API.

### Restoring Full Page Content (Global Styles & Components)

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
   import { getPageBuilder } from '@myissue/vue-website-page-builder'

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

## Automatic Draft Recovery

The Page Builder automatically checks for unsaved drafts in local storage for the current resource.
If a draft is found, users are prompted to either continue where they left off or use the version loaded from your backend.

- **`formType` (required):**
  Determines which draft to load from local storage. Set this to either `create` or `update` in the `updateOrCreate` config, depending on your use case.
- **`formName` (required):**
  Specifies the resource type (e.g., `article`, `jobPost`, `store`, etc.) in the `updateOrCreate` config. This is especially important if your platform supports multiple resource types. By providing a unique name, the Page Builder can correctly manage layouts and drafts for each resource, allowing users to pick up where they left off.

```vue
<script setup>
import { onMounted } from 'vue'
import { getPageBuilder } from '@myissue/vue-website-page-builder'

const configPageBuilder = {
  updateOrCreate: {
    formType: 'update',
    formName: 'article',
  },
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

## Embedding Page Builder in a Modal or Dialog

You can easily use the Page Builder inside a modal or dialog.
To allow users to close the modal from inside the builder, use the `showCloseButton` prop and listen for the `@handleClosePageBuilder` event:

```vue
<script setup>
import { ref } from 'vue'
import { PageBuilder } from '@myissue/vue-website-page-builder'

const showModal = ref(true)
function closePageBuilder() {
  showModal.value = false
}
</script>

<template>
  <Modal v-if="showModal" @close="showModal = false">
    <PageBuilder :showCloseButton="true" @handleClosePageBuilder="closePageBuilder" />
  </Modal>
</template>
```

## Publish Button

To allow users to use the Publish button from inside the builder, use the `showPublishButton` prop and listen for the `@handlePublishPageBuilder` event.

> **Note:**
> When the Publish button is clicked, the Page Builder will automatically save the latest changes to local storage before emitting the `@handlePublishPageBuilder` event. This ensures you always receive the most up-to-date content.

```vue
<script setup>
import { getPageBuilder, PageBuilder } from '@myissue/vue-website-page-builder'

const pageBuilderService = getPageBuilder()

const handlePublish = () => {
  // Retrieve the latest HTML content (saved by the builder)
  const latestHtml = pageBuilderService.getSavedPageHtml()
  // Submit, publish, or process the content as needed
  // e.g., send latestHtml to your API or update your form
}
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
