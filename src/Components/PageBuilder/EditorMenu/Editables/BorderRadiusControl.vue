<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import EditorAccordion from '../EditorAccordion.vue'
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
    borderRadiusGlobal.value = newValue
  },
  { immediate: true },
)
watch(
  getBorderRadiusTopLeft,
  (newValue) => {
    borderRadiusTopLeft.value = newValue
  },
  { immediate: true },
)
watch(
  getBorderRadiusTopRight,
  (newValue) => {
    borderRadiusTopRight.value = newValue
  },
  { immediate: true },
)
watch(
  getBorderRadiusBottomleft,
  (newValue) => {
    borderRadiusBottomleft.value = newValue
  },
  { immediate: true },
)
watch(
  getBorderRadiusBottomRight,
  (newValue) => {
    borderRadiusBottomRight.value = newValue
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
        <select
          id="global-border-radius"
          v-model="borderRadiusGlobal"
          class="pbx-myPrimarySelect"
          @change="pageBuilderService.handleBorderRadiusGlobal(borderRadiusGlobal ?? undefined)"
        >
          <option disabled value="">{{ translate('Select') }}</option>
          <option
            v-for="borderRadiusGlobal in tailwindBorderRadius.roundedGlobal"
            :key="borderRadiusGlobal"
          >
            {{ borderRadiusGlobal }}
          </option>
        </select>
      </div>
      <hr />
      <p class="pbx-editorSectionTitle">
        {{ translate('Specific') }}
      </p>
      <div class="pbx-editorFieldGroup">
        <label for="border-radius-top-left" class="pbx-myPrimaryInputLabel">
          {{ translate('Border Radius top left') }}
        </label>
        <select
          id="border-radius-top-left"
          v-model="borderRadiusTopLeft"
          class="pbx-myPrimarySelect"
          @change="pageBuilderService.handleBorderRadiusTopLeft(borderRadiusTopLeft ?? undefined)"
        >
          <option disabled value="">{{ translate('Select') }}</option>
          <option
            v-for="borderRadiusTopLeft in tailwindBorderRadius.roundedTopLeft"
            :key="borderRadiusTopLeft"
          >
            {{ borderRadiusTopLeft }}
          </option>
        </select>
      </div>
      <hr />
      <div class="pbx-editorFieldGroup">
        <label for="border-radius-top-right" class="pbx-myPrimaryInputLabel">
          {{ translate('Border Radius top right') }}
        </label>
        <select
          id="border-radius-top-right"
          v-model="borderRadiusTopRight"
          class="pbx-myPrimarySelect"
          @change="pageBuilderService.handleBorderRadiusTopRight(borderRadiusTopRight ?? undefined)"
        >
          <option disabled value="">{{ translate('Select') }}</option>
          <option
            v-for="borderRadiusTopRight in tailwindBorderRadius.roundedTopRight"
            :key="borderRadiusTopRight"
          >
            {{ borderRadiusTopRight }}
          </option>
        </select>
      </div>
      <hr />
      <div class="pbx-editorFieldGroup">
        <label for="border-radius-bottom-left" class="pbx-myPrimaryInputLabel">
          {{ translate('Border Radius bottom left') }}
        </label>
        <select
          id="border-radius-bottom-left"
          v-model="borderRadiusBottomleft"
          class="pbx-myPrimarySelect"
          @change="
            pageBuilderService.handleBorderRadiusBottomleft(borderRadiusBottomleft ?? undefined)
          "
        >
          <option disabled value="">{{ translate('Select') }}</option>
          <option
            v-for="borderRadiusBottomleft in tailwindBorderRadius.roundedBottomLeft"
            :key="borderRadiusBottomleft"
          >
            {{ borderRadiusBottomleft }}
          </option>
        </select>
      </div>
      <hr />
      <div class="pbx-editorFieldGroup">
        <label for="border-radius-bottom-right" class="pbx-myPrimaryInputLabel">
          {{ translate('Border Radius bottom right') }}
        </label>
        <select
          id="border-radius-bottom-right"
          v-model="borderRadiusBottomRight"
          class="pbx-myPrimarySelect"
          @change="
            pageBuilderService.handleBorderRadiusBottomRight(borderRadiusBottomRight ?? undefined)
          "
        >
          <option disabled value="">{{ translate('Select') }}</option>
          <option
            v-for="borderRadiusBottomRight in tailwindBorderRadius.roundedBottomRight"
            :key="borderRadiusBottomRight"
          >
            {{ borderRadiusBottomRight }}
          </option>
        </select>
      </div>
    </template>
  </EditorAccordion>
</template>
