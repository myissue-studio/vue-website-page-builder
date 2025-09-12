<script setup>
import { ref, computed, watch } from 'vue'
import EditorAccordion from '../EditorAccordion.vue'
import tailwindFontSizes from '../../../../utils/builder/tailwind-font-sizes'
import tailwindFontStyles from '../../../../utils/builder/tailwind-font-styles'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import { getPageBuilder } from '../../../../composables/builderInstance'

import { useTranslations } from '../../../../composables/useTranslations'

const { translate } = useTranslations()
const pageBuilderService = getPageBuilder()

// Use shared store instance
const pageBuilderStateStore = sharedPageBuilderStore

const fontBase = ref(null)
const fontDesktop = ref(null)
const fontTablet = ref(null)
const fontMobile = ref(null)
const fontWeight = ref(null)
const fontFamily = ref(null)
const fontStyle = ref(null)
const getFontBase = computed(() => {
  return pageBuilderStateStore.getFontBase
})
const getFontDesktop = computed(() => {
  return pageBuilderStateStore.getFontDesktop
})
const getFontTablet = computed(() => {
  return pageBuilderStateStore.getFontTablet
})
const getFontMobile = computed(() => {
  return pageBuilderStateStore.getFontMobile
})
const getFontWeight = computed(() => {
  return pageBuilderStateStore.getFontWeight
})
const getFontFamily = computed(() => {
  return pageBuilderStateStore.getFontFamily
})
const getFontStyle = computed(() => {
  return pageBuilderStateStore.getFontStyle
})

watch(
  getFontBase,
  async (newValue) => {
    fontBase.value = newValue
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
watch(
  getFontDesktop,
  async (newValue) => {
    fontDesktop.value = newValue
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
watch(
  getFontTablet,
  async (newValue) => {
    fontTablet.value = newValue
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
watch(
  getFontMobile,
  async (newValue) => {
    fontMobile.value = newValue
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
watch(
  getFontWeight,
  async (newValue) => {
    fontWeight.value = newValue
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
watch(
  getFontFamily,
  async (newValue) => {
    fontFamily.value = newValue
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
watch(
  getFontStyle,
  async (newValue) => {
    fontStyle.value = newValue
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
</script>

<template>
  <EditorAccordion>
    <template #title>{{ translate('Typographies') }}</template>
    <template #content>
      <!-- FONT SIZES -->
      <p class="pbx-myPrimaryParagraph pbx-font-medium pbx-py-0 pbx-my-4">
        {{ translate('Font Appearance') }}
      </p>
      <template v-if="false">
        <div class="pbx-my-2 pbx-py-2">
          <label for="font-base" class="pbx-myPrimaryInputLabel">
            {{ translate('Font Size') }}
          </label>
          <select
            id="font-base"
            v-model="fontBase"
            class="pbx-myPrimarySelect"
            @change="pageBuilderService.handleFontSizeBase(fontBase)"
          >
            <option disabled value="">{{ translate('Select') }}</option>
            <option v-for="fontSize in tailwindFontSizes.fontBase" :key="fontSize">
              {{ fontSize }}
            </option>
          </select>
        </div>
      </template>
      <div class="pbx-my-2 pbx-py-2">
        <label for="font-desktop" class="pbx-myPrimaryInputLabel">
          {{ translate('Font size') }}
        </label>
        <select
          id="font-desktop"
          v-model="fontDesktop"
          class="pbx-myPrimarySelect"
          @change="pageBuilderService.handleFontSizeDesktop(fontDesktop)"
        >
          <option disabled value="">{{ translate('Select') }}</option>
          <option v-for="fontSize in tailwindFontSizes.fontDesktop" :key="fontSize">
            {{ fontSize }}
          </option>
        </select>
      </div>
      <template v-if="false">
        <div class="pbx-my-2 pbx-py-2">
          <label for="font-tablet" class="pbx-myPrimaryInputLabel">
            {{ translate('Font tablet size') }}
          </label>
          <select
            id="font-tablet"
            v-model="fontTablet"
            class="pbx-myPrimarySelect"
            @change="pageBuilderService.handleFontSizeTablet(fontTablet)"
          >
            <option disabled value="">{{ translate('Select') }}</option>
            <option v-for="fontSize in tailwindFontSizes.fontTablet" :key="fontSize">
              {{ fontSize }}
            </option>
          </select>
        </div>
        <div class="pbx-my-2 pbx-py-2">
          <label for="font-mobile" class="pbx-myPrimaryInputLabel">
            {{ translate('Font small screens') }}
          </label>
          <select
            id="font-mobile"
            v-model="fontMobile"
            class="pbx-myPrimarySelect"
            @change="pageBuilderService.handleFontSizeMobile(fontMobile)"
          >
            <option disabled value="">{{ translate('Select') }}</option>
            <option v-for="fontSize in tailwindFontSizes.fontMobile" :key="fontSize">
              {{ fontSize }}
            </option>
          </select>
        </div>
      </template>
      <hr />

      <div class="pbx-my-2 pbx-py-2">
        <label for="font-weight" class="pbx-myPrimaryInputLabel">
          {{ translate('Font weight') }}
        </label>
        <select
          id="font-weight"
          v-model="fontWeight"
          class="pbx-myPrimarySelect"
          @change="pageBuilderService.handleFontWeight(fontWeight)"
        >
          <option disabled value="">{{ translate('Select') }}</option>
          <option v-for="fontWeight in tailwindFontStyles.fontWeight" :key="fontWeight">
            {{ fontWeight }}
          </option>
        </select>
      </div>
      <hr />

      <!-- FONT FAMILY -->
      <div class="pbx-my-2 pbx-py-2">
        <label for="font-family" class="pbx-myPrimaryInputLabel">
          {{ translate('Font family') }}
        </label>
        <select
          id="font-family"
          v-model="fontFamily"
          class="pbx-myPrimarySelect"
          @change="pageBuilderService.handleFontFamily(fontFamily)"
        >
          <option disabled value="">{{ translate('Select') }}</option>
          <option v-for="fontFamily in tailwindFontStyles.fontFamily" :key="fontFamily">
            {{ fontFamily }}
          </option>
        </select>
      </div>
      <hr />

      <div class="pbx-my-2 pbx-py-2">
        <label for="font-style" class="pbx-myPrimaryInputLabel">
          {{ translate('Font Style') }}
        </label>
        <select
          id="font-style"
          v-model="fontStyle"
          class="pbx-myPrimarySelect"
          @change="pageBuilderService.handleFontStyle(fontStyle)"
        >
          <option disabled value="">{{ translate('Select') }}</option>
          <option v-for="fontStyle in tailwindFontStyles.fontStyle" :key="fontStyle">
            {{ fontStyle }}
          </option>
        </select>
      </div>
    </template>
  </EditorAccordion>
</template>
