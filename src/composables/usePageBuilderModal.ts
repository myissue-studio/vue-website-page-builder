import { inject } from 'vue'

// Composable for managing PageBuilder modals
export function usePageBuilderModal() {
  // Get the close function provided by the PageBuilder component
  const closeAddComponentModal = inject<(() => void) | null>('closeAddComponentModal', null)
  const closeMediaLibraryModal = inject<(() => void) | null>('closeMediaLibraryModal', null)
  const closeProductLibraryModal = inject<(() => void) | null>('closeProductLibraryModal', null)

  return {
    closeAddComponentModal:
      closeAddComponentModal ||
      (() => {
        console.warn(
          'closeAddComponentModal function not available. Make sure you are using this within a PageBuilder context.',
        )
      }),
    closeMediaLibraryModal:
      closeMediaLibraryModal ||
      (() => {
        console.warn(
          'closeMediaLibraryModal function not available. Make sure you are using this within a MediaLibraryModal context.',
        )
      }),
    closeProductLibraryModal:
      closeProductLibraryModal ||
      (() => {
        console.warn(
          'closeProductLibraryModal function not available. Make sure you are using this within a ProductLibraryModal context.',
        )
      }),
  }
}
