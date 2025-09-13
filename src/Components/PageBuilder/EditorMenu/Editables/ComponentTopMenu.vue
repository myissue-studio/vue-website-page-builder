<script setup>
import DynamicModalBuilder from '../../../Modals/DynamicModalBuilder.vue'
import { ref } from 'vue'
import { getPageBuilder } from '../../../../composables/builderInstance'
import { useTranslations } from '../../../../composables/useTranslations'
import { delay } from '../../../../composables/delay'
import PageBuilderSettings from '../../Settings/PageBuilderSettings.vue'
import ModalBuilder from '../../../../Components/Modals/ModalBuilder.vue'
import AdvancedPageBuilderSettings from '../../Settings/AdvancedPageBuilderSettings.vue'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'

const { translate } = useTranslations()

// Use shared store instance
const pageBuilderStateStore = sharedPageBuilderStore

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

const openHTMLSettings = async function () {
  showHTMLSettings.value = true
  pageBuilderStateStore.setToggleGlobalHtmlMode(true)
  await pageBuilderService.globalPageStyles()

  await pageBuilderService.generateHtmlFromComponents()
}

const closeHTMLSettings = async function () {
  await pageBuilderService.handleManualSave()

  // Remove global highlight if present
  const pagebuilder = document.querySelector('#pagebuilder')
  if (pagebuilder) {
    pagebuilder.removeAttribute('data-global-selected')
  }
  showHTMLSettings.value = false
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
  }
}

const closeSEO = function () {
  showSEO.value = false
}
</script>

<template>
  <div>
    <div class="pbx-flex pbx-flex-col pbx-items-center pbx-justify-center pbx-myPrimaryGap">
      <!-- SEO Start -->
      <div class="pbx-flex pbx-gap-2 pbx-items-center pbx-justify-center pbx-relative">
        <div
          @click="handleSEO"
          pbx-bg-myPrimaryLinkColor
          class="pbx-select-none pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white"
          :class="{ 'pbx-bg-myPrimaryLinkColor pbx-text-white': showSEO }"
        >
          <div class="pbx-font-semibold pbx-text-sm">SEO</div>
        </div>

        <transition name="popup-fade">
          <div
            v-if="showSEO"
            class="pbx-top-0 pbx-left-full pbx-ml-2 pbx-absolute pbx-z-40 lg:pbx-w-[35rem] pbx-w-[30rem]"
          >
            <!-- Overlay: covers the whole screen, closes popup on click -->
            <div
              class="pbx-fixed pbx-inset-0 pbx-bg-black pbx-bg-opacity-10 pbx-z-30"
              @click="closeSEO"
            ></div>
            <!-- Popup: stays next to the SEO button, not centered -->
            <div
              class="pbx-top-0 pbx-left-0 pbx-ml-2 pbx-absolute pbx-z-40 lg:pbx-w-[35rem] pbx-w-[25rem]"
              @click.stop
            >
              <div
                class="lg:pbx-mr-10 pbx-rounded-3xl pbx-border pbx-border-gray-100 pbx-bg-white pbx-shadow-lg pbx-pt-4 pbx-pb-4 pbx-flex pbx-flex-col pbx-overflow-y-auto pbx-min-h-[35rem] pbx-max-h-[35rem] pbx-mx-4 pbx-pl-2 pbx-pr-4"
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
                  <!-- score indicator start -->
                  <div class="pbx-flex pbx-items-center pbx-justify-center pbx-gap-2">
                    <div
                      class="pbx-lg:pbx-text-base pbx-text-sm pbx-font-semibold pbx-text-center pbx-min-h-14 pbx-flex pbx-justify-center pbx-items-center"
                    >
                      <template v-if="seoResult">
                        <!-- Outer ring -->
                        <div
                          class="pbx-relative pbx-my-4 pbx-rounded-full pbx-flex pbx-items-center pbx-justify-center pbx-w-36 pbx-h-36"
                          :style="{
                            background: `conic-gradient(${
                              seoResult.score < 50 ? '#ef4444' : '#50C878'
                            } ${seoResult.score}%, #e5e7eb 0)`,
                          }"
                        >
                          <!-- Inner circle -->
                          <div
                            class="pbx-bg-gray-100 pbx-rounded-full pbx-w-32 pbx-h-32 pbx-flex pbx-items-center pbx-justify-center"
                          >
                            <div class="text-center">
                              <span class="pbx-lg:pbx-text-7xl pbx-text-5xl">{{
                                seoResult.score
                              }}</span>
                              <span class="pbx-text-xl">%</span>
                            </div>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                  <!-- score indicator end -->

                  <!-- Checks start -->
                  <div
                    v-if="seoResult && seoResult.checks && seoResult.checks.length"
                    class="pbx-w-full"
                  >
                    <h3 class="pbx-text-xl pbx-font-semibold pbx-mb-4 pbx-text-center">
                      {{ translate('SEO Check Results') }}
                    </h3>
                    <ul class="pbx-space-y-4">
                      <li
                        v-for="(check, index) in seoResult.checks"
                        :key="index"
                        class="pbx-flex pbx-items-start pbx-gap-4 pbx-p-4 pbx-bg-white pbx-rounded-lg pbx-shadow-sm pbx-border-2"
                        :class="check.passed ? 'pbx-border-emerald-500' : 'pbx-border-red-600'"
                      >
                        <!-- Status indicator -->
                        <div class="pbx-flex-shrink-0 pbx-mt-1">
                          <template v-if="check.passed">
                            <div
                              class="pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-myPrimaryLinkColor pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-white hover:pbx-text-white"
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
                  <div v-else class="pbx-text-gray-500 pbx-text-center">
                    No SEO checks available.
                  </div>
                  <!-- Checks end -->
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <!-- SEO End -->

      <div class="pbx-flex pbx-gap-2 pbx-items-center pbx-justify-center">
        <div
          @click="handleDeleteComponentsFromDOM"
          class="pbx-select-none pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryErrorColor hover:pbx-text-white pbx-text-myPrimaryErrorColor"
        >
          <span class="material-symbols-outlined"> delete_forever </span>
        </div>
      </div>

      <div class="pbx-w-full pbx-border-t pbx-border-solid pbx-border-gray-200"></div>

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
