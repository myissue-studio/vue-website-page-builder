import { createPinia } from 'pinia'
import { usePageBuilderStateStore } from './page-builder-state'

// Create a shared Pinia instance that will be used across the entire package
export const sharedPageBuilderPinia = createPinia()

// Create and export a shared store instance with proper typing
export const sharedPageBuilderStore: ReturnType<typeof usePageBuilderStateStore> =
  usePageBuilderStateStore(sharedPageBuilderPinia)

// Export the store and Pinia instance for external use
export { usePageBuilderStateStore } from './page-builder-state'
