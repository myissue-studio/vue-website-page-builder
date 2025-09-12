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

const seoResult = ref(null)
const showSEO = ref(false)

const handleSEO = async function () {
  showSEO.value = !showSEO.value

  if (showSEO.value) {
    seoResult.value = await pageBuilderService.analyzeSEO()
    console.log('data eeer:', seoResult.value)
  }
}

const closeSEO = function () {
  showSEO.value = false
}
</script>

<template>
  <div>
    <div class="pbx-flex pbx-flex-col pbx-items-center pbx-justify-center pbx-myPrimaryGap">
      <div class="pbx-flex pbx-gap-2 pbx-items-center pbx-justify-center">
        <div
          @click="handleDeleteComponentsFromDOM"
          class="pbx-select-none pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryErrorColor hover:pbx-text-white pbx-text-myPrimaryErrorColor"
        >
          <span class="material-symbols-outlined"> delete_forever </span>
        </div>
      </div>

      <div class="pbx-w-full pbx-border-t pbx-border-solid pbx-border-gray-200"></div>

      <!-- SEO Start -->
      <div class="pbx-flex pbx-gap-2 pbx-items-center pbx-justify-center pbx-relative">
        <div
          @click="handleSEO"
          class="pbx-select-none pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white"
        >
          <div class="pbx-font-semibold pbx-text-sm">SEO</div>
        </div>

        <transition name="popup-fade">
          <div
            v-if="showSEO"
            class="pbx-top-0 pbx-left-full pbx-ml-2 pbx-absolute pbx-z-40 pbx-min-h-50 lg:pbx-w-[50rem] pbx-w-[40rem] pbx-min-h-92"
          >
            <div
              class="lg:pbx-mr-10 pbx-rounded-3xl pbx-border pbx-border-gray-100 pbx-bg-white pbx-shadow-lg pbx-pt-4 pbx-pb-4 pbx-flex pbx-flex-col pbx-overflow-y-auto pbx-max-h-[50vh] pbx-mx-4 pbx-pl-2 pbx-pr-4"
            >
              <div
                class="pbx-flex pbx-gap-2 pbx-items-center pbx-justify-between pbx-border-b pbx-border-gray-200 pbx-pb-4 pbx-pl-2"
              >
                <span class="pbx-text-black pbx-font-medium">SEO</span>

                <!-- Close Modal start -->
                <div
                  @click="closeSEO"
                  class="pbx-select-none pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-black pbx-text-white pbx-aspect-square pbx-hover:fill-white pbx-focus-visible:ring-0 pbx-hover:outline-3 pbx-hover:outline-offset-2 pbx-hover:outline-black pbx-transition-all pbx-duration-100"
                >
                  <span class="material-symbols-outlined"> close </span>
                </div>
                <!-- Close Modal end -->
              </div>

              <div>
                <!-- score start -->
                <div class="pbx-flex pbx-items-center pbx-justify-center pbx-gap-2">
                  <div
                    class="pbx-lg:pbx-text-base pbx-text-sm pbx-font-semibold pbx-text-center pbx-min-h-14 pbx-flex pbx-justify-center pbx-items-center"
                  >
                    <!-- score animation start -->
                    <template v-if="seoResult">
                      <div
                        class="pbx-my-4 pbx-p-8 pbx-border pbx-border-red-100 pbx-rounded-full pbx-aspect-square pbx-flex pbx-flex-col pbx-items-center pbx-justify-center pbx-bg-gray-100"
                      >
                        <div>
                          <span class="pbx-lg:pbx-text-7xl pbx-text-5xl">{{
                            seoResult.score
                          }}</span>
                          <span class="pbx-text-xl">%</span>
                        </div>
                      </div>
                      <!-- score animation end -->
                    </template>
                    <!--v-if-->
                  </div>
                </div>
                <!-- score end -->
                <!-- Checks start -->
                <div
                  v-if="seoResult && seoResult.checks && seoResult.checks.length"
                  class="pbx-w-full"
                >
                  <h3 class="pbx-text-xl pbx-font-semibold pbx-mb-4 pbx-text-center">
                    SEO Check Results
                  </h3>
                  <ul class="pbx-space-y-4">
                    <li
                      v-for="(check, index) in seoResult.checks"
                      :key="index"
                      class="pbx-flex pbx-items-start pbx-gap-4 pbx-p-4 pbx-bg-white pbx-rounded-lg pbx-shadow-sm pbx-border"
                      :class="check.passed ? 'pbx-border-green-200' : 'pbx-border-red-200'"
                    >
                      <!-- Status indicator -->
                      <div class="pbx-flex-shrink-0 pbx-mt-1">
                        <template v-if="check.passed">
                          <div
                            class="pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white"
                          >
                            <span class="material-symbols-outlined"> check </span>
                          </div>
                        </template>
                        <template v-if="!check.passed">
                          <div
                            class="pbx-select-none pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-myPrimaryErrorColor pbx-aspect-square hover:pbx-bg-myPrimaryErrorColor hover:pbx-text-white pbx-text-white"
                          >
                            <span class="material-symbols-outlined">
                              check_indeterminate_small
                            </span>
                          </div>
                        </template>
                      </div>
                      <!-- Check details -->
                      <div class="pbx-flex-1">
                        <p
                          class="pbx-text-lg pbx-font-medium"
                          :class="check.passed ? 'pbx-text-green-700' : 'pbx-text-red-700'"
                        >
                          {{ check.check }}
                        </p>
                        <p class="pbx-text-sm pbx-text-gray-600">{{ check.details }}</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div v-else class="pbx-text-gray-500 pbx-text-center">No SEO checks available.</div>
                <!-- Checks end -->
              </div>
            </div>
          </div>
        </transition>
      </div>
      <!-- SEO End -->

      <!-- HTML Settings Start -->
      <div class="pbx-flex pbx-gap-2 pbx-items-center pbx-justify-center">
        <div
          @click="openHTMLSettings"
          class="pbx-select-none pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white"
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
          class="pbx-select-none pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white"
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
