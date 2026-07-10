<script setup lang="ts">
import { watch } from 'vue'
import type {
  ProductButtonStyle,
  ProductCardStyle,
  ProductGridLayout,
  ProductMobileColumns,
} from '../../../../types'
import ModalFilterChip from '../../../Modals/ModalFilterChip.vue'
import ToggleInput from '../../../Inputs/ToggleInput.vue'
import LinkStyleSettingsPanel from './LinkStyleSettingsPanel.vue'
import {
  PRODUCT_CARD_STYLE_OPTIONS,
  PRODUCT_LAYOUT_OPTIONS,
  PRODUCT_MOBILE_COLUMN_OPTIONS,
} from '../../../../utils/builder/product-section-options'

const layout = defineModel<ProductGridLayout>('layout', { required: true })
const mobileColumns = defineModel<ProductMobileColumns>('mobileColumns', { required: true })
const cardStyle = defineModel<ProductCardStyle>('cardStyle', { required: true })
const roundedImages = defineModel<boolean>('roundedImages', { required: true })
const openInNewTab = defineModel<boolean>('openInNewTab', { required: true })
const buttonStyle = defineModel<ProductButtonStyle>('buttonStyle', { required: true })
const roundedButtons = defineModel<boolean>('roundedButtons', { required: true })
const hidePrice = defineModel<boolean>('hidePrice', { required: true })
const hideImage = defineModel<boolean>('hideImage', { required: true })
const hideButton = defineModel<boolean>('hideButton', { required: true })
const hideLinks = defineModel<boolean>('hideLinks', { default: false })

defineProps<{
  translate: (key: string) => string
  compact?: boolean
  showHideLinksToggle?: boolean
  hasProductPrices?: boolean
  hasProductImages?: boolean
  hasProductButtons?: boolean
  hasProductLinks?: boolean
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

    <div
      class="pbx-productSettingsToggleGrid"
      :class="compact ? '' : 'pbx-productSettingsToggleGrid--twoCol'"
    >
      <section
        v-if="hasProductPrices || hasProductButtons || showHideLinksToggle"
        class="pbx-productSettingsSection"
      >
        <div class="pbx-productSettingsSectionHeader">
          <p class="pbx-productSettingsSectionTitle">{{ translate('Card content') }}</p>
          <p class="pbx-productSettingsSectionDesc">
            {{ translate('Choose what appears on each product card') }}
          </p>
        </div>
        <div class="pbx-productSettingsToggleList">
          <div v-if="hasProductPrices" class="pbx-productSettingsToggleRow">
            <div class="pbx-flex pbx-flex-col pbx-gap-0.5">
              <p class="pbx-m-0 pbx-text-sm pbx-font-medium pbx-text-myPrimaryDarkGrayColor">
                {{ translate('Hide prices') }}
              </p>
              <p class="pbx-m-0 pbx-text-xs pbx-text-gray-500">
                {{ translate('Do not show prices on product cards') }}
              </p>
            </div>
            <ToggleInput v-model="hidePrice" />
          </div>
          <div v-if="hasProductButtons" class="pbx-productSettingsToggleRow">
            <div class="pbx-flex pbx-flex-col pbx-gap-0.5">
              <p class="pbx-m-0 pbx-text-sm pbx-font-medium pbx-text-myPrimaryDarkGrayColor">
                {{ translate('Hide buy button') }}
              </p>
              <p class="pbx-m-0 pbx-text-xs pbx-text-gray-500">
                {{ translate('Do not show the product CTA button on cards') }}
              </p>
            </div>
            <ToggleInput v-model="hideButton" />
          </div>
          <div v-if="showHideLinksToggle" class="pbx-productSettingsToggleRow">
            <div class="pbx-flex pbx-flex-col pbx-gap-0.5">
              <p class="pbx-m-0 pbx-text-sm pbx-font-medium pbx-text-myPrimaryDarkGrayColor">
                {{ translate('Hide product links') }}
              </p>
              <p class="pbx-m-0 pbx-text-xs pbx-text-gray-500">
                {{ translate('Do not add links to product cards') }}
              </p>
            </div>
            <ToggleInput v-model="hideLinks" />
          </div>
        </div>
      </section>

      <LinkStyleSettingsPanel
        v-if="!hideLinks && (hasProductLinks || showHideLinksToggle)"
        v-model:button-style="buttonStyle"
        v-model:open-in-new-tab="openInNewTab"
        v-model:rounded-buttons="roundedButtons"
        :translate="translate"
        :show-button-style="Boolean(hasProductButtons)"
      />

      <section v-if="hasProductImages" class="pbx-productSettingsSection">
        <div class="pbx-productSettingsSectionHeader">
          <p class="pbx-productSettingsSectionTitle">{{ translate('Product images') }}</p>
          <p class="pbx-productSettingsSectionDesc">
            {{ translate('Photo appearance on each card') }}
          </p>
        </div>
        <div class="pbx-productSettingsToggleList">
          <div class="pbx-productSettingsToggleRow">
            <div class="pbx-flex pbx-flex-col pbx-gap-0.5">
              <p class="pbx-m-0 pbx-text-sm pbx-font-medium pbx-text-myPrimaryDarkGrayColor">
                {{ translate('Hide images') }}
              </p>
              <p class="pbx-m-0 pbx-text-xs pbx-text-gray-500">
                {{ translate('Do not show product photos on cards') }}
              </p>
            </div>
            <ToggleInput v-model="hideImage" />
          </div>
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
        </div>
      </section>
    </div>
  </div>
</template>
