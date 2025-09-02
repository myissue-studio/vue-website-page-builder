<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import DynamicModalBuilder from '../../../Modals/DynamicModalBuilder.vue'
import TipTapInput from '../../../TipTap/TipTapInput.vue'
import MediaLibraryModal from '../../../Modals/MediaLibraryModal.vue'
import TextColorEditor from './TextColorEditor.vue'
import BackgroundColorEditor from './BackgroundColorEditor.vue'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import { getPageBuilder } from '../../../../composables/builderInstance'
import { useTranslations } from '../../../../composables/useTranslations'

const { translate } = useTranslations()
const pageBuilderService = getPageBuilder()

// Use shared store instance
const pageBuilderStateStore = sharedPageBuilderStore
const customMediaComponent = inject('CustomMediaComponent')

const getElement = computed(() => {
  return pageBuilderStateStore.getElement
})

// Get tagName of element
const elementTag = computed(() => {
  return getElement.value?.tagName
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
const typeModal = ref('')
const gridColumnModal = ref(Number(1))
const titleModal = ref('')
const descriptionModal = ref('')
const firstButtonModal = ref('')
const secondButtonModal = ref(null)
const thirdButtonModal = ref(null)
// set dynamic modal handle functions
const firstModalButtonFunctionDynamicModalBuilder = ref(null)
const secondModalButtonFunctionDynamicModalBuilder = ref(null)
const thirdModalButtonFunctionDynamicModalBuilder = ref(null)

const handleModalPreviewTiptap = function () {
  pageBuilderService.toggleTipTapModal(true)

  typeModal.value = 'success'
  gridColumnModal.value = 2
  titleModal.value = translate('Manage Content')
  descriptionModal.value = null
  firstButtonModal.value = null
  secondButtonModal.value = null
  thirdButtonModal.value = 'Save'

  // handle click

  firstModalButtonFunctionDynamicModalBuilder.value = function () {
    pageBuilderService.toggleTipTapModal(false)
  }

  thirdModalButtonFunctionDynamicModalBuilder.value = function () {
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
const descriptionMedia = ref('')
const firstButtonMedia = ref('')
const secondButtonMedia = ref(null)
const thirdButtonMedia = ref(null)
// set dynamic modal handle functions
const firstMediaButtonFunction = ref(null)

const handleAddImage = function () {
  // open modal to true
  showMediaLibraryModal.value = true

  titleMedia.value = translate('Media Library')
  descriptionMedia.value = null
  firstButtonMedia.value = translate('Close')
  secondButtonMedia.value = translate(' Select image')

  // handle click
  firstMediaButtonFunction.value = function () {
    showMediaLibraryModal.value = false
  }
}

// Logic for Video Iframe

const urlError = ref(null)
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
    getElement.value.firstElementChild.getAttribute('src').trim() !== ''
      ? getElement.value.firstElementChild.src
      : ''

  iframeSrc.value = iframeSrcValue
  //
  //
  // open modal to true
  showModalIframeSrc.value = true

  typeModal.value = 'success'
  gridColumnModal.value = 2
  titleModal.value = 'Add video url'
  descriptionModal.value = null
  firstButtonModal.value = translate('Close')
  secondButtonModal.value = 'Save'
  thirdButtonModal.value = null

  // handle click
  firstModalButtonFunctionDynamicModalBuilder.value = function () {
    showModalIframeSrc.value = false
  }
  // handle click
  secondModalButtonFunctionDynamicModalBuilder.value = function () {
    const isNotValidated = validateURL()
    if (isNotValidated) {
      return
    }

    if (
      getElement.value &&
      getElement.value.firstElementChild &&
      getElement.value.firstElementChild.tagName === 'IFRAME'
    ) {
      // Set the src attribute

      // replace watch with embed
      iframeSrc.value = iframeSrc.value.replace('watch?v=', 'embed/')

      // Remove dynamic parameters (&ab_channel, &list, &start_radio)
      iframeSrc.value = iframeSrc.value
        .replace(/&ab_channel=[^&]*/, '')
        .replace(/&list=[^&]*/, '')
        .replace(/&start_radio=[^&]*/, '')
        .replace(/&t=[^&]*/, '') // Remove the 't' parameter (time)

      getElement.value.firstElementChild.src = iframeSrc.value
    }

    showModalIframeSrc.value = false
  }
}

const openOptionsMoreOpen = ref(false)
</script>
<template v-if="getElement">
  <div>
    <DynamicModalBuilder
      :showDynamicModalBuilder="showModalIframeSrc"
      maxWidth="2xl"
      :type="typeModal"
      :gridColumnAmount="gridColumnModal"
      :title="titleModal"
      :description="descriptionModal"
      :firstButtonText="firstButtonModal"
      :secondButtonText="secondButtonModal"
      :thirdButtonText="thirdButtonModal"
      @firstModalButtonFunctionDynamicModalBuilder="firstModalButtonFunctionDynamicModalBuilder"
      @secondModalButtonFunctionDynamicModalBuilder="secondModalButtonFunctionDynamicModalBuilder"
      @thirdModalButtonFunctionDynamicModalBuilder="thirdModalButtonFunctionDynamicModalBuilder"
    >
      <header></header>
      <main>
        <div class="pbx-myInputGroup">
          <div class="pbx-myPrimaryFormOrganizationHeaderDescriptionSection">
            <div class="pbx-myPrimaryFormOrganizationHeader">
              <label for="youtube-video" class="pbx-myPrimaryInputLabel">Video url:</label>
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
      :type="typeModal"
      :gridColumnAmount="gridColumnModal"
      :title="titleModal"
      :description="descriptionModal"
      :firstButtonText="firstButtonModal"
      :secondButtonText="secondButtonModal"
      :thirdButtonText="thirdButtonModal"
      @firstModalButtonFunctionDynamicModalBuilder="firstModalButtonFunctionDynamicModalBuilder"
      @secondModalButtonFunctionDynamicModalBuilder="secondModalButtonFunctionDynamicModalBuilder"
      @thirdModalButtonFunctionDynamicModalBuilder="thirdModalButtonFunctionDynamicModalBuilder"
    >
      <header></header>
      <main class="pbx-overflow-y-auto">
        <TipTapInput></TipTapInput>
      </main>
    </DynamicModalBuilder>

    <MediaLibraryModal
      :open="showMediaLibraryModal"
      :title="titleMedia"
      :description="descriptionMedia"
      :firstButtonText="firstButtonMedia"
      :secondButtonText="secondButtonMedia"
      :thirdButtonText="thirdButtonMedia"
      :customMediaComponent="customMediaComponent"
      @firstMediaButtonFunction="firstMediaButtonFunction"
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
            <button
              @click="handleModalIframeSrc"
              type="button"
              class="pbx-h-8 pbx-w-8 pbx-flex-end pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-200 pbx-aspect-square hover:pbx-bg-gray-100 hover:pbx-fill-white focus-visible:pbx-ring-0 pbx-text-myPrimaryDarkGrayColor"
            >
              <span class="material-symbols-outlined"> play_circle </span>
            </button>
          </div>
        </template>

        <template
          v-if="
            pageBuilderService.isSelectedElementValidText() &&
            !pageBuilderService.ElOrFirstChildIsIframe()
          "
        >
          <div class="pbx-flex pbx-items-center pbx-justify-start pbx-gap-2 pbx-w-max">
            <button
              @click="handleModalPreviewTiptap"
              type="button"
              class="pbx-h-8 pbx-w-8 pbx-flex-end pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-200 pbx-aspect-square hover:pbx-bg-gray-100 hover:pbx-fill-white focus-visible:pbx-ring-0 pbx-text-myPrimaryDarkGrayColor"
            >
              <span class="material-symbols-outlined"> edit </span>
            </button>
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
            <button
              @click="handleAddImage"
              type="button"
              class="pbx-h-8 pbx-w-8 pbx-flex-end pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-200 pbx-aspect-square hover:pbx-bg-gray-100 hover:pbx-fill-white focus-visible:pbx-ring-0 pbx-text-myPrimaryDarkGrayColor"
            >
              <span class="material-symbols-outlined"> add_photo_alternate </span>
            </button>
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

        <template v-if="getElement">
          <button
            @click="pageBuilderService.deleteElementFromDOM"
            type="button"
            class="pbx-h-8 pbx-w-8 pbx-flex-end pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-200 pbx-aspect-square hover:pbx-bg-gray-100 hover:pbx-fill-white focus-visible:pbx-ring-0 pbx-text-myPrimaryDarkGrayColor"
          >
            <span class="material-symbols-outlined"> delete </span>
          </button>
        </template>

        <div
          v-if="getElement && getComponent"
          class="pbx-h-8 pbx-w-8 pbx-flex-end pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-200 pbx-aspect-square hover:pbx-bg-gray-100 hover:pbx-fill-white focus-visible:pbx-ring-0 pbx-text-myPrimaryDarkGrayColor"
          @click="openOptionsMoreOpen = !openOptionsMoreOpen"
        >
          <span class="material-symbols-outlined"> more_horiz </span>
        </div>
        <div
          v-if="getElement && getComponent"
          class="pbx-h-8 pbx-w-8 pbx-flex-end pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-200 pbx-aspect-square hover:pbx-bg-gray-100 hover:pbx-fill-white focus-visible:pbx-ring-0 pbx-text-myPrimaryDarkGrayColor"
          @click="pageBuilderService.clearHtmlSelection()"
        >
          <span class="material-symbols-outlined"> close_small</span>
        </div>
      </div>
    </div>

    <transition name="popup-fade">
      <div
        v-if="openOptionsMoreOpen"
        class="pbx-fixed pbx-z-40 pbx-top-10 pbx-right-0 lg:pbx-w-72 md:pbx-w-64 pbx-w-full pbx-select-none"
      >
        <div
          class="pbx-rounded-3xl pbx-border pbx-border-gray-100 pbx-bg-white pbx-shadow-lg pbx-pt-4 pbx-pb-4 pbx-flex pbx-flex-col pbx-overflow-y-auto pbx-max-h-[80vh] pbx-mx-4 pbx-px-2"
        >
          <div
            class="pbx-flex pbx-gap-2 pbx-items-center pbx-justify-between pbx-border-b pbx-border-gray-200 pbx-pb-4 pbx-pl-2"
          >
            <span class="pbx-text-black pbx-font-medium">Options</span>

            <!-- Close Modal start -->
            <div
              @click="openOptionsMoreOpen = !openOptionsMoreOpen"
              class="pbx-h-8 pbx-w-8 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-black pbx-text-white pbx-aspect-square hover:pbx-fill-white focus-visible:pbx-ring-0 hover:pbx-outline-3 hover:pbx-outline-offset-2 hover:pbx-outline-black pbx-transition-all pbx-duration-100"
            >
              <span class="material-symbols-outlined"> close_small </span>
            </div>
            <!-- Close Modal Start -->
          </div>

          <div class="pbx-flex pbx-flex-col pbx-gap-4 pbx-mt-6">
            <!-- content start -->
            <div
              v-if="getElement && getComponent"
              @click="
                () => {
                  openOptionsMoreOpen = !openOptionsMoreOpen
                  pageBuilderService.duplicateComponent()
                }
              "
              class="pbx-flex pbx-items-center pbx-justify-start pbx-gap-2 pbx-cursor-pointer"
            >
              <div
                class="pbx-h-8 pbx-w-8 pbx-flex-end pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-200 pbx-aspect-square hover:pbx-bg-gray-100 hover:pbx-fill-white focus-visible:pbx-ring-0 pbx-text-myPrimaryDarkGrayColor"
              >
                <span class="material-symbols-outlined"> control_point_duplicate </span>
              </div>
              <div class="pbx-text-sm">Duplicate</div>
            </div>
            <!-- content end -->
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
