<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { sharedPageBuilderStore } from '../../../stores/shared-store'
import ClassEditor from './Editables/ClassEditor.vue'
import StyleEditor from './Editables/StyleEditor.vue'
import ImageEditor from './Editables/ImageEditor.vue'
import OpacityEditor from './Editables/OpacityEditor.vue'
import PaddingControl from './Editables/PaddingControl.vue'
import MarginControl from './Editables/MarginControl.vue'
import BorderRadiusControl from './Editables/BorderRadiusControl.vue'
import BorderControls from './Editables/BorderControls.vue'
import ThemeColorSettingsEditor from './Editables/ThemeColorSettingsEditor.vue'
import PageDesignSettingsEditor from './Editables/PageDesignSettingsEditor.vue'
import OverviewSettingsSection from './Editables/OverviewSettingsSection.vue'
import DownloadHtmlSettingsSection from './Editables/DownloadHtmlSettingsSection.vue'
import SelectedHtmlSettingsSection from './Editables/SelectedHtmlSettingsSection.vue'
import { getPageBuilder } from '../../../composables/usePageBuilder'
import { useTranslations } from '../../../composables/useTranslations'
import BaseModal from '../../Modals/BaseModal.vue'
import PageDesignEditor from './Editables/PageDesignEditor.vue'
import { sleep } from '../../../utils/sleep'

const { translate } = useTranslations()

const pageBuilderService = getPageBuilder()
const pageBuilderStateStore = sharedPageBuilderStore

defineEmits(['closeEditor'])

type SidebarTab = 'styles' | 'settings' | 'tools'

const activeTab = ref<SidebarTab>('styles')

const getElement = computed(() => {
  return pageBuilderStateStore.getElement
})

const elementTag = computed(() => {
  return getElement.value?.tagName
})

const hasEditableSelection = computed(() => {
  const element = getElement.value
  return Boolean(element && pageBuilderService.isEditableElement(element))
})

const scrollContainer = ref<HTMLElement | null>(null)
let lastScrollTop = 0

watch(
  () => pageBuilderStateStore.getElement,
  (element) => {
    if (element?.tagName === 'IMG') {
      activeTab.value = 'styles'
    }
    nextTick(() => {
      if (scrollContainer.value) {
        scrollContainer.value.scrollTop = lastScrollTop
      }
    })
  },
)

function onScroll() {
  if (scrollContainer.value) {
    lastScrollTop = scrollContainer.value.scrollTop
  }
}

function setActiveTab(tab: SidebarTab) {
  activeTab.value = tab
  nextTick(() => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = 0
      lastScrollTop = 0
    }
  })
}

const showHTMLSettings = ref(false)
const isLoading = ref(false)

const openHTMLSettings = async function () {
  showHTMLSettings.value = true
  isLoading.value = true
  await sleep(200)
  pageBuilderStateStore.setToggleGlobalHtmlMode(true)
  await pageBuilderService.globalPageStyles()
  isLoading.value = false
}

const closeHTMLSettings = async function () {
  isLoading.value = true
  await sleep(200)
  await pageBuilderService.handleManualSave()

  pageBuilderService.stopGlobalStylesSync()

  const pagebuilder = document.querySelector('[data-pagebuilder-content]')
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

    <div class="pbx-px-4 pbx-mb-3">
      <div
        class="pbx-grid pbx-grid-cols-3 pbx-gap-1 pbx-rounded-xl pbx-border pbx-border-solid pbx-border-gray-200 pbx-bg-white pbx-p-1"
        role="tablist"
        :aria-label="translate('Styles')"
      >
        <button
          type="button"
          role="tab"
          :aria-selected="activeTab === 'styles'"
          class="pbx-rounded-lg pbx-py-2 pbx-text-sm pbx-font-medium pbx-transition-colors pbx-border-0 pbx-cursor-pointer"
          :class="
            activeTab === 'styles'
              ? 'pbx-bg-myPrimaryLinkColor pbx-text-white pbx-shadow-sm'
              : 'pbx-bg-transparent pbx-text-myPrimaryDarkGrayColor hover:pbx-bg-gray-50'
          "
          @click="setActiveTab('styles')"
        >
          {{ translate('Styles') }}
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="activeTab === 'settings'"
          class="pbx-rounded-lg pbx-py-2 pbx-text-sm pbx-font-medium pbx-transition-colors pbx-border-0 pbx-cursor-pointer"
          :class="
            activeTab === 'settings'
              ? 'pbx-bg-myPrimaryLinkColor pbx-text-white pbx-shadow-sm'
              : 'pbx-bg-transparent pbx-text-myPrimaryDarkGrayColor hover:pbx-bg-gray-50'
          "
          @click="setActiveTab('settings')"
        >
          {{ translate('Settings') }}
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="activeTab === 'tools'"
          class="pbx-rounded-lg pbx-py-2 pbx-text-sm pbx-font-medium pbx-transition-colors pbx-border-0 pbx-cursor-pointer"
          :class="
            activeTab === 'tools'
              ? 'pbx-bg-myPrimaryLinkColor pbx-text-white pbx-shadow-sm'
              : 'pbx-bg-transparent pbx-text-myPrimaryDarkGrayColor hover:pbx-bg-gray-50'
          "
          @click="setActiveTab('tools')"
        >
          {{ translate('Tools') }}
        </button>
      </div>
    </div>

    <div
      ref="scrollContainer"
      @scroll="onScroll"
      class="pbx-pl-3 pbx-pr-3 pbx-mb-4 pbx-flex-1 pbx-overflow-y-scroll"
    >
      <div v-show="activeTab === 'styles'" class="pbx-flex pbx-flex-col pbx-gap-2">
        <div v-if="hasEditableSelection" class="pbx-flex pbx-flex-col pbx-gap-2">
          <ImageEditor />
          <OpacityEditor />
          <PaddingControl />
          <MarginControl />
          <BorderRadiusControl />
          <BorderControls />
          <ClassEditor />
          <StyleEditor />
        </div>

        <div
          v-else
          class="pbx-rounded-xl pbx-border pbx-border-solid pbx-border-gray-200 pbx-bg-white pbx-px-4 pbx-py-8 pbx-text-center"
        >
          <p class="pbx-myPrimaryParagraph pbx-text-sm pbx-text-gray-500 pbx-my-0">
            {{ translate('No Element selected') }}
          </p>
        </div>
      </div>

      <div v-show="activeTab === 'settings'" class="pbx-flex pbx-flex-col pbx-gap-2">
        <ThemeColorSettingsEditor />
        <PageDesignSettingsEditor @open="openHTMLSettings" />
      </div>

      <div v-show="activeTab === 'tools'" class="pbx-flex pbx-flex-col pbx-gap-2">
        <OverviewSettingsSection />
        <DownloadHtmlSettingsSection />
        <SelectedHtmlSettingsSection />
      </div>
    </div>
  </div>
  <BaseModal
    maxWidth="5xl"
    :showModalBuilder="showHTMLSettings"
    :title="translate('Page Design')"
    @closeMainModalBuilder="closeHTMLSettings"
    minHeight=""
    maxHeight=""
  >
    <PageDesignEditor :isLoading="isLoading" />
  </BaseModal>
</template>
