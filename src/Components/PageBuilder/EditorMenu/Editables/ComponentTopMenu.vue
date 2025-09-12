<script setup>
import DynamicModalBuilder from '../../../Modals/DynamicModalBuilder.vue'
import { ref, computed } from 'vue'
import { getPageBuilder } from '../../../../composables/builderInstance'
import { useTranslations } from '../../../../composables/useTranslations'
import { delay } from '../../../../composables/delay'

const { translate } = useTranslations()

const pageBuilderService = getPageBuilder()

// Delete all componenets start
const isDeletingLayout = ref(false)
const showModalDeleteAllComponents = ref(false)
//
// use dynamic model
const typeModal = ref('')
const gridColumnModal = ref(Number(1))
const titleModal = ref('')
const descriptionModal = ref('')
const firstButtonModal = ref('')
const secondButtonModal = ref(null)
const thirdButtonModal = ref(null)
// set dynamic modal handle functions
const firstModalButtonFunctionDynamicModalBuilder = ref(null)
const secondModalButtonFunctionDynamicModalBuilder = ref(null)
const thirdModalButtonFunctionDynamicModalBuilder = ref(null)

const handleDeleteComponentsFromDOM = function () {
  showModalDeleteAllComponents.value = true
  typeModal.value = 'delete'
  gridColumnModal.value = 2
  titleModal.value = translate('Remove all Components')
  descriptionModal.value = translate('Are you sure you want to remove all Components?')
  firstButtonModal.value = translate('Close')
  secondButtonModal.value = null
  thirdButtonModal.value = translate('Delete')

  // handle click
  firstModalButtonFunctionDynamicModalBuilder.value = function () {
    showModalDeleteAllComponents.value = false
  }
  secondModalButtonFunctionDynamicModalBuilder.value = function () {
    //
  }
  //
  // handle click
  thirdModalButtonFunctionDynamicModalBuilder.value = async function () {
    isDeletingLayout.value = true
    await pageBuilderService.clearHtmlSelection()
    await pageBuilderService.handleFormSubmission()
    await delay(500)
    delay

    showModalDeleteAllComponents.value = false
    isDeletingLayout.value = false
  }
  // end modal
}
// Delete all componenets end
</script>

<template>
  <div>
    <div class="pbx-flex pbx-flex-col pbx-items-center pbx-justify-center pbx-myPrimaryGap">
      <div class="pbx-flex pbx-gap-2 pbx-items-center pbx-justify-center">
        <div
          @click="handleDeleteComponentsFromDOM"
          class="pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryErrorColor hover:pbx-text-white pbx-text-myPrimaryErrorColor"
        >
          <span class="material-symbols-outlined"> delete_forever </span>
        </div>
      </div>
    </div>

    <DynamicModalBuilder
      :showDynamicModalBuilder="showModalDeleteAllComponents"
      :type="typeModal"
      :gridColumnAmount="gridColumnModal"
      :title="titleModal"
      :description="descriptionModal"
      :isLoading="isDeletingLayout"
      :firstButtonText="firstButtonModal"
      :secondButtonText="secondButtonModal"
      :thirdButtonText="thirdButtonModal"
      @firstModalButtonFunctionDynamicModalBuilder="firstModalButtonFunctionDynamicModalBuilder"
      @secondModalButtonFunctionDynamicModalBuilder="secondModalButtonFunctionDynamicModalBuilder"
      @thirdModalButtonFunctionDynamicModalBuilder="thirdModalButtonFunctionDynamicModalBuilder"
    >
      <header></header>
      <main></main>
    </DynamicModalBuilder>
  </div>
</template>
