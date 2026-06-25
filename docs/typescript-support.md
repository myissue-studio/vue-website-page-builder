# TypeScript Support

The `@myissue/vue-website-page-builder` package is built with TypeScript and includes comprehensive type declarations for full TypeScript support in your projects.

## Automatic Type Inference

When you install the package, TypeScript will automatically pick up the type declarations:

```bash
npm install @myissue/vue-website-page-builder
```

No additional setup or `@types` packages are needed.

## Available Types

### Core Exports

#### `PageBuilder` Component

The main Vue component for the page builder.

```vue
<script setup lang="ts">
import { PageBuilder } from '@myissue/vue-website-page-builder'
</script>

<template>
  <PageBuilder />
</template>
```

#### `getPageBuilder()` Function

Returns the singleton instance of the PageBuilderService.

```typescript
import { getPageBuilder } from '@myissue/vue-website-page-builder'

const pageBuilderService = getPageBuilder()
```

#### `usePageBuilderModal()` Composable

Hook for managing page builder modals.

```typescript
import { usePageBuilderModal } from '@myissue/vue-website-page-builder'

const { closeAddComponentModal, closeMediaLibraryModal } = usePageBuilderModal()
```

### Type Interfaces

#### `PageBuilderConfig`

Configuration object for initializing the page builder.

```typescript
import type { PageBuilderConfig } from '@myissue/vue-website-page-builder'

const config: PageBuilderConfig = {
  updateOrCreate: {
    formType: 'create', // or 'update'
    formName: 'article',
  },
  resourceData: {
    title: 'My Article',
    id: 1,
  },
  userForPageBuilder: {
    name: 'John Doe',
    image: '/john_doe.jpg',
  },
  pageBuilderLogo: {
    src: '/logo/logo.svg',
  },
  userSettings: {
    language: {
      default: 'en',
      enable: ['en', 'zh-Hans', 'fr'],
    },
    // Available fonts: jost, raleway, palantino, arial, helvetica, georgia, times, times-new-roman,
    // courier, courier-new, verdana, tahoma, trebuchet, garamond, bookman, comic-sans, impact,
    // lucida, lucida-console, lucida-sans, candara, optima, avenir, futura, calibri, cambria,
    // didot, franklin-gothic, rockwell, baskerville, sans, serif, mono
    fontFamily: 'jost',
    autoSave: true,
  },
  settings: {
    brandColor: '#DB93B0',
  },
}
```

#### `ComponentObject`

Represents a page builder component.

```typescript
import type { ComponentObject } from '@myissue/vue-website-page-builder'

const component: ComponentObject = {
  id: '1',
  html_code: '<div>My content</div>',
  title: 'Hero Section',
}
```

#### `ImageObject`

Represents an image in the page builder.

```typescript
import type { ImageObject } from '@myissue/vue-website-page-builder'

const image: ImageObject = {
  src: 'https://example.com/image.jpg',
}
```

#### `PageBuilderUser`

User information for display in the builder.

```typescript
import type { PageBuilderUser } from '@myissue/vue-website-page-builder'

const user: PageBuilderUser = {
  name: 'John Doe',
  image: '/john_doe.jpg',
}
```

#### `BuilderResourceComponent`

A single component/block passed by the developer.

```typescript
import type { BuilderResourceComponent } from '@myissue/vue-website-page-builder'

const resource: BuilderResourceComponent = {
  html_code: '<section>Content</section>',
  title: 'Section Title',
}
```

#### `BuilderResourceData`

Array of components for the page builder.

```typescript
import type { BuilderResourceData } from '@myissue/vue-website-page-builder'

const resourceData: BuilderResourceData = [
  { html_code: '<div>Component 1</div>', title: 'Component 1' },
  { html_code: '<div>Component 2</div>', title: 'Component 2' },
]
```

#### `FormName`

Valid form/resource type names.

```typescript
import type { FormName } from '@myissue/vue-website-page-builder'

// Examples of valid FormName values:
// Content: 'post', 'article', 'blog', 'news', 'page', 'faq', 'testimonial', etc.
// Commerce: 'product', 'products', 'category', 'collection', 'brand', etc.
// User/Team: 'profile', 'account', 'user', 'member', etc.

const formName: FormName = 'article'
```

#### `StartBuilderResult`

Return type from `startBuilder()` method.

```typescript
import type { StartBuilderResult } from '@myissue/vue-website-page-builder'

const result: StartBuilderResult = await pageBuilderService.startBuilder(config)
```

## PageBuilderService Methods

The `PageBuilderService` class provides the following public methods:

### Core Methods

- `startBuilder(config: PageBuilderConfig, passedComponentsArray?: BuilderResourceData): Promise<StartBuilderResult>`
  - Initialize the page builder with configuration and optional components
- `returnLatestComponents(): Promise<ComponentObject[]>`
  - Get the current state of all components
- `generateHtmlFromComponents(): Promise<string>`
  - Generate clean HTML from the current components
- `applySelectedImage(image: ImageObject): Promise<void>`
  - Apply a selected image to the current element

### Language Methods

- `availableLanguage(): AvailableLanguage[]`
  - Get list of available languages
- `changeLanguage(lang: string): void`
  - Change the current language

### Editing Methods

- `refreshListeners(): Promise<void>`
  - Refresh event listeners on elements
- `undo(): Promise<void>`
  - Undo the last change
- `redo(): Promise<void>`
  - Redo a previously undone change

### Component Methods

- `duplicateComponent(): Promise<void>`
  - Duplicate the currently selected component
- `deleteComponentFromDOM(): Promise<void>`
  - Delete the currently selected component
- `reorderComponent(direction: number): Promise<void>`
  - Move component up (-1) or down (1)

## Full TypeScript Example

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import {
  PageBuilder,
  getPageBuilder,
  usePageBuilderModal,
  type PageBuilderConfig,
  type ComponentObject,
  type ImageObject,
} from '@myissue/vue-website-page-builder'

// Get the page builder service instance
const pageBuilderService = getPageBuilder()

// Get modal controls
const { closeMediaLibraryModal } = usePageBuilderModal()

// Define configuration with full type safety
const config: PageBuilderConfig = {
  updateOrCreate: {
    formType: 'create',
    formName: 'article',
  },
  resourceData: {
    title: 'My New Article',
    id: 123,
  },
  userForPageBuilder: {
    name: 'Jane Doe',
    image: '/jane_doe.jpg',
  },
  pageBuilderLogo: {
    src: '/logo/logo.svg',
  },
  userSettings: {
    language: {
      default: 'en',
      enable: ['en', 'zh-Hans', 'fr'],
    },
    fontFamily: 'jost',
    autoSave: true,
  },
  settings: {
    brandColor: '#DB93B0',
  },
}

// Initialize on mount
onMounted(async () => {
  try {
    const result = await pageBuilderService.startBuilder(config)
    console.log('Builder initialized:', result)
  } catch (error) {
    console.error('Failed to initialize builder:', error)
  }
})

// Function to get current components
const getCurrentComponents = async (): Promise<ComponentObject[]> => {
  return await pageBuilderService.returnLatestComponents()
}

// Function to generate HTML
const generateHTML = async (): Promise<string> => {
  return await pageBuilderService.generateHtmlFromComponents()
}

// Function to apply an image
const applyImage = async (imageSrc: string): Promise<void> => {
  const image: ImageObject = { src: imageSrc }
  await pageBuilderService.applySelectedImage(image)
}
</script>

<template>
  <PageBuilder />
</template>
```

## Troubleshooting

### "Could not find a declaration file" Error

If you see this error:

```
Could not find a declaration file for module '@myissue/vue-website-page-builder'
```

**Solution:**

1. Make sure you're using version 3.4.96 or later
2. Delete `node_modules` and `package-lock.json`
3. Run `npm install` again
4. Restart your TypeScript server in VS Code (Command/Ctrl + Shift + P → "TypeScript: Restart TS Server")

### Custom Type Declarations

If you need to extend or override types (not recommended as of v3.4.96+), you can create a custom declaration file:

```typescript
// src/types/vue-website-page-builder.d.ts
declare module '@myissue/vue-website-page-builder' {
  // Your custom type extensions here
}
```

However, this should no longer be necessary as the package now includes full type declarations.
