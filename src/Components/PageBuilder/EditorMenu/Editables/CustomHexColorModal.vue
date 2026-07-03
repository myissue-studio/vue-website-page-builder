<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BaseModal from '../../../Modals/BaseModal.vue'
import HexColorPicker from '../../../Inputs/HexColorPicker.vue'
import SaveThemeColorPresetModal from './SaveThemeColorPresetModal.vue'
import { normalizeCssColorToHex } from '../../../../utils/builder/color-utils'
import { useTranslations } from '../../../../composables/useTranslations'
import { useToast } from '../../../../composables/useToast'

const props = defineProps<{
  show: boolean
  initialColor?: string
  title: string
}>()

const emit = defineEmits<{
  close: []
  apply: [value: string]
}>()

const { translate } = useTranslations()
const { showToast } = useToast()
const draftHex = ref(normalizeCssColorToHex(props.initialColor || '') ?? '#000000')
const appliedHex = ref<string | null>(null)
const initialHex = ref<string | null>(normalizeCssColorToHex(props.initialColor || '#000000'))
const showSaveModal = ref(false)

watch(
  () => props.show,
  (isOpen) => {
    if (!isOpen) return

    const initial = normalizeCssColorToHex(props.initialColor || '') ?? '#000000'
    draftHex.value = initial
    initialHex.value = initial
    appliedHex.value = null
    showSaveModal.value = false
  },
)

watch(
  () => props.initialColor,
  (value) => {
    if (!props.show || !value) return
    draftHex.value = normalizeCssColorToHex(value) ?? '#000000'
  },
)

const validDraft = computed(() => normalizeCssColorToHex(draftHex.value))

const previewHex = computed(() => validDraft.value ?? appliedHex.value ?? '#000000')

const activeAppliedHex = computed(() => appliedHex.value ?? initialHex.value)

const hasPendingColorChange = computed(
  () => Boolean(validDraft.value) && validDraft.value !== activeAppliedHex.value,
)

const isCurrentDraftApplied = computed(
  () => Boolean(appliedHex.value) && validDraft.value === appliedHex.value,
)

const canSaveToTheme = computed(() => Boolean(appliedHex.value))

const saveColor = computed(() => appliedHex.value ?? '')

function onHexInput(event: Event): void {
  draftHex.value = (event.target as HTMLInputElement).value
}

function onHexBlur(): void {
  const normalized = normalizeCssColorToHex(draftHex.value)
  if (normalized) draftHex.value = normalized
}

function onPickerUpdate(color: string): void {
  draftHex.value = normalizeCssColorToHex(color) ?? color
}

function applyDraft(): void {
  const normalized = normalizeCssColorToHex(draftHex.value)
  if (!normalized) return

  draftHex.value = normalized
  appliedHex.value = normalized
  emit('apply', normalized)
  showToast(translate('Color applied'), 'success')
}

function onEnterKey(event: KeyboardEvent): void {
  event.preventDefault()
  applyDraft()
}

function openSaveModal(): void {
  if (!canSaveToTheme.value) return
  showSaveModal.value = true
}

function closeSaveModal(): void {
  showSaveModal.value = false
}
</script>

<template>
  <BaseModal
    :showModalBuilder="show"
    :title="title"
    maxWidth="md"
    :z-index="10004"
    :show-actions="canSaveToTheme"
    @closeMainModalBuilder="$emit('close')"
  >
    <div class="pbx-min-h-[55rem]">
      <div class="pbx-customColorModal">
        <p class="pbx-customColorModalIntro">
          {{
            translate(
              'Pick a custom hex color, apply it to your selection, or save it as a theme preset.',
            )
          }}
        </p>

        <div class="pbx-customColorModalPreview">
          <span
            class="pbx-customColorModalPreviewSwatch"
            :style="{ backgroundColor: previewHex }"
            aria-hidden="true"
          ></span>
          <div class="pbx-customColorModalPreviewMeta">
            <span class="pbx-customColorModalPreviewLabel">{{ translate('Preview') }}</span>
            <span class="pbx-customColorModalPreviewHex">{{ previewHex }}</span>
          </div>
          <span v-if="isCurrentDraftApplied" class="pbx-customColorModalAppliedBadge">
            <span class="material-symbols-outlined pbx-text-[14px] pbx-leading-none">check</span>
            {{ translate('Applied') }}
          </span>
        </div>

        <div class="pbx-customColorModalSection">
          <span class="pbx-customColorModalSectionLabel">{{ translate('Hex color') }}</span>
          <div class="pbx-customColorModalHexRow">
            <input
              :value="draftHex"
              type="text"
              maxlength="7"
              placeholder="#rrggbb"
              spellcheck="false"
              class="pbx-myPrimaryInput pbx-w-full pbx-min-w-0"
              @input="onHexInput"
              @blur="onHexBlur"
              @keydown.enter="onEnterKey"
            />

            <button
              type="button"
              class="pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-aspect-square focus-visible:pbx-ring-0 disabled:pbx-cursor-not-allowed disabled:pbx-opacity-50"
              :class="[
                hasPendingColorChange
                  ? 'pbx-bg-emerald-600 pbx-text-white hover:pbx-bg-emerald-700'
                  : 'pbx-bg-gray-50 pbx-text-black hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white',
              ]"
              :title="translate('Apply color')"
              :disabled="!validDraft"
              @click="applyDraft"
            >
              <span class="material-symbols-outlined pbx-text-base pbx-leading-none">check</span>
            </button>
          </div>
        </div>

        <div class="pbx-customColorModalSection">
          <span class="pbx-customColorModalSectionLabel">{{ translate('Color picker') }}</span>
          <div class="pbx-customColorModalPickerCard">
            <HexColorPicker
              :model-value="previewHex"
              :show-hex-input="false"
              @update:model-value="onPickerUpdate"
            />
          </div>
        </div>
      </div>

      <SaveThemeColorPresetModal
        :show="showSaveModal"
        :color="saveColor"
        @close="closeSaveModal"
        @saved="closeSaveModal"
      />
    </div>

    <template #actions>
      <button type="button" class="pbx-mySecondaryButton" @click="$emit('close')">
        {{ translate('Close') }}
      </button>
      <button type="button" class="pbx-myPrimaryButton" @click="openSaveModal">
        {{ translate('Save to theme') }}
      </button>
    </template>
  </BaseModal>
</template>
