<script setup lang="ts">
import { watch } from 'vue'
import type { ProductCardStyle, ProductGridLayout, ProductMobileColumns } from '../../../../types'
import ModalFilterChip from '../../../Modals/ModalFilterChip.vue'
import ToggleInput from '../../../Inputs/ToggleInput.vue'
import {
  PRODUCT_CARD_STYLE_OPTIONS,
  PRODUCT_LAYOUT_OPTIONS,
  PRODUCT_MOBILE_COLUMN_OPTIONS,
} from '../../../../utils/builder/product-section-options'

const layout = defineModel<ProductGridLayout>('layout', { required: true })
const mobileColumns = defineModel<ProductMobileColumns>('mobileColumns', { required: true })
const cardStyle = defineModel<ProductCardStyle>('cardStyle', { required: true })
const roundedImages = defineModel<boolean>('roundedImages', { required: true })

defineProps<{
  translate: (key: string) => string
  compact?: boolean
}>()

watch(layout, (value) => {
  if (value === 'grid-1') {
    mobileColumns.value = 1
  }
})
</script>

<template>
  <div class="pbx-productSettingsPanel" :class="compact ? 'pbx-pt-1 pbx-pb-2' : ''">
    <section class="pbx-productSettingsSection">
      <div class="pbx-productSettingsSectionHeader">
        <p class="pbx-productSettingsSectionTitle">{{ translate('Grid layout') }}</p>
        <p class="pbx-productSettingsSectionDesc">
          {{ translate('Desktop product columns') }}
        </p>
      </div>
      <div class="pbx-productSettingsSectionChips">
        <ModalFilterChip
          v-for="option in PRODUCT_LAYOUT_OPTIONS"
          :key="option.value"
          :icon="option.iconKey"
          :label="translate(option.labelKey)"
          :hint="translate(option.hintKey)"
          :active="layout === option.value"
          @click="layout = option.value"
        />
      </div>
    </section>

    <section v-if="layout !== 'grid-1'" class="pbx-productSettingsSection">
      <div class="pbx-productSettingsSectionHeader">
        <p class="pbx-productSettingsSectionTitle">{{ translate('Mobile columns') }}</p>
        <p class="pbx-productSettingsSectionDesc">
          {{ translate('Products per row on small screens') }}
        </p>
      </div>
      <div class="pbx-productSettingsSectionChips">
        <ModalFilterChip
          v-for="option in PRODUCT_MOBILE_COLUMN_OPTIONS"
          :key="option.value"
          :icon="option.iconKey"
          :label="translate(option.labelKey)"
          :hint="translate(option.hintKey)"
          :active="mobileColumns === option.value"
          @click="mobileColumns = option.value"
        />
      </div>
    </section>

    <section class="pbx-productSettingsSection">
      <div class="pbx-productSettingsSectionHeader">
        <p class="pbx-productSettingsSectionTitle">{{ translate('Card style') }}</p>
        <p class="pbx-productSettingsSectionDesc">
          {{ translate('Border and shadow on product cards') }}
        </p>
      </div>
      <div class="pbx-productSettingsSectionChips">
        <ModalFilterChip
          v-for="option in PRODUCT_CARD_STYLE_OPTIONS"
          :key="option.value"
          :icon="option.iconKey"
          :label="translate(option.labelKey)"
          :hint="translate(option.hintKey)"
          :active="cardStyle === option.value"
          @click="cardStyle = option.value"
        />
      </div>
    </section>

    <section class="pbx-productSettingsSection">
      <div class="pbx-productSettingsToggleRow">
        <div class="pbx-flex pbx-flex-col pbx-gap-0.5">
          <p class="pbx-m-0 pbx-text-sm pbx-font-medium pbx-text-myPrimaryDarkGrayColor">
            {{ translate('Rounded images') }}
          </p>
          <p class="pbx-m-0 pbx-text-xs pbx-text-gray-500">
            {{ translate('Rounded photo corners') }}
          </p>
        </div>
        <ToggleInput v-model="roundedImages" />
      </div>
    </section>
  </div>
</template>
