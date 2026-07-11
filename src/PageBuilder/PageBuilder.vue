<script setup lang="ts">
import { onBeforeUnmount, onMounted, computed, ref, watch, provide, nextTick } from 'vue'
import BaseModal from '../Components/Modals/BaseModal.vue'
import PageBuilderPreview from './PageBuilderPreview.vue'
import SelectedElementToolbar from '../Components/PageBuilder/EditorMenu/Editables/SelectedElementToolbar.vue'
import ComponentLibraryModal from '../Components/Modals/ComponentLibraryModal.vue'
import ProductLibraryModal from '../Components/Modals/ProductLibraryModal.vue'
import RightSidebarEditor from '../Components/PageBuilder/EditorMenu/RightSidebarEditor.vue'
import { sharedPageBuilderPinia, sharedPageBuilderStore } from '../stores/shared-store'
import ToolbarOption from '../Components/PageBuilder/ToolbarOption/ToolbarOption.vue'
import { sleep } from '../utils/sleep'
import { useDebounce } from '../composables/useDebounce'
import ConfirmActionModal from '../Components/Modals/ConfirmActionModal.vue'
import GlobalLoader from '../Components/Loaders/GlobalLoader.vue'
import ImageSettingsModal from '../Components/PageBuilder/EditorMenu/Editables/ImageSettingsModal.vue'
import FloatingSidePanel from '../Components/Overlays/FloatingSidePanel.vue'
import { useTranslations } from '../composables/useTranslations'
import { getPageBuilder } from '../composables/usePageBuilder'
import UndoRedo from '../Components/PageBuilder/UndoRedo/UndoRedo.vue'
import LayersIcon from '../Components/Icons/LayersIcon.vue'
import PreviewDesktopIcon from '../Components/Iconsand/PreviewDesktopIcon.vue'
import HtmlCodeViewerModal from '../Components/PageBuilder/EditorMenu/Editables/HtmlCodeViewerModal.vue'
import HtmlEditorModal from '../Components/PageBuilder/EditorMenu/Editables/HtmlEditorModal.vue'
import ToastContainer from '../Components/Toast/ToastContainer.vue'
import { useHtmlCodeViewer } from '../composables/useHtmlCodeViewer'
import { useHtmlCodeEditor } from '../composables/useHtmlCodeEditor'
import { useToast } from '../composables/useToast'
import { useBuilderKeyboardShortcuts } from '../composables/useBuilderKeyboardShortcuts'
import {
  buildCustomFontStylesCss,
  findFontFamilyClassOnElement,
  getEditorFontFamilyClasses,
  hasUserPageCanvasFontOverride,
  resolveConfigDefaultFontClass,
  resolveFontFamily,
} from '../utils/builder/font-family-map'
import { shouldPreserveInlineEditorForToolbarPopover } from '../utils/builder/should-preserve-inline-editor-for-toolbar-popover'
import {
  dispatchCloseEditToolbarPopovers,
  EDIT_TOOLBAR_POPOVER_SCROLL_DOWN_CLOSE_PX,
  hasOpenEditToolbarPopovers,
  isEditToolbarPopoverScrollCloseSuppressed,
} from '../utils/builder/edit-toolbar-popover-events'
import {
  applyPageBuilderBrandColor,
  clearPageBuilderBrandColor,
} from '../utils/builder/apply-brand-color'

const pageBuilderService = getPageBuilder()
const {
  show: htmlViewerShow,
  title: htmlViewerTitle,
  html: htmlViewerHtml,
  closeHtmlViewer,
} = useHtmlCodeViewer()
const {
  show: htmlEditorShow,
  title: htmlEditorTitle,
  html: htmlEditorHtml,
  isLoading: htmlEditorLoading,
  error: htmlEditorError,
  closeHtmlEditor,
  saveHtmlEditor,
} = useHtmlCodeEditor()

/**
 * Props for PageBuilder component
 * @typedef {Object} Props
 * @property {Object|null} CustomMediaLibraryComponent - Custom media component
 * @property {Object|null} DisplayProducts - Optional custom product picker (replaces built-in sample catalog)
 * @property {boolean} enableDefaultProducts - Show built-in sample catalog when DisplayProducts is omitted (default true)
 * @property {Object|null} CustomBuilderComponents - Custom component
 * @property {Object} configPageBuilder - Configuration object containing:
 */
const props = defineProps({
  CustomMediaLibraryComponent: {
    type: Object,
    default: null,
  },
  DisplayProducts: {
    type: Object,
    default: null,
  },
  enableDefaultProducts: {
    type: Boolean,
    default: true,
  },
  CustomBuilderComponents: {
    type: Object,
    default: null,
  },
  showCloseButton: {
    type: Boolean,
    default: false,
  },
  showPublishButton: {
    type: Boolean,
    default: false,
  },
})

const { translate, loadTranslations } = useTranslations()
const { showToast } = useToast()

// Use shared Pinia instance for PageBuilder package
const internalPinia = sharedPageBuilderPinia

const pageBuilderStateStore = sharedPageBuilderStore

// Provide store for child components (all pointing to the same consolidated store)
provide('pageBuilderStateStore', pageBuilderStateStore)
// Provide the internal Pinia instance for components that need to create stores
provide('internalPinia', internalPinia)
// Provide custom components for child components
provide('CustomMediaComponent', props.CustomMediaLibraryComponent)
provide('DisplayProductsComponent', props.DisplayProducts)
provide('CustomBuilderComponents', props.CustomBuilderComponents)

/** Products UI: custom picker and/or built-in sample catalog (see enableDefaultProducts). */
const showProductsFeature = computed(
  () => Boolean(props.DisplayProducts) || props.enableDefaultProducts,
)

const emit = defineEmits(['handleClosePageBuilder', 'handlePublishPageBuilder'])

const gridColumnModalCloseNoSave = ref(Number(1))
const typeModalloseNoSave = ref('')
const showModalCloseNoSave = ref(false)
const titleModalCloseNoSave = ref('')
const descriptionModalCloseNoSave = ref('')
const firstButtonCloseNoSave = ref<string | null>('')
const secondButtonCloseNoSave = ref<string | null>(null)
const thirdButtonCloseNoSave = ref<string | null>(null)
const firstModalButtonCloseNoSaveFunction = ref<(() => void | Promise<void>) | null>(null)
const secondModalButtonCloseNoSaveFunction = ref<(() => void | Promise<void>) | null>(null)
const thirdModalButtonCloseNoSaveFunction = ref<(() => void | Promise<void>) | null>(null)

const closePageBuilder = async function () {
  typeModalloseNoSave.value = 'warning'
  showModalCloseNoSave.value = true

  titleModalCloseNoSave.value = translate('Continue Your Work?')
  descriptionModalCloseNoSave.value = translate(
    'Are you sure you want to close the Page Builder? All unsaved changes will be lost.',
  )
  firstButtonCloseNoSave.value = null
  secondButtonCloseNoSave.value = translate('Close Page Builder')
  thirdButtonCloseNoSave.value = null

  firstModalButtonCloseNoSaveFunction.value = async function () {
    showModalCloseNoSave.value = false
  }

  secondModalButtonCloseNoSaveFunction.value = function () {
    acceptClosePageBuilder()
  }

  thirdModalButtonCloseNoSaveFunction.value = async function () {
    //
  }

  // end modal
}

const acceptClosePageBuilder = function () {
  showModalCloseNoSave.value = false
  emit('handleClosePageBuilder')
}
const closePublish = async function () {
  pageBuilderStateStore.setIsLoadingGlobal(true)
  try {
    await pageBuilderService.handleManualSave()
    showToast(translate('Page saved successfully'), 'success')
  } catch {
    showToast(translate('Could not save page'), 'error')
  }
  pageBuilderStateStore.setIsLoadingGlobal(false)
  emit('handlePublishPageBuilder')
}

async function savePageWithToast(): Promise<void> {
  try {
    await pageBuilderService.handleManualSave()
    showToast(translate('Page saved successfully'), 'success')
  } catch {
    showToast(translate('Could not save page'), 'error')
  }
}

// Provide modal close function for custom components
const closeAddComponentModal = () => {
  showModalAddComponent.value = false
}
provide('closeAddComponentModal', closeAddComponentModal)

const languageSelction = ref('en')

let isInitializingLang = true
const isLoadingLang = ref(false)

// Watch for changes in languageSelction
watch(languageSelction, async (newVal) => {
  if (newVal && !isInitializingLang) {
    isLoadingLang.value = true
    await sleep(200)
    await loadTranslations(newVal)
    pageBuilderService.changeLanguage(newVal)

    // Ensure lang is updated within userSettings
    const userSettings = JSON.parse(localStorage.getItem('userSettingsPageBuilder') ?? '{}') || {}
    userSettings.lang = newVal
    localStorage.setItem('userSettingsPageBuilder', JSON.stringify(userSettings))
    isLoadingLang.value = false
  }
})

const getBuilderStarted = computed(() => {
  return pageBuilderStateStore.getBuilderStarted
})

const getPageBuilderConfig = computed(() => {
  return pageBuilderStateStore.getPageBuilderConfig
})

const NON_FAMILY_FONT_CLASSES = new Set([
  'pbx-font-thin',
  'pbx-font-extralight',
  'pbx-font-light',
  'pbx-font-normal',
  'pbx-font-medium',
  'pbx-font-bold',
  'pbx-font-extrabold',
  'pbx-font-black',
])

const isExplicitFontFamilyClass = (token: string, availableFontClasses: string[]): boolean => {
  if (token.startsWith('pbx-font-custom-')) return true
  if (availableFontClasses.includes(token)) return true
  if (token.startsWith('pbx-font-') && !NON_FAMILY_FONT_CLASSES.has(token)) return true
  return false
}

const configDefaultFontClass = computed(() =>
  resolveConfigDefaultFontClass(getPageBuilderConfig.value?.userSettings),
)

/**
 * Font class for #pagebuilder. Page Design choices override config defaults;
 * config `elementFonts` still apply until a different global page font is set.
 */
const canvasFontClass = computed(() => {
  const userSettings = getPageBuilderConfig.value?.userSettings
  const globalMode = pageBuilderStateStore.getToggleGlobalHtmlMode
  const storeFont = pageBuilderStateStore.getFontFamily

  if (globalMode && storeFont && storeFont !== 'none') {
    return storeFont
  }

  const pagebuilder = document.getElementById('pagebuilder')
  const domFont = pagebuilder ? findFontFamilyClassOnElement(pagebuilder, userSettings) : undefined

  if (
    domFont &&
    hasUserPageCanvasFontOverride(pagebuilder, userSettings, {
      globalPageDesignMode: globalMode,
      selectedFontClass: storeFont,
    })
  ) {
    return domFont
  }

  return configDefaultFontClass.value
})

const hasPageDesignFontOverride = computed(() => {
  const userSettings = getPageBuilderConfig.value?.userSettings
  const pagebuilder = document.getElementById('pagebuilder')

  return hasUserPageCanvasFontOverride(pagebuilder, userSettings, {
    globalPageDesignMode: pageBuilderStateStore.getToggleGlobalHtmlMode,
    selectedFontClass: pageBuilderStateStore.getFontFamily,
  })
})

const customFontStylesCss = computed(() =>
  buildCustomFontStylesCss(getPageBuilderConfig.value?.userSettings),
)

/**
 * Returns CSS custom properties for per-element font overrides, to be bound as
 * :style on #page-builder-wrapper (the scroll container that wraps #pagebuilder).
 * Setting them on the wrapper — not on #pagebuilder itself — avoids conflicts with
 * applyPageSettingsToPage, which rewrites #pagebuilder's style attribute directly.
 * The style.css rules inside #pagebuilder pick up the variables via CSS cascade.
 */
const canvasElementFontStyle = computed((): Record<string, string> => {
  const pageClass = canvasPageSettings.value?.classes
  if (typeof pageClass === 'string' && pageClass.trim().length > 0) {
    const tokens = pageClass.split(/\s+/).filter(Boolean)
    const availableFontClasses = getEditorFontFamilyClasses(
      getPageBuilderConfig.value?.userSettings,
    )
    const hasExplicitPageFont = tokens.some((token) =>
      isExplicitFontFamilyClass(token, availableFontClasses),
    )
    if (hasExplicitPageFont) return {}
  }

  if (hasPageDesignFontOverride.value) return {}

  const elementFonts = getPageBuilderConfig.value?.userSettings?.elementFonts
  if (!elementFonts) return {}
  const style: Record<string, string> = {}
  const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] as const
  for (const tag of tags) {
    const fontConfig = elementFonts[tag]
    if (fontConfig) {
      const resolved = resolveFontFamily(fontConfig)
      if (resolved) style[`--pbx-el-${tag}-font`] = resolved
    }
  }
  return style
})

const canvasPageSettings = computed(() => {
  return getPageBuilderConfig.value?.pageSettings
})

const canvasPageClass = computed(() => {
  const cls = canvasPageSettings.value?.classes
  if (!cls || typeof cls !== 'string') return ''
  return cls
})

const canvasHasExplicitFontClass = computed(() => {
  const cls = canvasPageClass.value
  if (!cls) return false

  const tokens = cls.split(/\s+/).filter(Boolean)
  const availableFontClasses = getEditorFontFamilyClasses(getPageBuilderConfig.value?.userSettings)

  return tokens.some((token) => isExplicitFontFamilyClass(token, availableFontClasses))
})

const canvasAppliedFontClass = computed(() => {
  // If persisted page settings already define a font-family class, do not
  // inject config default font class (e.g. pbx-font-jost) to avoid conflicts.
  if (canvasHasExplicitFontClass.value) return ''
  return canvasFontClass.value
})

const canvasPageStyle = computed(() => {
  const style = canvasPageSettings.value?.style
  if (!style) return ''
  if (typeof style === 'string') return style
  // style object form: convert to CSS string
  return Object.entries(style as Record<string, string>)
    .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v};`)
    .join(' ')
})

watch(
  () => getPageBuilderConfig.value?.settings?.brandColor,
  (brandColor) => {
    applyPageBuilderBrandColor(brandColor)
  },
  { immediate: true },
)

const getCurrentLanguage = computed(() => pageBuilderStateStore.getCurrentLanguage)
watch(getCurrentLanguage, (lang) => {
  if (lang && lang !== languageSelction.value) {
    languageSelction.value = lang
  }
})

const getMenuRight = computed(() => {
  return pageBuilderStateStore.getMenuRight
})
const openPageBuilderPreviewModal = ref(false)
const titleBuilderDesktop = ref('')
const titleBuilderMobile = ref('')

const savePreviewFontSettings = function () {
  localStorage.setItem('preview-font-class', canvasFontClass.value)
  localStorage.setItem(
    'preview-element-fonts',
    JSON.stringify(hasPageDesignFontOverride.value ? {} : canvasElementFontStyle.value),
  )
}

const previewCurrentDesign = function () {
  pageBuilderService.previewCurrentDesign()
  savePreviewFontSettings()
}
const handlePageBuilderPreview = function () {
  titleBuilderDesktop.value = translate('Preview')
  previewCurrentDesign()
  openPageBuilderPreviewModal.value = true
}

const openPageBuilderPreviewMobile = ref(false)

const previewCurrentDesignMobile = function () {
  pageBuilderService.previewCurrentDesign()
  savePreviewFontSettings()
}
const handlePageBuilderPreviewMobile = function () {
  titleBuilderMobile.value = translate('Mobile')
  previewCurrentDesignMobile()
  openPageBuilderPreviewMobile.value = true
}

const previewMenuOpen = ref(false)
const previewMenuTriggerRef = ref<HTMLElement | null>(null)
const previewMenuPopoverRef = ref<HTMLElement | null>(null)
const PREVIEW_MENU_WIDTH_PX = 220

const previewMenuPopoverStyle = ref({
  top: '0px',
  left: '0px',
  width: `${PREVIEW_MENU_WIDTH_PX}px`,
})

const updatePreviewMenuPosition = () => {
  const trigger = previewMenuTriggerRef.value
  if (!trigger) return

  const rect = trigger.getBoundingClientRect()
  const margin = 8
  const desiredLeft = rect.left + rect.width / 2 - PREVIEW_MENU_WIDTH_PX / 2
  const left = Math.max(
    margin,
    Math.min(desiredLeft, window.innerWidth - PREVIEW_MENU_WIDTH_PX - margin),
  )

  previewMenuPopoverStyle.value = {
    top: `${Math.round(rect.bottom + 8)}px`,
    left: `${Math.round(left)}px`,
    width: `${PREVIEW_MENU_WIDTH_PX}px`,
  }
}

const closePreviewMenuOnOutsideClick = (event: Event) => {
  if (!previewMenuOpen.value) return
  if (!(event.target instanceof Node)) return
  if (previewMenuTriggerRef.value?.contains(event.target)) return
  if (previewMenuPopoverRef.value?.contains(event.target)) return
  previewMenuOpen.value = false
}

const openDesktopPreviewFromMenu = async () => {
  previewMenuOpen.value = false
  pageBuilderStateStore.setMenuRight(false)
  pageBuilderStateStore.setElement(null)
  await pageBuilderService.clearHtmlSelection()
  handlePageBuilderPreview()
}

const openMobilePreviewFromMenu = async () => {
  previewMenuOpen.value = false
  pageBuilderStateStore.setMenuRight(false)
  pageBuilderStateStore.setElement(null)
  await pageBuilderService.clearHtmlSelection()
  handlePageBuilderPreviewMobile()
}

watch(previewMenuOpen, (isOpen) => {
  if (isOpen) {
    void nextTick(() => updatePreviewMenuPosition())
    document.addEventListener('pointerdown', closePreviewMenuOnOutsideClick)
    window.addEventListener('resize', updatePreviewMenuPosition)
    window.addEventListener('scroll', updatePreviewMenuPosition, true)
    return
  }

  document.removeEventListener('pointerdown', closePreviewMenuOnOutsideClick)
  window.removeEventListener('resize', updatePreviewMenuPosition)
  window.removeEventListener('scroll', updatePreviewMenuPosition, true)
})

const openAppNotStartedModal = ref(false)

const handlAppNotStartedModal = function () {
  openAppNotStartedModal.value = false
}

const firstPageBuilderPreviewModalButton = function () {
  openPageBuilderPreviewModal.value = false
}
const firstPageBuilderPreviewModalButtonMobile = function () {
  openPageBuilderPreviewMobile.value = false
}

const showModalAddComponent = ref(false)
const titleModalAddComponent = ref('')
const firstButtonTextSearchComponents = ref('')
const firstModalButtonSearchComponentsFunction = ref<(() => void | Promise<void>) | null>(null)

const toggleAddComponentModal = async function () {
  await pageBuilderService.clearHtmlSelection()

  //
  titleModalAddComponent.value = translate('Add Components to Page')
  firstButtonTextSearchComponents.value = translate('Close')
  showModalAddComponent.value = true

  firstModalButtonSearchComponentsFunction.value = function () {
    // handle show modal for unique content
    showModalAddComponent.value = false
  }

  // end modal
}

const showProductLibraryModal = ref(false)
const titleProductLibraryModal = ref('')

const toggleProductLibraryModal = async function () {
  await pageBuilderService.clearHtmlSelection()
  pageBuilderStateStore.setAddComponentAddIndex(null)
  pageBuilderStateStore.setComponentArrayAddMethod('unshift')
  titleProductLibraryModal.value = translate('Add Products to Page')
  showProductLibraryModal.value = true
}

const closeProductLibraryModal = () => {
  showProductLibraryModal.value = false
}

const handleInsertButtonClick = function (id: number) {
  pageBuilderStateStore.setAddComponentAddIndex(id)
  pageBuilderStateStore.setComponentArrayAddMethod('insert')
  toggleAddComponentModal()
}

const handleInsertProductButtonClick = async function (id: number) {
  await pageBuilderService.clearHtmlSelection()
  pageBuilderStateStore.setAddComponentAddIndex(id)
  pageBuilderStateStore.setComponentArrayAddMethod('insert')
  titleProductLibraryModal.value = translate('Add Products to Page')
  showProductLibraryModal.value = true
}

const getElement = computed(() => {
  return pageBuilderStateStore.getElement
})

const getComponents = computed(() => {
  return pageBuilderStateStore.getComponents
})

const getHasLocalDraftForUpdate = computed(() => {
  return pageBuilderStateStore.getHasLocalDraftForUpdate
})

watch(getHasLocalDraftForUpdate, (newVal) => {
  if (newVal) {
    handlerRumeEditingForUpdate()
  }
})

const getElementAttributes = computed(() => {
  if (!getElement.value || !(getElement.value instanceof HTMLElement)) {
    return null
  }

  // Extract the attributes to watch
  const attributesToWatch = {
    src: getElement.value.getAttribute('src'),
    href: getElement.value.getAttribute('href'),
    style: getElement.value.getAttribute('style'),
    class: getElement.value.getAttribute('class'),
    dataImage: getElement.value.getAttribute('data-image'),
  }

  return attributesToWatch
})

const debounce = useDebounce()

watch(getElementAttributes, async (newAttributes, oldAttributes) => {
  // Only run if an element is selected and attributes actually changed
  if (
    !pageBuilderStateStore.getElement ||
    (newAttributes?.src === oldAttributes?.src &&
      newAttributes?.href === oldAttributes?.href &&
      newAttributes?.style === oldAttributes?.style &&
      newAttributes?.class === oldAttributes?.class &&
      newAttributes?.dataImage === oldAttributes?.dataImage)
  ) {
    return
  }

  debounce(async () => {
    // Double-check element is still selected before initializing
    if (pageBuilderStateStore.getElement) {
      await pageBuilderService.initializeElementStyles()
    }
  }, 200)
})

const handleSelectComponent = function (
  componentObject: Parameters<typeof pageBuilderStateStore.setComponent>[0],
) {
  if (pageBuilderStateStore.getInlineTipTapEditor) return

  pageBuilderStateStore.setComponent(componentObject)
}

const handleCanvasDoubleClick = async function (event: MouseEvent) {
  await pageBuilderService.openInlineTipTapFromEvent(event)
}

const handleInlineEditorDocumentPointerDown = function (event: PointerEvent) {
  if (!pageBuilderStateStore.getInlineTipTapEditor) return
  if (!(event.target instanceof Node)) return

  const inlineElement = document.querySelector<HTMLElement>('#pagebuilder [data-pbx-inline-tiptap]')
  const editorElement = inlineElement?.querySelector('.ProseMirror')
  const inlineUiElement =
    event.target instanceof Element ? event.target.closest('[data-pbx-inline-editor-ui]') : null
  const modalElement = event.target instanceof Element ? event.target.closest('#pbx-modal') : null

  if (editorElement?.contains(event.target)) return
  if (inlineUiElement) return
  if (modalElement) return
  if (shouldPreserveInlineEditorForToolbarPopover(event.target)) return

  const nextElement = pageBuilderService.findEditableElementFromEventTarget(event.target)

  event.preventDefault()
  event.stopPropagation()
  event.stopImmediatePropagation()

  void pageBuilderService.finishActiveInlineTipTapEditorFromDom(nextElement)
}

const getIsLoadingGlobal = computed(() => {
  return pageBuilderStateStore.getIsLoadingGlobal
})
const getIsSaving = computed(() => {
  return pageBuilderStateStore.getIsSaving
})

const undoRedoRef = ref<InstanceType<typeof UndoRedo> | null>(null)
const selectedElementToolbarRef = ref<InstanceType<typeof SelectedElementToolbar> | null>(null)

const getIsLoadingResumeEditing = computed(() => {
  return pageBuilderStateStore.getIsLoadingResumeEditing
})
const getIsRestoring = computed(() => {
  return pageBuilderStateStore.getIsRestoring
})

const showGlobalLoader = ref(false)
// Stays true for the full onMounted init await, even if the service toggles
// isLoadingGlobal off early inside completeMountProcess().
const isMountInitializing = ref(false)

const gridColumnModalResumeEditing = ref(Number(1))
const typeModal = ref('')
const showModalResumeEditing = ref(false)
const titleModalResumeEditing = ref('')
const descriptionModalResumeEditing = ref('')
const firstButtonResumeEditing = ref('')
const secondButtonResumeEditing = ref<string | null>(null)
const thirdButtonResumeEditing = ref<string | null>(null)
const firstModalButtonResumeEditingFunction = ref<(() => void | Promise<void>) | null>(null)
const secondModalButtonResumeEditingFunction = ref<(() => void | Promise<void>) | null>(null)
const thirdModalButtonResumeEditingFunction = ref<(() => void | Promise<void>) | null>(null)

const handlerRumeEditingForUpdate = async function () {
  typeModal.value = 'warning'
  showModalResumeEditing.value = true

  titleModalResumeEditing.value = translate('Continue Your Work?')
  descriptionModalResumeEditing.value = translate(
    'We noticed you have some changes that weren’t saved last time. Would you like to pick up where you left off, or use the version that’s currently loaded from the database?',
  )
  firstButtonResumeEditing.value = translate('Use Saved Version')
  secondButtonResumeEditing.value = null
  thirdButtonResumeEditing.value = translate('Continue Where I Left Off')

  firstModalButtonResumeEditingFunction.value = async function () {
    pageBuilderStateStore.setHasLocalDraftForUpdate(false)
    showModalResumeEditing.value = false
  }

  secondModalButtonResumeEditingFunction.value = function () {}

  thirdModalButtonResumeEditingFunction.value = async function () {
    await pageBuilderService.resumeEditingFromDraft()
    pageBuilderStateStore.setHasLocalDraftForUpdate(false)

    showModalResumeEditing.value = false
  }

  // end modal
}

const gridColumnModalRestore = ref(Number(1))
const typeModalRestore = ref('')
const showModalRestore = ref(false)
const titleModalRestore = ref('')
const descriptionModalRestore = ref('')
const firstButtonRestore = ref('')
const secondButtonRestore = ref<string | null>(null)
const thirdButtonRestore = ref<string | null>(null)
const firstModalButtonRestoreFunction = ref<(() => void | Promise<void>) | null>(null)
const secondModalButtonRestoreFunction = ref<(() => void | Promise<void>) | null>(null)
const thirdModalButtonRestoreFunction = ref<(() => void | Promise<void>) | null>(null)

const handleRestoreOriginalContent = async function () {
  await pageBuilderService.clearHtmlSelection()

  typeModalRestore.value = 'success'
  showModalRestore.value = true

  titleModalRestore.value = translate('Do you want to reset this page?')
  descriptionModalRestore.value = translate(
    'Are you sure you want to reset this page? This will overwrite your current changes.',
  )
  firstButtonRestore.value = translate('Close')
  secondButtonRestore.value = null
  thirdButtonRestore.value = translate('Reset changes')

  firstModalButtonRestoreFunction.value = function () {
    showModalRestore.value = false
  }

  secondModalButtonRestoreFunction.value = async function () {}
  thirdModalButtonRestoreFunction.value = async function () {
    try {
      await pageBuilderService.restoreOriginalContent()
      showToast(translate('Page restored to original version'), 'success')
    } catch {
      showToast(translate('Could not restore page'), 'error')
    }
    showModalRestore.value = false
  }

  // end modal
}

const showImageSettingsModal = ref(false)

const openImageSettings = () => {
  if (showImageSettingsModal.value) {
    closeImageSettings()
    return
  }
  pageBuilderService.setImageSettingsModalOpen(true)
  showImageSettingsModal.value = true
}

const closeImageSettings = () => {
  showImageSettingsModal.value = false
  pageBuilderService.setImageSettingsModalOpen(false)
}

useBuilderKeyboardShortcuts({
  canUndo: () => pageBuilderStateStore.getHistoryIndex > 0,
  canRedo: () => pageBuilderStateStore.getHistoryIndex < pageBuilderStateStore.getHistoryLength - 1,
  isBlocked: () =>
    getIsLoadingGlobal.value ||
    isLoadingLang.value ||
    pageBuilderStateStore.getInlineTipTapEditor ||
    showModalAddComponent.value ||
    showProductLibraryModal.value ||
    showModalCloseNoSave.value ||
    showModalResumeEditing.value ||
    showModalRestore.value ||
    htmlEditorShow.value ||
    htmlViewerShow.value ||
    openPageBuilderPreviewModal.value ||
    openPageBuilderPreviewMobile.value ||
    showImageSettingsModal.value,
  onUndo: async () => {
    await undoRedoRef.value?.handleUndo()
  },
  onRedo: async () => {
    await undoRedoRef.value?.handleRedo()
  },
  onSave: savePageWithToast,
  onDeselect: async () => {
    await pageBuilderService.clearHtmlSelection()
  },
  onDelete: () => {
    selectedElementToolbarRef.value?.openDeleteConfirm()
  },
  hasSelection: () => Boolean(pageBuilderStateStore.getElement),
})
// HTML editor logic end

const ensureBuilderInitialized = function () {
  if (!getBuilderStarted.value) {
    openAppNotStartedModal.value = true
  }
}

const pbxBuilderWrapper = ref<HTMLElement | null>(null)
const pageBuilderCanvas = ref<HTMLElement | null>(null)
const editToolbarPinned = ref(true)
let panelPositionRaf = 0
let panelPositionObserver: MutationObserver | null = null
let builderScrollTop = 0
let scrollDownSincePopoverOpen = 0

function syncInsertControlCanvasOffsets() {
  const wrapper = pbxBuilderWrapper.value
  const canvas = pageBuilderCanvas.value
  if (!wrapper || !canvas) return

  const styles = window.getComputedStyle(canvas)
  wrapper.style.setProperty('--pbx-canvas-pad-left', styles.paddingLeft || '0px')
  wrapper.style.setProperty('--pbx-canvas-pad-right', styles.paddingRight || '0px')
  wrapper.style.setProperty('--pbx-canvas-margin-right', styles.marginRight || '0px')
}

function handleBuilderContainerScroll() {
  const container = pbxBuilderWrapper.value
  if (container) {
    const currentScrollTop = container.scrollTop
    const delta = currentScrollTop - builderScrollTop

    if (isEditToolbarPopoverScrollCloseSuppressed()) {
      scrollDownSincePopoverOpen = 0
    } else if (hasOpenEditToolbarPopovers()) {
      if (delta > 0) {
        scrollDownSincePopoverOpen += delta
        if (scrollDownSincePopoverOpen >= EDIT_TOOLBAR_POPOVER_SCROLL_DOWN_CLOSE_PX) {
          dispatchCloseEditToolbarPopovers()
          scrollDownSincePopoverOpen = 0
        }
      } else if (delta < 0) {
        scrollDownSincePopoverOpen = 0
      }
    } else {
      scrollDownSincePopoverOpen = 0
    }

    builderScrollTop = currentScrollTop
  }

  updatePanelPositionOnScroll()
}

const hideToolbar = function () {
  const toolbar = document.querySelector('#pbxEditToolbar')
  if (toolbar) {
    toolbar
      .querySelector<HTMLElement>('.pbx-select-none > .pbx-flex')
      ?.style.removeProperty('width')
    toolbar.classList.remove('is-visible')
    toolbar.removeAttribute('style')
  }
}

function applyToolbarFlexWidth(toolbar: HTMLElement, maxToolbarWidth: number) {
  const innerFlex = toolbar.querySelector<HTMLElement>('.pbx-select-none > .pbx-flex')
  if (!innerFlex) return

  innerFlex.style.flexWrap = 'nowrap'
  innerFlex.style.removeProperty('max-width')
  innerFlex.style.width = 'max-content'
  innerFlex.getBoundingClientRect()

  // Measure the actual one-line width of the current controls. This keeps the
  // toolbar compact, but automatically grows when new controls are added.
  const oneLineWidth = Math.ceil(innerFlex.getBoundingClientRect().width)
  innerFlex.style.flexWrap = 'wrap'

  if (oneLineWidth > 0) {
    innerFlex.style.width = `${Math.min(oneLineWidth, maxToolbarWidth)}px`
  }
  innerFlex.style.justifyContent = 'center'
  innerFlex.style.removeProperty('max-width')
}

const toggleEditToolbarPinned = function () {
  editToolbarPinned.value = !editToolbarPinned.value
  settleToolbarPosition()
}

function handlePanelMutation(mutations: MutationRecord[]) {
  const toolbar = document.querySelector('#pbxEditToolbar')
  let remeasureWidth = false

  for (const mutation of mutations) {
    if (mutation.type === 'attributes' && mutation.attributeName === 'selected') {
      remeasureWidth = true
      break
    }
    if (!toolbar) continue
    const target = mutation.target
    if (target instanceof Node && (toolbar === target || toolbar.contains(target))) {
      remeasureWidth = true
      break
    }
  }

  if (remeasureWidth) {
    updatePanelPosition()
  } else {
    updatePanelPositionOnScroll()
  }
}

function updatePanelPositionNow(options: { remeasureWidth?: boolean } = {}) {
  const remeasureWidth = options.remeasureWidth ?? true
  const container = pbxBuilderWrapper.value
  const editToolbarElement = container && container.querySelector<HTMLElement>('#pbxEditToolbar')

  if (!container || !editToolbarElement) return

  const selected = container.querySelector('[selected]')

  if (selected && typeof selected.getBoundingClientRect === 'function') {
    // When selected element is inside a no-select zone (e.g. image slider), anchor the
    // toolbar to the zone's outer container so it doesn't jump around with each slide.
    const noSelectAncestor = selected.closest('[data-pb-no-select]') as Element | null
    const targetEl = noSelectAncestor || selected
    const selectedRect = targetEl.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()

    const margin = 20 // px
    const maxToolbarWidth = container.offsetWidth - margin * 2
    editToolbarElement.style.maxWidth = `${maxToolbarWidth}px`

    editToolbarElement.style.position = editToolbarPinned.value ? 'fixed' : 'absolute'
    editToolbarElement.classList.add('is-visible')

    if (remeasureWidth) {
      editToolbarElement.style.removeProperty('width')
      applyToolbarFlexWidth(editToolbarElement, maxToolbarWidth)
      // Force layout so inner flex wraps within max-width before measuring size/position.
      editToolbarElement.getBoundingClientRect()
    }

    const GAP = 20 // px
    let top =
      selectedRect.top -
      containerRect.top +
      container.scrollTop -
      editToolbarElement.offsetHeight -
      GAP
    let left =
      selectedRect.left -
      containerRect.left +
      selectedRect.width / 2 -
      editToolbarElement.offsetWidth / 2

    if (editToolbarPinned.value) {
      top = containerRect.top + margin
      left = containerRect.left + container.offsetWidth / 2 - editToolbarElement.offsetWidth / 2
      left = Math.max(
        containerRect.left + margin,
        Math.min(
          left,
          containerRect.left + container.offsetWidth - editToolbarElement.offsetWidth - margin,
        ),
      )
    } else {
      top = Math.max(0, top)
      left = Math.max(
        margin,
        Math.min(left, container.offsetWidth - editToolbarElement.offsetWidth - margin),
      )
    }
    editToolbarElement.style.top = `${top}px`
    editToolbarElement.style.left = `${left}px`
    window.dispatchEvent(new CustomEvent('pagebuilder:toolbar-positioned'))
  } else {
    editToolbarElement.classList.remove('is-visible')
    editToolbarElement.removeAttribute('style')
  }
}

const settleToolbarPosition = function () {
  updatePanelPositionNow({ remeasureWidth: true })
  requestAnimationFrame(() => updatePanelPositionNow({ remeasureWidth: true }))
}

function updatePanelPositionOnScroll() {
  cancelAnimationFrame(panelPositionRaf)
  panelPositionRaf = requestAnimationFrame(() => {
    panelPositionRaf = 0
    updatePanelPositionNow({ remeasureWidth: false })
  })
}

function updatePanelPosition() {
  cancelAnimationFrame(panelPositionRaf)
  panelPositionRaf = requestAnimationFrame(() => {
    panelPositionRaf = 0
    updatePanelPositionNow({ remeasureWidth: true })
  })
}

watch(
  () => pageBuilderStateStore.getInlineTipTapEditor,
  () => {
    nextTick(settleToolbarPosition)
  },
)

watch(getElement, () => {
  nextTick(settleToolbarPosition)
})

watch(getComponents, () => {
  nextTick(settleToolbarPosition)
  nextTick(syncInsertControlCanvasOffsets)
})

watch(canvasPageClass, () => {
  nextTick(syncInsertControlCanvasOffsets)
})

watch(canvasPageStyle, () => {
  nextTick(syncInsertControlCanvasOffsets)
})

watch(
  [
    getIsLoadingGlobal,
    getIsLoadingResumeEditing,
    getIsRestoring,
    isLoadingLang,
    openAppNotStartedModal,
  ],
  () => {
    recomputeShowGlobalLoader()
  },
)

const handlePageBuilderLayoutChange = function () {
  settleToolbarPosition()
  syncInsertControlCanvasOffsets()
}

const handleWindowResize = function () {
  updatePanelPosition()
  syncInsertControlCanvasOffsets()
}

const userSettings = JSON.parse(localStorage.getItem('userSettingsPageBuilder') ?? 'null')

const recomputeShowGlobalLoader = function () {
  showGlobalLoader.value =
    isMountInitializing.value ||
    (getIsLoadingGlobal.value && !openAppNotStartedModal.value) ||
    isLoadingLang.value ||
    getIsLoadingResumeEditing.value ||
    getIsRestoring.value
}

onMounted(async () => {
  const needsDeferredMount = pageBuilderService.shouldCompleteBuilderMountOnMount(
    pageBuilderCanvas.value ?? undefined,
  )

  if (needsDeferredMount) {
    isMountInitializing.value = true
    pageBuilderStateStore.setIsLoadingGlobal(true)
    recomputeShowGlobalLoader()
  }

  try {
    if (needsDeferredMount) {
      await pageBuilderService.completeBuilderInitialization(undefined)
    } else {
      // Full initialization was skipped (already mounted) but Vue has re-rendered the
      // sections into new DOM nodes (e.g. modal v-if reopen).  Re-attach listeners so
      // the canvas is immediately interactive without needing a startBuilder() call.
      await pageBuilderService.refreshListeners()
    }
  } finally {
    isMountInitializing.value = false
    pageBuilderStateStore.setIsLoadingGlobal(false)
    recomputeShowGlobalLoader()
  }

  if (userSettings && userSettings.lang) {
    languageSelction.value = userSettings.lang
  }

  await loadTranslations(languageSelction.value)
  isInitializingLang = false
  recomputeShowGlobalLoader()

  updatePanelPosition()
  nextTick(syncInsertControlCanvasOffsets)

  // Set up MutationObserver and event listeners
  const container = pbxBuilderWrapper.value
  if (!container) return

  builderScrollTop = container.scrollTop

  panelPositionObserver = new MutationObserver(handlePanelMutation)
  panelPositionObserver.observe(container, {
    attributes: true,
    attributeFilter: ['selected'],
    childList: true,
    subtree: true,
  })

  container.addEventListener('scroll', handleBuilderContainerScroll, { passive: true })
  window.addEventListener('scroll', updatePanelPositionOnScroll, { passive: true })
  window.addEventListener('resize', handleWindowResize)
  window.addEventListener('pagebuilder:layout-change', handlePageBuilderLayoutChange)
  document.addEventListener('pointerdown', handleInlineEditorDocumentPointerDown, true)

  //
  //
  //
  //
  // Check if Builder started
  await sleep(10000)
  ensureBuilderInitialized()

  // Re-check if Builder started
  await sleep(10000)
  ensureBuilderInitialized()

  // Re-check again if Builder started
  await sleep(10000)
  ensureBuilderInitialized()
})

onBeforeUnmount(() => {
  previewMenuOpen.value = false
  document.removeEventListener('pointerdown', closePreviewMenuOnOutsideClick)
  window.removeEventListener('resize', updatePreviewMenuPosition)
  window.removeEventListener('scroll', updatePreviewMenuPosition, true)
  pageBuilderService.flushPendingEditsToLocalStorage()
  pageBuilderService.markCanvasUnmountedForNextMount()
  cancelAnimationFrame(panelPositionRaf)
  panelPositionObserver?.disconnect()
  panelPositionObserver = null
  pbxBuilderWrapper.value?.removeEventListener('scroll', handleBuilderContainerScroll)
  window.removeEventListener('scroll', updatePanelPositionOnScroll)
  window.removeEventListener('resize', handleWindowResize)
  window.removeEventListener('pagebuilder:layout-change', handlePageBuilderLayoutChange)
  document.removeEventListener('pointerdown', handleInlineEditorDocumentPointerDown, true)
  clearPageBuilderBrandColor()
})
</script>

<template>
  <component :is="'style'" v-if="customFontStylesCss">{{ customFontStylesCss }}</component>
  <div
    class="lg:pbx-min-w-full lg:pbx-max-w-full lg:pbx-w-full pbx-mx-auto pbx-flex pbx-flex-col pbx-font-sans pbx-text-black pbx-border-solid pbx-border pbx-border-gray-400 pbx-inset-x-0 pbx-z-10 pbx-bg-white pbx-overflow-x-auto pbx-h-full"
  >
    <GlobalLoader v-if="showGlobalLoader"></GlobalLoader>
    <BaseModal
      title="The builder hasn’t started yet"
      :showModalBuilder="openAppNotStartedModal"
      @closeMainModalBuilder="handlAppNotStartedModal"
      type="delete"
      maxWidth="2xl"
      :noBackgroundOpacity="true"
    >
      The builder hasn’t started yet. If this screen doesn’t go away soon, it may just need a little
      setup in the background. You can safely contact support and ask them to initialize the builder
      by running the startBuilder method for this resource.
    </BaseModal>

    <ComponentLibraryModal
      v-if="showModalAddComponent"
      :show="showModalAddComponent"
      :firstButtonText="firstButtonTextSearchComponents"
      :title="titleModalAddComponent"
      :CustomBuilderComponents="props.CustomBuilderComponents"
      @firstModalButtonSearchComponentsFunction="() => firstModalButtonSearchComponentsFunction?.()"
    ></ComponentLibraryModal>

    <ProductLibraryModal
      v-if="showProductsFeature && showProductLibraryModal"
      :open="showProductLibraryModal"
      :title="titleProductLibraryModal"
      :displayProductsComponent="props.DisplayProducts"
      @closeProductLibrary="closeProductLibraryModal"
    />

    <ConfirmActionModal
      :showDynamicModalBuilder="showModalCloseNoSave"
      :isLoading="false"
      :type="typeModalloseNoSave"
      :gridColumnAmount="gridColumnModalCloseNoSave"
      :title="titleModalCloseNoSave"
      :description="descriptionModalCloseNoSave"
      :firstButtonText="firstButtonCloseNoSave ?? undefined"
      :secondButtonText="secondButtonCloseNoSave ?? undefined"
      :thirdButtonText="thirdButtonCloseNoSave ?? undefined"
      @firstModalButtonFunctionDynamicModalBuilder="() => firstModalButtonCloseNoSaveFunction?.()"
      @secondModalButtonFunctionDynamicModalBuilder="() => secondModalButtonCloseNoSaveFunction?.()"
      @thirdModalButtonFunctionDynamicModalBuilder="() => thirdModalButtonCloseNoSaveFunction?.()"
    >
      <header></header>
      <main></main>
    </ConfirmActionModal>

    <BaseModal
      :title="titleBuilderDesktop"
      :showModalBuilder="openPageBuilderPreviewModal"
      @closeMainModalBuilder="firstPageBuilderPreviewModalButton"
      maxWidth="screen"
    >
      <PageBuilderPreview></PageBuilderPreview>
    </BaseModal>

    <BaseModal
      :title="titleBuilderMobile"
      :showModalBuilder="openPageBuilderPreviewMobile"
      @closeMainModalBuilder="firstPageBuilderPreviewModalButtonMobile"
      maxWidth="lg"
    >
      <PageBuilderPreview :mobile="true" />
    </BaseModal>

    <ConfirmActionModal
      :showDynamicModalBuilder="showModalResumeEditing"
      :isLoading="getIsLoadingResumeEditing"
      :type="typeModal"
      :gridColumnAmount="gridColumnModalResumeEditing"
      :title="titleModalResumeEditing"
      :description="descriptionModalResumeEditing"
      :firstButtonText="firstButtonResumeEditing"
      :secondButtonText="secondButtonResumeEditing ?? undefined"
      :thirdButtonText="thirdButtonResumeEditing ?? undefined"
      @firstModalButtonFunctionDynamicModalBuilder="() => firstModalButtonResumeEditingFunction?.()"
      @secondModalButtonFunctionDynamicModalBuilder="
        () => secondModalButtonResumeEditingFunction?.()
      "
      @thirdModalButtonFunctionDynamicModalBuilder="() => thirdModalButtonResumeEditingFunction?.()"
    >
      <header></header>
      <main></main>
    </ConfirmActionModal>
    <ConfirmActionModal
      :showDynamicModalBuilder="showModalRestore"
      :isLoading="getIsRestoring"
      :type="typeModalRestore"
      :gridColumnAmount="gridColumnModalRestore"
      :title="titleModalRestore"
      :description="descriptionModalRestore"
      :firstButtonText="firstButtonRestore"
      :secondButtonText="secondButtonRestore ?? undefined"
      :thirdButtonText="thirdButtonRestore ?? undefined"
      @firstModalButtonFunctionDynamicModalBuilder="() => firstModalButtonRestoreFunction?.()"
      @secondModalButtonFunctionDynamicModalBuilder="() => secondModalButtonRestoreFunction?.()"
      @thirdModalButtonFunctionDynamicModalBuilder="() => thirdModalButtonRestoreFunction?.()"
    >
      <header></header>
      <main></main>
    </ConfirmActionModal>

    <div
      id="pagebuilder-navbar"
      class="lg:pbx-min-w-full lg:pbx-max-w-full lg:pbx-w-full pbx-min-w-[64rem] pbx-max-w-[64rem] pbx-w-[64rem] pbx-flex-1 pbx-bg-myPrimaryLightGrayColor pbx-flex pbx-items-center pbx-justify-between pbx-border-0 pbx-border-solid pbx-border-b pbx-border-gray-200 pbx-mb-1 pbx-font-sans"
    >
      <template
        v-if="
          getPageBuilderConfig &&
          getPageBuilderConfig.pageBuilderLogo &&
          getPageBuilderConfig.pageBuilderLogo.src
        "
      >
        <!-- Logo # start -->
        <div
          @click.self="
            async () => {
              await pageBuilderService.clearHtmlSelection()
            }
          "
          class="pbx-flex pbx-justify-start pbx-py-1 lg:pbx-ml-4 pbx-ml-2"
        >
          <img class="pbx-h-4" :src="getPageBuilderConfig.pageBuilderLogo.src" alt="Logo" />
        </div>
      </template>
      <!-- Logo # end -->

      <UndoRedo ref="undoRedoRef" @toolbar-hide-request="hideToolbar"></UndoRedo>

      <div
        @click.self="
          async () => {
            await pageBuilderService.clearHtmlSelection()
          }
        "
        class="pbx-flex-1 pbx-flex pbx-justify-center pbx-items-center pbx-py-1 pbx-w-full"
      >
        <div class="pbx-flex pbx-items-center pbx-justify-center">
          <!-- Save Start -->
          <button
            class="pbx-mySecondaryButton pbx-navbarUtilityButton pbx-h-5 pbx-flex pbx-gap-1.5 pbx-mr-2"
            @click.stop="
              async () => {
                await pageBuilderService.clearHtmlSelection()
                await savePageWithToast()
              }
            "
            type="button"
            :disabled="getIsSaving"
            :aria-label="translate('Save')"
            :title="`${translate('Save')} (Ctrl+S)`"
          >
            <div
              v-if="!getIsSaving"
              class="pbx-h-8 pbx-w-8 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-justify-center"
            >
              <span class="material-symbols-outlined pbx-text-lg" aria-hidden="true">save</span>
            </div>
            <div
              v-if="getIsSaving"
              class="pbx-h-8 pbx-w-8 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-justify-center"
            >
              <span class="pbx-relative pbx-flex pbx-size-3">
                <span
                  class="pbx-absolute pbx-inline-flex pbx-h-full pbx-w-full pbx-animate-ping pbx-rounded-full pbx-bg-gray-400 pbx-opacity-75"
                ></span>
                <span
                  class="pbx-relative pbx-inline-flex pbx-size-3 pbx-rounded-full pbx-bg-green-200"
                ></span>
              </span>
            </div>
            <div>{{ translate('Save') }}</div>
          </button>
          <!-- Save End -->

          <!-- Restore Start -->
          <template
            v-if="
              getPageBuilderConfig &&
              getPageBuilderConfig.updateOrCreate &&
              getPageBuilderConfig.updateOrCreate.formType === 'update'
            "
          >
            <button
              class="pbx-mySecondaryButton pbx-navbarUtilityButton pbx-h-5 pbx-flex pbx-gap-1.5 lg:pbx-mr-2 pbx-mr-2"
              @click.stop="
                async () => {
                  await pageBuilderService.clearHtmlSelection()
                  await handleRestoreOriginalContent()
                }
              "
              type="button"
              :disabled="getIsRestoring"
              :aria-label="translate('Reset Page')"
            >
              <div
                v-if="!getIsRestoring"
                class="pbx-h-8 pbx-w-8 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-justify-center"
              >
                <span class="material-symbols-outlined pbx-text-lg"> settings_backup_restore </span>
              </div>
              <div
                v-if="getIsRestoring"
                class="pbx-h-8 pbx-w-8 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-justify-center"
              >
                <span class="pbx-relative pbx-flex pbx-size-3">
                  <span
                    class="pbx-absolute pbx-inline-flex pbx-h-full pbx-w-full pbx-animate-ping pbx-rounded-full pbx-bg-gray-400 pbx-opacity-75"
                  ></span>
                  <span
                    class="pbx-relative pbx-inline-flex pbx-size-3 pbx-rounded-full pbx-bg-green-200"
                  ></span>
                </span>
              </div>
              <div class="lg:pbx-block pbx-hidden">
                <span> {{ translate('Reset Page') }} </span>
              </div>
              <div class="lg:pbx-hidden pbx-block">
                <span> {{ translate('Reset') }} </span>
              </div>
            </button>
          </template>
          <!-- Restore End -->
        </div>
      </div>

      <div
        @click.self="
          async () => {
            await pageBuilderService.clearHtmlSelection()
          }
        "
        class="pbx-flex-1 pbx-flex pbx-justify-center pbx-items-center pbx-py-1 pbx-w-full"
      >
        <div
          @click.self="
            async () => {
              await pageBuilderService.clearHtmlSelection()
            }
          "
          class="pbx-flex pbx-items-center pbx-justify-center"
        >
          <button
            type="button"
            class="pbx-mySecondaryButton pbx-navbarUtilityButton pbx-h-5 pbx-flex pbx-items-center pbx-justify-center pbx-gap-1.5 pbx-mr-2 pbx-font-sans"
            :aria-label="translate('Add components')"
            :title="translate('Add components')"
            @click="
              () => {
                pageBuilderStateStore.setComponentArrayAddMethod('unshift')
                toggleAddComponentModal()
              }
            "
          >
            <span
              class="pbx-h-8 pbx-w-8 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-justify-center"
            >
              <LayersIcon />
            </span>
            <span class="lg:pbx-block pbx-hidden">
              {{ translate('Add') }}
            </span>
          </button>
          <button
            v-if="showProductsFeature"
            type="button"
            class="pbx-mySecondaryButton pbx-navbarUtilityButton pbx-h-5 pbx-flex pbx-items-center pbx-justify-center pbx-gap-1.5 pbx-mr-2 pbx-font-sans"
            :aria-label="translate('Add products')"
            :title="translate('Add products')"
            @click="toggleProductLibraryModal"
          >
            <span
              class="pbx-h-8 pbx-w-8 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-justify-center"
            >
              <span class="material-symbols-outlined"> local_mall </span>
            </span>
            <span class="lg:pbx-block pbx-hidden">
              {{ translate('Products') }}
            </span>
          </button>
          <button
            ref="previewMenuTriggerRef"
            type="button"
            class="pbx-mr-2 pbx-flex pbx-items-center pbx-justify-center pbx-gap-1.5 pbx-border-0 pbx-bg-transparent pbx-cursor-pointer"
            :aria-label="translate('Preview')"
            :title="translate('Preview')"
            :aria-expanded="previewMenuOpen"
            @click="previewMenuOpen = !previewMenuOpen"
          >
            <span
              class="pbx-h-8 pbx-w-8 pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white"
            >
              <PreviewDesktopIcon />
            </span>
          </button>
        </div>
      </div>

      <Teleport to="body">
        <transition name="popup-fade">
          <div
            v-if="previewMenuOpen"
            ref="previewMenuPopoverRef"
            role="menu"
            :style="previewMenuPopoverStyle"
            class="pbx-toolbarMoreMenu"
            @mousedown.stop
            @pointerdown.stop
            @click.stop
          >
            <div class="pbx-toolbarMoreMenuSection">
              <p class="pbx-toolbarMoreMenuSectionLabel">{{ translate('Preview') }}</p>
              <button
                type="button"
                class="pbx-toolbarMoreMenuItem"
                role="menuitem"
                @click="openDesktopPreviewFromMenu"
              >
                <span class="pbx-toolbarMoreMenuItemLabel">{{ translate('Desktop preview') }}</span>
              </button>
              <button
                type="button"
                class="pbx-toolbarMoreMenuItem"
                role="menuitem"
                @click="openMobilePreviewFromMenu"
              >
                <span class="pbx-toolbarMoreMenuItemLabel">{{ translate('Mobile preview') }}</span>
              </button>
            </div>
          </div>
        </transition>
      </Teleport>

      <div class="pbx-flex-1 pbx-flex gap-2 pbx-items-center pbx-justify-end">
        <!-- Options # Start -->
        <div
          @click.self="
            async () => {
              await pageBuilderService.clearHtmlSelection()
            }
          "
          class="pbx-flex pbx-items-center pbx-py-1 pbx-w-full"
          :class="[showCloseButton ? 'pbx-justify-between' : 'pbx-justify-end']"
        >
          <ToolbarOption></ToolbarOption>
        </div>
        <!-- Options # Start -->

        <!-- Publish buttons start -->
        <template v-if="showPublishButton">
          <div class="pbx-flex-1 pbx-ml-2">
            <button
              class="pbx-myPrimaryButton"
              @click="
                async () => {
                  closePublish()
                }
              "
            >
              {{ translate('Publish') }}
            </button>
          </div>
        </template>
        <!-- Publish buttons end -->

        <template
          v-if="
            pageBuilderService &&
            getPageBuilderConfig &&
            getPageBuilderConfig.userSettings &&
            getPageBuilderConfig.userSettings.language &&
            !(getPageBuilderConfig.userSettings.language as Record<string, unknown>)
              ?.disableLanguageDropDown
          "
        >
          <template
            v-if="
              getPageBuilderConfig &&
              getPageBuilderConfig.userSettings &&
              getPageBuilderConfig.userSettings.language
            "
          >
            <div
              class="pbx-flex-1 pbx-flex pbx-justify-end pbx-items-center pbx-ml-2 lg:pbx-mr-4 pbx-mr-2"
            >
              <select
                id="pbx-lang"
                class="pbx-myPrimarySelect pbx-min-w-20"
                v-model="languageSelction"
              >
                <template
                  v-if="
                    Array.isArray(getPageBuilderConfig.userSettings.language.enable) &&
                    getPageBuilderConfig.userSettings.language.enable.length >= 1
                  "
                >
                  <option
                    v-for="lang in pageBuilderService
                      .availableLanguage()
                      .filter(
                        (l) =>
                          getPageBuilderConfig?.userSettings?.language?.enable?.includes(l) ??
                          false,
                      )"
                    :key="lang"
                    :value="lang"
                  >
                    {{ lang }}
                  </option>
                </template>
                <template
                  v-if="
                    !getPageBuilderConfig.userSettings.language.enable ||
                    (Array.isArray(getPageBuilderConfig.userSettings.language.enable) &&
                      getPageBuilderConfig.userSettings.language.enable.length === 0)
                  "
                >
                  <option
                    v-for="lang in pageBuilderService.availableLanguage()"
                    :key="lang"
                    :value="lang"
                  >
                    {{ lang }}
                  </option>
                </template>
              </select>
            </div>
          </template>
        </template>
        <template v-if="showCloseButton">
          <div class="pbx-flex-1 pbx-ml-2 pbx-mr-2">
            <button
              type="button"
              class="pbx-h-8 pbx-w-8 pbx-flex-end pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white hover:pbx-fill-white focus-visible:pbx-ring-0"
              :aria-label="translate('Close Page Builder')"
              @click="
                async () => {
                  closePageBuilder()
                  await pageBuilderService.clearHtmlSelection()
                }
              "
            >
              <span class="material-symbols-outlined" aria-hidden="true"> close </span>
            </button>
          </div>
        </template>
      </div>
    </div>
    <!-- Top Layout Save And Reset Area - End -->

    <!-- Page Builder Main Start -->
    <div
      id="pagebuilder-main"
      class="lg:pbx-min-w-full lg:pbx-max-w-full lg:pbx-w-full pbx-min-w-[64rem] pbx-max-w-[64rem] pbx-w-[64rem] pbx-flex-1 pbx-relative pbx-h-full pbx-flex pbx-pb-2 pbx-gap-2"
      style="
        background-color: #fafafa;
        background-image: radial-gradient(#e5e7eb 1px, transparent 1px);
        background-size: 20px 20px;
      "
    >
      <main
        ref="pbxBuilderWrapper"
        id="page-builder-wrapper"
        class="pbx-transition-all pbx-duration-300 pbx-p-1 pbx-flex pbx-flex-col pbx-grow pbx-rounded-tr-2xl pbx-rounded-tl-2xl pbx-border-solid pbx-border pbx-border-gray-200 pbx-items-stretch pbx-text-black pbx-h-[100vh] pbx-overflow-y-scroll pbx-relative pbx-pt-16"
        :class="[getMenuRight ? 'pbx-w-full' : 'pbx-w-full']"
        :style="canvasElementFontStyle"
      >
        <div
          id="pbxEditToolbar"
          class="pbx-z-30 pbx-flex pbx-flex-wrap pbx-gap-x-2 pbx-gap-y-1 pbx-justify-start pbx-items-center pbx-content-start pbx-rounded-sm pbx-px-2 pbx-py-0 pbx-h-0 pbx-relative pbx-box-border"
        >
          <template v-if="getElement">
            <SelectedElementToolbar
              ref="selectedElementToolbarRef"
              :toolbar-pinned="editToolbarPinned"
              @open-image-settings="openImageSettings"
              @toggle-toolbar-pin="toggleEditToolbarPinned"
            ></SelectedElementToolbar>
          </template>
        </div>
        <!-- Element Popover toolbar end -->

        <div
          id="pagebuilder"
          ref="pageBuilderCanvas"
          data-builder-canvas
          :class="[canvasAppliedFontClass, canvasPageClass]"
          :style="canvasPageStyle ? canvasPageStyle : undefined"
          @dblclick.capture="handleCanvasDoubleClick"
        >
          <!-- Insert button when empty of componenets -->
          <div
            v-if="Array.isArray(getComponents) && getComponents.length === 0"
            data-pbx-insert-btn
            data-pb-no-select
          >
            <div
              class="pbx-flex pbx-justify-center pbx-w-full pbx-absolute pbx-items-center pbx-gap-3"
            >
              <div
                @click="handleInsertButtonClick(0)"
                class="pbx-py-4 pbx-px-4 pbx-my-4 pbx-rounded-full pbx-bg-gray-100 pbx-text-gray-600 pbx-flex pbx-items-center pbx-justify-center hover:pbx-text-white hover:pbx-bg-gray-900 pbx-cursor-pointer"
              >
                <div class="pbx-flex pbx-items-center pbx-gap-2">
                  <span
                    class="pbx-font-medium pbx-break-words lg:pbx-text-lg md:pbx-text-lg pbx-text-base pbx-font-sans"
                  >
                    {{ translate('Add new Components') }}
                  </span>
                </div>
              </div>
              <div
                v-if="showProductsFeature"
                @click="handleInsertProductButtonClick(0)"
                class="pbx-py-4 pbx-px-4 pbx-my-4 pbx-rounded-full pbx-bg-gray-100 pbx-text-gray-600 pbx-flex pbx-items-center pbx-justify-center hover:pbx-text-white hover:pbx-bg-gray-900 pbx-cursor-pointer"
              >
                <div class="pbx-flex pbx-items-center pbx-gap-2">
                  <span class="material-symbols-outlined">local_mall</span>
                  <span
                    class="pbx-font-medium pbx-break-words lg:pbx-text-lg md:pbx-text-lg pbx-text-base pbx-font-sans"
                  >
                    {{ translate('Products') }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Insert button at the top -->
          <div
            v-if="Array.isArray(getComponents) && getComponents.length != 0"
            data-pbx-insert-btn
            data-pb-no-select
          >
            <div
              class="pbx-flex pbx-justify-end pbx-w-full pbx-h-0 pbx-items-center pbx-rounded-r-full pbx-z-10"
            >
              <div class="pbx-flex pbx-items-center">
                <div
                  @click="handleInsertButtonClick(0)"
                  class="pbx-select-none pbx-addsection-btn pbx-font-sans pbx-rounded-l-full pbx-rounded-r-none pbx-bg-gray-100 pbx-text-gray-600 pbx-z-50 pbx-flex pbx-items-center pbx-justify-center hover:pbx-text-white hover:pbx-bg-gray-900 pbx-cursor-pointer"
                >
                  <div class="pbx-flex pbx-items-center">
                    <span class="material-symbols-outlined"> add </span>
                    <span class="lg:pbx-block pbx-hidden"> {{ translate('Add') }}</span>
                  </div>
                </div>
                <div
                  v-if="showProductsFeature"
                  @click="handleInsertProductButtonClick(0)"
                  class="pbx-select-none pbx-addsection-btn pbx-font-sans pbx-rounded-l-none pbx-bg-gray-100 pbx-text-gray-600 pbx-z-50 pbx-flex pbx-items-center pbx-justify-center hover:pbx-text-white hover:pbx-bg-gray-900 pbx-cursor-pointer pbx-border-l pbx-border-gray-200"
                >
                  <div class="pbx-flex pbx-items-center">
                    <span class="material-symbols-outlined"> local_mall </span>
                    <span v-if="false" class="lg:pbx-block pbx-hidden">
                      {{ translate('Products') }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Each section gets its own data-pagebuilder-content wrapper.
               User global styles land once on #pagebuilder.
               Insert buttons are siblings of content wrappers. -->
          <template v-for="(component, idx) in getComponents" :key="component.id">
            <div
              v-if="component.html_code"
              data-pagebuilder-content
              v-html="component.html_code"
              @mouseup="handleSelectComponent(component)"
            ></div>
            <!-- Insert button — sibling of [data-pagebuilder-content] -->
            <div
              v-if="Array.isArray(getComponents) && getComponents.length != 0"
              data-pbx-insert-btn
              data-pb-no-select
            >
              <div
                class="pbx-flex pbx-justify-end pbx-w-full pbx-h-0 pbx-items-center pbx-rounded-r-full pbx-z-10"
              >
                <div class="pbx-flex pbx-items-center">
                  <div
                    @click="handleInsertButtonClick(idx + 1)"
                    class="pbx-select-none pbx-addsection-btn pbx-font-sans pbx-rounded-l-full pbx-rounded-r-none pbx-bg-gray-100 pbx-text-gray-600 pbx-z-50 pbx-flex pbx-items-center pbx-justify-center hover:pbx-text-white hover:pbx-bg-gray-900 pbx-cursor-pointer"
                  >
                    <div class="pbx-flex pbx-items-center">
                      <span class="material-symbols-outlined"> add </span>
                      <span class="lg:pbx-block pbx-hidden"> {{ translate('Add') }}</span>
                    </div>
                  </div>
                  <div
                    v-if="showProductsFeature"
                    @click="handleInsertProductButtonClick(idx + 1)"
                    class="pbx-select-none pbx-addsection-btn pbx-font-sans pbx-rounded-l-none pbx-bg-gray-100 pbx-text-gray-600 pbx-z-50 pbx-flex pbx-items-center pbx-justify-center hover:pbx-text-white hover:pbx-bg-gray-900 pbx-cursor-pointer pbx-border-l pbx-border-gray-200"
                  >
                    <div class="pbx-flex pbx-items-center">
                      <span class="material-symbols-outlined"> local_mall </span>
                      <span v-if="false" class="lg:pbx-block pbx-hidden">
                        {{ translate('Products') }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </main>

      <transition name="slide-right" appear mode="out-in">
        <aside
          v-if="getMenuRight"
          aria-label="menu"
          id="pagebuilder-right-menu"
          class="pbx-z-20 pbx-flex-shrink-0 pbx-overflow-hidden pbx-border-0 pbx-border-solid pbx-border-l-0 pbx-border-l-gray-600 pbx-rounded-l-2xl pbx-h-[100vh]"
          :class="[
            getMenuRight
              ? 'pbx-w-96 pbx-bg-myPrimaryLightGrayColor pbx-items-stretch'
              : 'pbx-w-0 pbx-mr-0',
          ]"
        >
          <RightSidebarEditor @closeEditor="pageBuilderStateStore.setMenuRight(false)">
          </RightSidebarEditor>
        </aside>
        <div
          v-else
          @click.self="
            async () => {
              await pageBuilderService.clearHtmlSelection()
            }
          "
          class="pbx-w-18 pbx-bg-myPrimaryLightGrayColor pbx-pt-5 pbx-z-20 pbx-flex-shrink-0 pbx-overflow-hidden pbx-border-0 pbx-border-solid pbx-border-l-0 pbx-border-l-gray-600 pbx-rounded-l-2xl pbx-h-[100vh] pbx-pl-2 pbx-pr-2"
        >
          <div
            @click.self="
              async () => {
                await pageBuilderService.clearHtmlSelection()
              }
            "
            class="pbx-flex pbx-flex-col pbx-items-center pbx-justify-center pbx-gap-2"
          >
            <button
              v-if="!getMenuRight"
              @click="pageBuilderStateStore.setMenuRight(true)"
              type="button"
              class="pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white"
            >
              <span>
                <svg
                  fill="currentColor"
                  height="22"
                  viewBox="0 0 22 22"
                  width="22"
                  xmlns="http://www.w3.org/2000/svg"
                  style="display: block"
                >
                  <g clip-path="url(#prefix__clip0_1645_485)">
                    <path
                      clip-rule="evenodd"
                      d="M19.871 1.81a2.768 2.768 0 00-3.914 0l-3.543 3.544-2.5-2.5L0 12.768l8.914 8.914 9.914-9.914-2.5-2.5 3.543-3.543a2.768 2.768 0 000-3.914zm-2.5 1.415a.768.768 0 011.086 1.086L13.5 9.268l2.5 2.5-1.086 1.086-6.086-6.086 1.086-1.086 2.5 2.5 4.957-4.957zM7.414 8.182l-4.586 4.586 1.086 1.086 3.293-3.293 1.414 1.414-3.293 3.293 1.086 1.086 3.293-3.293 1.414 1.414-3.293 3.293 1.086 1.086 4.586-4.586-6.086-6.086z"
                      fill-rule="evenodd"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="prefix__clip0_1645_485">
                      <path d="M0 0h22v22H0z" fill="#fff"></path>
                    </clipPath>
                  </defs>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </transition>
    </div>
    <!-- Page Builder Main End -->
  </div>
  <FloatingSidePanel
    :title="translate('Image Settings')"
    :showSidebarPanel="showImageSettingsModal"
    position="left"
    @closeSidebarPanel="closeImageSettings"
  >
    <ImageSettingsModal :show="showImageSettingsModal" />
  </FloatingSidePanel>
  <HtmlEditorModal
    :show="htmlEditorShow"
    :title="htmlEditorTitle"
    :html="htmlEditorHtml"
    :is-loading="htmlEditorLoading"
    :error="htmlEditorError"
    @update:html="htmlEditorHtml = $event"
    @close="closeHtmlEditor"
    @save="saveHtmlEditor"
  />
  <HtmlCodeViewerModal
    :show="htmlViewerShow"
    :title="htmlViewerTitle"
    :html="htmlViewerHtml"
    @close="closeHtmlViewer"
  />
  <ToastContainer />
</template>

<style>
/* In builder edit mode: pause animation, restore full scrollability for editing */
[data-builder-canvas] [data-isl][data-isl-auto] .pbx-isl-t {
  animation-play-state: paused !important;
  overflow: auto !important;
  width: auto !important;
  pointer-events: auto !important;
  transform: none !important;
}
[data-builder-canvas] [data-isl][data-isl-auto] .pbx-isl-t > div {
  min-width: 100% !important;
}
[data-builder-canvas] [data-isl][data-isl-auto] .pbx-isl-dot,
[data-builder-canvas] [data-isl][data-isl-auto] .pbx-isl-nums span {
  animation-play-state: paused !important;
}

#pagebuilder [data-pbx-insert-btn] {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 2;
  width: calc(100% + var(--pbx-canvas-pad-left, 0px) + var(--pbx-canvas-pad-right, 0px));
  margin-left: calc(-1 * var(--pbx-canvas-pad-left, 0px));
  margin-right: calc(-1 * var(--pbx-canvas-pad-right, 0px));
  transform: translateX(var(--pbx-canvas-margin-right, 0px));
}
#pagebuilder [data-pbx-insert-btn]:hover .pbx-addsection-btn {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Keep builder insert controls visually stable when users apply global page
   typography styles (e.g. letter-spacing, text-transform, font-style). */
#pagebuilder [data-pbx-insert-btn] .pbx-addsection-btn,
#pagebuilder [data-pbx-insert-btn] .pbx-addsection-btn * {
  letter-spacing: normal !important;
  word-spacing: normal !important;
  text-transform: none !important;
  text-indent: 0 !important;
  font-style: normal !important;
  font-variant: normal !important;
}

#pagebuilder .pbx-addsection-btn {
  height: 1.875rem;
  padding-inline: 0.375rem;
  font-size: 0.9rem;
  line-height: 1;
}
#pagebuilder .pbx-addsection-btn > div {
  gap: 0.125rem;
}
#pagebuilder .pbx-addsection-btn .material-symbols-outlined {
  font-size: 1.125rem;
  line-height: 1;
}
/* Insert buttons are siblings of [data-pagebuilder-content], so section markup
   remains isolated from builder controls. */

#pagebuilder [element] {
  outline: rgba(255, 255, 255, 0) dashed 3px !important;
  outline-offset: -4px !important;
}

#pagebuilder [hovered] {
  outline: rgb(0, 140, 14, 1) dashed 3px !important;
  outline-offset: -4px !important;
}

#pagebuilder [selected] {
  position: relative;
  outline: rgb(185, 16, 16) dashed 3px !important;
  outline-offset: -4px !important;
}

/* sortable */

.sortable-ghost {
  display: flex;
  justify-content: center;
}

.sortable-ghost > * {
  width: 100%;
}

/* CSS for content inside page builder # start */
#page-builder-editor .tiptap {
  outline: none !important;
  box-shadow: none !important;
  background: #fff;
  min-height: 25rem;
  border-bottom: 1px solid #f1f1f1;
  padding: 0px 0px 10px 16px;
  margin-bottom: 20px;
  padding-bottom: 100px;
}

#pagebuilder [data-pbx-inline-tiptap] {
  cursor: text;
}

#pagebuilder [data-pbx-inline-tiptap] > .tiptap {
  outline: none !important;
  min-height: 1em;
}

#pagebuilder [data-pbx-inline-tiptap] .ProseMirror {
  outline: none !important;
  min-height: 1em;
}

#pagebuilder [data-pbx-inline-tiptap] .ProseMirror > *:first-child {
  margin-top: 0;
}

#pagebuilder [data-pbx-inline-tiptap] .ProseMirror > *:last-child {
  margin-bottom: 0;
}

#pagebuilder [data-pbx-inline-tiptap] .ProseMirror-focused {
  caret-color: currentColor;
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

.slide-right-enter-to,
.slide-right-leave-from {
  transform: translateX(0%);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.1s ease;
}
</style>
