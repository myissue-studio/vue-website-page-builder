<script setup lang="ts">
import { computed } from 'vue'
import BaseModal from '../../../Modals/BaseModal.vue'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import { useThemeColorPresets } from '../../../../composables/useThemeColorPresets'
import { useTranslations } from '../../../../composables/useTranslations'
import { useToast } from '../../../../composables/useToast'
import type { ThemeColorPresetId } from '../../../../types'

const props = defineProps<{
  show: boolean
  color: string
}>()

const emit = defineEmits<{
  close: []
  saved: [id: ThemeColorPresetId]
}>()

const { translate } = useTranslations()
const { showToast } = useToast()
const getPageBuilderConfig = computed(() => sharedPageBuilderStore.getPageBuilderConfig)
const { themeColorPresetSettings, updateThemeColorPreset } =
  useThemeColorPresets(getPageBuilderConfig)

function saveToPreset(id: ThemeColorPresetId): void {
  const preset = themeColorPresetSettings.value.colors.find((item) => item.id === id)
  updateThemeColorPreset(id, { color: props.color, enabled: true })
  showToast(`${translate('Color saved to')} ${translate(preset?.label ?? id)}`, 'success')
  emit('saved', id)
  emit('close')
}
</script>

<template>
  <BaseModal
    :showModalBuilder="show"
    :title="translate('Save color to theme')"
    maxWidth="md"
    :z-index="10004"
    @closeMainModalBuilder="$emit('close')"
  >
    <div class="pbx-min-h-[45rem]">
      <p class="pbx-myPrimaryParagraph pbx-mt-0">
        {{
          translate(
            'Choose a theme preset to save this color. This will replace the current color.',
          )
        }}
      </p>

      <div
        class="pbx-flex pbx-items-center pbx-gap-3 pbx-mb-4 pbx-rounded-lg pbx-border pbx-border-solid pbx-border-gray-200 pbx-bg-gray-50 pbx-px-4 pbx-py-3"
      >
        <span
          class="pbx-h-8 pbx-w-8 pbx-shrink-0 pbx-rounded-full pbx-border pbx-border-solid pbx-border-gray-200"
          :style="{ backgroundColor: color }"
        ></span>
        <span class="pbx-font-mono pbx-text-sm pbx-text-myPrimaryDarkGrayColor">{{ color }}</span>
      </div>

      <div class="pbx-grid pbx-grid-cols-1 pbx-gap-2">
        <button
          v-for="preset in themeColorPresetSettings.colors"
          :key="preset.id"
          type="button"
          class="pbx-flex pbx-w-full pbx-items-center pbx-justify-between pbx-gap-3 pbx-rounded-lg pbx-border pbx-border-solid pbx-border-gray-200 pbx-bg-white pbx-px-4 pbx-py-3 pbx-text-left pbx-transition-colors hover:pbx-border-myPrimaryLinkColor hover:pbx-bg-gray-50"
          @click="saveToPreset(preset.id)"
        >
          <div class="pbx-flex pbx-min-w-0 pbx-items-center pbx-gap-3">
            <span
              class="pbx-h-6 pbx-w-6 pbx-shrink-0 pbx-rounded-full pbx-border pbx-border-solid pbx-border-gray-200"
              :style="{ backgroundColor: preset.color }"
            ></span>
            <span class="pbx-text-sm pbx-font-medium pbx-text-myPrimaryDarkGrayColor">
              {{ translate(preset.label) }}
            </span>
          </div>
          <span class="pbx-font-mono pbx-text-xs pbx-text-gray-400">{{ preset.color }}</span>
        </button>
      </div>
    </div>
  </BaseModal>
</template>
