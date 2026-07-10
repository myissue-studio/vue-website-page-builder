<script setup lang="ts">
import { computed } from 'vue'
import { sharedPageBuilderStore } from '../../../stores/shared-store'
import GlobalLoader from '../../../Components/Loaders/GlobalLoader.vue'
import { getPageBuilder } from '../../../composables/usePageBuilder'
import { useTranslations } from '../../../composables/useTranslations'

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

defineExpose({ handleUndo, handleRedo, canUndo, canRedo })
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

    <div
      class="pbx-text-xs pbx-text-gray-600 pbx-mx-2 pbx-py-3 pbx-px-2 pbx-border-solid pbx-border pbx-border-gray-200 pbx-rounded-full"
      aria-live="polite"
      :aria-label="`${historyIndex + 1} ${translate('of')} ${historyLength}`"
    >
      {{ historyIndex + 1 }}/{{ historyLength }}
    </div>

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
