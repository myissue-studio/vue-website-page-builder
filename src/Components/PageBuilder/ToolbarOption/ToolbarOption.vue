<script setup>
import { computed, ref } from 'vue'
import { sharedPageBuilderStore } from '../../../stores/shared-store'
import ModalBuilder from '../../Modals/ModalBuilder.vue'
import PageBuilderSettings from '../Settings/PageBuilderSettings.vue'
import AdvancedPageBuilderSettings from '../Settings/AdvancedPageBuilderSettings.vue'

import DynamicModalBuilder from '../../Modals/DynamicModalBuilder.vue'

import { getPageBuilder } from '../../../composables/builderInstance'
import { delay } from '../../../composables/delay'
import { useTranslations } from '../../../composables/useTranslations'

const { translate } = useTranslations()

const pageBuilderService = getPageBuilder()

// Use shared store instance
const pageBuilderStateStore = sharedPageBuilderStore

const getPageBuilderConfig = computed(() => {
  return pageBuilderStateStore.getPageBuilderConfig
})

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
  //
  // handle click
  thirdModalButtonFunctionDynamicModalBuilder.value = async function () {
    isDeletingLayout.value = true
    await pageBuilderService.clearHtmlSelection()
    await pageBuilderService.handleFormSubmission()
    await delay(500)

    showModalDeleteAllComponents.value = false
    isDeletingLayout.value = false
  }
  // end modal
}

// Settings
const showMainSettings = ref(false)

// handle slideover window
const handleMainSettings = function () {
  showMainSettings.value = false
}

const openMainSettings = function () {
  showMainSettings.value = true
}

// Settings
const showHTMLSettings = ref(false)

// handle slideover window
const closeHTMLSettings = function () {
  showHTMLSettings.value = false
}

const openHTMLSettings = async function () {
  await pageBuilderService.generateHtmlFromComponents()
  showHTMLSettings.value = true
}
</script>

<template>
  <div>
    <div class="pbx-flex pbx-items-center pbx-justify-center">
      <div class="pbx-mr-2">
        <!-- User No image Start-->
        <div
          class="pbx-flex pbx-items-center pbx-myPrimaryTag pbx-whitespace-nowrap pbx-py-0 pbx-gap-2"
          v-if="
            getPageBuilderConfig &&
            getPageBuilderConfig.userForPageBuilder &&
            getPageBuilderConfig.userForPageBuilder.name &&
            (!getPageBuilderConfig.userForPageBuilder.image ||
              (typeof getPageBuilderConfig.userForPageBuilder.image === 'string' &&
                getPageBuilderConfig.userForPageBuilder.image?.length < 2))
          "
        >
          <div
            class="pbx-text-white pbx-rounded-full pbx-bg-myPrimaryBrandColor pbx-flex pbx-justify-center pbx-items-center pbx-text-xs pbx-d pbx-min-d pbx-max-d lg:pbx-w-8 lg:pbx-h-8 lg:pbx-min-w-8 lg:pbx-max-w-8 pbx-w-8 pbx-h-8 pbx-min-w-8 pbx-max-w-8 pbx-font-normal"
          >
            {{
              typeof getPageBuilderConfig.userForPageBuilder.name === 'string' &&
              getPageBuilderConfig.userForPageBuilder.name[0]
            }}
          </div>
          <div
            class="pbx-hidden pbx-text-xs pbx-d lg:pbx-flex pbx-items-center pbx-font-normal pbx-w-max pbx-break-keep"
          >
            {{ getPageBuilderConfig.userForPageBuilder.name }}
          </div>
        </div>

        <!-- User No image End -->

        <!-- User With image Start-->
        <div
          class="pbx-flex pbx-items-center lg:pbx-myPrimaryTag pbx-whitespace-nowrap pbx-py-0 pbx-gap-4 pbx-w-max pbx-h-12 pbx-ml-2"
          v-if="
            getPageBuilderConfig &&
            getPageBuilderConfig.userForPageBuilder &&
            getPageBuilderConfig.userForPageBuilder.name &&
            getPageBuilderConfig.userForPageBuilder.image &&
            typeof getPageBuilderConfig.userForPageBuilder.image === 'string' &&
            getPageBuilderConfig.userForPageBuilder.image.length > 2
          "
        >
          <div
            class="pbx-text-white pbx-flex-shrink-0 pbx-d pbx-w-10 pbx-h-10 pbx-rounded-full pbx-flex pbx-justify-center pbx-items-center pbx-text-xs pbx-rounded-l-full"
          >
            <img
              alt="Avatar"
              :src="`${getPageBuilderConfig.userForPageBuilder.image}`"
              class="pbx-block pbx-inset-0 pbx-object-top pbx-d pbx-min-d pbx-max-d lg:pbx-w-8 lg:pbx-h-8 lg:pbx-min-w-8 lg:pbx-max-w-8 pbx-w-8 pbx-h-8 pbx-min-w-8 pbx-max-w-8 pbx-object-cover pbx-rounded-full"
            />
          </div>
          <div
            class="pbx-hidden pbx-text-xs pbx-d lg:pbx-flex pbx-items-center pbx-font-normal pbx-w-max pbx-break-keep"
          >
            {{ getPageBuilderConfig.userForPageBuilder.name }}
          </div>
        </div>
      </div>

      <!-- User With image End -->

      <div class="pbx-hidden lg:pbx-block">
        <!-- Component Start -->
        <div class="pbx-relative pbx-group">
          <button type="button" class="pbx-mySecondaryButton pbx-font-normal pbx-text-xs">
            <span> {{ translate('Options') }} </span>
          </button>
          <div
            class="pbx-absolute pbx-left-0 -pbx-ml-16 -pbx-mt-2 pbx-flex pbx-flex-col pbx-gap-3 pbx-shadow-lg pbx-bg-white pbx-w-max pbx-border-solid pbx-border pbx-border-gray-100 pbx-rounded-2xl pbx-transition-all pbx-duration-200 pbx-ease-out pbx-pt-4 pbx-pr-4 pbx-pb-4 pbx-pl-2 pbx-z-30 pbx-opacity-0 pbx-pointer-events-none pbx-translate-y-2 group-hover:pbx-opacity-100 group-hover:pbx-pointer-events-auto group-hover:pbx-translate-y-0"
          >
            <!-- Main Settings Start -->
            <button
              @click="
                async () => {
                  await pageBuilderService.clearHtmlSelection()
                  openMainSettings()
                }
              "
              class="pbx-mySecondaryButton pbx-text-xs pbx-font-normal"
              type="button"
            >
              {{ translate('Config Overview') }}
            </button>
            <!-- Main Settings End -->

            <!-- HTML Settings Start -->
            <button
              @click="openHTMLSettings"
              class="pbx-mySecondaryButton pbx-text-xs pbx-font-normal"
              type="button"
            >
              {{ translate('HTML Overview') }}
            </button>
            <!-- HTML Settings End -->

            <!-- Delete Layout Start -->
            <button
              @click="handleDeleteComponentsFromDOM"
              class="pbx-myPrimaryDeleteButton pbx-text-xs pbx-font-normal"
              type="button"
            >
              {{ translate('Delete Layout') }}
            </button>
            <!-- Delete Layout End -->
          </div>
        </div>
      </div>
      <!-- Component End -->
    </div>

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
