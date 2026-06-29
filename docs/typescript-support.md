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

#### `resetThemeColorPresets()` Function

Clears the current user's saved theme color presets from `localStorage` and restores in-memory state to built-in defaults. Call this when a user signs out so the next user starts with a clean state.

```typescript
import { resetThemeColorPresets } from '@myissue/vue-website-page-builder'

// On user sign-out
resetThemeColorPresets()
```

#### `buildStorageKey(config?)` Function

Returns the `localStorage` key used to persist theme color presets for a given config. Useful for debugging, migrating, or pre-populating stored preset data.

```typescript
import { buildStorageKey } from '@myissue/vue-website-page-builder'
import type { PageBuilderConfig } from '@myissue/vue-website-page-builder'

const config: PageBuilderConfig = {
  updateOrCreate: { formType: 'create', formName: 'article' },
  userForPageBuilder: { id: 42, name: 'Alice' },
}

const key = buildStorageKey(config)
// → 'vueWebsitePageBuilderThemeColorPresets-u42'

// Without a user id:
const sharedKey = buildStorageKey()
// → 'vueWebsitePageBuilderThemeColorPresets'
```

### Type Interfaces

#### `PageBuilderConfig`

Configuration object for initializing the page builder.

**Flexible Types:** All configuration properties accept flexible types for maximum compatibility:

- `formName` accepts any string (not limited to predefined types)
- `userForPageBuilder.id` accepts any `string` or `number` — use your auth system's user identifier
- `userForPageBuilder.image` is optional
- `language.default` accepts any language code string
- `language.enable` accepts any string array (including readonly arrays from `as const`)
- `settings.themeColorPresets` accepts `ThemeColorPresetSettingsInput` for database-sourced colors
- Additional custom properties can be added via index signatures
- All properties are optional except `updateOrCreate`

**Note on `as const`:** When using `as const` for your config object, arrays become readonly. The interface supports this automatically.

```typescript
import type { PageBuilderConfig } from '@myissue/vue-website-page-builder'

// Example 1: Standard usage
const config: PageBuilderConfig = {
  updateOrCreate: {
    formType: 'create', // or 'update'
    formName: 'article', // Any string accepted: 'article', 'cms-page-home', 'custom-form', etc.
  },
  resourceData: {
    title: 'My Article',
    id: 1,
  },
  userForPageBuilder: {
    id: currentUser.id,        // Optional — scopes theme preset storage per user
    name: 'John Doe',
    image: '/john_doe.jpg',    // Optional
  },
  pageBuilderLogo: {
    src: '/logo/logo.svg',
  },
  userSettings: {
    language: {
      default: 'en', // Any language code accepted
      enable: ['en', 'zh-Hans', 'fr'], // Any language codes accepted
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
    themeColorPresets: {
      enabled: true,
      colors: [
        { id: 'primary', label: 'Primary', color: '#482C3D', enabled: true },
        { id: 'secondary', label: 'Secondary', color: '#E5D352', enabled: true },
        { id: 'custom1', label: 'Custom 1', color: '#AC3931', enabled: true },
      ],
    },
  },
}

// Example 2: Dynamic form names and minimal config
const dynamicConfig: PageBuilderConfig = {
  updateOrCreate: {
    formType: 'update',
    formName: `cms-page-${pageSlug}`, // Template literals work!
  },
  resourceData: {
    title: pageTitle,
    customField: 'any value', // Custom properties allowed
  },
  userForPageBuilder: {
    name: userName, // id and image are both optional
  },
  userSettings: {
    language: {
      default: userLanguage, // Any string accepted
    },
    autoSave: false,
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

User information for display in the builder. The optional `id` field scopes each user's theme color preset storage to their own `localStorage` key so personalized colors are never shared between users on the same device.

```typescript
import type { PageBuilderUser } from '@myissue/vue-website-page-builder'

// Full example — id scopes preset storage per user
const user: PageBuilderUser = {
  id: currentUser.id,       // string or number — any stable identifier from your auth system
  name: 'John Doe',
  image: '/john_doe.jpg',   // Optional
}

// Minimal — no image, no scoped storage (all users share one preset key)
const minimalUser: PageBuilderUser = {
  name: 'Jane Doe',
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

#### `ThemeColorPreset` / `ThemeColorPresetId`

A single normalized preset and its valid ID values.

```typescript
import type { ThemeColorPreset, ThemeColorPresetId } from '@myissue/vue-website-page-builder'

// ThemeColorPresetId is the union of all supported slot names:
// 'primary' | 'secondary' | 'custom1' | 'custom2' | 'custom3' | 'custom4' | 'custom5' | 'custom6'

const preset: ThemeColorPreset = {
  id: 'primary',
  label: 'Primary',
  color: '#482C3D', // always a normalized '#rrggbb' string internally
  enabled: true,
}
```

#### `ThemeColorPresetInput` / `ThemeColorPresetSettingsInput`

Flexible input types for consumer configurations. Use these when your color data comes from a database, API, or variable inference — where `id` is typed as a plain `string` rather than the strict `ThemeColorPresetId` union. All fields are optional.

Without these input types, TypeScript would raise an error like:
> *Type `'string'` is not assignable to type `'ThemeColorPresetId'`.*

```typescript
import type {
  ThemeColorPresetInput,
  ThemeColorPresetSettingsInput,
} from '@myissue/vue-website-page-builder'

// Individual color from a database row
const color: ThemeColorPresetInput = {
  id: dbRow.slug,       // plain string — no type error
  label: dbRow.name,
  color: dbRow.hexCode,
  enabled: dbRow.active,
}

// Full presets object from an API response
const presets: ThemeColorPresetSettingsInput = {
  enabled: true,
  colors: apiColors.map((c) => ({
    id: c.slug,
    label: c.name,
    color: c.hex,
    enabled: c.visible,
  })),
}

// Pass directly into configPageBuilder — no type assertion needed
const configPageBuilder = {
  updateOrCreate: { formType: 'create' as const, formName: 'article' },
  settings: { themeColorPresets: presets },
}
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
- `generateFullPageHtml(): Promise<string>`
  - Generate clean full page HTML, including the outer `#pagebuilder` wrapper and global `pageSettings`
- `getSavedPageHtml(): string | false`
  - Retrieve the latest saved full page HTML from local storage for publishing or backend submission
- `parsePageBuilderHTML(htmlString: string): { components: ComponentObject[]; pageSettings: PageSettings }`
  - Parse saved full page HTML back into editable components and global page settings
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
  resetThemeColorPresets,
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
    id: currentUser.id,   // Scopes theme preset storage to this user
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
    themeColorPresets: {
      enabled: true,
      colors: [
        { id: 'primary', label: 'Primary', color: '#482C3D', enabled: true },
        { id: 'secondary', label: 'Secondary', color: '#E5D352', enabled: true },
      ],
    },
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

// Call on sign-out to clear the user's personalized preset storage
const handleSignOut = () => {
  resetThemeColorPresets()
  // ... rest of sign-out logic
}

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
