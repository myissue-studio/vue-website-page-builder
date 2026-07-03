<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import { getPageBuilder } from '../../../../composables/usePageBuilder'
import { useTranslations } from '../../../../composables/useTranslations'
import { sleep } from '@/utils/sleep'

const props = defineProps<{
  show: boolean
}>()

const { translate } = useTranslations()
const pageBuilderService = getPageBuilder()
const pageBuilderStateStore = sharedPageBuilderStore

const settingsTick = ref(0)
const imageAltText = ref('')
const savedAltText = ref('')
const isSavingAlt = ref(false)

const POSITION_GRID: string[][] = [
  ['pbx-object-top-left', 'pbx-object-top', 'pbx-object-top-right'],
  ['pbx-object-left', 'pbx-object-center', 'pbx-object-right'],
  ['pbx-object-bottom-left', 'pbx-object-bottom', 'pbx-object-bottom-right'],
]

const selectedObjectFit = computed(() => {
  void settingsTick.value
  const val = pageBuilderStateStore.getImageObjectFit
  if (!val || val === 'none') return null
  return val
})

const selectedObjectPosition = computed(() => {
  void settingsTick.value
  const val = pageBuilderStateStore.getImageObjectPosition
  if (!val || val === 'none') return 'pbx-object-center'
  return val
})

const selectedAspectRatio = computed(() => {
  void settingsTick.value
  const val = pageBuilderStateStore.getImageAspectRatio
  if (!val || val === 'none') return 'none'
  return val
})

const altTextDirty = computed(() => imageAltText.value.trim() !== savedAltText.value.trim())

function loadAltTextFromSelection() {
  const alt = pageBuilderService.getSelectedImageAltText()
  imageAltText.value = alt
  savedAltText.value = alt
}

watch(
  () => props.show,
  async (open) => {
    if (!open) return
    loadAltTextFromSelection()
    await pageBuilderService.initializeElementStyles()
    loadAltTextFromSelection()
    settingsTick.value++
  },
  { immediate: true },
)

async function refreshAfterChange() {
  settingsTick.value++
  await pageBuilderService.handleAutoSave()
}

async function setObjectFit(fitClass: string) {
  pageBuilderService.handleImageObjectFit(fitClass)
  await refreshAfterChange()
}

async function setObjectPosition(positionClass: string) {
  pageBuilderService.handleImageObjectPosition(positionClass)
  await refreshAfterChange()
}

async function setAspectRatio(aspectClass: string) {
  pageBuilderService.handleImageAspectRatio(aspectClass)
  await refreshAfterChange()
}

async function saveAltText() {
  if (!altTextDirty.value || isSavingAlt.value) return
  isSavingAlt.value = true
  await sleep(400)
  try {
    await pageBuilderService.handleImageAltText(imageAltText.value)
    savedAltText.value = imageAltText.value.trim()
    settingsTick.value++
  } finally {
    isSavingAlt.value = false
  }
}

const aspectPresets = [
  { id: 'none', labelKey: 'Auto' },
  { id: 'pbx-aspect-square', labelKey: 'Square' },
  { id: 'pbx-aspect-video', labelKey: 'Landscape 16:9' },
  { id: 'pbx-aspect-[9/16]', labelKey: 'Portrait 9:16' },
] as const
</script>

<template>
  <div class="pbx-flex pbx-flex-col pbx-gap-4 pbx-pt-1 pbx-pb-2" @mousedown.stop @click.stop>
    <!-- Object fit -->
    <div>
      <p class="pbx-text-sm pbx-font-semibold pbx-text-myPrimaryDarkGrayColor pbx-mb-2">
        {{ translate('Image fit') }}
      </p>
      <div class="pbx-flex pbx-gap-2">
        <button
          type="button"
          class="pbx-flex-1 pbx-rounded-xl pbx-border pbx-border-solid pbx-px-4 pbx-py-3 pbx-text-sm pbx-font-medium pbx-cursor-pointer pbx-transition-colors"
          :class="
            selectedObjectFit === 'pbx-object-cover'
              ? 'pbx-border-myPrimaryLinkColor pbx-bg-green-50 pbx-text-myPrimaryLinkColor'
              : 'pbx-border-gray-200 pbx-bg-white pbx-text-gray-700 hover:pbx-border-gray-300'
          "
          @click="setObjectFit('pbx-object-cover')"
        >
          {{ translate('Cover') }}
        </button>
        <button
          type="button"
          class="pbx-flex-1 pbx-rounded-xl pbx-border pbx-border-solid pbx-px-4 pbx-py-3 pbx-text-sm pbx-font-medium pbx-cursor-pointer pbx-transition-colors"
          :class="
            selectedObjectFit === 'pbx-object-contain'
              ? 'pbx-border-myPrimaryLinkColor pbx-bg-green-50 pbx-text-myPrimaryLinkColor'
              : 'pbx-border-gray-200 pbx-bg-white pbx-text-gray-700 hover:pbx-border-gray-300'
          "
          @click="setObjectFit('pbx-object-contain')"
        >
          {{ translate('Contain') }}
        </button>
      </div>
      <p class="pbx-text-xs pbx-text-gray-500 pbx-mt-2 pbx-mb-0">
        {{ translate('Cover fills the frame and may crop. Contain shows the full image.') }}
      </p>
    </div>

    <!-- Object position -->
    <div>
      <p class="pbx-text-sm pbx-font-semibold pbx-text-myPrimaryDarkGrayColor pbx-mb-2">
        {{ translate('Crop focus') }}
      </p>
      <div class="pbx-flex pbx-items-center pbx-justify-center">
        <div
          class="pbx-inline-grid pbx-gap-1 pbx-py-8 pbx-px-2 pbx-rounded-xl pbx-border pbx-border-solid pbx-border-gray-200 pbx-bg-gray-50 pbx-w-full pbx-justify-center"
          style="grid-template-columns: repeat(3, 2.5rem)"
        >
          <button
            v-for="positionClass in POSITION_GRID.flat()"
            :key="positionClass"
            type="button"
            class="pbx-w-10 pbx-h-10 pbx-rounded-lg pbx-border pbx-border-solid pbx-flex pbx-items-center pbx-justify-center pbx-cursor-pointer pbx-text-xs pbx-transition-colors"
            :class="
              selectedObjectPosition === positionClass
                ? 'pbx-border-myPrimaryLinkColor pbx-bg-myPrimaryLinkColor pbx-text-white'
                : 'pbx-border-gray-200 pbx-bg-white pbx-text-gray-500 hover:pbx-border-gray-300'
            "
            :title="positionClass.replace('pbx-object-', '')"
            @click="setObjectPosition(positionClass)"
          >
            <span class="material-symbols-outlined pbx-text-base">crop_free</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Aspect ratio -->
    <div>
      <p class="pbx-text-sm pbx-font-semibold pbx-text-myPrimaryDarkGrayColor pbx-mb-2">
        {{ translate('Shape') }}
      </p>
      <div class="pbx-grid pbx-grid-cols-2 pbx-gap-2">
        <button
          v-for="preset in aspectPresets"
          :key="preset.id"
          type="button"
          class="pbx-rounded-xl pbx-border pbx-border-solid pbx-px-3 pbx-py-2.5 pbx-text-sm pbx-font-medium pbx-cursor-pointer pbx-transition-colors"
          :class="
            selectedAspectRatio === preset.id
              ? 'pbx-border-myPrimaryLinkColor pbx-bg-green-50 pbx-text-myPrimaryLinkColor'
              : 'pbx-border-gray-200 pbx-bg-white pbx-text-gray-700 hover:pbx-border-gray-300'
          "
          @click="setAspectRatio(preset.id)"
        >
          {{ translate(preset.labelKey) }}
        </button>
      </div>
    </div>

    <!-- Alt text -->
    <div>
      <label
        for="image-alt-text"
        class="pbx-text-sm pbx-font-semibold pbx-text-myPrimaryDarkGrayColor pbx-mb-2 pbx-block"
      >
        {{ translate('Alt text') }}
      </label>
      <div
        class="pbx-flex pbx-justify-between pbx-items-center pbx-gap-4 pbx-border pbx-border-gray-200 pbx-py-4 pbx-px-3 pbx-rounded-lg"
      >
        <input
          id="image-alt-text"
          v-model="imageAltText"
          type="text"
          class="pbx-myPrimaryInput pbx-flex-1 pbx-min-w-0"
          :placeholder="translate('Describe this image for accessibility')"
          @keydown.enter.prevent="saveAltText"
        />
        <button
          type="button"
          class="pbx-h-10 pbx-w-10 pbx-shrink-0 pbx-rounded-xl pbx-border pbx-border-solid pbx-flex pbx-items-center pbx-justify-center pbx-cursor-pointer pbx-transition-colors"
          :class="
            altTextDirty
              ? 'pbx-border-myPrimaryLinkColor pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-opacity-90'
              : 'pbx-border-gray-200 pbx-bg-gray-100 pbx-text-gray-400 pbx-cursor-not-allowed'
          "
          :disabled="!altTextDirty || isSavingAlt"
          :title="translate('Save')"
          @click="saveAltText"
        >
          <span v-if="!isSavingAlt" class="material-symbols-outlined pbx-text-xl">check</span>
          <span v-if="isSavingAlt" class="material-symbols-outlined pbx-animate-spin">refresh</span>
        </button>
      </div>
      <p class="pbx-text-xs pbx-text-gray-500 pbx-mt-2 pbx-mb-0">
        {{ translate('Helps screen readers and SEO understand the image content.') }}
      </p>
    </div>
  </div>
</template>
