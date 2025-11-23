<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { sharedPageBuilderStore } from '../../../stores/shared-store'
import ClassEditor from './Editables/ClassEditor.vue'
import StyleEditor from './Editables/StyleEditor.vue'
import ImageEditor from './Editables/ImageEditor.vue'
import OpacityEditor from './Editables/OpacityEditor.vue'
import Padding from './Editables/Padding.vue'
import Margin from './Editables/Margin.vue'
import BorderRadius from './Editables/BorderRadius.vue'
import Borders from './Editables/Borders.vue'
import { getPageBuilder } from '../../../composables/builderInstance'
import { useTranslations } from '../../../composables/useTranslations'
import ModalBuilder from '../../Modals/ModalBuilder.vue'
import AdvancedPageBuilderSettings from '../Settings/AdvancedPageBuilderSettings.vue'
import { delay } from '../../../composables/delay'

const { translate } = useTranslations()

const pageBuilderService = getPageBuilder()
const pageBuilderStateStore = sharedPageBuilderStore

defineEmits(['closeEditor'])

const getElement = computed(() => {
  return pageBuilderStateStore.getElement
})

const elementTag = computed(() => {
  return getElement.value?.tagName
})

const scrollContainer = ref(null)
let lastScrollTop = 0

// Watch for changes that cause re-render (e.g. dropdown value in store)
watch(
  // or the specific value that triggers re-render
  () => pageBuilderStateStore.getElement,
  () => {
    // Restore scroll after DOM updates
    nextTick(() => {
      if (scrollContainer.value) {
        scrollContainer.value.scrollTop = lastScrollTop
      }
    })
  },
)

// Save scroll position before update
function onScroll() {
  if (scrollContainer.value) {
    lastScrollTop = scrollContainer.value.scrollTop
  }
}

const showHTMLSettings = ref(false)
const isLoading = ref(false)

const openHTMLSettings = async function () {
  showHTMLSettings.value = true
  isLoading.value = true
  await delay(200)
  pageBuilderStateStore.setToggleGlobalHtmlMode(true)
  await pageBuilderService.globalPageStyles()

  await pageBuilderService.generateHtmlFromComponents()
  isLoading.value = false
}

const closeHTMLSettings = async function () {
  isLoading.value = true
  await delay(200)
  await pageBuilderService.handleManualSave()

  // Remove global highlight if present
  const pagebuilder = document.querySelector('#pagebuilder')
  if (pagebuilder) {
    pagebuilder.removeAttribute('data-global-selected')
  }
  showHTMLSettings.value = false
  isLoading.value = false
}
</script>

<template>
  <div class="pbx-flex pbx-h-full pbx-flex-col">
    <div
      class="pbx-flex pbx-flex-row pbx-justify-between pbx-pt-7 pbx-pr-4 pbx-pl-4 pbx-items-center pbx-mb-3"
    >
      <button
        type="button"
        @click="$emit('closeEditor')"
        class="pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white"
      >
        <span class="material-symbols-outlined"> close </span>
      </button>
      <p class="pbx-font-medium pbx-text-sm">
        {{ translate('Editing') }}
        <span class="pbx-lowercase">&lt;{{ elementTag }}&gt;</span>
      </p>
    </div>

    <div
      ref="scrollContainer"
      @scroll="onScroll"
      class="pbx-pl-3 pbx-pr-3 pbx-mb-4 pbx-overflow-y-scroll"
    >
      <div v-show="getElement && pageBuilderService.isEditableElement(getElement)">
        <article class="pbx-mb-1">
          <ImageEditor> </ImageEditor>
        </article>
        <article class="pbx-my-1">
          <OpacityEditor> </OpacityEditor>
        </article>
        <article class="pbx-my-1">
          <Padding> </Padding>
        </article>
        <article class="pbx-my-1">
          <Margin> </Margin>
        </article>
        <article class="pbx-my-1">
          <BorderRadius></BorderRadius>
        </article>
        <article class="pbx-my-1">
          <Borders></Borders>
        </article>
        <article class="pbx-my-1">
          <ClassEditor></ClassEditor>
        </article>
        <article class="pbx-my-1">
          <StyleEditor></StyleEditor>
        </article>
        <div class="pbx-w-full pbx-border-t pbx-border-solid pbx-border-gray-200 pbx-my-6"></div>
      </div>

      <button
        @click="openHTMLSettings"
        type="button"
        class="pbx-my-1 pbx-border pbx-border-gray-900 pbx-flex pbx-flex-row pbx-justify-between pbx-items-center pbx-pl-3 pbx-pr-3 pbx-py-5 pbx-cursor-pointer pbx-duration-200 pbx-bg-black pbx-text-white hover:pbx-bg-myPrimaryLightGrayColor hover:pbx-text-black pbx-select-none pbx-w-full"
      >
        <p class="pbx-font-medium pbx-my-0 pbx-py-0">
          {{ translate('Global Page Styles') }}
        </p>
      </button>
    </div>
  </div>
  <ModalBuilder
    maxWidth="5xl"
    :showModalBuilder="showHTMLSettings"
    :title="translate('Selected HTML')"
    @closeMainModalBuilder="closeHTMLSettings"
    minHeight=""
    maxHeight=""
  >
    <AdvancedPageBuilderSettings :isLoading="isLoading"> </AdvancedPageBuilderSettings>
  </ModalBuilder>
</template>
