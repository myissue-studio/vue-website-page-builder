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
const fontTopPadding = ref<string | null>(null)
const fontRightPadding = ref<string | null>(null)
const fontBottomPadding = ref<string | null>(null)
const fontLeftPadding = ref<string | null>(null)
const fontVerticalMargin = ref<string | null>(null)
const fontHorizontalMargin = ref<string | null>(null)
const getFontVerticalPadding = computed(() => {
  return pageBuilderStateStore.getFontVerticalPadding
})
const getFontHorizontalPadding = computed(() => {
  return pageBuilderStateStore.getFontHorizontalPadding
})
const getFontTopPadding = computed(() => {
  return pageBuilderStateStore.getFontTopPadding
})
const getFontRightPadding = computed(() => {
  return pageBuilderStateStore.getFontRightPadding
})
const getFontBottomPadding = computed(() => {
  return pageBuilderStateStore.getFontBottomPadding
})
const getFontLeftPadding = computed(() => {
  return pageBuilderStateStore.getFontLeftPadding
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
  getFontTopPadding,
  async (newValue) => {
    fontTopPadding.value = newValue
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
watch(
  getFontRightPadding,
  async (newValue) => {
    fontRightPadding.value = newValue
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
watch(
  getFontBottomPadding,
  async (newValue) => {
    fontBottomPadding.value = newValue
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
watch(
  getFontLeftPadding,
  async (newValue) => {
    fontLeftPadding.value = newValue
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
    <template #title>{{ translate('Padding') }}</template>
    <template #content>
      <div class="pbx-my-2 pbx-py-2">
        <div class="pbx-pt-4 pbx-pb-2 pbx-mb-4">
          <p class="pbx-myPrimaryInputLabel pbx-font-medium pbx-italic">
            {{ translate('Large Screens Only') }}
          </p>
          <hr />
        </div>
        <label for="vertical-padding" class="pbx-myPrimaryInputLabel">{{
          translate('Vertical Padding')
        }}</label>
        <select
          id="vertical-padding"
          v-model="fontVerticalPadding"
          class="pbx-myPrimarySelect"
          @change="pageBuilderService.handleVerticalPadding(fontVerticalPadding ?? undefined)"
        >
          <option disabled value="">{{ translate('Select') }}</option>
          <option
            v-for="verticalPadding in tailwindPaddingPlusMargin.verticalPadding"
            :key="verticalPadding"
          >
            {{ verticalPadding }}
          </option>
        </select>
      </div>
      <hr />
      <div class="pbx-my-2 pbx-py-2">
        <label for="horizontal-padding" class="pbx-myPrimaryInputLabel">{{
          translate('Horizontal Padding')
        }}</label>
        <select
          id="horizontal-padding"
          v-model="fontHorizontalPadding"
          class="pbx-myPrimarySelect"
          @change="pageBuilderService.handleHorizontalPadding(fontHorizontalPadding ?? undefined)"
        >
          <option disabled value="">{{ translate('Select') }}</option>
          <option
            v-for="horizontalPadding in tailwindPaddingPlusMargin.horizontalPadding"
            :key="horizontalPadding"
          >
            {{ horizontalPadding }}
          </option>
        </select>
      </div>
      <hr />
      <div class="pbx-my-2 pbx-py-2">
        <label for="top-padding" class="pbx-myPrimaryInputLabel">{{
          translate('Top Padding')
        }}</label>
        <select
          id="top-padding"
          v-model="fontTopPadding"
          class="pbx-myPrimarySelect"
          @change="pageBuilderService.handleTopPadding(fontTopPadding ?? undefined)"
        >
          <option disabled value="">{{ translate('Select') }}</option>
          <option v-for="topPadding in tailwindPaddingPlusMargin.topPadding" :key="topPadding">
            {{ topPadding }}
          </option>
        </select>
      </div>
      <hr />
      <div class="pbx-my-2 pbx-py-2">
        <label for="right-padding" class="pbx-myPrimaryInputLabel">{{
          translate('Right Padding')
        }}</label>
        <select
          id="right-padding"
          v-model="fontRightPadding"
          class="pbx-myPrimarySelect"
          @change="pageBuilderService.handleRightPadding(fontRightPadding ?? undefined)"
        >
          <option disabled value="">{{ translate('Select') }}</option>
          <option
            v-for="rightPadding in tailwindPaddingPlusMargin.rightPadding"
            :key="rightPadding"
          >
            {{ rightPadding }}
          </option>
        </select>
      </div>
      <hr />
      <div class="pbx-my-2 pbx-py-2">
        <label for="bottom-padding" class="pbx-myPrimaryInputLabel">{{
          translate('Bottom Padding')
        }}</label>
        <select
          id="bottom-padding"
          v-model="fontBottomPadding"
          class="pbx-myPrimarySelect"
          @change="pageBuilderService.handleBottomPadding(fontBottomPadding ?? undefined)"
        >
          <option disabled value="">{{ translate('Select') }}</option>
          <option
            v-for="bottomPadding in tailwindPaddingPlusMargin.bottomPadding"
            :key="bottomPadding"
          >
            {{ bottomPadding }}
          </option>
        </select>
      </div>
      <hr />
      <div class="pbx-my-2 pbx-py-2">
        <label for="left-padding" class="pbx-myPrimaryInputLabel">{{
          translate('Left Padding')
        }}</label>
        <select
          id="left-padding"
          v-model="fontLeftPadding"
          class="pbx-myPrimarySelect"
          @change="pageBuilderService.handleLeftPadding(fontLeftPadding ?? undefined)"
        >
          <option disabled value="">{{ translate('Select') }}</option>
          <option v-for="leftPadding in tailwindPaddingPlusMargin.leftPadding" :key="leftPadding">
            {{ leftPadding }}
          </option>
        </select>
      </div>
    </template>
  </EditorAccordion>
</template>
