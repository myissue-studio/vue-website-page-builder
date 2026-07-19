<script setup lang="ts">
import { computed } from 'vue'
import { sharedPageBuilderStore } from '../../../stores/shared-store'
import GlobalLoader from '../../../Components/Loaders/GlobalLoader.vue'
import { getPageBuilder } from '../../../composables/usePageBuilder'
import { useTranslations } from '../../../composables/useTranslations'
import CustomDropdown from '../../Inputs/CustomDropdown.vue'
import {
  buildHistoryHint,
  buildHistoryHintParts,
  getHistoryPageTitle,
  type HistorySnapshotLike,
} from '../../../utils/builder/history-snapshot-summary'
import SliderIcon from '@/Components/Icons/SliderIcon.vue'

interface HistoryDropdownOption {
  value: string
  label: string
  title: string
  pageTitle: string
  hintMeta: string
  hintChange: string
  hintPreview: string
  position: string
}

const pageBuilderService = getPageBuilder()
const { translate } = useTranslations()

const emit = defineEmits(['toolbar-hide-request'])

const pageBuilderStateStore = sharedPageBuilderStore

const getIsLoadingGlobal = computed(() => {
  return pageBuilderStateStore.getIsLoadingGlobal
})

const historyIndex = computed(() => pageBuilderStateStore.getHistoryIndex)
const historyLength = computed(() => pageBuilderStateStore.getHistoryLength)

const canUndo = computed(() => historyIndex.value > 0)
const canRedo = computed(() => historyIndex.value < historyLength.value - 1)
const selectedHistoryValue = computed(() => String(historyIndex.value))
const historyButtonClass = computed(() =>
  [
    'pbx-history-trigger pbx-h-8 pbx-min-w-8 pbx-px-2.5 pbx-rounded-full pbx-flex pbx-items-center pbx-justify-center pbx-gap-0.5 pbx-border pbx-border-gray-200 pbx-bg-white pbx-text-gray-700 focus-visible:pbx-ring-0',
    historyLength.value >= 1
      ? 'pbx-cursor-pointer hover:pbx-bg-gray-50'
      : 'pbx-cursor-default pbx-bg-gray-50 pbx-opacity-70',
  ].join(' '),
)

const historyOptions = computed((): HistoryDropdownOption[] => {
  const snapshots = pageBuilderService
    .getHistorySnapshots()
    .slice(0, historyLength.value) as HistorySnapshotLike[]

  return snapshots
    .map((snapshot, index) => {
      const previous = index > 0 ? snapshots[index - 1] : null
      const isCurrent = index === historyIndex.value
      const isOldest = index === 0
      const title = isCurrent
        ? translate('Current version')
        : isOldest
          ? translate('Oldest saved')
          : translate('Saved')
      const pageTitle = getHistoryPageTitle(snapshot)
      const hintParts = buildHistoryHintParts(snapshot, previous, translate)
      const hint = buildHistoryHint(snapshot, previous, translate)
      const position = `${index + 1}/${historyLength.value}`

      return {
        value: String(index),
        label: pageTitle ? `${title} · ${pageTitle} · ${hint}` : `${title} · ${hint}`,
        title,
        pageTitle,
        hintMeta: hintParts.meta,
        hintChange: hintParts.change,
        hintPreview: hintParts.preview,
        position,
      }
    })
    .reverse()
})

const handleUndo = async function () {
  if (!canUndo.value) return
  emit('toolbar-hide-request')
  await pageBuilderService.undo()
  await pageBuilderService.clearHtmlSelection()
}

const handleRedo = async function () {
  if (!canRedo.value) return
  emit('toolbar-hide-request')
  await pageBuilderService.redo()
  await pageBuilderService.clearHtmlSelection()
}

const handleHistorySelect = async function (value: string) {
  const nextIndex = Number(value)
  if (!Number.isInteger(nextIndex) || nextIndex === historyIndex.value) return
  emit('toolbar-hide-request')
  await pageBuilderService.restoreHistoryIndex(nextIndex)
  await pageBuilderService.clearHtmlSelection()
}

defineExpose({ handleUndo, handleRedo, canUndo, canRedo, handleHistorySelect })
</script>

<template>
  <GlobalLoader v-if="getIsLoadingGlobal"></GlobalLoader>
  <div
    class="pbx-flex-1 pbx-flex pbx-justify-center pbx-items-center pbx-py-2 pbx-w-full pbx-gap-1"
  >
    <button
      type="button"
      :disabled="!canUndo"
      :aria-label="translate('Undo')"
      :title="translate('Undo')"
      @click="handleUndo"
      class="pbx-h-8 pbx-w-8 pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square pbx-text-black hover:pbx-text-white"
      :class="[
        canUndo
          ? 'pbx-cursor-pointer hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0'
          : 'pbx-cursor-not-allowed pbx-bg-opacity-20 hover:pbx-bg-gray-200',
      ]"
    >
      <span class="material-symbols-outlined" aria-hidden="true"> undo </span>
    </button>

    <CustomDropdown
      :model-value="selectedHistoryValue"
      :options="historyOptions"
      :button-class="historyButtonClass"
      menu-class="pbx-history-dropdown-menu pbx-custom-dropdown__menu--quiet"
      menu-item-class="pbx-history-dropdown-item"
      :disabled="historyLength < 1"
      :aria-label="translate('Open history')"
      :title="translate('Open history')"
      @select="handleHistorySelect"
    >
      <template #button>
        <span class="pbx-history-trigger-content" aria-live="polite">
          <span class="pbx-sr-only">
            {{ translate('Open history') }}
            {{ historyIndex + 1 }}/{{ historyLength }}
          </span>
          <span v-if="historyLength >= 1" class="pbx-text-[10px] pbx-text-gray-600" n="true">
            {{ historyLength }}
          </span>
          <div
            v-if="historyLength >= 1"
            class="pbx-h-4 pbx-border-l pbx-border-gray-300 pbx-mx-1"
          ></div>
          <SliderIcon size="12" />
        </span>
      </template>

      <template #option="{ option, selected }">
        <span
          class="pbx-pageDesignOpenButton pbx-history-version-row"
          :class="{ 'pbx-history-version-row--selected': selected }"
        >
          <span class="pbx-pageDesignOpenButtonIcon">
            <span class="material-symbols-outlined" aria-hidden="true">
              {{ selected ? 'check' : 'history' }}
            </span>
          </span>
          <span class="pbx-pageDesignOpenButtonText">
            <span class="pbx-pageDesignOpenButtonLabel">
              {{ option.title }}
            </span>
            <span v-if="option.pageTitle" class="pbx-history-version-page-title">
              {{ option.pageTitle }}
            </span>
            <span class="pbx-pageDesignOpenButtonHint pbx-history-version-hint">
              <span class="pbx-history-version-hint-meta">{{ option.hintMeta }}</span>
              <span v-if="option.hintChange" class="pbx-history-version-hint-change">
                {{ option.hintChange }}
              </span>
              <span v-if="option.hintPreview" class="pbx-history-version-hint-preview">
                “{{ option.hintPreview }}”
              </span>
            </span>
          </span>
          <span class="pbx-history-version-position" aria-hidden="true">
            {{ option.position }}
          </span>
          <span class="pbx-pageDesignOpenButtonArrow material-symbols-outlined" aria-hidden="true">
            arrow_forward
          </span>
        </span>
      </template>
    </CustomDropdown>

    <button
      type="button"
      :disabled="!canRedo"
      :aria-label="translate('Redo')"
      :title="translate('Redo')"
      @click="handleRedo"
      class="pbx-h-8 pbx-w-8 pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square pbx-text-black hover:pbx-text-white"
      :class="[
        canRedo
          ? 'pbx-cursor-pointer hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0'
          : 'pbx-cursor-not-allowed pbx-bg-opacity-20 hover:pbx-bg-gray-200',
      ]"
    >
      <span class="material-symbols-outlined" aria-hidden="true"> redo </span>
    </button>
  </div>
</template>

<style scoped>
.pbx-history-trigger-content {
  display: inline-flex;
  align-items: center;
  gap: 0.125rem;
  line-height: 1;
}

.pbx-history-trigger-count {
  min-width: 1rem;
  padding: 0 0.25rem;
  border-radius: 9999px;
  color: rgb(55 65 81);
  font-size: 0.625rem;
  font-weight: 600;
  line-height: 1rem;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.pbx-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

:deep(.pbx-history-dropdown-menu) {
  /* Center under the small trigger so a wide panel does not spill off-screen left. */
  left: 50%;
  right: auto;
  width: min(22rem, calc(100vw - 1.5rem));
  min-width: 0;
  max-width: min(22rem, calc(100vw - 1.5rem));
  max-height: 28rem;
  transform: translateX(-50%);
  padding: 0.375rem;
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

:deep(.pbx-history-dropdown-item:hover:not(:disabled) .pbx-history-version-row) {
  background-color: rgb(249 250 251);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

:deep(.pbx-history-version-row) {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  pointer-events: none;
}

:deep(.pbx-history-version-row--selected) {
  border-color: rgb(209 213 219);
  background-color: rgb(249 250 251);
}

:deep(.pbx-history-version-row .pbx-pageDesignOpenButtonLabel) {
  color: rgb(31 41 55);
}

:deep(.pbx-history-version-page-title) {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 500;
  color: rgb(55 65 81);
}

:deep(.pbx-history-version-row .pbx-pageDesignOpenButtonHint),
:deep(.pbx-history-version-position),
:deep(.pbx-history-version-row .pbx-pageDesignOpenButtonArrow) {
  color: rgb(107 114 128);
}

:deep(.pbx-history-version-row .pbx-pageDesignOpenButtonHint) {
  white-space: normal;
  overflow-wrap: anywhere;
}

:deep(.pbx-history-version-hint) {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.125rem;
}

:deep(.pbx-history-version-hint-change) {
  line-height: 1.35;
  letter-spacing: 0.01em;
}

:deep(.pbx-history-version-hint-preview) {
  font-style: italic;
  color: rgb(156 163 175);
}

:deep(.pbx-history-version-row .pbx-pageDesignOpenButtonIcon) {
  color: rgb(55 65 81);
  background-color: rgb(243 244 246);
}

:deep(.pbx-history-version-position) {
  flex-shrink: 0;
  font-size: 0.75rem;
  line-height: 1rem;
}
</style>
