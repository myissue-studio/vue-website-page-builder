<script setup>
import { onMounted, computed, ref, watch, provide } from 'vue'
import ModalBuilder from '../Components/Modals/ModalBuilder.vue'
import Preview from './Preview.vue'
import ComponentTopMenu from '../Components/PageBuilder/EditorMenu/Editables/ComponentTopMenu.vue'
import EditGetElement from '../Components/PageBuilder/EditorMenu/Editables/EditGetElement.vue'
import BuilderComponents from '../Components/Modals/BuilderComponents.vue'
import RightSidebarEditor from '../Components/PageBuilder/EditorMenu/RightSidebarEditor.vue'
import { sharedPageBuilderPinia, sharedPageBuilderStore } from '../stores/shared-store'
import ToolbarOption from '../Components/PageBuilder/ToolbarOption/ToolbarOption.vue'
import { delay } from '../composables/delay'
import { useDebounce } from '../composables/useDebounce.ts'
import DynamicModalBuilder from '../Components/Modals/DynamicModalBuilder.vue'
import GlobalLoader from '../Components/Loaders/GlobalLoader.vue'
import { useTranslations } from '../composables/useTranslations'
import { getPageBuilder } from '../composables/builderInstance'
import UndoRedo from '../Components/PageBuilder/UndoRedo/UndoRedo.vue'

const pageBuilderService = getPageBuilder()

/**
 * Props for PageBuilder component
 * @typedef {Object} Props
 * @property {Object|null} CustomMediaLibraryComponent - Custom media component
 * @property {Object|null} CustomBuilderComponents - Custom component
 * @property {Object} configPageBuilder - Configuration object containing:
 */
const props = defineProps({
  CustomMediaLibraryComponent: {
    type: Object,
    default: null,
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

// Use shared Pinia instance for PageBuilder package
const internalPinia = sharedPageBuilderPinia

const pageBuilderStateStore = sharedPageBuilderStore

// Provide store for child components (all pointing to the same consolidated store)
provide('pageBuilderStateStore', pageBuilderStateStore)
// Provide the internal Pinia instance for components that need to create stores
provide('internalPinia', internalPinia)
// Provide custom components for child components
provide('CustomMediaComponent', props.CustomMediaLibraryComponent)
provide('CustomBuilderComponents', props.CustomBuilderComponents)

const emit = defineEmits(['handleClosePageBuilder', 'handlePublishPageBuilder'])

const closePageBuilder = function () {
  emit('handleClosePageBuilder')
}
const closePublish = async function () {
  pageBuilderStateStore.setIsLoadingGlobal(true)
  await pageBuilderService.handleManualSave()
  pageBuilderStateStore.setIsLoadingGlobal(false)
  emit('handlePublishPageBuilder')
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
    await delay(200)
    await loadTranslations(newVal)
    pageBuilderService.changeLanguage(newVal)

    // Ensure lang is updated within userSettings
    const userSettings = JSON.parse(localStorage.getItem('userSettingsPageBuilder')) || {}
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

const getMenuRight = computed(() => {
  return pageBuilderStateStore.getMenuRight
})
const openPageBuilderPreviewModal = ref(false)
const titleBuilderDesktop = ref('')
const titleBuilderMobile = ref('')

const previewCurrentDesign = function () {
  pageBuilderService.previewCurrentDesign()
}
const handlePageBuilderPreview = function () {
  titleBuilderDesktop.value = translate('Preview')
  previewCurrentDesign()
  openPageBuilderPreviewModal.value = true
}

const openPageBuilderPreviewMobile = ref(false)

const previewCurrentDesignMobile = function () {
  pageBuilderService.previewCurrentDesign()
}
const handlePageBuilderPreviewMobile = function () {
  titleBuilderMobile.value = translate('Mobile')
  previewCurrentDesignMobile()
  openPageBuilderPreviewMobile.value = true
}

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
const firstModalButtonSearchComponentsFunction = ref(null)

const handleAddComponent = async function () {
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

const getElement = computed(() => {
  return pageBuilderStateStore.getElement
})

const getComponents = computed(() => {
  return pageBuilderStateStore.getComponents
})

const getHasLocalDraftForUpdate = computed(() => {
  return pageBuilderStateStore.getHasLocalDraftForUpdate
})

const getToggleGlobalHtmlMode = computed(() => {
  return pageBuilderStateStore.getToggleGlobalHtmlMode
})

watch(getHasLocalDraftForUpdate, (newVal) => {
  if (newVal) {
    handlerRumeEditingForUpdate()
  }
})

const getElementAttributes = computed(() => {
  if (!getElement.value || !(getElement.value instanceof HTMLElement)) {
    return ''
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
  // Only run if attributes actually changed
  if (
    newAttributes?.src !== oldAttributes?.src ||
    newAttributes?.href !== oldAttributes?.href ||
    newAttributes?.style !== oldAttributes?.style ||
    newAttributes?.class !== oldAttributes?.class ||
    newAttributes?.dataImage !== oldAttributes?.dataImage
  ) {
    debounce(async () => {
      await pageBuilderService.initializeElementStyles()
    }, 200)
  }
})

const handleSelectComponent = function (componentObject) {
  pageBuilderStateStore.setComponent(componentObject)
}

const getIsLoadingGlobal = computed(() => {
  return pageBuilderStateStore.getIsLoadingGlobal
})
const getIsSaving = computed(() => {
  return pageBuilderStateStore.getIsSaving
})

const getIsLoadingResumeEditing = computed(() => {
  return pageBuilderStateStore.getIsLoadingResumeEditing
})
const getIsRestoring = computed(() => {
  return pageBuilderStateStore.getIsRestoring
})

const gridColumnModalResumeEditing = ref(Number(1))
const typeModal = ref('')
const showModalResumeEditing = ref(false)
const titleModalResumeEditing = ref('')
const descriptionModalResumeEditing = ref('')
const firstButtonResumeEditing = ref('')
const secondButtonResumeEditing = ref(null)
const thirdButtonResumeEditing = ref(null)
const firstModalButtonResumeEditingFunction = ref(null)
const secondModalButtonResumeEditingFunction = ref(null)
const thirdModalButtonResumeEditingFunction = ref(null)

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
const secondButtonRestore = ref(null)
const thirdButtonRestore = ref(null)
const firstModalButtonRestoreFunction = ref(null)
const secondModalButtonRestoreFunction = ref(null)
const thirdModalButtonRestoreFunction = ref(null)

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
    await pageBuilderService.restoreOriginalContent()
    showModalRestore.value = false
  }

  // end modal
}

// HTML editor logic start
const getShowModalHTMLEditor = computed(() => pageBuilderStateStore.getShowModalHTMLEditor)

const elementHTML = computed(() => {
  if (!getElement.value || !(getElement.value instanceof HTMLElement)) {
    return ''
  }
  return getElement.value.outerHTML
})

const editableHtml = ref('')
const editableComponents = ref('')

watch(getShowModalHTMLEditor, async (newVal) => {
  if (newVal) {
    if (!getToggleGlobalHtmlMode.value) {
      editableHtml.value = elementHTML.value
      return
    }

    editableComponents.value = await pageBuilderService.generateHtmlFromComponents()
  }
})

const handleCloseHTMLEditor = () => {
  pageBuilderStateStore.setShowModalHTMLEditor(false)
}

const isLoading = ref(false)
const errSaveComponents = ref(null)

const handleSaveChangesElement = async () => {
  errSaveComponents.value = null
  isLoading.value = true
  await delay(300)

  const error = await pageBuilderService.applyModifiedHTML(editableHtml.value)

  if (error) {
    errSaveComponents.value = error
    isLoading.value = false
    return
  }

  pageBuilderStateStore.setShowModalHTMLEditor(false)
  isLoading.value = false
}

const handleSaveChangesComponents = async () => {
  errSaveComponents.value = null
  isLoading.value = true
  errSaveComponents.value = null
  await delay(300)

  const error = await pageBuilderService.applyModifiedComponents(editableComponents.value)

  if (error) {
    errSaveComponents.value = error
    isLoading.value = false
    return
  }

  pageBuilderStateStore.setShowModalHTMLEditor(false)
  isLoading.value = false
}
// HTML editor logic end

const ensureBuilderInitialized = function () {
  if (!getBuilderStarted.value) {
    openAppNotStartedModal.value = true
  }
}

const pbxBuilderWrapper = ref(null)

const hideToolbar = function () {
  const toolbar = document.querySelector('#pbxEditToolbar')
  if (toolbar) {
    toolbar.classList.remove('is-visible')
    toolbar.removeAttribute('style')
  }
}

function updatePanelPosition() {
  const container = pbxBuilderWrapper.value
  const editToolbarElement = container && container.querySelector('#pbxEditToolbar')

  if (!container || !editToolbarElement) return

  const selected = container.querySelector('[selected]')

  if (selected && typeof selected.getBoundingClientRect === 'function') {
    const selectedRect = selected.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()

    let left =
      selectedRect.left -
      containerRect.left +
      selectedRect.width / 2 -
      editToolbarElement.offsetWidth / 2

    // Add margin so toolbar is never flush with the left edge
    const margin = 20 // px
    left = Math.max(
      margin,
      Math.min(left, container.offsetWidth - editToolbarElement.offsetWidth - margin),
    )

    const GAP = 20 // px
    const proposedTop =
      selectedRect.top -
      containerRect.top +
      container.scrollTop -
      editToolbarElement.offsetHeight -
      GAP

    const top = Math.max(0, proposedTop)

    editToolbarElement.style.position = 'absolute'
    editToolbarElement.style.left = `${left}px`
    editToolbarElement.style.top = `${top}px`
    editToolbarElement.classList.add('is-visible')
  } else {
    editToolbarElement.classList.remove('is-visible')
    editToolbarElement.removeAttribute('style')
  }
}

const userSettings = JSON.parse(localStorage.getItem('userSettingsPageBuilder'))

onMounted(async () => {
  await pageBuilderService.completeBuilderInitialization(undefined, true)

  if (userSettings && userSettings.lang) {
    languageSelction.value = userSettings.lang
  }
  if (
    getPageBuilderConfig.value &&
    getPageBuilderConfig.value.userSettings &&
    getPageBuilderConfig.value.userSettings.language &&
    getPageBuilderConfig.value.userSettings.language.default &&
    (!userSettings || !userSettings.lang)
  ) {
    languageSelction.value = getPageBuilderConfig.value.userSettings.language.default
  }

  await loadTranslations(languageSelction.value)
  isInitializingLang = false

  updatePanelPosition()

  // Set up MutationObserver and event listeners
  const container = pbxBuilderWrapper.value
  if (!container) return

  const observer = new MutationObserver(updatePanelPosition)
  observer.observe(container, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['selected'],
  })

  window.addEventListener('scroll', updatePanelPosition)
  window.addEventListener('resize', updatePanelPosition)

  //
  //
  //
  //
  // Check if Builder started
  await delay(10000)
  ensureBuilderInitialized()

  // Re-check if Builder started
  await delay(10000)
  ensureBuilderInitialized()

  // Re-check again if Builder started
  await delay(10000)
  ensureBuilderInitialized()
})
</script>

<template>
  <div
    class="lg:pbx-min-w-full lg:pbx-max-w-full lg:pbx-w-full pbx-mx-auto pbx-flex pbx-flex-col pbx-font-sans pbx-text-black pbx-border-solid pbx-border pbx-border-gray-400 pbx-inset-x-0 pbx-z-10 pbx-bg-white pbx-overflow-x-auto pbx-h-full"
  >
    <GlobalLoader
      v-if="(getIsLoadingGlobal && !openAppNotStartedModal) || isLoadingLang"
    ></GlobalLoader>
    <ModalBuilder
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
    </ModalBuilder>

    <BuilderComponents
      v-if="showModalAddComponent"
      :show="showModalAddComponent"
      :firstButtonText="firstButtonTextSearchComponents"
      :title="titleModalAddComponent"
      :CustomBuilderComponents="props.CustomBuilderComponents"
      @firstModalButtonSearchComponentsFunction="firstModalButtonSearchComponentsFunction"
    ></BuilderComponents>

    <ModalBuilder
      :title="titleBuilderDesktop"
      :showModalBuilder="openPageBuilderPreviewModal"
      @closeMainModalBuilder="firstPageBuilderPreviewModalButton"
      maxWidth="screen"
    >
      <Preview></Preview>
    </ModalBuilder>

    <ModalBuilder
      :title="titleBuilderMobile"
      :showModalBuilder="openPageBuilderPreviewMobile"
      @closeMainModalBuilder="firstPageBuilderPreviewModalButtonMobile"
      maxWidth="lg"
    >
      <Preview :mobile="true" />
    </ModalBuilder>

    <DynamicModalBuilder
      :showDynamicModalBuilder="showModalResumeEditing"
      :isLoading="getIsLoadingResumeEditing"
      :type="typeModal"
      :gridColumnAmount="gridColumnModalResumeEditing"
      :title="titleModalResumeEditing"
      :description="descriptionModalResumeEditing"
      :firstButtonText="firstButtonResumeEditing"
      :secondButtonText="secondButtonResumeEditing"
      :thirdButtonText="thirdButtonResumeEditing"
      @firstModalButtonFunctionDynamicModalBuilder="firstModalButtonResumeEditingFunction"
      @secondModalButtonFunctionDynamicModalBuilder="secondModalButtonResumeEditingFunction"
      @thirdModalButtonFunctionDynamicModalBuilder="thirdModalButtonResumeEditingFunction"
    >
      <header></header>
      <main></main>
    </DynamicModalBuilder>
    <DynamicModalBuilder
      :showDynamicModalBuilder="showModalRestore"
      :isLoading="getIsRestoring"
      :type="typeModalRestore"
      :gridColumnAmount="gridColumnModalRestore"
      :title="titleModalRestore"
      :description="descriptionModalRestore"
      :firstButtonText="firstButtonRestore"
      :secondButtonText="secondButtonRestore"
      :thirdButtonText="thirdButtonRestore"
      @firstModalButtonFunctionDynamicModalBuilder="firstModalButtonRestoreFunction"
      @secondModalButtonFunctionDynamicModalBuilder="secondModalButtonRestoreFunction"
      @thirdModalButtonFunctionDynamicModalBuilder="thirdModalButtonRestoreFunction"
    >
      <header></header>
      <main></main>
    </DynamicModalBuilder>

    <ModalBuilder
      maxWidth="7xl"
      :showModalBuilder="getShowModalHTMLEditor"
      :title="translate('HTML Editor')"
      @closeMainModalBuilder="handleCloseHTMLEditor"
    >
      <template v-if="!getToggleGlobalHtmlMode">
        <textarea
          id="html-editor"
          v-model="editableHtml"
          class="pbx-h-full pbx-font-sans pbx-bg-gray-900 pbx-text-white pbx-w-full"
          style="overflow: auto; min-height: 400px"
        ></textarea>
        <div class="pbx-flex pbx-justify-end pbx-min-h-6">
          <p v-if="errSaveComponents" class="pbx-myPrimaryParagraphError">
            Error: {{ errSaveComponents }}
          </p>
        </div>
        <div
          class="pbx-border-0 pbx-border-solid pbx-border-t pbx-border-gray-200 pbx-flex pbx-items-center pbx-justify-end"
        >
          <div class="pbx-py-4 pbx-flex sm:pbx-justify-end pbx-justify-center">
            <div
              class="sm:pbx-grid-cols-2 sm:pbx-items-end sm:pbx-justify-end pbx-flex sm:pbx-flex-row pbx-flex-col pbx-myPrimaryGap sm:pbx-w-5/6 pbx-w-full"
            >
              <template v-if="!isLoading">
                <button @click="handleCloseHTMLEditor" type="button" class="pbx-mySecondaryButton">
                  {{ translate('Close') }}
                </button>
                <button @click="handleSaveChangesElement" type="button" class="pbx-myPrimaryButton">
                  {{ translate('Save') }}
                </button>
              </template>
              <template v-if="isLoading">
                <div class="pbx-flex pbx-items-center pbx-my-2 pbx-justify-end">
                  <div
                    class="pbx-inline-block pbx-h-8 pbx-w-8 pbx-animate-spin pbx-rounded-full pbx-border-4 pbx-border-solid pbx-border-current pbx-border-r-transparent pbx-align-[-0.125em] motion-reduce:pbx-animate-[spin_1.5s_linear_infinite]"
                  >
                    <span
                      class="!pbx-absolute !pbx-m-px !pbx-h-px !pbx-w-px !pbx-overflow-hidden !pbx-whitespace-nowrap !pbx-border-0 !pbx-p-0 !pbx-[clip:rect(0,0,0,0)]"
                      >Loading...</span
                    >
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </template>

      <template v-if="getToggleGlobalHtmlMode">
        <textarea
          id="html-editor"
          v-model="editableComponents"
          class="pbx-h-full pbx-font-sans pbx-bg-gray-900 pbx-text-white pbx-w-full"
          style="overflow: auto; min-height: 400px"
        ></textarea>
        <div class="pbx-flex pbx-justify-end pbx-min-h-6">
          <p v-if="errSaveComponents" class="pbx-myPrimaryParagraphError">
            Error: {{ errSaveComponents }}
          </p>
        </div>
        <div
          class="pbx-border-0 pbx-border-solid pbx-border-t pbx-border-gray-200 pbx-flex pbx-items-center pbx-justify-end"
        >
          <div class="pbx-py-4 pbx-flex sm:pbx-justify-end pbx-justify-center">
            <div
              class="sm:pbx-grid-cols-2 sm:pbx-items-end sm:pbx-justify-end pbx-flex sm:pbx-flex-row pbx-flex-col pbx-myPrimaryGap sm:pbx-w-5/6 pbx-w-full"
            >
              <template v-if="!isLoading">
                <button @click="handleCloseHTMLEditor" type="button" class="pbx-mySecondaryButton">
                  {{ translate('Close') }}
                </button>
                <button
                  @click="handleSaveChangesComponents"
                  type="button"
                  class="pbx-myPrimaryButton"
                >
                  {{ translate('Save') }}
                </button>
              </template>
              <template v-if="isLoading">
                <div class="pbx-flex pbx-items-center pbx-my-2 pbx-justify-end">
                  <div
                    class="pbx-inline-block pbx-h-8 pbx-w-8 pbx-animate-spin pbx-rounded-full pbx-border-4 pbx-border-solid pbx-border-current pbx-border-r-transparent pbx-align-[-0.125em] motion-reduce:pbx-animate-[spin_1.5s_linear_infinite]"
                  >
                    <span
                      class="!pbx-absolute !pbx-m-px !pbx-h-px !pbx-w-px !pbx-overflow-hidden !pbx-whitespace-nowrap !pbx-border-0 !pbx-p-0 !pbx-[clip:rect(0,0,0,0)]"
                      >Loading...</span
                    >
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </template>
    </ModalBuilder>

    <div
      id="pagebuilder-navbar"
      class="lg:pbx-min-w-full lg:pbx-max-w-full lg:pbx-w-full pbx-min-w-[64rem] pbx-max-w-[64rem] pbx-w-[64rem] pbx-flex-1 pbx-bg-myPrimaryLightGrayColor pbx-flex pbx-items-center pbx-justify-between pbx-border-0 pbx-border-solid pbx-border-b pbx-border-gray-200 pbx-mb-2 pbx-font-sans pbx-min-h-20"
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
          class="pbx-flex pbx-justify-start pbx-py-2 lg:pbx-ml-4 pbx-ml-2"
        >
          <img class="pbx-h-6" :src="getPageBuilderConfig.pageBuilderLogo.src" alt="Logo" />
        </div>
      </template>
      <!-- Logo # end -->

      <UndoRedo @toolbar-hide-request="hideToolbar"></UndoRedo>

      <div
        @click.self="
          async () => {
            await pageBuilderService.clearHtmlSelection()
          }
        "
        class="pbx-flex-1 pbx-flex pbx-justify-center pbx-items-center pbx-py-2 pbx-w-full"
      >
        <div class="pbx-flex pbx-items-center pbx-justify-center">
          <!-- Save Start -->
          <button
            class="pbx-mySecondaryButton pbx-h-6 pbx-flex pbx-gap-2 pbx-mr-2"
            @click.stop="
              async () => {
                await pageBuilderService.clearHtmlSelection()
                await pageBuilderService.handleManualSave()
              }
            "
            type="button"
            :disabled="getIsSaving"
          >
            <div
              v-if="!getIsSaving"
              class="pbx-h-10 pbx-w-4 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-justify-center"
            >
              <span class="material-symbols-outlined">save</span>
            </div>
            <div
              v-if="getIsSaving"
              class="pbx-h-10 pbx-w-4 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-justify-center"
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
              class="pbx-mySecondaryButton pbx-h-6 pbx-flex pbx-gap-2 lg:pbx-mr-2 pbx-mr-2"
              @click.stop="
                async () => {
                  await pageBuilderService.clearHtmlSelection()
                  await handleRestoreOriginalContent()
                }
              "
              type="button"
              :disabled="getIsRestoring"
            >
              <div
                v-if="!getIsRestoring"
                class="pbx-h-10 pbx-w-4 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-justify-center"
              >
                <span class="material-symbols-outlined"> settings_backup_restore </span>
              </div>
              <div
                v-if="getIsRestoring"
                class="pbx-h-10 pbx-w-4 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-justify-center"
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
        class="pbx-flex-1 pbx-flex pbx-justify-center pbx-items-center pbx-py-2 pbx-w-full"
      >
        <div
          @click.self="
            async () => {
              await pageBuilderService.clearHtmlSelection()
            }
          "
          class="pbx-flex pbx-items-center pbx-justify-center"
        >
          <div
            class="pbx-mr-2"
            @click="
              () => {
                pageBuilderStateStore.setComponentArrayAddMethod('unshift')
                handleAddComponent()
              }
            "
          >
            <div class="pbx-flex pbx-items-center pbx-justify-center pbx-gap-2 pbx-border-gray-200">
              <span class="lg:pbx-block pbx-hidden">
                <div class="pbx-whitespace-nowrap pbx-cursor-pointer">
                  {{ translate('Add new Components') }}
                </div>
              </span>
              <span
                class="pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white"
              >
                <span class="pbx-myMediumIcon material-symbols-outlined"> interests </span>
              </span>
            </div>
          </div>
          <div class="pbx-flex pbx-items-center pbx-justify-center pbx-mr-2">
            <div
              @click="
                async () => {
                  pageBuilderStateStore.setMenuRight(false)
                  pageBuilderStateStore.setElement(null)
                  await pageBuilderService.clearHtmlSelection()
                  handlePageBuilderPreview()
                }
              "
            >
              <div class="pbx-flex pbx-items-center pbx-justify-center pbx-gap-2">
                <span
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
                      <path
                        clip-rule="evenodd"
                        d="M2 3h18v13h-8v2h3v2H7v-2h3v-2H2V3zm2 2v9h14V5H4z"
                        fill-rule="evenodd"
                      ></path>
                    </svg>
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div class="lg:pbx-flex pbx-hidden pbx-items-center pbx-justify-center">
            <div
              @click="
                async () => {
                  pageBuilderStateStore.setMenuRight(false)
                  pageBuilderStateStore.setElement(null)
                  await pageBuilderService.clearHtmlSelection()
                  handlePageBuilderPreviewMobile()
                }
              "
            >
              <div class="pbx-flex pbx-items-center pbx-justify-center pbx-gap-2">
                <span
                  class="pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white"
                >
                  <svg
                    fill="currentColor"
                    height="22"
                    viewBox="0 0 22 22"
                    width="22"
                    xmlns="http://www.w3.org/2000/svg"
                    class="css-gy660l"
                  >
                    <path d="M14 16H8v2h6v-2z"></path>
                    <path
                      d="M14 1H8a3 3 0 00-3 3v14a3 3 0 003 3h6a3 3 0 003-3V4a3 3 0 00-3-3zM7 4a1 1 0 011-1h6a1 1 0 011 1v14a1 1 0 01-1 1H8a1 1 0 01-1-1V4z"
                    ></path>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="pbx-flex-1 pbx-flex gap-2 pbx-items-center pbx-justify-end">
        <!-- Options # Start -->
        <div
          @click.self="
            async () => {
              await pageBuilderService.clearHtmlSelection()
            }
          "
          class="pbx-flex pbx-items-center pbx-py-2 pbx-w-full"
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
            !getPageBuilderConfig.userSettings.language.disableLanguageDropDown
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
                      .filter((l) => getPageBuilderConfig.userSettings.language.enable.includes(l))"
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
              class="pbx-h-10 pbx-w-10 pbx-flex-end pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white hover:pbx-fill-white focus-visible:pbx-ring-0"
              @click="
                async () => {
                  closePageBuilder()
                  await pageBuilderService.clearHtmlSelection()
                }
              "
            >
              <span class="material-symbols-outlined"> close </span>
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
    >
      <!-- Left Menu Start -->
      <div
        @click.self="
          async () => {
            await pageBuilderService.clearHtmlSelection()
          }
        "
        id="pagebuilder-left-menu"
        class="pbx-w-16 pbx-pt-7 pbx-pb-2 pbx-bg-myPrimaryLightGrayColor pbx-rounded-r-2xl pbx-shadow-sm"
      >
        <div class="pbx-mx-2 pbx-flex pbx-flex-col pbx-myPrimaryGap pbx-items-stretch">
          <div class="pbx-flex pbx-gap-2 pbx-items-center pbx-justify-center">
            <button
              type="button"
              @click="
                () => {
                  pageBuilderStateStore.setComponentArrayAddMethod('unshift')
                  handleAddComponent()
                }
              "
              class="pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white"
            >
              <span class="pbx-myMediumIcon material-symbols-outlined"> interests </span>
            </button>
          </div>
          <div
            @click.self="
              async () => {
                await pageBuilderService.clearHtmlSelection()
              }
            "
          >
            <ComponentTopMenu></ComponentTopMenu>
          </div>
        </div>
      </div>
      <!-- Left Menu End -->

      <main
        ref="pbxBuilderWrapper"
        id="page-builder-wrapper"
        class="pbx-transition-all pbx-duration-300 pbx-font-sans pbx-p-1 pbx-flex pbx-flex-col pbx-grow pbx-rounded-tr-2xl pbx-rounded-tl-2xl pbx-border-solid pbx-border pbx-border-gray-200 pbx-items-stretch pbx-text-black pbx-h-[100vh] pbx-overflow-y-scroll pbx-relative pbx-pt-16"
        :class="[getMenuRight ? 'pbx-w-full' : 'pbx-w-full']"
      >
        <div
          id="pbxEditToolbar"
          class="pbx-z-30 pbx-flex pbx-gap-2 pbx-justify-center pbx-items-center pbx-rounded-sm pbx-px-2 pbx-h-0 pbx-relative"
        >
          <template v-if="getElement">
            <EditGetElement></EditGetElement>
          </template>
        </div>
        <!-- Element Popover toolbar end -->

        <div id="pagebuilder" class="pbx-text-black pbx-font-sans">
          <template v-for="component in getComponents" :key="component.id">
            <div
              v-if="component.html_code"
              v-html="component.html_code"
              @mouseup="handleSelectComponent(component)"
            ></div>
          </template>
        </div>
      </main>

      <transition name="slide-right" appear mode="out-in">
        <aside
          v-if="getMenuRight"
          aria-label="menu"
          id="pagebuilder-right-menu"
          class="pbx-z-20 pbx-flex-shrink-0 pbx-overflow-hidden pbx-border-0 pbx-border-solid pbx-border-l-0 pbx-border-l-gray-600 pbx-rounded-l-2xl pbx-h-[100vh] pbx-pl-2"
          :class="[
            getMenuRight
              ? 'pbx-w-80 pbx-bg-myPrimaryLightGrayColor pbx-items-stretch'
              : 'bpx-w-0 pbx-mr-0',
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
                  class="css-l0u10b"
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

    <!-- Footer Start -->
    <div
      id="pagebuilder-footer"
      class="lg:pbx-min-w-full lg:pbx-max-w-full lg:pbx-w-full pbx-min-w-[64rem] pbx-max-w-[64rem] pbx-w-[64rem] pbx-flex-1 pbx-flex pbx-items-center pbx-justify-center pbx-border-0 pbx-border-t pbx-border-t-gray-200 pbx-border-solid pbx-bg-myPrimaryLightGrayColor pbx-py-4"
    >
      <div
        @click="
          () => {
            pageBuilderStateStore.setComponentArrayAddMethod('push')
            handleAddComponent()
          }
        "
        class="pbx-flex pbx-items-center pbx-justify-center pbx-gap-2 pbx-cursor-pointer"
      >
        <span class="lg:pbx-block pbx-hidden">
          <div class="pbx-whitespace-nowrap">{{ translate('Add to the bottom') }}</div>
        </span>
        <div class="pbx-flex pbx-gap-2 pbx-items-center pbx-justify-center">
          <button
            type="button"
            class="pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white"
          >
            <span class="pbx-myMediumIcon material-symbols-outlined"> interests </span>
          </button>
        </div>
      </div>
    </div>
    <!-- Footer End -->
  </div>
</template>

<style>
#pagebuilder [element] {
  outline: rgba(255, 255, 255, 0) dashed 4px !important;
  outline-offset: -4px !important;
}
#pagebuilder [hovered] {
  outline: rgb(0, 140, 14, 1) dashed 4px !important;
  outline-offset: -4px !important;
}

#pagebuilder [selected] {
  position: relative;

  outline: rgb(185, 16, 16) dashed 4px !important;
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
