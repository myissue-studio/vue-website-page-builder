<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import ToggleInput from '../../../Inputs/ToggleInput.vue'
import DynamicModalBuilder from '../../../Modals/DynamicModalBuilder.vue'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import { useThemeColorPresets } from '../../../../composables/useThemeColorPresets'
import { useTranslations } from '../../../../composables/useTranslations'
import type { ThemeColorPreset, ThemeColorPresetId } from '../../../../types'

const { translate } = useTranslations()
const pageBuilderStateStore = sharedPageBuilderStore
const getPageBuilderConfig = computed(() => pageBuilderStateStore.getPageBuilderConfig)

const {
  themeColorPresetSettings,
  setThemeColorPresetsEnabled,
  updateThemeColorPreset,
  resetToConfigDefaults,
} = useThemeColorPresets(getPageBuilderConfig)

// Local hex text per preset — decouples the text field from the store so the
// user can freely type or paste without Vue re-renders resetting the field.
const editingHex = ref<Record<string, string>>({})

function localHex(preset: ThemeColorPreset): string {
  return editingHex.value[preset.id] ?? preset.color
}

// Keep the local text in sync when the colour picker (or any external update)
// changes the stored colour, but only when the field is not currently focused.
watch(
  () => themeColorPresetSettings.value.colors,
  (colors) => {
    colors.forEach((preset) => {
      const activeId = (document.activeElement as HTMLInputElement | null)?.id
      if (activeId !== `color-input-${preset.id}`) {
        editingHex.value[preset.id] = preset.color
      }
    })
  },
  { deep: true },
)

const HEX_RE = /^#?[0-9a-fA-F]{6}$/

function onHexInput(preset: ThemeColorPreset, event: Event): void {
  const input = event.target as HTMLInputElement
  const raw = input.value.trim()
  // Always store what the user typed so Vue won't reset the field mid-edit.
  editingHex.value[preset.id] = input.value
  // Only push to the store when the value is a complete, valid hex.
  if (HEX_RE.test(raw)) {
    updateThemeColorPreset(preset.id, { color: raw })
  }
}

function onHexBlur(preset: ThemeColorPreset): void {
  // On blur, snap the field back to the stored (normalised) colour.
  editingHex.value[preset.id] = preset.color
}

function updatePresetEnabled(id: ThemeColorPresetId, enabled: boolean): void {
  updateThemeColorPreset(id, { enabled })
}

function updatePresetColorFromEvent(preset: ThemeColorPreset, event: Event): void {
  const input = event.target
  if (!(input instanceof HTMLInputElement)) return
  updateThemeColorPreset(preset.id, { color: input.value })
}

// ---------------------------------------------------------------------------
// Reset to provided defaults — confirmation modal
// ---------------------------------------------------------------------------
const showResetModal = ref(false)

function openResetModal(): void {
  showResetModal.value = true
}

function closeResetModal(): void {
  showResetModal.value = false
}

function confirmReset(): void {
  resetToConfigDefaults()
  // Clear local editing state so fields immediately show the restored values.
  editingHex.value = {}
  showResetModal.value = false
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
      <div
        v-for="preset in themeColorPresetSettings.colors"
        :key="preset.id"
        class="pbx-myInputGroup"
      >
        <label :for="`color-input-${preset.id}`" class="pbx-myPrimaryInputLabel">
          {{ translate(preset.label) }}
        </label>
        <div
          class="pbx-flex pbx-justify-between pbx-items-center pbx-gap-4 pbx-border pbx-border-gray-200 pbx-py-4 pbx-px-3 pbx-rounded-lg"
        >
          <ToggleInput
            :model-value="preset.enabled"
            @update:model-value="(enabled) => updatePresetEnabled(preset.id, enabled)"
          />

          <input
            :id="`color-input-${preset.id}`"
            :value="localHex(preset)"
            type="text"
            maxlength="7"
            placeholder="#rrggbb"
            class="pbx-myPrimaryInput pbx-w-full"
            @input="(event) => onHexInput(preset, event)"
            @blur="onHexBlur(preset)"
          />

          <!-- Custom color swatch — the native picker is invisible but fully covers the swatch -->
          <div class="pbx-flex pbx-items-center pbx-gap-2">
            <label class="pbx-myPrimaryInputLabel pbx-m-0 pbx-p-0" :for="'color-' + preset.id">
              Color
            </label>
            <div
              class="pbx-flex pbx-items-center pbx-justify-center"
              style="position: relative; flex-shrink: 0; width: 2.5rem; height: 2.5rem"
            >
              <div
                :style="{ backgroundColor: preset.color }"
                style="
                  width: 50%;
                  height: 50%;
                  border-radius: 9999px;
                  border: 2px solid #d1d5db;
                  box-shadow:
                    0 1px 3px rgba(0, 0, 0, 0.12),
                    inset 0 0 0 1px rgba(255, 255, 255, 0.15);
                  transition: border-color 0.15s;
                "
              ></div>
              <input
                :id="'color-' + preset.id"
                :value="preset.color"
                type="color"
                style="
                  position: absolute;
                  inset: 0;
                  opacity: 0;
                  width: 50%;
                  height: 50%;
                  cursor: pointer;
                  padding: 0;
                  border: 0;
                "
                @input="(event) => updatePresetColorFromEvent(preset, event)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reset to provided defaults button -->
    <div
      class="pbx-border-t pbx-border-gray-100 pbx-pt-4 pbx-mt-2 pbx-flex pbx-items-center pbx-justify-between pbx-gap-3"
    >
      <div>
        <p class="pbx-text-sm pbx-font-semibold pbx-text-myPrimaryDarkGrayColor pbx-my-0">
          {{ translate('Reset to provided defaults') }}
        </p>
        <p class="pbx-text-xs pbx-text-gray-500 pbx-my-0">
          {{ translate('Restore the original colors provided to the page builder') }}
        </p>
      </div>
      <button
        type="button"
        class="pbx-mySecondaryButton pbx-flex pbx-items-center pbx-gap-1 pbx-shrink-0"
        @click="openResetModal"
      >
        <span class="material-symbols-outlined pbx-text-base pbx-leading-none">restart_alt</span>
        {{ translate('Reset') }}
      </button>
    </div>
  </div>

  <!-- Confirmation modal -->
  <DynamicModalBuilder
    :showDynamicModalBuilder="showResetModal"
    type="delete"
    :gridColumnAmount="2"
    :title="translate('Reset to provided defaults')"
    :description="
      translate(
        'This will restore the original colors provided to the page builder. Any changes you have made to colors or enabled states will be lost.',
      )
    "
    :firstButtonText="translate('Close')"
    :thirdButtonText="translate('Reset')"
    @firstModalButtonFunctionDynamicModalBuilder="closeResetModal"
    @thirdModalButtonFunctionDynamicModalBuilder="confirmReset"
  >
    <header></header>
    <main></main>
  </DynamicModalBuilder>
</template>
