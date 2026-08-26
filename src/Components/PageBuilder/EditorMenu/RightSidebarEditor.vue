<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { sharedPageBuilderStore } from '../../../stores/shared-store'
import ClassEditor from './Editables/ClassEditor.vue'
import StyleEditor from './Editables/StyleEditor.vue'
import ElementHtmlEditorSettingsEditor from './Editables/ElementHtmlEditorSettingsEditor.vue'
import ImageEditor from './Editables/ImageEditor.vue'
import ProductSectionSettingsEditor from './Editables/ProductSectionSettingsEditor.vue'
import SliderSettingsEditor from './Editables/SliderSettingsEditor.vue'
import OpacityEditor from './Editables/OpacityEditor.vue'
import PaddingControl from './Editables/PaddingControl.vue'
import MarginControl from './Editables/MarginControl.vue'
import BorderRadiusControl from './Editables/BorderRadiusControl.vue'
import BorderControls from './Editables/BorderControls.vue'
import ThemeColorSettingsEditor from './Editables/ThemeColorSettingsEditor.vue'
import PageMetaSettingsEditor from './Editables/PageMetaSettingsEditor.vue'
import SeoCheckSettingsEditor from './Editables/SeoCheckSettingsEditor.vue'
import RemoveAllComponentsSettingsEditor from './Editables/RemoveAllComponentsSettingsEditor.vue'
import PageDesignSettingsEditor from './Editables/PageDesignSettingsEditor.vue'
import PageHtmlEditorSettingsEditor from './Editables/PageHtmlEditorSettingsEditor.vue'
import DownloadHtmlSettingsSection from './Editables/DownloadHtmlSettingsSection.vue'
import DeveloperSettingsSection from './Editables/DeveloperSettingsSection.vue'
import { getPageBuilder } from '../../../composables/usePageBuilder'
import { useTranslations } from '../../../composables/useTranslations'
import { useToast } from '../../../composables/useToast'
import BaseModal from '../../Modals/BaseModal.vue'
import PageDesignEditor from './Editables/PageDesignEditor.vue'
import { sleep } from '../../../utils/sleep'

const { translate } = useTranslations()
const { showToast } = useToast()

const pageBuilderService = getPageBuilder()
const pageBuilderStateStore = sharedPageBuilderStore

defineEmits([
  'closeEditor',
  'open-image-settings',
  'open-product-section-settings',
  'open-slider-settings',
])

type SidebarTab = 'styles' | 'settings' | 'tools' | 'dev'

const activeTab = ref<SidebarTab>('settings')

const getElement = computed(() => {
  return pageBuilderStateStore.getElement
})

const getComponent = computed(() => {
  return pageBuilderStateStore.getComponent
})

const elementTag = computed(() => {
  return getElement.value?.tagName
})

const hasEditableSelection = computed(() => {
  const element = getElement.value
  return Boolean(element && pageBuilderService.isEditableElement(element))
})

const showImageEditor = computed(() => {
  const element = getElement.value
  if (!element) return false
  return element.tagName === 'IMG' || Boolean(pageBuilderStateStore.getBasePrimaryImage)
})

const showProductSectionSettings = computed(() => {
  void getElement.value
  void pageBuilderStateStore.getComponent
  return pageBuilderService.isSelectedProductSection()
})

const showSliderSettings = computed(() => {
  const element = getElement.value
  return !!(element instanceof HTMLElement && element.closest('[data-isl]'))
})

function getElementBreadcrumbLabel(element: HTMLElement, section: HTMLElement | null): string {
  if (section && element === section) return ''

  const tag = element.tagName
  if (tag === 'IMG') return translate('Image')
  if (tag === 'A') return translate('Link')
  if (tag === 'BUTTON') return translate('Button')
  if (tag === 'P') return translate('Paragraph')
  if (tag === 'UL' || tag === 'OL') return translate('List')
  if (tag === 'LI') return translate('List item')
  if (/^H[1-6]$/.test(tag)) return translate('Heading')
  if (tag === 'SPAN') return translate('Text')
  if (tag === 'DIV') return translate('Block')

  return tag.charAt(0) + tag.slice(1).toLowerCase()
}

const selectionBreadcrumb = computed(() => {
  if (!hasEditableSelection.value) return [] as string[]

  const element = getElement.value
  if (!(element instanceof HTMLElement)) return [] as string[]

  const section = pageBuilderService.getSelectedComponentSection()
  const componentTitle =
    section?.getAttribute('data-component-title')?.trim() || getComponent.value?.title?.trim() || ''

  const elementLabel = getElementBreadcrumbLabel(element, section)
  const parts = [componentTitle, elementLabel].filter(Boolean)

  if (parts.length > 0) return parts
  return element.tagName ? [`<${element.tagName.toLowerCase()}>`] : []
})

const scrollContainer = ref<HTMLElement | null>(null)
let lastScrollTop = 0
let previousHadEditableSelection = hasEditableSelection.value

watch(
  hasEditableSelection,
  (hasSelection) => {
    if (hasSelection) {
      activeTab.value = 'styles'
    } else if (previousHadEditableSelection && activeTab.value === 'styles') {
      activeTab.value = 'settings'
    }
    previousHadEditableSelection = hasSelection

    nextTick(() => {
      if (scrollContainer.value) {
        scrollContainer.value.scrollTop = lastScrollTop
      }
    })
  },
  { immediate: true },
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
  try {
    await pageBuilderService.handleManualSave()
    showToast(translate('Page saved successfully'), 'success')
  } catch {
    showToast(translate('Could not save page'), 'error')
  } finally {
    pageBuilderStateStore.setToggleGlobalHtmlMode(false)
  }

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
    <div class="pbx-shrink-0 pbx-bg-myPrimaryLightGrayColor">
      <div
        class="pbx-flex pbx-flex-row pbx-justify-between pbx-pt-7 pbx-pr-4 pbx-pl-4 pbx-items-start pbx-mb-3 pbx-gap-3"
      >
        <button
          type="button"
          @click="$emit('closeEditor')"
          :aria-label="translate('Close properties panel')"
          class="pbx-h-10 pbx-w-10 pbx-shrink-0 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white focus-visible:pbx-ring-0 pbx-text-black"
        >
          <span class="material-symbols-outlined" aria-hidden="true"> close </span>
        </button>
        <div class="pbx-min-w-0 pbx-flex-1 pbx-pt-1.5 pbx-text-right">
          <p class="pbx-m-0 pbx-min-h-5 pbx-font-medium pbx-text-sm pbx-leading-5">
            <template v-if="hasEditableSelection">
              {{ translate('Editing') }}
              <span class="pbx-lowercase">&lt;{{ elementTag }}&gt;</span>
            </template>
            <template v-else>
              {{ translate('Properties') }}
            </template>
          </p>
          <p
            class="pbx-m-0 pbx-mt-1 pbx-flex pbx-min-h-5 pbx-items-center pbx-justify-end pbx-gap-0.5 pbx-overflow-hidden pbx-text-xs pbx-leading-5"
            :class="selectionBreadcrumb.length ? 'pbx-text-gray-500' : 'pbx-invisible'"
            :title="selectionBreadcrumb.length ? selectionBreadcrumb.join(' / ') : undefined"
            :aria-hidden="selectionBreadcrumb.length ? undefined : 'true'"
          >
            <template v-if="selectionBreadcrumb.length">
              <template v-for="(part, index) in selectionBreadcrumb" :key="`${part}-${index}`">
                <span
                  v-if="index > 0"
                  class="material-symbols-outlined pbx-inline-flex pbx-shrink-0 pbx-items-center pbx-justify-center pbx-text-[14px] pbx-leading-none pbx-text-gray-400"
                  aria-hidden="true"
                >
                  arrow_forward
                </span>
                <span
                  class="pbx-min-w-0"
                  :class="index < selectionBreadcrumb.length - 1 ? 'pbx-truncate' : 'pbx-shrink-0'"
                  >{{ part }}</span
                >
              </template>
            </template>
            <span v-else aria-hidden="true">&nbsp;</span>
          </p>
        </div>
      </div>

      <div class="pbx-px-4 pbx-pb-3">
        <div
          class="pbx-grid pbx-grid-cols-4 pbx-gap-2 pbx-rounded-xl pbx-border pbx-border-solid pbx-border-gray-200 pbx-bg-white pbx-p-1"
          role="tablist"
          :aria-label="translate('Properties panel')"
        >
          <button
            type="button"
            role="tab"
            :aria-selected="activeTab === 'styles'"
            :title="translate('Styles')"
            class="pbx-min-w-0 pbx-rounded-lg pbx-px-1 pbx-py-2 pbx-text-sm pbx-font-medium pbx-transition-colors pbx-border-0 pbx-cursor-pointer pbx-font-sans pbx-truncate"
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
            :title="translate('Settings')"
            class="pbx-min-w-0 pbx-rounded-lg pbx-px-1 pbx-py-2 pbx-text-sm pbx-font-medium pbx-transition-colors pbx-border-0 pbx-cursor-pointer pbx-font-sans pbx-truncate"
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
            :title="translate('Tools')"
            class="pbx-min-w-0 pbx-rounded-lg pbx-px-1 pbx-py-2 pbx-text-sm pbx-font-medium pbx-transition-colors pbx-border-0 pbx-cursor-pointer pbx-font-sans pbx-truncate"
            :class="
              activeTab === 'tools'
                ? 'pbx-bg-myPrimaryLinkColor pbx-text-white pbx-shadow-sm'
                : 'pbx-bg-transparent pbx-text-myPrimaryDarkGrayColor hover:pbx-bg-gray-50'
            "
            @click="setActiveTab('tools')"
          >
            {{ translate('Tools') }}
          </button>
          <button
            type="button"
            role="tab"
            :aria-selected="activeTab === 'dev'"
            :title="translate('Developer')"
            :aria-label="translate('Developer')"
            class="pbx-min-w-0 pbx-rounded-lg pbx-px-1 pbx-py-2 pbx-text-sm pbx-font-medium pbx-transition-colors pbx-border-0 pbx-cursor-pointer pbx-font-sans pbx-truncate"
            :class="
              activeTab === 'dev'
                ? 'pbx-bg-myPrimaryLinkColor pbx-text-white pbx-shadow-sm'
                : 'pbx-bg-transparent pbx-text-myPrimaryDarkGrayColor hover:pbx-bg-gray-50'
            "
            @click="setActiveTab('dev')"
          >
            {{ translate('Dev') }}
          </button>
        </div>
      </div>
    </div>

    <div
      ref="scrollContainer"
      @scroll="onScroll"
      class="pbx-min-h-0 pbx-flex-1 pbx-overflow-y-auto pbx-pl-3 pbx-pr-3 pbx-pb-4"
    >
      <div v-show="activeTab === 'styles'" class="pbx-flex pbx-flex-col pbx-gap-2">
        <div v-show="hasEditableSelection" class="pbx-flex pbx-flex-col pbx-gap-2">
          <SliderSettingsEditor v-if="showSliderSettings" @open="$emit('open-slider-settings')" />
          <ImageEditor v-if="showImageEditor" @open="$emit('open-image-settings')" />
          <ProductSectionSettingsEditor
            v-if="showProductSectionSettings"
            @open="$emit('open-product-section-settings')"
          />
          <OpacityEditor />
          <PaddingControl />
          <MarginControl />
          <BorderRadiusControl />
          <BorderControls />
          <ClassEditor />
          <StyleEditor />
          <ElementHtmlEditorSettingsEditor />
        </div>

        <div
          v-show="!hasEditableSelection"
          class="pbx-rounded-xl pbx-border pbx-border-solid pbx-border-gray-200 pbx-bg-white pbx-px-4 pbx-py-8 pbx-text-center"
        >
          <p class="pbx-myPrimaryParagraph pbx-text-sm pbx-text-gray-500 pbx-my-0">
            {{ translate('No Element selected') }}
          </p>
        </div>
      </div>

      <div v-show="activeTab === 'settings'" class="pbx-flex pbx-flex-col pbx-gap-2">
        <PageDesignSettingsEditor @open="openHTMLSettings" />
        <ThemeColorSettingsEditor />
        <PageMetaSettingsEditor />
        <SeoCheckSettingsEditor />
        <PageHtmlEditorSettingsEditor />
        <RemoveAllComponentsSettingsEditor />
      </div>

      <div v-show="activeTab === 'tools'" class="pbx-flex pbx-flex-col pbx-gap-2">
        <DownloadHtmlSettingsSection />
      </div>

      <div v-show="activeTab === 'dev'" class="pbx-flex pbx-flex-col pbx-gap-2">
        <DeveloperSettingsSection />
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
