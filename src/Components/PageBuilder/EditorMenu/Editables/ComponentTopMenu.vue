<script setup>
import DynamicModalBuilder from '../../../Modals/DynamicModalBuilder.vue'
import { ref } from 'vue'
import { getPageBuilder } from '../../../../composables/builderInstance'
import { useTranslations } from '../../../../composables/useTranslations'
import { delay } from '../../../../composables/delay'
import PageBuilderSettings from '../../Settings/PageBuilderSettings.vue'
import ModalBuilder from '../../../../Components/Modals/ModalBuilder.vue'
import AdvancedPageBuilderSettings from '../../Settings/AdvancedPageBuilderSettings.vue'

const { translate } = useTranslations()

const pageBuilderService = getPageBuilder()

const isDeletingLayout = ref(false)
const showModalDeleteAllComponents = ref(false)

const typeModal = ref('')
const gridColumnModal = ref(Number(1))
const titleModal = ref('')
const descriptionModal = ref('')
const firstButtonModal = ref('')
const secondButtonModal = ref(null)
const thirdButtonModal = ref(null)

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

  firstModalButtonFunctionDynamicModalBuilder.value = function () {
    showModalDeleteAllComponents.value = false
  }
  secondModalButtonFunctionDynamicModalBuilder.value = function () {}
  thirdModalButtonFunctionDynamicModalBuilder.value = async function () {
    isDeletingLayout.value = true
    await pageBuilderService.clearHtmlSelection()
    await pageBuilderService.handleFormSubmission()
    await delay(500)

    showModalDeleteAllComponents.value = false
    isDeletingLayout.value = false
  }
}

const showHTMLSettings = ref(false)

const closeHTMLSettings = function () {
  showHTMLSettings.value = false
}
const openHTMLSettings = async function () {
  await pageBuilderService.generateHtmlFromComponents()
  showHTMLSettings.value = true
}
const showMainSettings = ref(false)

const handleMainSettings = function () {
  showMainSettings.value = false
}
const openMainSettings = function () {
  showMainSettings.value = true
}
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

      <!-- HTML Settings Start -->

      <div class="pbx-flex pbx-gap-2 pbx-items-center pbx-justify-center">
        <div
          @click="openHTMLSettings"
          class="pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white"
        >
          <span class="material-symbols-outlined"> deployed_code </span>
        </div>
      </div>

      <!-- HTML Settings End -->

      <!-- settings start -->
      <div class="pbx-flex pbx-gap-2 pbx-items-center pbx-justify-center">
        <div
          @click="
            async () => {
              await pageBuilderService.clearHtmlSelection()
              openMainSettings()
            }
          "
          class="pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white"
        >
          <svg
            fill="currentColor"
            height="22"
            viewBox="0 0 22 22"
            width="22"
            xmlns="http://www.w3.org/2000/svg"
            class="css-1a6490m"
          >
            <path
              clip-rule="evenodd"
              d="M15.192 5.393A6.965 6.965 0 0012 4.071V2h-2v2.07a6.964 6.964 0 00-3.192 1.323L5.344 3.93 3.93 5.343l1.464 1.464A6.964 6.964 0 004.07 10H2v2h2.07a6.964 6.964 0 001.324 3.193L3.93 16.657l1.414 1.414 1.464-1.464A6.964 6.964 0 0010 17.929V20h2v-2.07a6.964 6.964 0 003.192-1.323l1.465 1.464 1.414-1.414-1.465-1.465A6.964 6.964 0 0017.93 12H20v-2h-2.07a6.963 6.963 0 00-1.324-3.193l1.464-1.464-1.414-1.414-1.464 1.464zM11 16a5 5 0 100-10 5 5 0 000 10z"
              fill-rule="evenodd"
            ></path>
          </svg>
        </div>
      </div>
      <!-- settings end -->
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

    <ModalBuilder
      maxWidth="5xl"
      :showModalBuilder="showHTMLSettings"
      :title="translate('Selected HTML')"
      @closeMainModalBuilder="closeHTMLSettings"
      minHeight=""
      maxHeight=""
    >
      <AdvancedPageBuilderSettings> </AdvancedPageBuilderSettings>
    </ModalBuilder>

    <ModalBuilder
      maxWidth="5xl"
      :showModalBuilder="showMainSettings"
      title="Main Settings"
      @closeMainModalBuilder="handleMainSettings"
      minHeight=""
      maxHeight=""
    >
      <PageBuilderSettings> </PageBuilderSettings>
    </ModalBuilder>
  </div>
</template>
