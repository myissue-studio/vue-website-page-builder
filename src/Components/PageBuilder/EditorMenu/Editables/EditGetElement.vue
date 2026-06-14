<script setup lang="ts">
import { ref, computed, inject, watch } from 'vue'
import DynamicModalBuilder from '../../../Modals/DynamicModalBuilder.vue'
import TipTapInput from '../../../TipTap/TipTapInput.vue'
import MediaLibraryModal from '../../../Modals/MediaLibraryModal.vue'
import TextColorEditor from './TextColorEditor.vue'
import BackgroundColorEditor from './BackgroundColorEditor.vue'
import ToggleInput from '../../../Inputs/ToggleInput.vue'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import { getPageBuilder } from '../../../../composables/builderInstance'
import { useTranslations } from '../../../../composables/useTranslations'

const { translate } = useTranslations()
const pageBuilderService = getPageBuilder()

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
  const nav = `if(c.hasAttribute('data-isl-auto')){var sp=parseInt(c.getAttribute('data-isl-speed')||'3',10);var dl=(${idx === 0 ? '0' : `(-${idx}*sp)`})+'s';var els=[t].concat(Array.from(c.querySelectorAll('.pbx-isl-dot,.pbx-isl-nums span')));els.forEach(function(el){el.style.animation='none';});t.offsetHeight;els.forEach(function(el){el.style.animation='';el.style.animationDelay=dl;el.style.opacity='';el.style.background='';});}else{t.scrollTo({left:t.children[${idx}].offsetLeft,behavior:'smooth'});}`
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

const handleShowHTMLEditor = async () => {
  pageBuilderStateStore.setToggleGlobalHtmlMode(false)
  openOptionsMoreOpen.value = false
  pageBuilderStateStore.setShowModalHTMLEditor(true)
}

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

    showModalDeleteComponent.value = false
  }
  // end modal
}
</script>
<template v-if="getElement">
  <div>
    <DynamicModalBuilder
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
    </DynamicModalBuilder>
    <DynamicModalBuilder
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
    </DynamicModalBuilder>
    <DynamicModalBuilder
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
    </DynamicModalBuilder>
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

    <div class="pbx-select-none">
      <p v-if="false" class="pbx-font-medium pbx-text-[10px] pbx-w-max lg:pbx-block pbx-hidden">
        Editing
        <span class="pbx-lowercase">&lt;{{ elementTag }}&gt;</span>
      </p>
      <div
        class="pbx-flex pbx-items-center pbx-justify-center pbx-gap-2"
        :class="{ '': getElement }"
      >
        <template v-if="pageBuilderService.ElOrFirstChildIsIframe()">
          <div class="pbx-flex pbx-items-center pbx-justify-start pbx-gap-2 pbx-w-max">
            <div
              @click="handleModalIframeSrc"
              class="pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-flex pbx-items-center pbx-justify-center hover:pbx-bg-gray-100 pbx-aspect-square pbx-text-myPrimaryDarkGrayColor pbx-bg-gray-100 pbx-rounded-xl hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white"
            >
              <span class="material-symbols-outlined"> play_circle </span>
            </div>
          </div>
        </template>

        <template
          v-if="
            pageBuilderService.isSelectedElementValidText() &&
            !pageBuilderService.ElOrFirstChildIsIframe()
          "
        >
          <div class="pbx-flex pbx-items-center pbx-justify-start pbx-gap-2 pbx-w-max">
            <div
              @click="handleModalPreviewTiptap"
              class="pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-flex pbx-items-center pbx-justify-center hover:pbx-bg-gray-100 pbx-aspect-square pbx-text-myPrimaryDarkGrayColor pbx-bg-gray-100 pbx-rounded-xl hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white"
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
              class="pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-flex pbx-items-center pbx-justify-center hover:pbx-bg-gray-100 pbx-aspect-square pbx-text-myPrimaryDarkGrayColor pbx-bg-gray-100 pbx-rounded-xl hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white"
            >
              <span class="material-symbols-outlined"> add_photo_alternate </span>
            </div>
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

        <template v-if="getElement && false">
          <div
            @click="pageBuilderService.deleteElementFromDOM"
            class="pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-flex pbx-items-center pbx-justify-center hover:pbx-bg-gray-100 pbx-aspect-square pbx-text-myPrimaryDarkGrayColor pbx-bg-gray-100 pbx-rounded-xl hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white"
          >
            <span class="material-symbols-outlined"> delete </span>
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
            <span class="material-symbols-outlined pbx-text-base">adjust</span>
          </div>
        </template>

        <DynamicModalBuilder
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
        </DynamicModalBuilder>

        <div
          v-if="getElement && getComponent"
          class="pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-flex pbx-items-center pbx-justify-center hover:pbx-bg-gray-100 pbx-aspect-square pbx-text-myPrimaryDarkGrayColor pbx-bg-gray-100 pbx-rounded-xl hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white"
          @click="openOptionsMoreOpen = !openOptionsMoreOpen"
        >
          <span class="material-symbols-outlined"> more_horiz </span>
        </div>
        <div
          v-if="getElement && getComponent"
          class="pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-flex pbx-items-center pbx-justify-center hover:pbx-bg-gray-100 pbx-aspect-square pbx-text-myPrimaryDarkGrayColor pbx-bg-gray-100 pbx-rounded-xl hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white"
          @click="pageBuilderService.clearHtmlSelection()"
        >
          <span class="material-symbols-outlined"> close_small</span>
        </div>
      </div>
    </div>
  </div>

  <transition name="popup-fade">
    <div
      v-if="openOptionsMoreOpen"
      class="pbx-absolute pbx-top-10 pbx-transform pbx-select-none pbx-bg-white pbx-rounded-2xl pbx-py-2 pbx-px-2 pbx-border-solid pbx-border pbx-border-gray-200 pbx-inset-x-auto pbx-z-40 pbx-w-56"
    >
      <div>
        <div class="pbx-flex pbx-flex-col">
          <!-- content start -->
          <!-- move up and down start -->
          <div
            v-if="getElement && getComponent"
            @click="pageBuilderService.reorderComponent(-1)"
            :disabled="!canMoveUp"
            class="pbx-flex pbx-items-center pbx-justify-start pbx-gap-2 pbx-py-2 pbx-px-2 pbx-rounded-full"
            :class="[
              canMoveUp ? 'pbx-cursor-pointer hover:pbx-bg-red-50' : 'pbx-cursor-not-allowed',
            ]"
          >
            <div
              class="pbx-h-10 pbx-w-10 pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center hover:pbx-bg-gray-100 pbx-aspect-square pbx-text-myPrimaryDarkGrayColor"
              :class="[
                canMoveUp
                  ? 'hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white focus-visible:pbx-ring-0 pbx-cursor-pointer'
                  : 'pbx-cursor-not-allowed pbx-bg-opacity-20 hover:pbx-bg-gray-200',
              ]"
            >
              <span class="material-symbols-outlined"> move_up </span>
            </div>
            <div class="pbx-text-sm">
              {{ translate('Move up') }}
            </div>
          </div>
          <div
            v-if="getElement && getComponent"
            @click="pageBuilderService.reorderComponent(1)"
            :disabled="!canMoveDown"
            class="pbx-flex pbx-items-center pbx-justify-start pbx-gap-2 pbx-py-2 pbx-px-2 pbx-rounded-full"
            :class="[
              canMoveDown ? 'pbx-cursor-pointer hover:pbx-bg-red-50' : 'pbx-cursor-not-allowed ',
            ]"
          >
            <div
              class="pbx-h-10 pbx-w-10 pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center hover:pbx-bg-gray-100 pbx-aspect-square pbx-text-myPrimaryDarkGrayColor"
              :class="[
                canMoveDown
                  ? 'hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white focus-visible:pbx-ring-0 pbx-cursor-pointer'
                  : 'pbx-cursor-not-allowed pbx-bg-opacity-20 hover:pbx-bg-gray-200',
              ]"
            >
              <span class="material-symbols-outlined"> move_down </span>
            </div>
            <div class="pbx-text-sm">
              {{ translate('Move down') }}
            </div>
          </div>
          <!-- move up and down end -->

          <!-- delete component start -->
          <div
            v-if="getElement && getComponent"
            @click="handleDelete()"
            class="pbx-flex pbx-items-center pbx-justify-start pbx-gap-2 pbx-cursor-pointer hover:pbx-bg-red-50 pbx-py-2 pbx-px-2 pbx-rounded-full"
          >
            <div
              class="ppbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-rounded-sm pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-aspect-square hover:pbx-bg-myPrimaryErrorColor hover:pbx-text-white pbx-text-myPrimaryErrorColor"
            >
              <span class="material-symbols-outlined"> delete_forever </span>
            </div>
            <div class="pbx-text-sm">
              {{ translate('Delete component') }}
            </div>
          </div>

          <!-- delete component end -->

          <div
            v-if="getElement && getComponent"
            @click="
              () => {
                openOptionsMoreOpen = !openOptionsMoreOpen
                pageBuilderService.duplicateComponent()
              }
            "
            class="pbx-flex pbx-items-center pbx-justify-start pbx-gap-2 pbx-cursor-pointer hover:pbx-bg-red-50 pbx-py-2 pbx-px-2 pbx-rounded-full"
          >
            <div
              class="pbx-h-10 pbx-w-10 pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center pbx-aspect-square pbx-text-myPrimaryDarkGrayColor hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white focus-visible:pbx-ring-0 pbx-cursor-pointer"
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
                    d="M2 16V2h14v4h4v14H6v-4H2zM4 4h10v10H4V4zm4 12v2h10V8h-2v8H8z"
                    fill-rule="evenodd"
                  ></path>
                </svg>
              </span>
            </div>
            <div class="pbx-text-sm">
              {{ translate('Duplicate component') }}
            </div>
          </div>
          <div
            v-if="getElement && getComponent"
            @click="handleShowHTMLEditor"
            class="pbx-flex pbx-items-center pbx-justify-start pbx-gap-2 pbx-cursor-pointer hover:pbx-bg-red-50 pbx-py-2 pbx-px-2 pbx-rounded-full"
          >
            <div
              class="pbx-h-10 pbx-w-10 pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center pbx-aspect-square pbx-text-myPrimaryDarkGrayColor hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white focus-visible:pbx-ring-0 pbx-cursor-pointer"
            >
              <span class="material-symbols-outlined"> deployed_code </span>
            </div>
            <div class="pbx-text-sm">{{ translate('HTML Editor') }}</div>
          </div>

          <!-- content end -->
        </div>
      </div>
    </div>
  </transition>
</template>
