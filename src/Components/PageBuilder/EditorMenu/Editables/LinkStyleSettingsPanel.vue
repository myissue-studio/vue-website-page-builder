<script setup lang="ts">
import type { ProductButtonStyle } from '../../../../types'
import ModalFilterChip from '../../../Modals/ModalFilterChip.vue'
import ToggleInput from '../../../Inputs/ToggleInput.vue'
import { PRODUCT_BUTTON_STYLE_OPTIONS } from '../../../../utils/builder/product-section-options'

const buttonStyle = defineModel<ProductButtonStyle>('buttonStyle', { required: true })
const openInNewTab = defineModel<boolean>('openInNewTab', { required: true })
const roundedButtons = defineModel<boolean>('roundedButtons', { required: true })

withDefaults(
  defineProps<{
    translate: (key: string) => string
    title?: string
    description?: string
    showButtonStyle?: boolean
    showOpenInNewTab?: boolean
    showRoundedButtons?: boolean
  }>(),
  {
    title: 'Product links',
    description: 'Link behavior on product cards',
    showButtonStyle: true,
    showOpenInNewTab: true,
    showRoundedButtons: true,
  },
)
</script>

<template>
  <section class="pbx-productSettingsSection">
    <div class="pbx-productSettingsSectionHeader">
      <p class="pbx-productSettingsSectionTitle">{{ translate(title) }}</p>
      <p class="pbx-productSettingsSectionDesc">
        {{ translate(description) }}
      </p>
    </div>

    <div v-if="showButtonStyle" class="pbx-productSettingsSectionChips pbx-mb-3">
      <ModalFilterChip
        v-for="option in PRODUCT_BUTTON_STYLE_OPTIONS"
        :key="option.value"
        :icon="buttonStyle === option.value ? 'radio_button_checked' : 'radio_button_unchecked'"
        :label="translate(option.labelKey)"
        :hint="translate(option.hintKey)"
        :active="buttonStyle === option.value"
        @click="buttonStyle = option.value"
      />
    </div>
    <hr />
    <div class="pbx-productSettingsToggleList">
      <div v-if="showOpenInNewTab" class="pbx-productSettingsToggleRow">
        <div class="pbx-flex pbx-flex-col pbx-gap-0.5">
          <p class="pbx-m-0 pbx-text-sm pbx-font-medium pbx-text-myPrimaryDarkGrayColor">
            {{ translate('Open in new tab') }}
          </p>
          <p class="pbx-m-0 pbx-text-xs pbx-text-gray-500">
            {{ translate('Product links open in a new browser tab') }}
          </p>
        </div>
        <ToggleInput v-model="openInNewTab" />
      </div>

      <div
        v-if="showButtonStyle && showRoundedButtons && buttonStyle === 'button'"
        class="pbx-productSettingsToggleRow"
      >
        <div class="pbx-flex pbx-flex-col pbx-gap-0.5">
          <p class="pbx-m-0 pbx-text-sm pbx-font-medium pbx-text-myPrimaryDarkGrayColor">
            {{ translate('Rounded buttons') }}
          </p>
          <p class="pbx-m-0 pbx-text-xs pbx-text-gray-500">
            {{ translate('Use rounded corners for CTA buttons') }}
          </p>
        </div>
        <ToggleInput v-model="roundedButtons" />
      </div>
    </div>
  </section>
</template>
