<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import EditorAccordion from '../EditorAccordion.vue'
import tailwindFontSizes from '../../../../utils/builder/tailwind-font-sizes'
import tailwindFontStyles from '../../../../utils/builder/tailwind-font-styles'
import { resolveInheritedFontFamily } from '../../../../utils/builder/resolve-inherited-font-family'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import { getPageBuilder } from '../../../../composables/builderInstance'

import { useTranslations } from '../../../../composables/useTranslations'

const { translate } = useTranslations()
const pageBuilderService = getPageBuilder()

// Use shared store instance
const pageBuilderStateStore = sharedPageBuilderStore

const fontBase = ref<string | null>(null)
const fontDesktop = ref<string | null>(null)
const fontTablet = ref<string | null>(null)
const fontMobile = ref<string | null>(null)
const fontWeight = ref<string | null>(null)
const fontFamily = ref<string | null>(null)
const inheritedFontFamily = ref('')
const fontStyle = ref<string | null>(null)
const getElement = computed(() => {
  return pageBuilderStateStore.getElement
})
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
const getPageBuilderConfig = computed(() => {
  return pageBuilderStateStore.getPageBuilderConfig
})

const availableFontFamilies = computed(() => {
  return tailwindFontStyles.fontFamily
})

const hasExplicitFontFamily = computed(() => {
  return Boolean(fontFamily.value && fontFamily.value !== 'none')
})

const handleFontFamilyChange = function () {
  pageBuilderService.handleFontFamily(fontFamily.value == null ? 'none' : fontFamily.value)
}

const updateInheritedFontFamily = async () => {
  await nextTick()

  if (!(getElement.value instanceof HTMLElement)) {
    inheritedFontFamily.value = ''
    return
  }

  inheritedFontFamily.value = resolveInheritedFontFamily(
    getElement.value,
    getPageBuilderConfig.value,
  )
}

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
    fontFamily.value = !newValue || newValue === 'none' ? null : newValue
    await updateInheritedFontFamily()
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
watch(getElement, updateInheritedFontFamily, { immediate: true, flush: 'post' })
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
            @change="pageBuilderService.handleFontSizeBase(fontBase ?? undefined)"
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
          @change="pageBuilderService.handleFontSizeDesktop(fontDesktop ?? undefined)"
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
            @change="pageBuilderService.handleFontSizeTablet(fontTablet ?? undefined)"
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
            @change="pageBuilderService.handleFontSizeMobile(fontMobile ?? undefined)"
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
          @change="pageBuilderService.handleFontWeight(fontWeight ?? undefined)"
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
          @change="handleFontFamilyChange"
        >
          <option :value="null">{{ translate('No font family') }}</option>
          <option v-for="fontFamily in availableFontFamilies" :key="fontFamily">
            {{ fontFamily }}
          </option>
        </select>
        <p
          v-if="!hasExplicitFontFamily && inheritedFontFamily"
          class="pbx-mt-2 pbx-mb-0 pbx-text-xs pbx-text-gray-500"
        >
          {{ translate('Inherited') }}: {{ inheritedFontFamily }}
        </p>
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
          @change="pageBuilderService.handleFontStyle(fontStyle ?? undefined)"
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
