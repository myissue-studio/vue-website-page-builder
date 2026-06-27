<script setup lang="ts">
import { computed } from 'vue'
import ToggleInput from '../../../Inputs/ToggleInput.vue'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import { useThemeColorPresets } from '../../../../composables/useThemeColorPresets'
import { useTranslations } from '../../../../composables/useTranslations'
import type { ThemeColorPreset, ThemeColorPresetId } from '../../../../types'

const { translate } = useTranslations()
const pageBuilderStateStore = sharedPageBuilderStore
const getPageBuilderConfig = computed(() => pageBuilderStateStore.getPageBuilderConfig)

const { themeColorPresetSettings, setThemeColorPresetsEnabled, updateThemeColorPreset } =
  useThemeColorPresets(getPageBuilderConfig)

function updatePresetEnabled(id: ThemeColorPresetId, enabled: boolean): void {
  updateThemeColorPreset(id, { enabled })
}

function updatePresetColor(preset: ThemeColorPreset, color: string): void {
  updateThemeColorPreset(preset.id, { color })
}

function updatePresetColorFromEvent(preset: ThemeColorPreset, event: Event): void {
  const input = event.target
  if (!(input instanceof HTMLInputElement)) return

  updatePresetColor(preset, input.value)
}
</script>

<template>
  <div class="pbx-flex pbx-flex-col pbx-gap-4 pbx-mb-20">
    <div
      class="pbx-flex pbx-items-center pbx-justify-between pbx-gap-4 pbx-rounded-lg pbx-border pbx-border-solid pbx-border-gray-100 pbx-bg-gray-50 pbx-px-4 pbx-py-3"
    >
      <div>
        <p class="pbx-text-sm pbx-font-semibold pbx-text-myPrimaryDarkGrayColor pbx-my-0">
          {{ translate('Enable theme color presets') }}
        </p>
        <p class="pbx-text-xs pbx-text-gray-500 pbx-my-0">
          {{ translate('Use saved hex colors in text and background color menus') }}
        </p>
      </div>
      <ToggleInput
        :model-value="themeColorPresetSettings.enabled"
        @update:model-value="setThemeColorPresetsEnabled"
      />
    </div>

    <div class="pbx-grid pbx-grid-cols-1 pbx-gap-3">
      <div v-for="preset in themeColorPresetSettings.colors" :key="preset.id">
        <label
          :for="`color-input-${preset.id}`"
          class="pbx-text-xs pbx-font-semibold pbx-text-gray-500"
        >
          {{ translate(preset.label) }}
        </label>
        <div
          class="pbx-flex pbx-justify-between pbx-items-center pbx-gap-10 pbx-border pbx-border-gray-200 pbx-py-4 pbx-px-2 pbx-rounded-lg"
        >
          <ToggleInput
            :model-value="preset.enabled"
            @update:model-value="(enabled) => updatePresetEnabled(preset.id, enabled)"
          />

          <input
            :id="`color-input-${preset.id}`"
            :value="preset.color"
            type="text"
            maxlength="7"
            class="pbx-myPrimaryInput pbx-w-full"
            @input="(event) => updatePresetColorFromEvent(preset, event)"
          />
          <div id="ColorInput">
            <input
              :value="preset.color"
              type="color"
              class="pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-p-2 pbx-rounded-full pbx-bg-gray-50"
              @input="(event) => updatePresetColorFromEvent(preset, event)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
