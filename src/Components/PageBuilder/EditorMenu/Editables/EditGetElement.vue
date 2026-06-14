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

const isInsideSlider = computed(() => {
  return !!(getElement.value instanceof HTMLElement && getElement.value.closest('[data-isl]'))
})

const sliderAutoRotate = computed(() => {
  autoRotateTick.value // reactive dependency — re-run when toggle mutates DOM
  if (!(getElement.value instanceof HTMLElement)) return false
  return getElement.value.closest('[data-isl]')?.hasAttribute('data-isl-auto') ?? false
})

const toggleSliderAutoRotate = async (_newVal?: boolean) => {
  if (!(getElement.value instanceof HTMLElement)) return
  const container = getElement.value.closest('[data-isl]') as HTMLElement | null
  if (!container) return
  if (container.hasAttribute('data-isl-auto')) {
    container.removeAttribute('data-isl-auto')
  } else {
    container.setAttribute('data-isl-auto', '')
  }
  autoRotateTick.value++ // force sliderAutoRotate to re-compute
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
          <div class="pbx-flex pbx-items-center pbx-justify-start pbx-gap-1.5 pbx-w-max">
            <ToggleInput
              :model-value="sliderAutoRotate"
              @update:model-value="toggleSliderAutoRotate"
            />
            <span
              class="pbx-text-xs pbx-font-medium pbx-text-myPrimaryDarkGrayColor pbx-whitespace-nowrap"
              >Auto</span
            >
          </div>
        </template>

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
