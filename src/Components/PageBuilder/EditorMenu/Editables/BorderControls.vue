<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import EditorAccordion from '../EditorAccordion.vue'
import tailwindBorderStyleWidthPlusColor from '../../../../utils/builder/tailwind-border-style-width-color'
import CustomDropdown from '../../../Inputs/CustomDropdown.vue'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import { getPageBuilder } from '../../../../composables/usePageBuilder'
import { useTranslations } from '../../../../composables/useTranslations'

defineOptions({
  name: 'BorderControls',
})

const { translate } = useTranslations()
const pageBuilderService = getPageBuilder()

const pageBuilderStateStore = sharedPageBuilderStore

const borderStyle = ref<string | null>(null)
const borderWidth = ref<string | null>(null)
const borderColor = ref<string | null>(null)

const borderStyleOptions = computed(() => [
  { value: '', label: translate('Select'), disabled: true },
  ...tailwindBorderStyleWidthPlusColor.borderStyle.map((value) => ({ value, label: value })),
])

const borderWidthOptions = computed(() => [
  { value: '', label: translate('Select'), disabled: true },
  ...tailwindBorderStyleWidthPlusColor.borderWidth.map((value) => ({ value, label: value })),
])

const getBorderStyle = computed(() => {
  return pageBuilderStateStore.getBorderStyle
})
const getBorderWidth = computed(() => {
  return pageBuilderStateStore.getBorderWidth
})
const getBorderColor = computed(() => {
  return pageBuilderStateStore.getBorderColor
})

watch(
  getBorderStyle,
  (newValue) => {
    borderStyle.value = newValue ?? ''
  },
  { immediate: true },
)
watch(
  getBorderWidth,
  (newValue) => {
    borderWidth.value = newValue ?? ''
  },
  { immediate: true },
)
watch(
  getBorderColor,
  (newValue) => {
    borderColor.value = newValue
  },
  { immediate: true },
)
</script>

<template>
  <EditorAccordion>
    <template #title>{{ translate('Border Style, Width & Color') }}</template>
    <template #content>
      <p class="pbx-editorSectionTitle">
        {{ translate('Border') }}
      </p>

      <div class="pbx-editorFieldGroup">
        <label for="border-style" class="pbx-myPrimaryInputLabel">{{
          translate('Border Style')
        }}</label>
        <CustomDropdown
          id="border-style"
          v-model="borderStyle"
          :options="borderStyleOptions"
          @select="(value) => pageBuilderService.handleBorderStyle(value || undefined)"
        >
          <template #button>
            <span class="pbx-block pbx-truncate">{{ borderStyle || translate('Select') }}</span>
          </template>
        </CustomDropdown>
      </div>
      <hr />
      <div class="pbx-editorFieldGroup">
        <label for="border-width" class="pbx-myPrimaryInputLabel">{{
          translate('Border Width')
        }}</label>
        <CustomDropdown
          id="border-width"
          v-model="borderWidth"
          :options="borderWidthOptions"
          @select="(value) => pageBuilderService.handleBorderWidth(value || undefined)"
        >
          <template #button>
            <span class="pbx-block pbx-truncate">{{ borderWidth || translate('Select') }}</span>
          </template>
        </CustomDropdown>
      </div>
      <hr />
      <div class="pbx-editorFieldGroup">
        <label for="border-color" class="pbx-myPrimaryInputLabel">{{
          translate('Border Color')
        }}</label>
        <CustomDropdown
          v-model="borderColor"
          id="border-color"
          class="pbx-mt-2"
          :options="tailwindBorderStyleWidthPlusColor.borderColor.map((value) => ({ value }))"
          @select="(value) => pageBuilderService.handleBorderColor(value ?? undefined)"
        >
          <template #button>
            <span class="pbx-flex pbx-items-center pbx-gap-2">
              <div v-if="getBorderColor === 'none'">
                <div class="pbx-myPrimaryColorPreview pbx-border-none">
                  <span class="material-symbols-outlined"> ev_shadow </span>
                </div>
              </div>
              <div
                v-if="borderColor !== 'none'"
                class="pbx-aspect-square pbx-w-6 pbx-h-6 pbx-border-solid pbx-border pbx-border-gray-100 pbx-rounded-sm"
                :class="`pbx-bg-${borderColor?.replace('pbx-border-', '')}`"
              ></div>
              <span class="pbx-block pbx-truncate">{{ borderColor }}</span>
            </span>
          </template>
          <template #option="{ option, selected }">
            <div class="pbx-flex pbx-w-full pbx-items-center">
              <div v-if="option.value === 'none'">
                <div class="pbx-myPrimaryColorPreview pbx-border-none">
                  <span class="material-symbols-outlined"> ev_shadow </span>
                </div>
              </div>

              <div
                v-if="option.value !== 'none'"
                class="pbx-aspect-square pbx-w-6 pbx-h-6 pbx-bg-gray-950"
                :class="`pbx-bg-${option.value.replace('pbx-border-', '')}`"
              ></div>
              <span v-if="option.value === 'none'" class="pbx-ml-3">{{
                translate('Transparent')
              }}</span>
              <span v-if="option.value !== 'none'" class="pbx-ml-3">{{ option.value }}</span>
            </div>
          </template>
        </CustomDropdown>
      </div>
    </template>
  </EditorAccordion>
</template>
