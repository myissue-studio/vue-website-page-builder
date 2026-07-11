<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import EditorAccordion from '../EditorAccordion.vue'
import CustomDropdown from '../../../Inputs/CustomDropdown.vue'
import tailwindBorderRadius from '../../../../utils/builder/tailwind-border-radius'
import { getPageBuilder } from '../../../../composables/usePageBuilder'
import { useTranslations } from '../../../../composables/useTranslations'

const { translate } = useTranslations()
const pageBuilderService = getPageBuilder()

const pageBuilderStateStore = sharedPageBuilderStore

const borderRadiusGlobal = ref<string | null>(null)
const borderRadiusTopLeft = ref<string | null>(null)
const borderRadiusTopRight = ref<string | null>(null)
const borderRadiusBottomleft = ref<string | null>(null)
const borderRadiusBottomRight = ref<string | null>(null)

const withSelectOption = (values: string[]) => [
  { value: '', label: translate('Select'), disabled: true },
  ...values.map((value) => ({ value, label: value })),
]

const getBorderRadiusGlobal = computed(() => {
  return pageBuilderStateStore.getBorderRadiusGlobal
})
const getBorderRadiusTopLeft = computed(() => {
  return pageBuilderStateStore.getBorderRadiusTopLeft
})
const getBorderRadiusTopRight = computed(() => {
  return pageBuilderStateStore.getBorderRadiusTopRight
})
const getBorderRadiusBottomleft = computed(() => {
  return pageBuilderStateStore.getBorderRadiusBottomleft
})
const getBorderRadiusBottomRight = computed(() => {
  return pageBuilderStateStore.getBorderRadiusBottomRight
})

watch(
  getBorderRadiusGlobal,
  (newValue) => {
    borderRadiusGlobal.value = newValue ?? ''
  },
  { immediate: true },
)
watch(
  getBorderRadiusTopLeft,
  (newValue) => {
    borderRadiusTopLeft.value = newValue ?? ''
  },
  { immediate: true },
)
watch(
  getBorderRadiusTopRight,
  (newValue) => {
    borderRadiusTopRight.value = newValue ?? ''
  },
  { immediate: true },
)
watch(
  getBorderRadiusBottomleft,
  (newValue) => {
    borderRadiusBottomleft.value = newValue ?? ''
  },
  { immediate: true },
)
watch(
  getBorderRadiusBottomRight,
  (newValue) => {
    borderRadiusBottomRight.value = newValue ?? ''
  },
  { immediate: true },
)
</script>

<template>
  <EditorAccordion>
    <template #title>{{ translate('Border Radius') }}</template>
    <template #content>
      <p class="pbx-editorSectionTitle">
        {{ translate('Global') }}
      </p>
      <div class="pbx-editorFieldGroup">
        <label for="global-border-radius" class="pbx-myPrimaryInputLabel">{{
          translate('Border Radius')
        }}</label>
        <CustomDropdown
          id="global-border-radius"
          v-model="borderRadiusGlobal"
          :options="withSelectOption(tailwindBorderRadius.roundedGlobal)"
          @select="(value) => pageBuilderService.handleBorderRadiusGlobal(value || undefined)"
        >
          <template #button>
            <span class="pbx-block pbx-truncate">{{
              borderRadiusGlobal || translate('Select')
            }}</span>
          </template>
        </CustomDropdown>
      </div>
      <hr />
      <p class="pbx-editorSectionTitle">
        {{ translate('Specific') }}
      </p>
      <div class="pbx-editorFieldGroup">
        <label for="border-radius-top-left" class="pbx-myPrimaryInputLabel">
          {{ translate('Border Radius top left') }}
        </label>
        <CustomDropdown
          id="border-radius-top-left"
          v-model="borderRadiusTopLeft"
          :options="withSelectOption(tailwindBorderRadius.roundedTopLeft)"
          @select="(value) => pageBuilderService.handleBorderRadiusTopLeft(value || undefined)"
        >
          <template #button>
            <span class="pbx-block pbx-truncate">{{
              borderRadiusTopLeft || translate('Select')
            }}</span>
          </template>
        </CustomDropdown>
      </div>
      <hr />
      <div class="pbx-editorFieldGroup">
        <label for="border-radius-top-right" class="pbx-myPrimaryInputLabel">
          {{ translate('Border Radius top right') }}
        </label>
        <CustomDropdown
          id="border-radius-top-right"
          v-model="borderRadiusTopRight"
          :options="withSelectOption(tailwindBorderRadius.roundedTopRight)"
          @select="(value) => pageBuilderService.handleBorderRadiusTopRight(value || undefined)"
        >
          <template #button>
            <span class="pbx-block pbx-truncate">{{
              borderRadiusTopRight || translate('Select')
            }}</span>
          </template>
        </CustomDropdown>
      </div>
      <hr />
      <div class="pbx-editorFieldGroup">
        <label for="border-radius-bottom-left" class="pbx-myPrimaryInputLabel">
          {{ translate('Border Radius bottom left') }}
        </label>
        <CustomDropdown
          id="border-radius-bottom-left"
          v-model="borderRadiusBottomleft"
          :options="withSelectOption(tailwindBorderRadius.roundedBottomLeft)"
          @select="(value) => pageBuilderService.handleBorderRadiusBottomleft(value || undefined)"
        >
          <template #button>
            <span class="pbx-block pbx-truncate">{{
              borderRadiusBottomleft || translate('Select')
            }}</span>
          </template>
        </CustomDropdown>
      </div>
      <hr />
      <div class="pbx-editorFieldGroup">
        <label for="border-radius-bottom-right" class="pbx-myPrimaryInputLabel">
          {{ translate('Border Radius bottom right') }}
        </label>
        <CustomDropdown
          id="border-radius-bottom-right"
          v-model="borderRadiusBottomRight"
          :options="withSelectOption(tailwindBorderRadius.roundedBottomRight)"
          @select="(value) => pageBuilderService.handleBorderRadiusBottomRight(value || undefined)"
        >
          <template #button>
            <span class="pbx-block pbx-truncate">{{
              borderRadiusBottomRight || translate('Select')
            }}</span>
          </template>
        </CustomDropdown>
      </div>
    </template>
  </EditorAccordion>
</template>
