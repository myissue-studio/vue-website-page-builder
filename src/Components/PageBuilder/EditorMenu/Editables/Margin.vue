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
const fontTopMargin = ref<string | null>(null)
const fontRightMargin = ref<string | null>(null)
const fontBottomMargin = ref<string | null>(null)
const fontLeftMargin = ref<string | null>(null)
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
const getFontTopMargin = computed(() => {
  return pageBuilderStateStore.getFontTopMargin
})
const getFontRightMargin = computed(() => {
  return pageBuilderStateStore.getFontRightMargin
})
const getFontBottomMargin = computed(() => {
  return pageBuilderStateStore.getFontBottomMargin
})
const getFontLeftMargin = computed(() => {
  return pageBuilderStateStore.getFontLeftMargin
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
watch(
  getFontTopMargin,
  async (newValue) => {
    fontTopMargin.value = newValue
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
watch(
  getFontRightMargin,
  async (newValue) => {
    fontRightMargin.value = newValue
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
watch(
  getFontBottomMargin,
  async (newValue) => {
    fontBottomMargin.value = newValue
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
watch(
  getFontLeftMargin,
  async (newValue) => {
    fontLeftMargin.value = newValue
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
      <hr />
      <div class="pbx-pt-4 pbx-pb-2">
        <p class="pbx-myPrimaryInputLabel pbx-font-medium pbx-italic">
          {{ translate('Advanced Margin') }}
        </p>
      </div>
      <div class="pbx-my-2 pbx-py-2">
        <label for="top-margin" class="pbx-myPrimaryInputLabel">{{
          translate('Top Margin')
        }}</label>
        <select
          id="top-margin"
          v-model="fontTopMargin"
          class="pbx-myPrimarySelect"
          @change="pageBuilderService.handleTopMargin(fontTopMargin ?? undefined)"
        >
          <option disabled value="">{{ translate('Select') }}</option>
          <option v-for="topMargin in tailwindPaddingPlusMargin.topMargin" :key="topMargin">
            {{ topMargin }}
          </option>
        </select>
      </div>
      <hr />
      <div class="pbx-my-2 pbx-py-2">
        <label for="right-margin" class="pbx-myPrimaryInputLabel">{{
          translate('Right Margin')
        }}</label>
        <select
          id="right-margin"
          v-model="fontRightMargin"
          class="pbx-myPrimarySelect"
          @change="pageBuilderService.handleRightMargin(fontRightMargin ?? undefined)"
        >
          <option disabled value="">{{ translate('Select') }}</option>
          <option v-for="rightMargin in tailwindPaddingPlusMargin.rightMargin" :key="rightMargin">
            {{ rightMargin }}
          </option>
        </select>
      </div>
      <hr />
      <div class="pbx-my-2 pbx-py-2">
        <label for="bottom-margin" class="pbx-myPrimaryInputLabel">{{
          translate('Bottom Margin')
        }}</label>
        <select
          id="bottom-margin"
          v-model="fontBottomMargin"
          class="pbx-myPrimarySelect"
          @change="pageBuilderService.handleBottomMargin(fontBottomMargin ?? undefined)"
        >
          <option disabled value="">{{ translate('Select') }}</option>
          <option
            v-for="bottomMargin in tailwindPaddingPlusMargin.bottomMargin"
            :key="bottomMargin"
          >
            {{ bottomMargin }}
          </option>
        </select>
      </div>
      <hr />
      <div class="pbx-my-2 pbx-py-2">
        <label for="left-margin" class="pbx-myPrimaryInputLabel">{{
          translate('Left Margin')
        }}</label>
        <select
          id="left-margin"
          v-model="fontLeftMargin"
          class="pbx-myPrimarySelect"
          @change="pageBuilderService.handleLeftMargin(fontLeftMargin ?? undefined)"
        >
          <option disabled value="">{{ translate('Select') }}</option>
          <option v-for="leftMargin in tailwindPaddingPlusMargin.leftMargin" :key="leftMargin">
            {{ leftMargin }}
          </option>
        </select>
      </div>
    </template>
  </EditorAccordion>
</template>
