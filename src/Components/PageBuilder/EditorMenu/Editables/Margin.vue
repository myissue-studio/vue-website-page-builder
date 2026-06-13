<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import EditorAccordion from '../EditorAccordion.vue'
import tailwindPaddingPlusMargin from '../../../../utils/builder/tailwind-padding-margin'
import { getPageBuilder } from '../../../../composables/builderInstance'
import { useTranslations } from '../../../../composables/useTranslations'

const { translate } = useTranslations()
const pageBuilderService = getPageBuilder()

// Use shared store instance
const pageBuilderStateStore = sharedPageBuilderStore

const fontVerticalPadding = ref<string | null>(null)
const fontHorizontalPadding = ref<string | null>(null)
const fontVerticalMargin = ref<string | null>(null)
const fontHorizontalMargin = ref<string | null>(null)
const getFontVerticalPadding = computed(() => {
  return pageBuilderStateStore.getFontVerticalPadding
})
const getFontHorizontalPadding = computed(() => {
  return pageBuilderStateStore.getFontHorizontalPadding
})
const getFontVerticalMargin = computed(() => {
  return pageBuilderStateStore.getFontVerticalMargin
})
const getFontHorizontalMargin = computed(() => {
  return pageBuilderStateStore.getFontHorizontalMargin
})

watch(
  getFontVerticalPadding,
  async (newValue) => {
    fontVerticalPadding.value = newValue
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
watch(
  getFontHorizontalPadding,
  async (newValue) => {
    fontHorizontalPadding.value = newValue
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
watch(
  getFontVerticalMargin,
  async (newValue) => {
    fontVerticalMargin.value = newValue
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
watch(
  getFontHorizontalMargin,
  async (newValue) => {
    fontHorizontalMargin.value = newValue
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
</script>
<template>
  <EditorAccordion>
    <template #title>{{ translate('Margin') }}</template>
    <template #content>
      <div class="pbx-my-2 pbx-py-2">
        <div class="pbx-pt-4 pbx-pb-2 pbx-mb-4">
          <p class="pbx-myPrimaryInputLabel pbx-font-medium pbx-italic">
            {{ translate('Large Screens Only') }}
          </p>
          <hr />
        </div>
        <label for="vertical-margin" class="pbx-myPrimaryInputLabel">{{
          translate('Vertical Margin')
        }}</label>
        <select
          id="vertical-margin"
          v-model="fontVerticalMargin"
          class="pbx-myPrimarySelect"
          @change="pageBuilderService.handleVerticalMargin(fontVerticalMargin ?? undefined)"
        >
          <option disabled value="">{{ translate('Select') }}</option>
          <option
            v-for="verticalMargin in tailwindPaddingPlusMargin.verticalMargin"
            :key="verticalMargin"
          >
            {{ verticalMargin }}
          </option>
        </select>
      </div>
      <hr />
      <div class="pbx-my-2 pbx-py-2">
        <label for="horizontal-margin" class="pbx-myPrimaryInputLabel">{{
          translate('Horizontal Margin')
        }}</label>
        <select
          id="horizontal-margin"
          v-model="fontHorizontalMargin"
          class="pbx-myPrimarySelect"
          @change="pageBuilderService.handleHorizontalMargin(fontHorizontalMargin ?? undefined)"
        >
          <option disabled value="">{{ translate('Select') }}</option>
          <option
            v-for="horizontalMargin in tailwindPaddingPlusMargin.horizontalMargin"
            :key="horizontalMargin"
          >
            {{ horizontalMargin }}
          </option>
        </select>
      </div>
    </template>
  </EditorAccordion>
</template>
