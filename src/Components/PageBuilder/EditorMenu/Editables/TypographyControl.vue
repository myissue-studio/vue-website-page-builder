<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import EditorAccordion from '../EditorAccordion.vue'
import tailwindFontSizes from '../../../../utils/builder/tailwind-font-sizes'
import tailwindFontStyles from '../../../../utils/builder/tailwind-font-styles'
import { getFontFamilyPickerOptions } from '../../../../utils/builder/font-family-map'
import { resolveInheritedFontFamily } from '../../../../utils/builder/resolve-inherited-font-family'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import { getPageBuilder } from '../../../../composables/usePageBuilder'

import { useTranslations } from '../../../../composables/useTranslations'

const { translate } = useTranslations()
const pageBuilderService = getPageBuilder()

const props = withDefaults(
  defineProps<{
    defaultOpen?: boolean
    prettyHeader?: boolean
    splitBasicAdvanced?: boolean
  }>(),
  {
    defaultOpen: false,
    prettyHeader: false,
    splitBasicAdvanced: false,
  },
)

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
const showAdvancedTypography = ref(false)
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

const availableFontFamilyOptions = computed(() =>
  getFontFamilyPickerOptions(getPageBuilderConfig.value?.userSettings),
)

const hasExplicitFontFamily = computed(() => {
  return Boolean(fontFamily.value && fontFamily.value !== 'none')
})

const handleFontFamilyChange = async function () {
  await pageBuilderService.handleFontFamily(fontFamily.value == null ? 'none' : fontFamily.value)
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
    {
      globalPageDesignMode: pageBuilderStateStore.getToggleGlobalHtmlMode,
      selectedFontClass: pageBuilderStateStore.getFontFamily,
    },
  )
}

watch(
  getFontBase,
  (newValue) => {
    fontBase.value = newValue
  },
  { immediate: true },
)
watch(
  getFontDesktop,
  (newValue) => {
    fontDesktop.value = newValue
  },
  { immediate: true },
)
watch(
  getFontTablet,
  (newValue) => {
    fontTablet.value = newValue
  },
  { immediate: true },
)
watch(
  getFontMobile,
  (newValue) => {
    fontMobile.value = newValue
  },
  { immediate: true },
)
watch(
  getFontWeight,
  (newValue) => {
    fontWeight.value = newValue
  },
  { immediate: true },
)
watch(
  getFontFamily,
  async (newValue) => {
    fontFamily.value = !newValue || newValue === 'none' ? null : newValue
    await updateInheritedFontFamily()
  },
  { immediate: true },
)
watch(getElement, updateInheritedFontFamily, { immediate: true, flush: 'post' })
watch(
  getFontStyle,
  (newValue) => {
    fontStyle.value = newValue
  },
  { immediate: true },
)
</script>

<template>
  <EditorAccordion :default-expanded="props.defaultOpen" :class="props.prettyHeader ? '' : ''">
    <template #title>{{ translate('Typographies') }}</template>
    <template #content>
      <p v-if="!props.splitBasicAdvanced" class="pbx-myPrimaryParagraph pbx-font-medium pbx-pt-6">
        {{ translate('Font Appearance') }}
      </p>

      <template v-if="props.splitBasicAdvanced">
        <div class="pbx-pt-2 pbx-space-y-3">
          <div
            class="pbx-rounded-xl pbx-border pbx-border-solid pbx-border-gray-200 pbx-bg-gray-50 pbx-p-3"
          >
            <div class="pbx-space-y-3">
              <div>
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
                  <option
                    v-for="option in availableFontFamilyOptions.filter(
                      (entry) => entry.value !== 'none',
                    )"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
                <p
                  v-if="!hasExplicitFontFamily && inheritedFontFamily"
                  class="pbx-mt-1 pbx-mb-0 pbx-text-xs pbx-text-gray-500"
                >
                  {{ translate('Inherited') }}: {{ inheritedFontFamily }}
                </p>
              </div>

              <div class="pbx-grid pbx-grid-cols-1 md:pbx-grid-cols-2 pbx-gap-3">
                <div>
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

                <div>
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
              </div>
            </div>
          </div>

          <button
            type="button"
            class="pbx-flex pbx-w-full pbx-items-center pbx-justify-between pbx-rounded-lg pbx-border pbx-border-solid pbx-border-gray-200 pbx-bg-white pbx-px-3 pbx-py-2 pbx-font-sans pbx-text-sm pbx-font-medium pbx-text-gray-700 hover:pbx-bg-gray-100"
            @click="showAdvancedTypography = !showAdvancedTypography"
          >
            <span>{{ translate('More options') }}</span>
            <span
              class="material-symbols-outlined pbx-text-base pbx-leading-none"
              aria-hidden="true"
            >
              {{ showAdvancedTypography ? 'expand_less' : 'expand_more' }}
            </span>
          </button>

          <div
            v-if="showAdvancedTypography"
            class="pbx-rounded-xl pbx-border pbx-border-solid pbx-border-gray-200 pbx-bg-white pbx-p-3"
          >
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
        </div>
      </template>

      <template v-else>
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
            <option
              v-for="option in availableFontFamilyOptions.filter((entry) => entry.value !== 'none')"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
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
    </template>
  </EditorAccordion>
</template>
