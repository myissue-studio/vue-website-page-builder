<script setup lang="ts">
import { ref, computed } from 'vue'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import EditorAccordion from '../EditorAccordion.vue'
import { getPageBuilder } from '../../../../composables/usePageBuilder'
import { useTranslations } from '../../../../composables/useTranslations'

const { translate } = useTranslations()
const pageBuilderService = getPageBuilder()

const pageBuilderStateStore = sharedPageBuilderStore

const currentStyles = computed(() => pageBuilderStateStore.getCurrentStyles)

const inputProperty = ref('')
const inputValue = ref('')
const errorMessage = ref('')
const valueInputRef = ref<HTMLInputElement | null>(null)

const handleEnterOnProperty = () => {
  if (valueInputRef.value) {
    valueInputRef.value.focus()
  }
}

const handleAddStyle = async () => {
  const property = inputProperty.value.trim()
  const value = inputValue.value.trim()

  if (!property || !value) {
    errorMessage.value = translate('Please enter a property and a value.')
    return
  }

  if (currentStyles.value && currentStyles.value[property]) {
    errorMessage.value = `"${property}" ${translate('already exists. Remove it first to add a new one.')}`
    return
  }

  errorMessage.value = '' // Clear error

  pageBuilderService.handleAddStyle(property, value)
  await pageBuilderService.initializeElementStyles()

  inputProperty.value = ''
  inputValue.value = ''
}
</script>

<template>
  <EditorAccordion>
    <template #title>{{ translate('Inline Styles') }}</template>
    <template #content>
      <p class="pbx-editorSectionDesc">
        {{
          translate(
            'These are the inline styles applied by the builder. Add your own styles and press Enter to apply them to the selected element.',
          )
        }}
      </p>

      <div class="pbx-flex pbx-flex-row pbx-flex-wrap pbx-gap-2 pbx-mb-4">
        <div
          v-for="(value, key) in currentStyles"
          :key="key"
          class="pbx-myPrimaryTag pbx-cursor-pointer hover:pbx-bg-myPrimaryErrorColor hover:pbx-text-white pbx-text-xs pbx-py-2 pbx-font-medium"
          @click="
            async () => {
              pageBuilderService.handleRemoveStyle(key)
              await pageBuilderService.initializeElementStyles()
            }
          "
        >
          <div class="pbx-flex pbx-items-center pbx-gap-1">
            <span class="pbx-mr-1"> {{ key }}: {{ value }}; </span>
          </div>
        </div>
      </div>

      <hr />
      <p class="pbx-editorSectionTitle">
        {{ translate('Add your own style.') }}
      </p>
      <div class="pbx-editorFieldGroup">
        <div class="pbx-flex pbx-gap-2 pbx-flex-col pbx-item-center">
          <input
            id="custom-style-property"
            v-model="inputProperty"
            type="text"
            :aria-label="translate('property')"
            :placeholder="translate('property')"
            @keydown.enter.prevent="handleEnterOnProperty"
            autocomplete="off"
            class="pbx-myPrimaryInput"
          />
          <input
            id="custom-style-value"
            ref="valueInputRef"
            v-model="inputValue"
            type="text"
            :aria-label="translate('value')"
            :placeholder="translate('value')"
            @keydown.enter="handleAddStyle"
            autocomplete="off"
            class="pbx-myPrimaryInput"
          />

          <button @click="handleAddStyle" type="button" class="pbx-myPrimaryButton">
            {{ translate('Add') }}
          </button>
        </div>
      </div>
      <p v-if="errorMessage" class="pbx-myPrimaryInputError">{{ errorMessage }}</p>
    </template>
  </EditorAccordion>
</template>
