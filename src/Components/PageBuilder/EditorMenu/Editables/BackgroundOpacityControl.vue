<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import tailwindOpacities from '../../../../utils/builder/tailwind-opacities'
import CustomDropdown from '../../../Inputs/CustomDropdown.vue'
import { getPageBuilder } from '../../../../composables/usePageBuilder'
import { useTranslations } from '../../../../composables/useTranslations'
const pageBuilderService = getPageBuilder()
const { translate } = useTranslations()

// Use shared store instance
const pageBuilderStateStore = sharedPageBuilderStore
const opacityVueModel = ref<string | null>(null)
const getBackgroundOpacity = computed(() => {
  return pageBuilderStateStore.getBackgroundOpacity
})

watch(
  getBackgroundOpacity,
  (newValue) => {
    opacityVueModel.value = newValue
  },
  { immediate: true },
)
</script>

<template>
  <div class="pbx-editorFieldGroup">
    <CustomDropdown
      v-model="opacityVueModel"
      id="bg-opacity"
      :options="tailwindOpacities.backgroundOpacities.map((value) => ({ value }))"
      @select="(value) => pageBuilderService.handleBackgroundOpacity(value)"
    >
      <template #button>
        <span class="pbx-flex pbx-min-w-0 pbx-items-center pbx-gap-2">
          <div v-if="opacityVueModel === 'none'" class="pbx-shrink-0">
            <div class="pbx-myPrimaryColorPreview pbx-border-none">
              <span class="material-symbols-outlined"> ev_shadow </span>
            </div>
          </div>

          <div
            v-if="opacityVueModel !== 'none'"
            class="pbx-aspect-square pbx-w-6 pbx-h-6 pbx-bg-gray-950 pbx-shrink-0"
            :class="`${opacityVueModel}`"
          ></div>

          <span class="pbx-block pbx-min-w-0 pbx-break-words">{{
            opacityVueModel === 'none' ? translate('Transparent') : opacityVueModel
          }}</span>
        </span>
      </template>
      <template #option="{ option, selected }">
        <div class="pbx-flex pbx-w-full pbx-min-w-0 pbx-items-center">
          <div v-if="option.value === 'none'" class="pbx-shrink-0">
            <div class="pbx-myPrimaryColorPreview pbx-border-none">
              <span class="material-symbols-outlined"> ev_shadow </span>
            </div>
          </div>

          <div
            v-if="option.value !== 'none'"
            class="pbx-aspect-square pbx-w-6 pbx-h-6 pbx-bg-gray-950 pbx-shrink-0"
            :class="`${option.value}`"
          ></div>
          <span v-if="option.value === 'none'" class="pbx-ml-3 pbx-min-w-0 pbx-break-words">{{
            translate('Transparent')
          }}</span>
          <span v-if="option.value !== 'none'" class="pbx-ml-3 pbx-min-w-0 pbx-flex-1 pbx-break-words">{{
            option.value
          }}</span>
        </div>
      </template>
    </CustomDropdown>
  </div>
</template>
