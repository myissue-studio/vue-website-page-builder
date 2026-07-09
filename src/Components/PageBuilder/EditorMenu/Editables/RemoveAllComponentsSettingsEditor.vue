<script setup lang="ts">
import { ref } from 'vue'
import EditorAccordion from '../EditorAccordion.vue'
import ConfirmActionModal from '../../../Modals/ConfirmActionModal.vue'
import HtmlActionButton from './HtmlActionButton.vue'
import { getPageBuilder } from '../../../../composables/usePageBuilder'
import { useTranslations } from '../../../../composables/useTranslations'
import { useToast } from '../../../../composables/useToast'
import { sleep } from '../../../../utils/sleep'

defineOptions({
  name: 'RemoveAllComponentsSettingsEditor',
})

const { translate } = useTranslations()
const { showToast } = useToast()
const pageBuilderService = getPageBuilder()

const isDeletingLayout = ref(false)
const showModalDeleteAllComponents = ref(false)

const typeModal = ref('')
const gridColumnModal = ref(Number(1))
const titleModal = ref('')
const descriptionModal = ref('')
const firstButtonModal = ref('')
const secondButtonModal = ref<string | null>(null)
const thirdButtonModal = ref<string | null>(null)

const firstModalButtonFunctionDynamicModalBuilder = ref<(() => void) | null>(null)
const secondModalButtonFunctionDynamicModalBuilder = ref<(() => void) | null>(null)
const thirdModalButtonFunctionDynamicModalBuilder = ref<(() => Promise<void>) | null>(null)

const handleDeleteComponentsFromDOM = function () {
  showModalDeleteAllComponents.value = true
  typeModal.value = 'delete'
  gridColumnModal.value = 2
  titleModal.value = translate('Remove all Components')
  descriptionModal.value = translate('Are you sure you want to remove all Components?')
  firstButtonModal.value = translate('Close')
  secondButtonModal.value = null
  thirdButtonModal.value = translate('Delete')

  firstModalButtonFunctionDynamicModalBuilder.value = function () {
    showModalDeleteAllComponents.value = false
  }
  secondModalButtonFunctionDynamicModalBuilder.value = function () {}
  thirdModalButtonFunctionDynamicModalBuilder.value = async function () {
    isDeletingLayout.value = true
    await pageBuilderService.clearHtmlSelection()
    await pageBuilderService.handleFormSubmission()
    await sleep(500)

    showModalDeleteAllComponents.value = false
    isDeletingLayout.value = false
    showToast(translate('All components removed'), 'success')
  }
}
</script>

<template>
  <EditorAccordion>
    <template #title>{{ translate('Page layout') }}</template>
    <template #content>
      <p class="pbx-editorSectionDesc">
        {{ translate('Remove all components description') }}
      </p>

      <HtmlActionButton
        icon="delete_forever"
        :label="translate('Remove all Components')"
        :hint="translate('Clear every section from the page')"
        variant="danger"
        @click="handleDeleteComponentsFromDOM"
      />
    </template>
  </EditorAccordion>

  <ConfirmActionModal
    :showDynamicModalBuilder="showModalDeleteAllComponents"
    :type="typeModal"
    :gridColumnAmount="gridColumnModal"
    :title="titleModal"
    :description="descriptionModal"
    :isLoading="isDeletingLayout"
    :firstButtonText="firstButtonModal"
    :secondButtonText="secondButtonModal ?? undefined"
    :thirdButtonText="thirdButtonModal ?? undefined"
    @firstModalButtonFunctionDynamicModalBuilder="
      () => firstModalButtonFunctionDynamicModalBuilder?.()
    "
    @secondModalButtonFunctionDynamicModalBuilder="
      () => secondModalButtonFunctionDynamicModalBuilder?.()
    "
    @thirdModalButtonFunctionDynamicModalBuilder="
      () => thirdModalButtonFunctionDynamicModalBuilder?.()
    "
  >
    <header></header>
    <main></main>
  </ConfirmActionModal>
</template>
