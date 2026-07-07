<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import EditorAccordion from '../EditorAccordion.vue'
import { getPageBuilder } from '../../../../composables/usePageBuilder'
import { useTranslations } from '../../../../composables/useTranslations'

const { translate } = useTranslations()
const pageBuilderService = getPageBuilder()
const pageBuilderStateStore = sharedPageBuilderStore

const getElement = computed(() => pageBuilderStateStore.getElement)

const iconName = ref('shopping_bag')
const iconSize = ref('20px')
const iconColor = ref('')
const hasIcon = ref(false)

watch(
  getElement,
  () => {
    const iconState = pageBuilderService.getSelectedElementInlineIconSettings()
    hasIcon.value = iconState.enabled
    iconName.value = iconState.name || 'shopping_bag'
    iconSize.value = iconState.size || '20px'
    iconColor.value = iconState.color || ''
  },
  { immediate: true },
)

const canUseIcons = computed(() => {
  const element = getElement.value
  if (!element) return false
  if (element.tagName === 'IMG') return false
  return true
})

const applyIcon = async () => {
  if (!canUseIcons.value) return
  pageBuilderService.setSelectedElementInlineIcon({
    name: iconName.value,
    size: iconSize.value,
    color: iconColor.value,
  })
  hasIcon.value = true
  await pageBuilderService.handleAutoSave()
}

const removeIcon = async () => {
  if (!canUseIcons.value) return
  pageBuilderService.removeSelectedElementInlineIcon()
  hasIcon.value = false
  await pageBuilderService.handleAutoSave()
}
</script>

<template>
  <EditorAccordion>
    <template #title>{{ translate('Icon') }}</template>
    <template #content>
      <p class="pbx-editorSectionDesc">
        {{
          translate(
            'Add a Material icon before the selected element content. The icon is saved in exported HTML.',
          )
        }}
      </p>

      <div v-if="canUseIcons" class="pbx-editorFieldGroup">
        <div class="pbx-flex pbx-flex-col pbx-gap-2">
          <input
            v-model="iconName"
            type="text"
            :aria-label="translate('Icon name')"
            :placeholder="translate('Icon name')"
            autocomplete="off"
            class="pbx-myPrimaryInput"
          />

          <div class="pbx-grid pbx-grid-cols-2 pbx-gap-2">
            <input
              v-model="iconSize"
              type="text"
              :aria-label="translate('Icon size')"
              :placeholder="translate('Icon size')"
              autocomplete="off"
              class="pbx-myPrimaryInput"
            />
            <input
              v-model="iconColor"
              type="text"
              :aria-label="translate('Icon color')"
              :placeholder="translate('Icon color')"
              autocomplete="off"
              class="pbx-myPrimaryInput"
            />
          </div>

          <div class="pbx-flex pbx-gap-2">
            <button type="button" class="pbx-myPrimaryButton pbx-flex-1" @click="applyIcon">
              {{ hasIcon ? translate('Update') : translate('Add') }}
            </button>
            <button
              type="button"
              class="pbx-myPrimaryDeleteButton"
              :disabled="!hasIcon"
              @click="removeIcon"
            >
              {{ translate('Remove') }}
            </button>
          </div>
        </div>
      </div>

      <p v-else class="pbx-myPrimaryParagraph pbx-text-sm pbx-text-gray-500 pbx-my-0">
        {{ translate('Select a non-image element to add an icon.') }}
      </p>
    </template>
  </EditorAccordion>
</template>
