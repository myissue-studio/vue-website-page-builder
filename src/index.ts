// Main Page Builder Components
export { default as PageBuilder } from './PageBuilder/PageBuilder.vue'
export { default as PageBuilderPreview } from './PageBuilder/PageBuilderPreview.vue'

// Export stores (consolidated into single store)
export { usePageBuilderStateStore } from './stores/page-builder-state'

// Export composables
export { usePageBuilderModal } from './composables/usePageBuilderModal'

// Theme color preset utilities
// resetThemeColorPresets — clears the stored presets for the current user and
//   resets in-memory state to built-in defaults (useful on sign-out).
// buildStorageKey        — returns the localStorage key for a given config,
//   helpful when host apps want to pre-populate or migrate storage entries.
export { resetThemeColorPresets, buildStorageKey } from './composables/useThemeColorPresets'

// Export types
export type {
  PageBuilderUser,
  ComponentObject,
  ImageObject,
  PageBuilderProduct,
  PageBuilderProductInput,
  ProductGridLayout,
  ProductCardStyle,
  ProductSectionOptions,
  InsertProductsOptions,
  PageBuilderConfig,
  BuilderResourceComponent,
  BuilderResourceData,
  StartBuilderResult,
  PageSettings,
  ThemeColorPreset,
  ThemeColorPresetId,
  ThemeColorPresetInput,
  ThemeColorPresetSettings,
  ThemeColorPresetSettingsInput,
  FormName,
} from './types'

// Export the PageBuilderService class for type declarations
export { PageBuilderService } from './services/PageBuilderService'

// Export Pinia for convenience (same version as package uses)
export { createPinia } from 'pinia'

// Export CSS (users will need to import this separately)
import './css/style.css'

// Export shared store instances for external access
export { sharedPageBuilderPinia, sharedPageBuilderStore } from './stores/shared-store'

export { getPageBuilder } from './composables/usePageBuilder'

export { buildProductSectionHtml } from './utils/builder/product-section-html'

// Export the plugin for app.use()
export { pageBuilder } from './plugin'
