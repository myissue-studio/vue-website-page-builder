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
      </div>
    </div>
  </div>
</template>
