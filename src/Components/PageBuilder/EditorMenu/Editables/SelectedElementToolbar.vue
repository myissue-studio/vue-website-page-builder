<script setup lang="ts">
import { ref, computed, inject, watch, onBeforeUnmount, nextTick } from 'vue'
import ConfirmActionModal from '../../../Modals/ConfirmActionModal.vue'
import TipTapInput from '../../../TipTap/TipTapInput.vue'
import InlineTipTapEditor from '../../../TipTap/InlineTipTapEditor.vue'
import MediaLibraryModal from '../../../Modals/MediaLibraryModal.vue'
import TextColorEditor from './TextColorEditor.vue'
import BackgroundColorEditor from './BackgroundColorEditor.vue'
import ToggleInput from '../../../Inputs/ToggleInput.vue'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import { getPageBuilder } from '../../../../composables/usePageBuilder'
import { useTranslations } from '../../../../composables/useTranslations'
import { useToast } from '../../../../composables/useToast'
import SliderIcon from '../../../Icons/SliderIcon.vue'
import ProductSectionSettingsFields from './ProductSectionSettingsFields.vue'
import type {
  ProductButtonStyle,
  ProductCardStyle,
  ProductGridLayout,
  ProductMobileColumns,
} from '../../../../types'
import { DEFAULT_PRODUCT_SECTION_OPTIONS } from '../../../../utils/builder/product-section-options'
import { getEditToolbarPopoverTop } from '../../../../utils/builder/clamp-edit-toolbar-popover-top'
import {
  CLOSE_EDIT_TOOLBAR_POPOVERS_EVENT,
  suppressEditToolbarPopoverScrollClose,
} from '../../../../utils/builder/edit-toolbar-popover-events'
import {
  buildSliderOnclickJs,
  buildSliderStyle,
  isSliderArrowsEnabled,
  syncSliderArrows,
  syncSliderWrapClones,
} from '../../../../utils/builder/slider-layout'
import { getPlaceholderImageDataUrl } from '../../../../utils/builder/placeholder-image'

const { translate } = useTranslations()
const { showToast } = useToast()
const pageBuilderService = getPageBuilder()
const props = defineProps<{
  toolbarPinned?: boolean
}>()
const emit = defineEmits<{
  (event: 'open-image-settings'): void
  (event: 'toggle-toolbar-pin'): void
}>()

// Use shared store instance
const pageBuilderStateStore = sharedPageBuilderStore
const customMediaComponent = inject<Record<string, unknown> | null>('CustomMediaComponent', null)

const getElement = computed(() => {
  return pageBuilderStateStore.getElement
})

// Get tagName of element
const elementTag = computed(() => {
  return getElement.value?.tagName
})

const canMoveUp = computed(() => pageBuilderService.canMoveUp())
const canMoveDown = computed(() => pageBuilderService.canMoveDown())
const canReverseLayout = computed(() => {
  if (!getElement.value || !getComponent.value) return false
  return !!pageBuilderService.findReverseableContainer()
})

const autoRotateTick = ref(0)
const showSliderModal = ref(false)
const draftSliderAutoRotate = ref(false)
const draftSliderSpeed = ref(3)
const draftSliderImageCount = ref(3)
const draftSliderPerView = ref(1)
const draftSliderLoop = ref(true)
const draftSliderShowArrows = ref(true)
const sliderSettingsBaseline = ref<{
  autoRotate: boolean
  speed: number
  imageCount: number
  perView: number
  loop: boolean
  showArrows: boolean
} | null>(null)
const isSavingSliderSettings = ref(false)

const isInsideSlider = computed(() => {
  return !!(getElement.value instanceof HTMLElement && getElement.value.closest('[data-isl]'))
})

const sliderAutoRotate = computed(() => {
  void autoRotateTick.value
  if (!(getElement.value instanceof HTMLElement)) return false
  return getElement.value.closest('[data-isl]')?.hasAttribute('data-isl-auto') ?? false
})

const isSliderSettingsDirty = computed(() => {
  const baseline = sliderSettingsBaseline.value
  if (!baseline) return false
  return (
    draftSliderAutoRotate.value !== baseline.autoRotate ||
    draftSliderSpeed.value !== baseline.speed ||
    draftSliderImageCount.value !== baseline.imageCount ||
    draftSliderPerView.value !== baseline.perView ||
    draftSliderLoop.value !== baseline.loop ||
    draftSliderShowArrows.value !== baseline.showArrows
  )
})

const readSliderSettingsFromDom = () => {
  if (!(getElement.value instanceof HTMLElement)) {
    return {
      autoRotate: false,
      speed: 3,
      imageCount: 3,
      perView: 1,
      loop: true,
      showArrows: true,
    }
  }
  const container = getElement.value.closest('[data-isl]') as HTMLElement | null
  if (!container) {
    return {
      autoRotate: false,
      speed: 3,
      imageCount: 3,
      perView: 1,
      loop: true,
      showArrows: true,
    }
  }
  const track = container.querySelector('.pbx-isl-t')
  const perViewRaw = parseInt(container.getAttribute('data-isl-per-view') || '1', 10)
  const realSlideCount = track
    ? Array.from(track.children).filter((child) => !child.hasAttribute('data-isl-clone')).length
    : 3
  return {
    autoRotate: container.hasAttribute('data-isl-auto'),
    speed: parseInt(container.getAttribute('data-isl-speed') || '3', 10),
    imageCount: realSlideCount,
    perView: perViewRaw === 2 ? 2 : 1,
    loop: container.getAttribute('data-isl-loop') !== 'false',
    showArrows: isSliderArrowsEnabled(container),
  }
}

const openSliderSettings = () => {
  const current = readSliderSettingsFromDom()
  draftSliderAutoRotate.value = current.autoRotate
  draftSliderSpeed.value = current.speed
  draftSliderImageCount.value = current.imageCount
  draftSliderPerView.value = current.perView
  draftSliderLoop.value = current.loop
  draftSliderShowArrows.value = current.showArrows
  sliderSettingsBaseline.value = { ...current }
  showSliderModal.value = true
}

const closeSliderSettings = () => {
  showSliderModal.value = false
  sliderSettingsBaseline.value = null
}

const componentSettingsTick = ref(0)
const showComponentSettingsModal = ref(false)
const imageSettingsTick = ref(0)

const isSelectedImage = computed(() => {
  void imageSettingsTick.value
  return pageBuilderService.isSelectedElementImage()
})

const isImageSettingsOpen = computed(() => pageBuilderStateStore.getImageSettingsPanelOpen)

const openImageSettings = () => {
  imageSettingsTick.value++
  emit('open-image-settings')
}

const isSelectedComponentTopElement = computed(() => {
  void componentSettingsTick.value
  return pageBuilderService.isSelectedComponentTopElement()
})

const selectedComponentFullWidth = computed(() => {
  void componentSettingsTick.value
  return pageBuilderService.selectedComponentIsFullWidth()
})

const openComponentSettings = () => {
  componentSettingsTick.value++
  showComponentSettingsModal.value = true
}

const updateSelectedComponentFullWidth = async (enabled: boolean) => {
  const updatePromise = pageBuilderService.setSelectedComponentFullWidth(enabled)
  componentSettingsTick.value++
  await updatePromise
  componentSettingsTick.value++
}

const productSectionSettingsTick = ref(0)
const showProductSectionSettingsModal = ref(false)
const productLayout = ref<ProductGridLayout>(DEFAULT_PRODUCT_SECTION_OPTIONS.layout)
const productMobileColumns = ref<ProductMobileColumns>(
  DEFAULT_PRODUCT_SECTION_OPTIONS.mobileColumns ?? 1,
)
const productCardStyle = ref<ProductCardStyle>(
  DEFAULT_PRODUCT_SECTION_OPTIONS.cardStyle ?? 'minimal',
)
const productRoundedImages = ref(DEFAULT_PRODUCT_SECTION_OPTIONS.roundedImages ?? false)
const productOpenInNewTab = ref(DEFAULT_PRODUCT_SECTION_OPTIONS.openInNewTab ?? false)
const productButtonStyle = ref<ProductButtonStyle>(
  DEFAULT_PRODUCT_SECTION_OPTIONS.buttonStyle ?? 'text',
)
const productRoundedButtons = ref(DEFAULT_PRODUCT_SECTION_OPTIONS.roundedButtons ?? false)
const productHidePrice = ref(DEFAULT_PRODUCT_SECTION_OPTIONS.hidePrice ?? false)
const productHideImage = ref(DEFAULT_PRODUCT_SECTION_OPTIONS.hideImage ?? false)
const productHideButton = ref(DEFAULT_PRODUCT_SECTION_OPTIONS.hideButton ?? false)
const productHideLinks = ref(DEFAULT_PRODUCT_SECTION_OPTIONS.hideLinks ?? false)
const productSectionHasPrices = ref(false)
const productSectionHasImages = ref(false)
const productSectionHasButtons = ref(false)
const productSectionHasLinks = ref(false)
let productSettingsApplyQueued = false
let productSettingsPendingSaveToast = false
let productSettingsSaveToastTimer: ReturnType<typeof setTimeout> | null = null
let productSettingsBaseline: {
  layout: ProductGridLayout
  mobileColumns: ProductMobileColumns
  cardStyle: ProductCardStyle
  roundedImages: boolean
  openInNewTab: boolean
  buttonStyle: ProductButtonStyle
  roundedButtons: boolean
  hidePrice: boolean
  hideImage: boolean
  hideButton: boolean
  hideLinks: boolean
} | null = null

const productSettingsMatchBaseline = (): boolean => {
  if (!productSettingsBaseline) return true
  return (
    productLayout.value === productSettingsBaseline.layout &&
    productMobileColumns.value === productSettingsBaseline.mobileColumns &&
    productCardStyle.value === productSettingsBaseline.cardStyle &&
    productRoundedImages.value === productSettingsBaseline.roundedImages &&
    productOpenInNewTab.value === productSettingsBaseline.openInNewTab &&
    productButtonStyle.value === productSettingsBaseline.buttonStyle &&
    productRoundedButtons.value === productSettingsBaseline.roundedButtons &&
    productHidePrice.value === productSettingsBaseline.hidePrice &&
    productHideImage.value === productSettingsBaseline.hideImage &&
    productHideButton.value === productSettingsBaseline.hideButton &&
    productHideLinks.value === productSettingsBaseline.hideLinks
  )
}

const notifyProductSectionSettingsSaved = () => {
  productSettingsPendingSaveToast = true
  if (productSettingsSaveToastTimer) clearTimeout(productSettingsSaveToastTimer)
  productSettingsSaveToastTimer = setTimeout(() => {
    showToast(translate('Product section settings saved'), 'success')
    productSettingsPendingSaveToast = false
    productSettingsSaveToastTimer = null
  }, 350)
}

const flushProductSectionSettingsSavedToast = () => {
  if (!productSettingsPendingSaveToast) return
  if (productSettingsSaveToastTimer) {
    clearTimeout(productSettingsSaveToastTimer)
    productSettingsSaveToastTimer = null
  }
  showToast(translate('Product section settings saved'), 'success')
  productSettingsPendingSaveToast = false
}

const isSelectedProductSection = computed(() => {
  void productSectionSettingsTick.value
  return pageBuilderService.isSelectedProductSection()
})

const openProductSectionSettings = () => {
  const options = pageBuilderService.getSelectedProductSectionOptions()
  const mobileColumns = options.mobileColumns ?? 1
  const cardStyle = options.cardStyle ?? 'minimal'
  const roundedImages = options.roundedImages ?? false
  const openInNewTab = options.openInNewTab ?? false
  const buttonStyle = options.buttonStyle ?? 'text'
  const roundedButtons = options.roundedButtons ?? false
  const hidePrice = options.hidePrice ?? false
  const hideImage = options.hideImage ?? false
  const hideButton = options.hideButton ?? false
  const hideLinks = options.hideLinks ?? false
  const availability = pageBuilderService.getSelectedProductSectionContentAvailability()

  productSettingsBaseline = {
    layout: options.layout,
    mobileColumns,
    cardStyle,
    roundedImages,
    openInNewTab,
    buttonStyle,
    roundedButtons,
    hidePrice,
    hideImage,
    hideButton,
    hideLinks,
  }

  productLayout.value = options.layout
  productMobileColumns.value = mobileColumns
  productCardStyle.value = cardStyle
  productRoundedImages.value = roundedImages
  productOpenInNewTab.value = openInNewTab
  productButtonStyle.value = buttonStyle
  productRoundedButtons.value = roundedButtons
  productHidePrice.value = hidePrice
  productHideImage.value = hideImage
  productHideButton.value = hideButton
  productHideLinks.value = hideLinks
  productSectionHasPrices.value = availability.hasPrices
  productSectionHasImages.value = availability.hasImages
  productSectionHasButtons.value = availability.hasButtons
  productSectionHasLinks.value = availability.hasLinks
  productSectionSettingsTick.value++
  showProductSectionSettingsModal.value = true
}

const closeProductSectionSettings = () => {
  flushProductSectionSettingsSavedToast()
  showProductSectionSettingsModal.value = false
  productSettingsBaseline = null
}

const applySelectedProductSectionSettings = async () => {
  if (!showProductSectionSettingsModal.value || productSettingsApplyQueued) return
  productSettingsApplyQueued = true
  try {
    await pageBuilderService.updateSelectedProductSection({
      layout: productLayout.value,
      mobileColumns: productMobileColumns.value,
      cardStyle: productCardStyle.value,
      roundedImages: productRoundedImages.value,
      openInNewTab: productOpenInNewTab.value,
      buttonStyle: productButtonStyle.value,
      roundedButtons: productRoundedButtons.value,
      hidePrice: productHidePrice.value,
      hideImage: productHideImage.value,
      hideButton: productHideButton.value,
      hideLinks: productHideLinks.value,
    })
    productSectionSettingsTick.value++
    if (!productSettingsMatchBaseline()) {
      notifyProductSectionSettingsSaved()
    }
  } catch {
    if (productSettingsSaveToastTimer) {
      clearTimeout(productSettingsSaveToastTimer)
      productSettingsSaveToastTimer = null
    }
    productSettingsPendingSaveToast = false
    showToast(translate('Could not save product section settings'), 'error')
  } finally {
    productSettingsApplyQueued = false
  }
}

watch(
  [
    productLayout,
    productMobileColumns,
    productCardStyle,
    productRoundedImages,
    productOpenInNewTab,
    productButtonStyle,
    productRoundedButtons,
    productHidePrice,
    productHideImage,
    productHideButton,
    productHideLinks,
  ],
  () => {
    void applySelectedProductSectionSettings()
  },
)

const toggleSliderAutoRotate = (value: boolean) => {
  draftSliderAutoRotate.value = value
}

const toggleSliderLoop = (value: boolean) => {
  draftSliderLoop.value = value
}

const toggleSliderShowArrows = (value: boolean) => {
  draftSliderShowArrows.value = value
}

const changeSliderSpeed = (n: number) => {
  draftSliderSpeed.value = n
}

const changeSlideCount = (newCount: number) => {
  draftSliderImageCount.value = newCount
}

const changeSliderPerView = async (n: number) => {
  draftSliderPerView.value = n === 2 ? 2 : 1
  // Apply immediately so 1-up vs 2-up is visible before Save.
  await applySliderSettingsToDom()
}

const applySliderSettingsToDom = async () => {
  if (!(getElement.value instanceof HTMLElement)) return

  // Prefer a live canvas node — syncDomToStoreOnly remounts and can detach getElement.
  let container = getElement.value.closest('[data-isl]') as HTMLElement | null
  if (container && !container.isConnected) {
    const canvas = document.querySelector('[data-builder-canvas]')
    const sectionId = getElement.value
      .closest('section[data-componentid]')
      ?.getAttribute('data-componentid')
    const liveSection = sectionId
      ? canvas?.querySelector(`section[data-componentid="${sectionId}"]`)
      : null
    container =
      (liveSection?.querySelector('[data-isl]') as HTMLElement | null) ??
      (canvas?.querySelector('[data-isl]') as HTMLElement | null)
  }
  if (!container?.isConnected) return

  const track = container.querySelector('.pbx-isl-t') as HTMLElement | null
  if (!track) return

  // Drop wrap clones before counting/mutating real slides.
  track.querySelectorAll(':scope > [data-isl-clone]').forEach((el) => el.remove())

  const section = container.closest('section')
  const styleTag = section?.querySelector('style')
  const newCount = draftSliderImageCount.value
  const speed = draftSliderSpeed.value
  const perView = draftSliderPerView.value === 2 ? 2 : 1
  const loop = draftSliderLoop.value
  const showArrows = draftSliderShowArrows.value
  const currentCount = track.children.length
  if (newCount > currentCount) {
    const firstImg = track.querySelector('img') as HTMLImageElement | null
    const placeholderSrc = getPlaceholderImageDataUrl()
    for (let i = currentCount; i < newCount; i++) {
      const slide = document.createElement('div')
      slide.style.scrollSnapAlign = 'start'
      const img = document.createElement('img')
      img.src = placeholderSrc
      img.style.width = firstImg?.style.width || '100%'
      img.style.aspectRatio = firstImg?.style.aspectRatio || '16/9'
      img.style.objectFit = firstImg?.style.objectFit || 'cover'
      img.style.display = 'block'
      img.alt = `Slide ${i + 1}`
      slide.appendChild(img)
      track.appendChild(slide)
    }
  } else if (newCount < currentCount) {
    for (let i = currentCount - 1; i >= newCount; i--) {
      track.children[i]?.remove()
    }
  }

  Array.from(track.children).forEach((child) => {
    if (child instanceof HTMLElement) {
      // Clear inline sizing so per-view CSS (50% / 90%) can apply.
      child.style.minWidth = ''
      child.style.width = ''
      child.style.maxWidth = ''
      child.style.flex = ''
      child.style.flexShrink = ''
      child.style.scrollSnapAlign = 'start'
      child.style.paddingLeft = ''
      child.style.paddingRight = ''
    }
  })

  // Always keep a full 2-up frame on the last step (e.g. slides 5+1).
  syncSliderWrapClones(track, perView)

  const numsDiv = container.querySelector('.pbx-isl-nums') as HTMLElement | null
  const dotsDiv = numsDiv?.nextElementSibling as HTMLElement | null
  if (numsDiv && dotsDiv) {
    numsDiv.innerHTML = ''
    dotsDiv.classList.add('pbx-isl-dots')
    dotsDiv.innerHTML = ''
    for (let i = 0; i < newCount; i++) {
      const numSpan = document.createElement('span')
      numSpan.textContent = String(i + 1)
      numSpan.setAttribute('onclick', buildSliderOnclickJs(i))
      numsDiv.appendChild(numSpan)
      const dotSpan = document.createElement('span')
      dotSpan.className = 'pbx-isl-dot'
      dotSpan.setAttribute('onclick', buildSliderOnclickJs(i))
      dotsDiv.appendChild(dotSpan)
    }
  }

  if (draftSliderAutoRotate.value) {
    track.scrollLeft = 0
    track.style.transform = ''
    track.style.animation = ''
    track.style.animationDelay = ''
    container.setAttribute('data-isl-auto', '')
  } else {
    track.style.transform = ''
    track.style.animation = ''
    track.style.animationDelay = ''
    container.removeAttribute('data-isl-auto')
  }
  container.setAttribute('data-isl-speed', String(speed))
  container.setAttribute('data-isl-per-view', String(perView))
  container.setAttribute('data-isl-loop', loop ? 'true' : 'false')
  container.setAttribute('data-isl-active', '0')

  const nums = container.querySelectorAll<HTMLElement>('.pbx-isl-nums span')
  const dots = container.querySelectorAll<HTMLElement>('.pbx-isl-dot')
  nums.forEach((span, i) => span.setAttribute('onclick', buildSliderOnclickJs(i)))
  dots.forEach((dot, i) => dot.setAttribute('onclick', buildSliderOnclickJs(i)))

  syncSliderArrows(container, showArrows)

  if (styleTag) styleTag.textContent = buildSliderStyle(newCount, speed, perView, loop)

  autoRotateTick.value++
  // Keep Vue `v-html` store in sync so remounts don't restore Material Symbol text glyphs.
  await pageBuilderService.syncDomToStoreOnly()
  await pageBuilderService.refreshListeners()
}

const saveSliderSettings = async () => {
  if (!isSliderSettingsDirty.value) {
    closeSliderSettings()
    return
  }
  isSavingSliderSettings.value = true
  try {
    await applySliderSettingsToDom()
    await pageBuilderService.handleAutoSave()
    showToast(translate('Slider settings saved'), 'success')
    closeSliderSettings()
  } finally {
    isSavingSliderSettings.value = false
  }
}

const activeSlideIndex = computed(() => {
  if (!(getElement.value instanceof HTMLElement)) return -1
  const container = getElement.value.closest('[data-isl]')
  if (!container) return -1
  const track = container.querySelector('.pbx-isl-t')
  if (!track) return -1
  const realSlides = Array.from(track.children).filter(
    (child) => !child.hasAttribute('data-isl-clone'),
  )
  for (let i = 0; i < realSlides.length; i++) {
    if (realSlides[i].contains(getElement.value)) return i
  }
  return -1
})

watch(activeSlideIndex, (idx) => {
  if (!(getElement.value instanceof HTMLElement)) return
  const container = getElement.value.closest('[data-isl]') as HTMLElement | null
  if (!container) return
  if (idx >= 0) {
    container.setAttribute('data-isl-active', String(idx))
  } else {
    container.removeAttribute('data-isl-active')
  }
})

const getShowModalTipTap = computed(() => {
  const result = pageBuilderStateStore.getShowModalTipTap

  if (result) {
    handleModalPreviewTiptap()
  }
  return result
})

const getInlineTipTapEditor = computed(() => pageBuilderStateStore.getInlineTipTapEditor)

const getComponent = computed(() => {
  return pageBuilderStateStore.getComponent
})

// hanlde Tip Tap modal
const typeModalTipTap = ref('')
const gridColumnModalTipTap = ref(Number(1))
const titleModalTipTap = ref('')
const descriptionModalTipTap = ref<string | null>('')
const firstButtonModalTipTap = ref<string | null>('')
const secondButtonModalTipTap = ref<string | null>(null)
const thirdButtonModalTipTap = ref<string | null>(null)
// set dynamic modal handle functions
const firstModalButtonFunctionDynamicModalBuilderTipTap = ref<(() => void) | null>(null)
const secondModalButtonFunctionDynamicModalBuilderTipTap = ref<(() => void) | null>(null)
const thirdModalButtonFunctionDynamicModalBuilderTipTap = ref<(() => void) | null>(null)

const handleModalPreviewTiptap = function () {
  pageBuilderService.toggleTipTapModal(true)

  typeModalTipTap.value = 'success'
  gridColumnModalTipTap.value = 2
  titleModalTipTap.value = translate('Manage Content')
  descriptionModalTipTap.value = null
  firstButtonModalTipTap.value = null
  secondButtonModalTipTap.value = null
  thirdButtonModalTipTap.value = 'Save'

  // handle click

  firstModalButtonFunctionDynamicModalBuilderTipTap.value = function () {
    pageBuilderService.toggleTipTapModal(false)
  }

  thirdModalButtonFunctionDynamicModalBuilderTipTap.value = function () {
    pageBuilderService.toggleTipTapModal(true)
  }
}

const handleInlineTipTapEditor = async function () {
  await pageBuilderService.toggleInlineTipTapEditor(true)
}

// handle image
// get current image from store
const getBasePrimaryImage = computed(() => {
  return pageBuilderStateStore.getBasePrimaryImage
})

const showMediaLibraryModal = ref(false)
// modal content
const titleMedia = ref('')
const descriptionMedia = ref<string | null>('')
const firstButtonMedia = ref('')
const secondButtonMedia = ref<string | null>(null)
const thirdButtonMedia = ref<string | null>(null)
// set dynamic modal handle functions
const firstMediaButtonFunction = ref<(() => void) | null>(null)

const handleAddImage = function () {
  // open modal to true
  showMediaLibraryModal.value = true

  titleMedia.value = translate('Media Library')
  descriptionMedia.value = null
  firstButtonMedia.value = translate('Close')
  secondButtonMedia.value = translate('Select image')

  // handle click
  firstMediaButtonFunction.value = function () {
    showMediaLibraryModal.value = false
  }
}

// Logic for Video Iframe

const urlError = ref<string | null>(null)
const iframeSrc = ref('')
const showModalIframeSrc = ref(false)

const validateURL = function () {
  // initial value
  urlError.value = null

  // url validation
  const urlRegex = /^https?:\/\//
  const isValidURL = ref(true)
  isValidURL.value = urlRegex.test(iframeSrc.value)

  // cancelled
  if (isValidURL.value === false) {
    urlError.value =
      "The provided URL is invalid. Please ensure that it begins with 'https://' for proper formatting and security."
    return true
  }

  return false
}

const handleModalIframeSrc = function () {
  urlError.value = null

  const iframeSrcValue =
    getElement.value &&
    getElement.value.firstElementChild?.tagName === 'IFRAME' &&
    getElement.value.firstElementChild.hasAttribute('src') &&
    (getElement.value.firstElementChild.getAttribute('src') ?? '').trim() !== ''
      ? (getElement.value.firstElementChild as HTMLIFrameElement).src
      : ''

  iframeSrc.value = iframeSrcValue
  //
  //
  // open modal to true
  showModalIframeSrc.value = true

  typeModalTipTap.value = 'success'
  gridColumnModalTipTap.value = 2
  titleModalTipTap.value = translate('Add video url')
  descriptionModalTipTap.value = null
  firstButtonModalTipTap.value = translate('Close')
  secondButtonModalTipTap.value = 'Save'
  thirdButtonModalTipTap.value = null

  // handle click
  firstModalButtonFunctionDynamicModalBuilderTipTap.value = function () {
    showModalIframeSrc.value = false
  }
  // handle click
  secondModalButtonFunctionDynamicModalBuilderTipTap.value = async function () {
    const isNotValidated = validateURL()
    if (isNotValidated) {
      return
    }

    if (
      getElement.value &&
      getElement.value.firstElementChild &&
      getElement.value.firstElementChild.tagName === 'IFRAME'
    ) {
      // Convert YouTube URL to proper embed format
      let embedUrl = iframeSrc.value

      try {
        const url = new URL(iframeSrc.value)

        // Check if it's a YouTube URL
        if (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be')) {
          let videoId = ''

          // Extract video ID from different YouTube URL formats
          if (url.hostname.includes('youtu.be')) {
            // Format: https://youtu.be/VIDEO_ID
            videoId = url.pathname.slice(1)
          } else if (url.pathname.includes('/embed/')) {
            // Already an embed URL
            videoId = url.pathname.split('/embed/')[1]?.split('?')[0]
          } else if (url.pathname.includes('/watch')) {
            // Format: https://www.youtube.com/watch?v=VIDEO_ID
            videoId = url.searchParams.get('v') ?? ''
          }

          if (videoId) {
            // Build clean embed URL with required parameters
            const params = new URLSearchParams()

            // Add playlist parameter if present
            const listParam = url.searchParams.get('list')
            if (listParam) {
              params.append('list', listParam)
            }

            // Add parameters required for Safari and embedded playback
            params.append('enablejsapi', '1')
            params.append('origin', window.location.origin)
            params.append('autoplay', '0')

            embedUrl = `https://www.youtube.com/embed/${videoId}?${params.toString()}`
          }
        }
      } catch (error) {
        // If URL parsing fails, fallback to original simple replace
        console.warn('URL parsing failed, using fallback method:', error)
        embedUrl = iframeSrc.value.replace('watch?v=', 'embed/')
      }

      ;(getElement.value.firstElementChild as HTMLIFrameElement).src = embedUrl
      await pageBuilderService.handleAutoSave()
    }

    showModalIframeSrc.value = false
  }
}

const openOptionsMoreOpen = ref(false)
const moreMenuTriggerRef = ref<HTMLElement | null>(null)
const moreMenuPopoverRef = ref<HTMLElement | null>(null)
const MORE_MENU_WIDTH_PX = 240

const moreMenuPopoverStyle = ref({
  top: '0px',
  left: '0px',
  width: `${MORE_MENU_WIDTH_PX}px`,
})

const updateMoreMenuPosition = function () {
  const trigger = moreMenuTriggerRef.value
  if (!trigger) return

  const rect = trigger.getBoundingClientRect()
  const margin = 8
  let left = rect.left + rect.width / 2 - MORE_MENU_WIDTH_PX / 2
  left = Math.max(margin, Math.min(left, window.innerWidth - MORE_MENU_WIDTH_PX - margin))

  moreMenuPopoverStyle.value = {
    top: `${getEditToolbarPopoverTop(rect.bottom)}px`,
    left: `${Math.round(left)}px`,
    width: `${MORE_MENU_WIDTH_PX}px`,
  }
}

let moreMenuPositionRaf = 0

const trackMoreMenuPosition = function () {
  if (!openOptionsMoreOpen.value) {
    moreMenuPositionRaf = 0
    return
  }

  updateMoreMenuPosition()
  moreMenuPositionRaf = requestAnimationFrame(trackMoreMenuPosition)
}

const startMoreMenuPositionTracking = function () {
  cancelAnimationFrame(moreMenuPositionRaf)
  void nextTick(() => {
    updateMoreMenuPosition()
    moreMenuPositionRaf = requestAnimationFrame(trackMoreMenuPosition)
  })
}

const stopMoreMenuPositionTracking = function () {
  cancelAnimationFrame(moreMenuPositionRaf)
  moreMenuPositionRaf = 0
}

const attachMoreMenuPositionListeners = function () {
  startMoreMenuPositionTracking()
}

const detachMoreMenuPositionListeners = function () {
  stopMoreMenuPositionTracking()
}

const closeMoreMenuOnOutsideClick = function (event: Event) {
  if (!openOptionsMoreOpen.value) return
  if (!(event.target instanceof Node)) return
  if (moreMenuTriggerRef.value?.contains(event.target)) return
  if (moreMenuPopoverRef.value?.contains(event.target)) return
  if (event.target instanceof Element && event.target.closest('#pbxEditToolbar')) return
  openOptionsMoreOpen.value = false
}

const closeMoreMenu = () => {
  openOptionsMoreOpen.value = false
}

const syncMoreMenuPosition = () => {
  if (!openOptionsMoreOpen.value) return
  updateMoreMenuPosition()
}

let moreMenuSettleRaf = 0

const settleMoreMenuPositionAfterLayout = function () {
  suppressEditToolbarPopoverScrollClose()
  cancelAnimationFrame(moreMenuSettleRaf)
  let frame = 0
  const maxFrames = 24

  const tick = function () {
    if (!openOptionsMoreOpen.value) {
      moreMenuSettleRaf = 0
      return
    }

    updateMoreMenuPosition()
    frame++
    if (frame < maxFrames) {
      moreMenuSettleRaf = requestAnimationFrame(tick)
      return
    }

    moreMenuSettleRaf = 0
  }

  moreMenuSettleRaf = requestAnimationFrame(tick)
}

const handleMoveComponentUp = async () => {
  suppressEditToolbarPopoverScrollClose()
  await pageBuilderService.reorderComponent(-1)
  settleMoreMenuPositionAfterLayout()
}

const handleMoveComponentDown = async () => {
  suppressEditToolbarPopoverScrollClose()
  await pageBuilderService.reorderComponent(1)
  settleMoreMenuPositionAfterLayout()
}

const closeMoreMenuOnScrollDown = function () {
  openOptionsMoreOpen.value = false
}

watch(openOptionsMoreOpen, (isOpen) => {
  if (isOpen) {
    attachMoreMenuPositionListeners()
    document.addEventListener('pointerdown', closeMoreMenuOnOutsideClick)
    window.addEventListener('pagebuilder:toolbar-positioned', syncMoreMenuPosition)
    window.addEventListener('pagebuilder:layout-change', syncMoreMenuPosition)
    window.addEventListener(CLOSE_EDIT_TOOLBAR_POPOVERS_EVENT, closeMoreMenuOnScrollDown)
    return
  }

  cancelAnimationFrame(moreMenuSettleRaf)
  moreMenuSettleRaf = 0
  detachMoreMenuPositionListeners()
  document.removeEventListener('pointerdown', closeMoreMenuOnOutsideClick)
  window.removeEventListener('pagebuilder:toolbar-positioned', syncMoreMenuPosition)
  window.removeEventListener('pagebuilder:layout-change', syncMoreMenuPosition)
  window.removeEventListener(CLOSE_EDIT_TOOLBAR_POPOVERS_EVENT, closeMoreMenuOnScrollDown)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(moreMenuSettleRaf)
  moreMenuSettleRaf = 0
  detachMoreMenuPositionListeners()
  document.removeEventListener('pointerdown', closeMoreMenuOnOutsideClick)
  window.removeEventListener('pagebuilder:toolbar-positioned', syncMoreMenuPosition)
  window.removeEventListener('pagebuilder:layout-change', syncMoreMenuPosition)
  window.removeEventListener(CLOSE_EDIT_TOOLBAR_POPOVERS_EVENT, closeMoreMenuOnScrollDown)
  if (productSettingsSaveToastTimer) {
    clearTimeout(productSettingsSaveToastTimer)
    productSettingsSaveToastTimer = null
  }
})

const showModalDeleteComponent = ref(false)
// use dynamic model
const typeModal = ref('')
const gridColumnModal = ref(Number(1))
const titleModal = ref('')
const descriptionModal = ref('')
const firstButtonModal = ref('')
const secondButtonModal = ref<string | null>(null)
const thirdButtonModal = ref<string | null>(null)
// set dynamic modal handle functions
const firstModalButtonFunctionDynamicModalBuilder = ref<(() => void) | null>(null)
const secondModalButtonFunctionDynamicModalBuilder = ref<(() => void) | null>(null)
const thirdModalButtonFunctionDynamicModalBuilder = ref<(() => Promise<void>) | null>(null)

// remove component
const handleDelete = function () {
  showModalDeleteComponent.value = true
  typeModal.value = 'delete'
  gridColumnModal.value = 2
  titleModal.value = translate('Remove Component?')
  descriptionModal.value = translate('Are you sure you want to remove this Component?')
  firstButtonModal.value = translate('Close')
  secondButtonModal.value = null
  thirdButtonModal.value = translate('Delete')

  // handle click
  firstModalButtonFunctionDynamicModalBuilder.value = function () {
    showModalDeleteComponent.value = false
  }
  //
  // handle click
  thirdModalButtonFunctionDynamicModalBuilder.value = async function () {
    await pageBuilderService.deleteComponentFromDOM()
    showToast(translate('Component deleted'), 'success')
    showModalDeleteComponent.value = false
  }
  // end modal
}

const handleDeleteElement = function () {
  const element = getElement.value
  if (!element) return

  const parentSection = element.closest('section')

  // Predict whether removing this element would leave the section with no visible content.
  // We clone the section, remove the selected element from the clone, then check for
  // any remaining meaningful content — if none is found the whole component will be
  // cleaned up automatically by deleteElementFromDOM().
  let willEmptySection = false
  if (parentSection) {
    const clone = parentSection.cloneNode(true) as HTMLElement
    const cloneTarget = clone.querySelector('[selected]')
    if (cloneTarget) {
      cloneTarget.remove()
      const meaningfulSelector =
        'img, video, iframe, input, button, a, h1, h2, h3, h4, h5, h6, p, li, blockquote, pre, code, table'
      willEmptySection = !clone.querySelector(meaningfulSelector) && !clone.textContent?.trim()
    }
  }

  showModalDeleteComponent.value = true
  typeModal.value = 'delete'
  gridColumnModal.value = 2

  if (willEmptySection) {
    titleModal.value = translate('Delete element and component?')
    descriptionModal.value = translate(
      'Removing this element will leave the component empty, so the entire component will also be removed.',
    )
  } else {
    titleModal.value = translate('Delete element?')
    descriptionModal.value = translate(
      'You are about to remove this element. This action cannot be undone.',
    )
  }

  firstButtonModal.value = translate('Close')
  secondButtonModal.value = null
  thirdButtonModal.value = translate('Delete')

  firstModalButtonFunctionDynamicModalBuilder.value = function () {
    showModalDeleteComponent.value = false
  }

  thirdModalButtonFunctionDynamicModalBuilder.value = async function () {
    await pageBuilderService.deleteElementFromDOM()
    showToast(
      translate(willEmptySection ? 'Element and component deleted' : 'Element deleted'),
      'success',
    )
    showModalDeleteComponent.value = false
  }
}

// duplicate individual HTML element (not the whole component)
const handleDuplicateElement = async function () {
  await pageBuilderService.duplicateElementInDOM()
  showToast(translate('Element duplicated'), 'success')
}

const handleDuplicateComponent = async function () {
  await pageBuilderService.duplicateComponent()
  showToast(translate('Component duplicated'), 'success')
}

defineExpose({
  openDeleteConfirm: handleDeleteElement,
  openProductSectionSettings,
  openSliderSettings,
})
</script>
<template v-if="getElement">
  <div class="pbx-max-w-full pbx-min-w-0">
    <ConfirmActionModal
      :showDynamicModalBuilder="showModalIframeSrc"
      maxWidth="2xl"
      :type="typeModalTipTap"
      :gridColumnAmount="gridColumnModalTipTap"
      :title="titleModalTipTap"
      :description="descriptionModalTipTap"
      :firstButtonText="firstButtonModalTipTap ?? undefined"
      :secondButtonText="secondButtonModalTipTap ?? undefined"
      :thirdButtonText="thirdButtonModalTipTap ?? undefined"
      @firstModalButtonFunctionDynamicModalBuilder="
        () => firstModalButtonFunctionDynamicModalBuilderTipTap?.()
      "
      @secondModalButtonFunctionDynamicModalBuilder="
        () => secondModalButtonFunctionDynamicModalBuilderTipTap?.()
      "
      @thirdModalButtonFunctionDynamicModalBuilder="
        () => thirdModalButtonFunctionDynamicModalBuilderTipTap?.()
      "
    >
      <header></header>
      <main>
        <div class="pbx-myInputGroup">
          <div class="pbx-myPrimaryFormOrganizationHeaderDescriptionSection">
            <div class="pbx-myPrimaryFormOrganizationHeader">
              <label for="youtube-video" class="pbx-myPrimaryInputLabel">{{
                translate('Video url:')
              }}</label>
              <input
                id="youtube-video"
                v-model="iframeSrc"
                type="text"
                class="pbx-myPrimaryInput"
                name="video"
              />
              <div
                v-if="urlError"
                class="pbx-min-h-[2.5rem] pbx-flex pbx-items-center pbx-justify-start"
              >
                <p class="pbx-myPrimaryInputError pbx-mt-2 pbx-mb-0 pbx-py-0 pbx-self-start">
                  {{ urlError }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ConfirmActionModal>
    <ConfirmActionModal
      :simpleModal="true"
      :showDynamicModalBuilder="getShowModalTipTap"
      maxWidth="6xl"
      :type="typeModalTipTap"
      :gridColumnAmount="gridColumnModalTipTap"
      :title="titleModalTipTap"
      :description="descriptionModalTipTap"
      :firstButtonText="firstButtonModalTipTap ?? undefined"
      :secondButtonText="secondButtonModalTipTap ?? undefined"
      :thirdButtonText="thirdButtonModalTipTap ?? undefined"
      @firstModalButtonFunctionDynamicModalBuilder="
        () => firstModalButtonFunctionDynamicModalBuilderTipTap?.()
      "
      @secondModalButtonFunctionDynamicModalBuilder="
        () => secondModalButtonFunctionDynamicModalBuilderTipTap?.()
      "
      @thirdModalButtonFunctionDynamicModalBuilder="
        () => thirdModalButtonFunctionDynamicModalBuilderTipTap?.()
      "
    >
      <header></header>
      <main class="pbx-overflow-y-auto">
        <TipTapInput></TipTapInput>
      </main>
    </ConfirmActionModal>
    <ConfirmActionModal
      :showDynamicModalBuilder="showModalDeleteComponent"
      :type="typeModal"
      :gridColumnAmount="gridColumnModal"
      :title="titleModal"
      :description="descriptionModal"
      :firstButtonText="firstButtonModal"
      :secondButtonText="secondButtonModal ?? undefined"
      :thirdButtonText="thirdButtonModal ?? undefined"
      @firstModalButtonFunctionDynamicModalBuilder="
        () => firstModalButtonFunctionDynamicModalBuilder?.()
      "
      @secondModalButtonFunctionDynamicModalBuilder="
        () => secondModalButtonFunctionDynamicModalBuilder?.()
      "
      @thirdModalButtonFunctionDynamicModalBuilder="
        () => thirdModalButtonFunctionDynamicModalBuilder?.()
      "
    >
      <header></header>
      <main></main>
    </ConfirmActionModal>
    <MediaLibraryModal
      :open="showMediaLibraryModal"
      :title="titleMedia"
      :description="descriptionMedia"
      :firstButtonText="firstButtonMedia"
      :secondButtonText="secondButtonMedia ?? undefined"
      :thirdButtonText="thirdButtonMedia ?? undefined"
      :customMediaComponent="customMediaComponent ?? undefined"
      @firstMediaButtonFunction="() => firstMediaButtonFunction?.()"
    >
    </MediaLibraryModal>

    <div class="pbx-select-none pbx-max-w-full pbx-min-w-0">
      <p v-if="false" class="pbx-font-medium pbx-text-[10px] pbx-w-max lg:pbx-block pbx-hidden">
        Editing
        <span class="pbx-lowercase">&lt;{{ elementTag }}&gt;</span>
      </p>
      <div
        class="pbx-flex pbx-flex-wrap pbx-items-center pbx-justify-start pbx-gap-x-2 pbx-gap-y-1 pbx-max-w-full pbx-min-w-0"
        :class="{ '': getElement }"
      >
        <template v-if="pageBuilderService.ElOrFirstChildIsIframe()">
          <div class="pbx-flex pbx-items-center pbx-justify-start pbx-gap-2 pbx-w-max">
            <div
              @click="handleModalIframeSrc"
              class="pbx-h-8 pbx-w-8 pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center pbx-aspect-square pbx-text-myPrimaryDarkGrayColor pbx-border pbx-border-gray-500 pbx-cursor-pointer pbx-transition-all pbx-duration-200 pbx-ease-in-out hover:pbx-shadow-md hover:pbx-text-yellow-500 focus-visible:pbx-ring-0 pbx-transition-transform pbx-duration-200"
            >
              <span class="material-symbols-outlined"> play_circle </span>
            </div>
          </div>
        </template>

        <template
          v-if="
            (getInlineTipTapEditor || pageBuilderService.isSelectedElementValidText()) &&
            !pageBuilderService.ElOrFirstChildIsIframe()
          "
        >
          <InlineTipTapEditor></InlineTipTapEditor>
          <div
            v-if="!getInlineTipTapEditor"
            class="pbx-flex pbx-items-center pbx-justify-start pbx-gap-2 pbx-w-max"
          >
            <div
              @click="handleInlineTipTapEditor"
              class="pbx-h-8 pbx-w-8 pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center pbx-aspect-square pbx-text-myPrimaryDarkGrayColor pbx-border pbx-border-gray-500 pbx-cursor-pointer pbx-transition-all pbx-duration-200 pbx-ease-in-out hover:pbx-shadow-md hover:pbx-text-yellow-500 focus-visible:pbx-ring-0 pbx-transition-transform pbx-duration-200"
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
                  <path
                    clip-rule="evenodd"
                    d="M20.5 6.5L7 20H2v-5L15.5 1.5l5 5zm-7.823.651L4 15.828V18h2.172l8.677-8.677-2.172-2.172zm3.586.758L17.672 6.5 15.5 4.328l-1.409 1.41 2.172 2.17z"
                    fill-rule="evenodd"
                  ></path>
                </svg>
              </span>
            </div>
          </div>
          <TextColorEditor></TextColorEditor>
        </template>

        <template
          v-if="
            getElement &&
            getComponent &&
            getBasePrimaryImage &&
            !pageBuilderService.ElOrFirstChildIsIframe()
          "
        >
          <div class="pbx-flex pbx-items-center pbx-justify-start pbx-gap-2 pbx-w-max">
            <div
              @click="handleAddImage"
              class="pbx-h-8 pbx-w-8 pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center pbx-aspect-square pbx-text-myPrimaryDarkGrayColor pbx-border pbx-border-gray-500 pbx-cursor-pointer pbx-transition-all pbx-duration-200 pbx-ease-in-out hover:pbx-shadow-md hover:pbx-text-yellow-500 focus-visible:pbx-ring-0 pbx-transition-transform pbx-duration-200"
            >
              <span class="material-symbols-outlined"> add_photo_alternate </span>
            </div>
          </div>
        </template>

        <template v-if="getElement && isSelectedImage">
          <div
            @click="openImageSettings"
            class="pbx-h-8 pbx-w-8 pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center pbx-aspect-square pbx-text-myPrimaryDarkGrayColor pbx-border pbx-border-gray-500 pbx-cursor-pointer pbx-transition-all pbx-duration-200 pbx-ease-in-out hover:pbx-shadow-md hover:pbx-text-yellow-500 focus-visible:pbx-ring-0 pbx-transition-transform pbx-duration-200"
            :class="
              isImageSettingsOpen
                ? 'pbx-bg-myPrimaryLinkColor pbx-text-white'
                : 'pbx-text-myPrimaryDarkGrayColor'
            "
            :title="translate('Image Settings')"
          >
            <SliderIcon />
          </div>
        </template>

        <template
          v-if="
            getElement &&
            getElement.nodeType === 1 &&
            !getBasePrimaryImage &&
            !pageBuilderService.ElOrFirstChildIsIframe()
          "
        >
          <BackgroundColorEditor></BackgroundColorEditor>
        </template>

        <template v-if="getElement && getComponent && isSelectedComponentTopElement">
          <div
            @click="openComponentSettings"
            class="pbx-h-8 pbx-w-8 pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center pbx-aspect-square pbx-text-myPrimaryDarkGrayColor pbx-border pbx-border-gray-500 pbx-cursor-pointer pbx-transition-all pbx-duration-200 pbx-ease-in-out hover:pbx-shadow-md hover:pbx-text-yellow-500 focus-visible:pbx-ring-0 pbx-transition-transform pbx-duration-200"
            :title="translate('Component Settings')"
          >
            <SliderIcon />
          </div>
        </template>

        <template v-if="getElement && getComponent && isSelectedProductSection">
          <div
            @click="openProductSectionSettings"
            class="pbx-h-8 pbx-w-8 pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center pbx-aspect-square pbx-text-myPrimaryDarkGrayColor pbx-border pbx-border-gray-500 pbx-cursor-pointer pbx-transition-all pbx-duration-200 pbx-ease-in-out hover:pbx-shadow-md hover:pbx-text-yellow-500 focus-visible:pbx-ring-0"
            :class="
              showProductSectionSettingsModal
                ? 'pbx-bg-myPrimaryLinkColor pbx-text-white'
                : 'pbx-text-myPrimaryDarkGrayColor'
            "
            :title="translate('Product section settings')"
          >
            <span class="material-symbols-outlined">shopping_bag</span>
          </div>
        </template>

        <template v-if="isInsideSlider">
          <div
            @click="openSliderSettings"
            :class="sliderAutoRotate ? '' : ''"
            class="pbx-h-8 pbx-w-8 pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center pbx-aspect-square pbx-text-myPrimaryDarkGrayColor pbx-border pbx-border-gray-500 pbx-cursor-pointer pbx-transition-all pbx-duration-200 pbx-ease-in-out hover:pbx-shadow-md hover:pbx-text-yellow-500 focus-visible:pbx-ring-0 pbx-transition-transform pbx-duration-200 pbx-text-myPrimaryDarkGrayColor"
            :title="translate('Slider Settings')"
          >
            <span class="material-symbols-outlined"> adjust </span>
          </div>
        </template>

        <ConfirmActionModal
          v-if="showComponentSettingsModal"
          :showDynamicModalBuilder="showComponentSettingsModal"
          :isLoading="false"
          type="success"
          :gridColumnAmount="1"
          :title="translate('Component Settings')"
          description=""
          :firstButtonText="translate('Close')"
          @firstModalButtonFunctionDynamicModalBuilder="showComponentSettingsModal = false"
        >
          <header></header>
          <main>
            <div class="pbx-flex pbx-flex-col pbx-gap-3 pbx-pt-1 pbx-pb-2">
              <div
                class="pbx-rounded-2xl pbx-border pbx-border-solid pbx-border-gray-100 pbx-bg-gray-50 pbx-px-4 pbx-py-3"
              >
                <div class="pbx-flex pbx-items-center pbx-justify-between pbx-gap-4">
                  <div class="pbx-flex pbx-flex-col pbx-gap-1">
                    <p class="pbx-text-sm pbx-font-semibold pbx-text-myPrimaryDarkGrayColor">
                      {{ translate('Full-width component') }}
                    </p>
                    <p class="pbx-text-xs pbx-text-gray-500 pbx-my-0">
                      {{ translate('Stretch across browser width') }}
                    </p>
                  </div>

                  <ToggleInput
                    :model-value="selectedComponentFullWidth"
                    @update:model-value="updateSelectedComponentFullWidth"
                  />
                </div>
              </div>
            </div>
          </main>
        </ConfirmActionModal>

        <ConfirmActionModal
          v-if="showProductSectionSettingsModal"
          :showDynamicModalBuilder="showProductSectionSettingsModal"
          :isLoading="false"
          type="success"
          maxWidth="4xl"
          :gridColumnAmount="1"
          :title="translate('Product section settings')"
          description=""
          :firstButtonText="translate('Close')"
          @firstModalButtonFunctionDynamicModalBuilder="closeProductSectionSettings"
        >
          <header></header>
          <main>
            <ProductSectionSettingsFields
              v-model:layout="productLayout"
              v-model:mobile-columns="productMobileColumns"
              v-model:card-style="productCardStyle"
              v-model:rounded-images="productRoundedImages"
              v-model:open-in-new-tab="productOpenInNewTab"
              v-model:button-style="productButtonStyle"
              v-model:rounded-buttons="productRoundedButtons"
              v-model:hide-price="productHidePrice"
              v-model:hide-image="productHideImage"
              v-model:hide-button="productHideButton"
              v-model:hide-links="productHideLinks"
              :show-hide-links-toggle="true"
              :has-product-prices="productSectionHasPrices"
              :has-product-images="productSectionHasImages"
              :has-product-buttons="productSectionHasButtons"
              :has-product-links="productSectionHasLinks"
              :translate="translate"
              compact
            />
          </main>
        </ConfirmActionModal>

        <ConfirmActionModal
          v-if="showSliderModal"
          :showDynamicModalBuilder="showSliderModal"
          :isLoading="isSavingSliderSettings"
          type="success"
          maxWidth="3xl"
          :gridColumnAmount="2"
          :title="translate('Slider Settings')"
          description=""
          :firstButtonText="translate('Close')"
          :thirdButtonText="translate('Save')"
          @firstModalButtonFunctionDynamicModalBuilder="closeSliderSettings"
          @thirdModalButtonFunctionDynamicModalBuilder="saveSliderSettings"
        >
          <header></header>
          <main>
            <div class="pbx-productSettingsPanel pbx-pt-1 pbx-pb-2">
              <!-- Layout -->
              <section class="pbx-productSettingsSection">
                <div class="pbx-productSettingsSectionHeader">
                  <p class="pbx-productSettingsSectionTitle">{{ translate('Slider layout') }}</p>
                  <p class="pbx-productSettingsSectionDesc">
                    {{ translate('How many images and how they are shown') }}
                  </p>
                </div>

                <div class="pbx-flex pbx-flex-col pbx-gap-5">
                  <div>
                    <p class="pbx-text-xs pbx-font-medium pbx-text-gray-500 pbx-mb-2 pbx-mt-0">
                      {{ translate('Number of images') }}
                    </p>
                    <div class="pbx-flex pbx-flex-wrap pbx-gap-2">
                      <button
                        v-for="n in [2, 3, 4, 5, 6]"
                        :key="n"
                        type="button"
                        @click="changeSlideCount(n)"
                        class="pbx-h-10 pbx-min-w-10 pbx-px-3 pbx-rounded-lg pbx-text-sm pbx-font-medium pbx-cursor-pointer pbx-flex pbx-items-center pbx-justify-center pbx-border pbx-border-solid pbx-transition-colors"
                        :class="
                          draftSliderImageCount === n
                            ? 'pbx-bg-myPrimaryLinkColor pbx-text-white pbx-border-myPrimaryLinkColor'
                            : 'pbx-bg-white pbx-text-gray-700 pbx-border-gray-200 hover:pbx-border-gray-300 hover:pbx-bg-gray-50'
                        "
                      >
                        {{ n }}
                      </button>
                    </div>
                  </div>

                  <div>
                    <p class="pbx-text-xs pbx-font-medium pbx-text-gray-500 pbx-mb-2 pbx-mt-0">
                      {{ translate('Slides per view') }}
                    </p>
                    <div class="pbx-flex pbx-flex-wrap pbx-gap-2">
                      <button
                        v-for="n in [1, 2]"
                        :key="n"
                        type="button"
                        @click="changeSliderPerView(n)"
                        class="pbx-h-10 pbx-min-w-10 pbx-px-3 pbx-rounded-lg pbx-text-sm pbx-font-medium pbx-cursor-pointer pbx-flex pbx-items-center pbx-justify-center pbx-border pbx-border-solid pbx-transition-colors"
                        :class="
                          draftSliderPerView === n
                            ? 'pbx-bg-myPrimaryLinkColor pbx-text-white pbx-border-myPrimaryLinkColor'
                            : 'pbx-bg-white pbx-text-gray-700 pbx-border-gray-200 hover:pbx-border-gray-300 hover:pbx-bg-gray-50'
                        "
                      >
                        {{ n }}
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Playback -->
              <section class="pbx-productSettingsSection">
                <div class="pbx-productSettingsSectionHeader">
                  <p class="pbx-productSettingsSectionTitle">{{ translate('Playback') }}</p>
                  <p class="pbx-productSettingsSectionDesc">
                    {{ translate('Autoplay, speed, and looping') }}
                  </p>
                </div>

                <div class="pbx-productSettingsToggleList">
                  <div class="pbx-productSettingsToggleRow">
                    <div class="pbx-flex pbx-flex-col pbx-gap-0.5 pbx-min-w-0">
                      <p class="pbx-text-sm pbx-font-medium pbx-text-myPrimaryDarkGrayColor pbx-m-0">
                        {{ translate('Auto Rotate') }}
                      </p>
                      <p class="pbx-text-xs pbx-text-gray-500 pbx-m-0">
                        {{ translate('Advance slides automatically') }}
                      </p>
                    </div>
                    <ToggleInput
                      :model-value="draftSliderAutoRotate"
                      @update:model-value="toggleSliderAutoRotate"
                    />
                  </div>

                  <div
                    v-if="draftSliderAutoRotate"
                    class="pbx-rounded-xl pbx-border pbx-border-solid pbx-border-gray-100 pbx-bg-white pbx-px-3 pbx-py-3"
                  >
                    <p class="pbx-text-xs pbx-font-medium pbx-text-gray-500 pbx-mb-2 pbx-mt-0">
                      {{ translate('Rotation Speed (s)') }}
                    </p>
                    <div class="pbx-flex pbx-flex-wrap pbx-gap-2">
                      <button
                        v-for="s in [1, 2, 3, 4, 5]"
                        :key="s"
                        type="button"
                        @click="changeSliderSpeed(s)"
                        class="pbx-h-10 pbx-min-w-10 pbx-px-3 pbx-rounded-lg pbx-text-sm pbx-font-medium pbx-cursor-pointer pbx-flex pbx-items-center pbx-justify-center pbx-border pbx-border-solid pbx-transition-colors"
                        :class="
                          draftSliderSpeed === s
                            ? 'pbx-bg-myPrimaryLinkColor pbx-text-white pbx-border-myPrimaryLinkColor'
                            : 'pbx-bg-white pbx-text-gray-700 pbx-border-gray-200 hover:pbx-border-gray-300 hover:pbx-bg-gray-50'
                        "
                      >
                        {{ s }}
                      </button>
                    </div>
                  </div>

                  <div class="pbx-productSettingsToggleRow">
                    <div class="pbx-flex pbx-flex-col pbx-gap-0.5 pbx-min-w-0">
                      <p class="pbx-text-sm pbx-font-medium pbx-text-myPrimaryDarkGrayColor pbx-m-0">
                        {{ translate('Loop') }}
                      </p>
                      <p class="pbx-text-xs pbx-text-gray-500 pbx-m-0">
                        {{ translate('Restart after the last slide') }}
                      </p>
                    </div>
                    <ToggleInput
                      :model-value="draftSliderLoop"
                      @update:model-value="toggleSliderLoop"
                    />
                  </div>
                </div>
              </section>

              <!-- Navigation -->
              <section class="pbx-productSettingsSection">
                <div class="pbx-productSettingsSectionHeader">
                  <p class="pbx-productSettingsSectionTitle">{{ translate('Navigation') }}</p>
                  <p class="pbx-productSettingsSectionDesc">
                    {{ translate('Previous and next controls') }}
                  </p>
                </div>

                <div class="pbx-productSettingsToggleList">
                  <div class="pbx-productSettingsToggleRow">
                    <div class="pbx-flex pbx-flex-col pbx-gap-0.5 pbx-min-w-0">
                      <p class="pbx-text-sm pbx-font-medium pbx-text-myPrimaryDarkGrayColor pbx-m-0">
                        {{ translate('Show arrows') }}
                      </p>
                      <p class="pbx-text-xs pbx-text-gray-500 pbx-m-0">
                        {{ translate('Show back and forward buttons on the slider') }}
                      </p>
                    </div>
                    <ToggleInput
                      :model-value="draftSliderShowArrows"
                      @update:model-value="toggleSliderShowArrows"
                    />
                  </div>
                </div>
              </section>
            </div>
          </main>
        </ConfirmActionModal>

        <div v-if="getElement && getComponent" class="pbx-shrink-0">
          <button
            ref="moreMenuTriggerRef"
            type="button"
            class="pbx-h-8 pbx-w-8 pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center pbx-aspect-square pbx-border pbx-border-solid pbx-border-gray-500 pbx-bg-transparent pbx-text-myPrimaryDarkGrayColor pbx-cursor-pointer pbx-transition-all pbx-duration-200 hover:pbx-shadow-md hover:pbx-text-yellow-500 focus-visible:pbx-outline-none focus-visible:pbx-ring-2 focus-visible:pbx-ring-myPrimaryLinkColor/30"
            :aria-expanded="openOptionsMoreOpen"
            aria-haspopup="menu"
            :aria-label="translate('More options')"
            @click="openOptionsMoreOpen = !openOptionsMoreOpen"
          >
            <span class="material-symbols-outlined" aria-hidden="true"> more_horiz </span>
          </button>
        </div>
        <button
          v-if="getElement && getComponent"
          type="button"
          class="pbx-h-8 pbx-w-8 pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center pbx-aspect-square pbx-border pbx-border-solid pbx-border-gray-500 pbx-cursor-pointer pbx-transition-all pbx-duration-200 pbx-ease-in-out hover:pbx-shadow-md hover:pbx-text-yellow-500 focus-visible:pbx-ring-0"
          :class="
            props.toolbarPinned
              ? 'pbx-bg-myPrimaryLinkColor pbx-text-white'
              : 'pbx-bg-transparent pbx-text-myPrimaryDarkGrayColor'
          "
          :aria-pressed="props.toolbarPinned"
          :title="props.toolbarPinned ? translate('Unpin toolbar') : translate('Pin toolbar')"
          @click="emit('toggle-toolbar-pin')"
        >
          <span class="material-symbols-outlined pbx-materialIcon18" aria-hidden="true">
            push_pin
          </span>
        </button>
        <div
          v-if="getElement && getComponent"
          class="pbx-h-8 pbx-w-8 pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center pbx-aspect-square pbx-text-myPrimaryDarkGrayColor pbx-border pbx-border-gray-500 pbx-cursor-pointer pbx-transition-all pbx-duration-200 pbx-ease-in-out hover:pbx-shadow-md hover:pbx-text-yellow-500 focus-visible:pbx-ring-0 pbx-transition-transform pbx-duration-200"
          @click="pageBuilderService.clearHtmlSelection()"
        >
          <span class="material-symbols-outlined"> close_small</span>
        </div>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <transition name="popup-fade">
      <div
        v-if="openOptionsMoreOpen"
        ref="moreMenuPopoverRef"
        data-pbx-edit-toolbar-popover
        data-pbx-more-menu-popover
        role="menu"
        :style="moreMenuPopoverStyle"
        class="pbx-toolbarMoreMenu pbx-pb-12"
        @mousedown.stop
        @pointerdown.stop
        @click.stop
      >
        <div v-if="getElement && getComponent" class="pbx-toolbarMoreMenuSection">
          <p class="pbx-toolbarMoreMenuSectionLabel">{{ translate('Layout & order') }}</p>
          <button
            type="button"
            role="menuitem"
            class="pbx-toolbarMoreMenuItem"
            :disabled="!canMoveUp"
            @click="handleMoveComponentUp"
          >
            <span class="pbx-toolbarMoreMenuItemIcon material-symbols-outlined" aria-hidden="true">
              move_up
            </span>
            <span class="pbx-toolbarMoreMenuItemLabel">{{ translate('Move up') }}</span>
          </button>
          <button
            type="button"
            role="menuitem"
            class="pbx-toolbarMoreMenuItem"
            :disabled="!canMoveDown"
            @click="handleMoveComponentDown"
          >
            <span class="pbx-toolbarMoreMenuItemIcon material-symbols-outlined" aria-hidden="true">
              move_down
            </span>
            <span class="pbx-toolbarMoreMenuItemLabel">{{ translate('Move down') }}</span>
          </button>
          <button
            v-if="canReverseLayout"
            type="button"
            role="menuitem"
            class="pbx-toolbarMoreMenuItem"
            @click="
              () => {
                closeMoreMenu()
                pageBuilderService.reverseComponentLayout()
              }
            "
          >
            <span class="pbx-toolbarMoreMenuItemIcon material-symbols-outlined" aria-hidden="true">
              swap_horiz
            </span>
            <span class="pbx-toolbarMoreMenuItemLabel">{{ translate('Reverse layout') }}</span>
          </button>
        </div>

        <div
          v-if="getElement && getComponent && getElement.tagName !== 'SECTION'"
          class="pbx-toolbarMoreMenuSection"
        >
          <p class="pbx-toolbarMoreMenuSectionLabel">{{ translate('Element actions') }}</p>
          <button
            type="button"
            role="menuitem"
            class="pbx-toolbarMoreMenuItem"
            @click="
              () => {
                closeMoreMenu()
                handleDuplicateElement()
              }
            "
          >
            <span class="pbx-toolbarMoreMenuItemIcon material-symbols-outlined" aria-hidden="true">
              content_copy
            </span>
            <span class="pbx-toolbarMoreMenuItemLabel">{{ translate('Duplicate element') }}</span>
          </button>
          <button
            type="button"
            role="menuitem"
            class="pbx-toolbarMoreMenuItem pbx-toolbarMoreMenuItem--danger"
            @click="
              () => {
                closeMoreMenu()
                handleDeleteElement()
              }
            "
          >
            <span class="pbx-toolbarMoreMenuItemIcon material-symbols-outlined" aria-hidden="true">
              delete
            </span>
            <span class="pbx-toolbarMoreMenuItemLabel">{{ translate('Delete element') }}</span>
          </button>
        </div>

        <div v-if="getElement && getComponent" class="pbx-toolbarMoreMenuSection">
          <p class="pbx-toolbarMoreMenuSectionLabel">{{ translate('Component actions') }}</p>
          <button
            type="button"
            role="menuitem"
            class="pbx-toolbarMoreMenuItem"
            @click="
              () => {
                closeMoreMenu()
                handleDuplicateComponent()
              }
            "
          >
            <span class="pbx-toolbarMoreMenuItemIcon" aria-hidden="true">
              <svg
                fill="currentColor"
                height="18"
                viewBox="0 0 22 22"
                width="18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clip-rule="evenodd"
                  d="M2 16V2h14v4h4v14H6v-4H2zM4 4h10v10H4V4zm4 12v2h10V8h-2v8H8z"
                  fill-rule="evenodd"
                />
              </svg>
            </span>
            <span class="pbx-toolbarMoreMenuItemLabel">{{ translate('Duplicate component') }}</span>
          </button>
          <button
            type="button"
            role="menuitem"
            class="pbx-toolbarMoreMenuItem pbx-toolbarMoreMenuItem--danger"
            @click="
              () => {
                closeMoreMenu()
                handleDelete()
              }
            "
          >
            <span class="pbx-toolbarMoreMenuItemIcon material-symbols-outlined" aria-hidden="true">
              delete_forever
            </span>
            <span class="pbx-toolbarMoreMenuItemLabel">{{ translate('Delete component') }}</span>
          </button>
        </div>
      </div>
    </transition>
  </Teleport>
</template>
