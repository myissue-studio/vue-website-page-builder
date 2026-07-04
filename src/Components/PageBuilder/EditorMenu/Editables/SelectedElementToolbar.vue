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
import type { ProductCardStyle, ProductGridLayout, ProductMobileColumns } from '../../../../types'
import { DEFAULT_PRODUCT_SECTION_OPTIONS } from '../../../../utils/builder/product-section-options'

const { translate } = useTranslations()
const { showToast } = useToast()
const pageBuilderService = getPageBuilder()
const emit = defineEmits<{
  (event: 'open-image-settings'): void
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

const isInsideSlider = computed(() => {
  return !!(getElement.value instanceof HTMLElement && getElement.value.closest('[data-isl]'))
})

const sliderAutoRotate = computed(() => {
  void autoRotateTick.value
  if (!(getElement.value instanceof HTMLElement)) return false
  return getElement.value.closest('[data-isl]')?.hasAttribute('data-isl-auto') ?? false
})

const sliderImageCount = computed(() => {
  void autoRotateTick.value
  if (!(getElement.value instanceof HTMLElement)) return 3
  const container = getElement.value.closest('[data-isl]')
  if (!container) return 3
  const track = container.querySelector('.pbx-isl-t')
  return track ? track.children.length : 3
})

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
let productSettingsApplyQueued = false

const isSelectedProductSection = computed(() => {
  void productSectionSettingsTick.value
  return pageBuilderService.isSelectedProductSection()
})

const openProductSectionSettings = () => {
  const options = pageBuilderService.getSelectedProductSectionOptions()
  productLayout.value = options.layout
  productMobileColumns.value = options.mobileColumns ?? 1
  productCardStyle.value = options.cardStyle ?? 'minimal'
  productRoundedImages.value = options.roundedImages ?? false
  productSectionSettingsTick.value++
  showProductSectionSettingsModal.value = true
}

const applySelectedProductSectionSettings = async () => {
  if (!showProductSectionSettingsModal.value || productSettingsApplyQueued) return
  productSettingsApplyQueued = true
  await pageBuilderService.updateSelectedProductSection({
    layout: productLayout.value,
    mobileColumns: productMobileColumns.value,
    cardStyle: productCardStyle.value,
    roundedImages: productRoundedImages.value,
  })
  productSectionSettingsTick.value++
  productSettingsApplyQueued = false
}

watch(
  [productLayout, productMobileColumns, productCardStyle, productRoundedImages],
  () => {
    void applySelectedProductSectionSettings()
  },
)

const toggleSliderAutoRotate = async () => {
  if (!(getElement.value instanceof HTMLElement)) return
  const container = getElement.value.closest('[data-isl]') as HTMLElement | null
  if (!container) return
  if (container.hasAttribute('data-isl-auto')) {
    container.removeAttribute('data-isl-auto')
  } else {
    const track = container.querySelector('.pbx-isl-t') as HTMLElement | null
    if (track) track.scrollLeft = 0
    container.setAttribute('data-isl-auto', '')
  }
  // Rebuild onclick handlers so preview navigation uses the correct path
  // (animation-restart for auto mode, scrollTo for non-auto mode)
  const nums = container.querySelectorAll<HTMLElement>('.pbx-isl-nums span')
  const dots = container.querySelectorAll<HTMLElement>('.pbx-isl-dot')
  nums.forEach((span, i) => span.setAttribute('onclick', buildSliderOnclickJs(i)))
  dots.forEach((dot, i) => dot.setAttribute('onclick', buildSliderOnclickJs(i)))
  autoRotateTick.value++
  await pageBuilderService.handleAutoSave()
}

const sliderSpeed = computed(() => {
  void autoRotateTick.value
  if (!(getElement.value instanceof HTMLElement)) return 3
  const container = getElement.value.closest('[data-isl]') as HTMLElement | null
  return parseInt(container?.getAttribute('data-isl-speed') || '3', 10)
})

const changeSliderSpeed = async (n: number) => {
  if (!(getElement.value instanceof HTMLElement)) return
  const container = getElement.value.closest('[data-isl]') as HTMLElement | null
  if (!container) return
  container.setAttribute('data-isl-speed', String(n))
  // Rebuild style tag so animation duration updates immediately
  const section = container.closest('section')
  const styleTag = section?.querySelector('style')
  const track = container.querySelector('.pbx-isl-t') as HTMLElement | null
  const count = track ? track.children.length : 3
  if (styleTag) styleTag.textContent = buildSliderStyle(count, n)
  autoRotateTick.value++
  await pageBuilderService.handleAutoSave()
}

// ── Slider style/onclick helpers ───────────────────────────────────────────
function buildSliderOnclickJs(idx: number): string {
  const numHl = `var ns=c.querySelectorAll('.pbx-isl-nums span');ns.forEach(function(s,i){s.style.opacity=i===${idx}?'1':'0.55';s.style.background=i===${idx}?'rgba(255,255,255,0.9)':'rgba(255,255,255,0.25)';s.style.borderRadius='9999px';s.style.padding='0.1rem 0.55rem';s.style.color=i===${idx}?'#111':'#fff';s.style.textShadow=i===${idx}?'none':'0 1px 4px rgba(0,0,0,0.7)';});`
  const dotHl = `var ds=c.querySelectorAll('.pbx-isl-dot');ds.forEach(function(dot,i){dot.style.background=i===${idx}?'rgba(255,255,255,1)':'rgba(255,255,255,0.55)';});`
  const nav = `var inBuilder=!!c.closest('[data-builder-canvas]');if(c.hasAttribute('data-isl-auto')&&!inBuilder){var sp=parseInt(c.getAttribute('data-isl-speed')||'3',10);var dl=(${idx === 0 ? '0' : `(-${idx}*sp)`})+'s';var els=[t].concat(Array.from(c.querySelectorAll('.pbx-isl-dot,.pbx-isl-nums span')));els.forEach(function(el){el.style.animation='none';});t.offsetHeight;els.forEach(function(el){el.style.animation='';el.style.animationDelay=dl;el.style.opacity='';el.style.background='';});}else{t.scrollTo({left:t.children[${idx}].offsetLeft,behavior:'smooth'});}`
  return `(function(d,e){e.stopPropagation();var c=d.closest('[data-isl]');var t=c.querySelector('.pbx-isl-t');${numHl}${dotHl}${nav}var img=t.children[${idx}].querySelector('img');if(img)img.click();})(this,event)`
}

function buildSliderStyle(n: number, speed: number = 3): string {
  const T = n * speed
  const step = 100 / n
  const hold = Math.max(step - 3, 1)
  const trackW = n * 100
  const slideW = (100 / n).toFixed(3)

  // Track keyframes
  let trackKf = `@keyframes pbx-isl-r{0%,${hold.toFixed(3)}%{transform:translateX(0)}`
  for (let i = 1; i < n; i++) {
    const tx = -((100 * i) / n).toFixed(3)
    const s = (i * step).toFixed(3)
    const e2 = (i * step + hold).toFixed(3)
    trackKf += `${s}%,${e2}%{transform:translateX(${tx}%)}`
  }
  trackKf += `99%,100%{transform:translateX(0)}}`

  // Per-dot keyframes + rules (sync background with track timing)
  let dotKfs = ''
  let dotRules = ''
  for (let i = 0; i < n; i++) {
    const aStart = (i * step).toFixed(3)
    const aEnd = (i * step + hold).toFixed(3)
    const afterEnd = Math.min((i + 1) * step, 100).toFixed(3)
    const dim = 'rgba(255,255,255,0.55)'
    const active = 'rgba(255,255,255,1)'
    if (i === 0) {
      dotKfs += `@keyframes pbx-isl-da-${i}{0%,${aEnd}%{background:${active}}${afterEnd}%,100%{background:${dim}}}`
    } else {
      const before = (i * step - 0.001).toFixed(3)
      dotKfs += `@keyframes pbx-isl-da-${i}{0%,${before}%{background:${dim}}${aStart}%,${aEnd}%{background:${active}}${afterEnd}%,100%{background:${dim}}}`
    }
    dotRules += `[data-isl][data-isl-auto] .pbx-isl-dot:nth-child(${i + 1}){animation:pbx-isl-da-${i} ${T}s infinite}`
  }

  // Per-num keyframes + rules (sync opacity+background with track timing)
  let numKfs = ''
  let numRules = ''
  for (let i = 0; i < n; i++) {
    const aStart = (i * step).toFixed(3)
    const aEnd = (i * step + hold).toFixed(3)
    const afterEnd = Math.min((i + 1) * step, 100).toFixed(3)
    const dimState = 'opacity:0.55;background:rgba(255,255,255,0.25)'
    const activeState = 'opacity:1;background:rgba(255,255,255,0.9)'
    if (i === 0) {
      numKfs += `@keyframes pbx-isl-na-${i}{0%,${aEnd}%{${activeState}}${afterEnd}%,100%{${dimState}}}`
    } else {
      const before = (i * step - 0.001).toFixed(3)
      numKfs += `@keyframes pbx-isl-na-${i}{0%,${before}%{${dimState}}${aStart}%,${aEnd}%{${activeState}}${afterEnd}%,100%{${dimState}}}`
    }
    numRules += `[data-isl][data-isl-auto] .pbx-isl-nums span:nth-child(${i + 1}){animation:pbx-isl-na-${i} ${T}s infinite}`
  }

  // Builder active-slide rules (CSS attribute selector — used in edit mode)
  let activeRules = ''
  for (let i = 0; i < n; i++) {
    if (i > 0) activeRules += ','
    activeRules += `[data-isl-active="${i}"] .pbx-isl-nums span:nth-child(${i + 1})`
  }
  activeRules +=
    '{opacity:1;background:rgba(255,255,255,0.9);color:#111;border-radius:9999px;padding:0.1rem 0.55rem;text-shadow:none}'

  return [
    '.pbx-isl-t{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scroll-behavior:smooth;-webkit-overflow-scrolling:touch;scrollbar-width:none;-ms-overflow-style:none}',
    '.pbx-isl-t::-webkit-scrollbar{display:none}',
    trackKf,
    `[data-isl][data-isl-auto] .pbx-isl-t{overflow:hidden!important;scroll-snap-type:none!important;width:${trackW}%!important;animation:pbx-isl-r ${T}s infinite;pointer-events:none}`,
    `[data-isl][data-isl-auto] .pbx-isl-t>div{min-width:${slideW}%!important}`,
    '.pbx-isl-dot{display:inline-block;width:0.5rem;height:0.5rem;border-radius:50%;background:rgba(255,255,255,0.55);cursor:pointer}',
    '.pbx-isl-nums{display:none;gap:0.75rem;margin-bottom:0.625rem}',
    '.pbx-isl-nums span{font-size:1rem;font-weight:700;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,0.7);cursor:pointer;min-width:1.5rem;text-align:center;background:rgba(255,255,255,0.25);border-radius:9999px;padding:0.1rem 0.55rem;opacity:0.55;display:inline-block;box-sizing:border-box}',
    '[data-pagebuilder-content] .pbx-isl-nums{display:flex}',
    '[data-pagebuilder-content] .pbx-isl-nums span{opacity:0.4;transition:all 0.2s}',
    activeRules,
    dotKfs,
    dotRules,
    numKfs,
    numRules,
  ].join('')
}

const changeSlideCount = async (newCount: number) => {
  if (!(getElement.value instanceof HTMLElement)) return
  const container = getElement.value.closest('[data-isl]') as HTMLElement | null
  if (!container) return
  const track = container.querySelector('.pbx-isl-t') as HTMLElement | null
  if (!track) return
  const currentCount = track.children.length
  const section = container.closest('section')
  const styleTag = section?.querySelector('style')
  const firstImg = track.querySelector('img') as HTMLImageElement | null
  const placeholderSrc = firstImg?.getAttribute('src') || ''
  if (newCount > currentCount) {
    for (let i = currentCount; i < newCount; i++) {
      const slide = document.createElement('div')
      slide.style.minWidth = '100%'
      slide.style.scrollSnapAlign = 'start'
      const img = document.createElement('img')
      img.src = placeholderSrc
      img.style.width = '100%'
      img.style.aspectRatio = '16/9'
      img.style.objectFit = 'cover'
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
  const numsDiv = container.querySelector('.pbx-isl-nums') as HTMLElement | null
  const dotsDiv = numsDiv?.nextElementSibling as HTMLElement | null
  if (numsDiv && dotsDiv) {
    numsDiv.innerHTML = ''
    dotsDiv.innerHTML = ''
    for (let i = 0; i < newCount; i++) {
      const numSpan = document.createElement('span')
      numSpan.textContent = String(i + 1)
      numSpan.setAttribute('onclick', buildSliderOnclickJs(i))
      if (i === 0) {
        numSpan.style.opacity = '1'
        numSpan.style.background = 'rgba(255,255,255,0.9)'
        numSpan.style.color = '#111'
        numSpan.style.borderRadius = '9999px'
        numSpan.style.padding = '0.1rem 0.55rem'
        numSpan.style.textShadow = 'none'
      }
      numsDiv.appendChild(numSpan)
      const dotSpan = document.createElement('span')
      dotSpan.className = 'pbx-isl-dot'
      if (i === 0) dotSpan.style.background = 'rgba(255,255,255,1)'
      dotSpan.setAttribute('onclick', buildSliderOnclickJs(i))
      dotsDiv.appendChild(dotSpan)
    }
  }
  if (styleTag) styleTag.textContent = buildSliderStyle(newCount, sliderSpeed.value)
  autoRotateTick.value++
  await pageBuilderService.refreshListeners()
  await pageBuilderService.handleAutoSave()
}

const activeSlideIndex = computed(() => {
  if (!(getElement.value instanceof HTMLElement)) return -1
  const container = getElement.value.closest('[data-isl]')
  if (!container) return -1
  const track = container.querySelector('.pbx-isl-t')
  if (!track) return -1
  for (let i = 0; i < track.children.length; i++) {
    if (track.children[i].contains(getElement.value)) return i
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
  secondModalButtonFunctionDynamicModalBuilderTipTap.value = function () {
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
    top: `${Math.round(rect.bottom + 4)}px`,
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
  openOptionsMoreOpen.value = false
}

const closeMoreMenu = () => {
  openOptionsMoreOpen.value = false
}

const syncMoreMenuPosition = () => {
  if (!openOptionsMoreOpen.value) return
  updateMoreMenuPosition()
}

const handleMoveComponentUp = async () => {
  await pageBuilderService.reorderComponent(-1)
  syncMoreMenuPosition()
}

const handleMoveComponentDown = async () => {
  await pageBuilderService.reorderComponent(1)
  syncMoreMenuPosition()
}

watch(openOptionsMoreOpen, (isOpen) => {
  if (isOpen) {
    attachMoreMenuPositionListeners()
    document.addEventListener('pointerdown', closeMoreMenuOnOutsideClick)
    window.addEventListener('pagebuilder:toolbar-positioned', syncMoreMenuPosition)
    window.addEventListener('pagebuilder:layout-change', syncMoreMenuPosition)
    return
  }

  detachMoreMenuPositionListeners()
  document.removeEventListener('pointerdown', closeMoreMenuOnOutsideClick)
  window.removeEventListener('pagebuilder:toolbar-positioned', syncMoreMenuPosition)
  window.removeEventListener('pagebuilder:layout-change', syncMoreMenuPosition)
})

onBeforeUnmount(() => {
  detachMoreMenuPositionListeners()
  document.removeEventListener('pointerdown', closeMoreMenuOnOutsideClick)
  window.removeEventListener('pagebuilder:toolbar-positioned', syncMoreMenuPosition)
  window.removeEventListener('pagebuilder:layout-change', syncMoreMenuPosition)
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

defineExpose({ openDeleteConfirm: handleDeleteElement })
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
            <span class="material-symbols-outlined pbx-text-lg">grid_view</span>
          </div>
        </template>

        <template v-if="isInsideSlider">
          <div
            @click="showSliderModal = true"
            :class="
              sliderAutoRotate
                ? 'pbx-bg-myPrimaryLinkColor pbx-text-white'
                : 'pbx-bg-gray-100 pbx-text-myPrimaryDarkGrayColor'
            "
            class="pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-flex pbx-items-center pbx-justify-center pbx-rounded-xl hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white"
            :title="translate('Slider Settings')"
          >
            <span class="material-symbols-outlined"> settings </span>
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
          :gridColumnAmount="1"
          :title="translate('Product section settings')"
          description=""
          :firstButtonText="translate('Close')"
          @firstModalButtonFunctionDynamicModalBuilder="showProductSectionSettingsModal = false"
        >
          <header></header>
          <main>
            <ProductSectionSettingsFields
              v-model:layout="productLayout"
              v-model:mobile-columns="productMobileColumns"
              v-model:card-style="productCardStyle"
              v-model:rounded-images="productRoundedImages"
              :translate="translate"
              compact
            />
          </main>
        </ConfirmActionModal>

        <ConfirmActionModal
          v-if="showSliderModal"
          :showDynamicModalBuilder="showSliderModal"
          :isLoading="false"
          type="success"
          :gridColumnAmount="1"
          :title="translate('Slider Settings')"
          description=""
          :firstButtonText="translate('Close')"
          @firstModalButtonFunctionDynamicModalBuilder="showSliderModal = false"
        >
          <header></header>
          <main>
            <div class="pbx-flex pbx-flex-col pbx-gap-3 pbx-pt-1 pbx-pb-2">
              <!-- Auto Rotate card -->
              <div
                class="pbx-rounded-2xl pbx-border pbx-border-solid pbx-border-gray-100 pbx-overflow-hidden"
              >
                <div
                  class="pbx-flex pbx-items-center pbx-justify-between pbx-px-4 pbx-py-3"
                  :class="sliderAutoRotate ? 'pbx-bg-myPrimaryLinkColor' : 'pbx-bg-gray-50'"
                >
                  <div class="pbx-flex pbx-items-center pbx-gap-2">
                    <span
                      class="material-symbols-outlined pbx-text-xl"
                      :class="
                        sliderAutoRotate ? 'pbx-text-white' : 'pbx-text-myPrimaryDarkGrayColor'
                      "
                      >autoplay</span
                    >
                    <span
                      class="pbx-text-sm pbx-font-semibold"
                      :class="
                        sliderAutoRotate ? 'pbx-text-white' : 'pbx-text-myPrimaryDarkGrayColor'
                      "
                      >{{ translate('Auto Rotate') }}</span
                    >
                  </div>
                  <ToggleInput
                    :model-value="sliderAutoRotate"
                    @update:model-value="toggleSliderAutoRotate"
                  />
                </div>

                <!-- Speed row — only when auto rotate is on -->
                <div
                  v-if="sliderAutoRotate"
                  class="pbx-px-4 pbx-py-3 pbx-border-0 pbx-border-t pbx-border-solid pbx-border-gray-100 pbx-bg-white"
                >
                  <p
                    class="pbx-text-xs pbx-text-gray-400 pbx-font-medium pbx-mb-2 pbx-uppercase pbx-tracking-wide"
                  >
                    {{ translate('Rotation Speed (s)') }}
                  </p>
                  <div class="pbx-flex pbx-gap-2">
                    <button
                      v-for="s in [1, 2, 3, 4, 5]"
                      :key="s"
                      @click="changeSliderSpeed(s)"
                      :class="
                        sliderSpeed === s
                          ? 'pbx-bg-myPrimaryLinkColor pbx-text-white pbx-shadow-sm'
                          : 'pbx-bg-gray-100 pbx-text-myPrimaryDarkGrayColor hover:pbx-bg-gray-200'
                      "
                      class="pbx-h-9 pbx-w-9 pbx-rounded-xl pbx-text-sm pbx-font-semibold pbx-cursor-pointer pbx-flex pbx-items-center pbx-justify-center pbx-border-0 pbx-transition-colors"
                      type="button"
                    >
                      {{ s }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Number of images card -->
              <div
                class="pbx-rounded-2xl pbx-border pbx-border-solid pbx-border-gray-100 pbx-bg-gray-50 pbx-px-4 pbx-py-3"
              >
                <div class="pbx-flex pbx-items-center pbx-gap-2 pbx-mb-2">
                  <span
                    class="material-symbols-outlined pbx-text-xl pbx-text-myPrimaryDarkGrayColor"
                    >photo_library</span
                  >
                  <p
                    class="pbx-text-xs pbx-text-gray-400 pbx-font-medium pbx-uppercase pbx-tracking-wide"
                  >
                    {{ translate('Number of images') }}
                  </p>
                </div>
                <div class="pbx-flex pbx-gap-2">
                  <button
                    v-for="n in [2, 3, 4, 5, 6]"
                    :key="n"
                    @click="changeSlideCount(n)"
                    :class="
                      sliderImageCount === n
                        ? 'pbx-bg-myPrimaryLinkColor pbx-text-white pbx-shadow-sm'
                        : 'pbx-bg-white pbx-text-myPrimaryDarkGrayColor hover:pbx-bg-gray-200 pbx-border pbx-border-solid pbx-border-gray-200'
                    "
                    class="pbx-h-9 pbx-w-9 pbx-rounded-xl pbx-text-sm pbx-font-semibold pbx-cursor-pointer pbx-flex pbx-items-center pbx-justify-center pbx-border-0 pbx-transition-colors"
                    type="button"
                  >
                    {{ n }}
                  </button>
                </div>
              </div>
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
        class="pbx-toolbarMoreMenu"
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
