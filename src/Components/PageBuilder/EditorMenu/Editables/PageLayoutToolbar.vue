<script setup lang="ts">
import type { SEOSummary } from '../../../../types'
import ConfirmActionModal from '../../../Modals/ConfirmActionModal.vue'
import { ref, computed } from 'vue'
import { getPageBuilder } from '../../../../composables/usePageBuilder'
import { useTranslations } from '../../../../composables/useTranslations'
import { useToast } from '../../../../composables/useToast'
import { sleep } from '../../../../utils/sleep'
import FloatingSidePanel from '../../../../Components/Overlays/FloatingSidePanel.vue'

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

const seoResult = ref<SEOSummary | null>(null)
const showSEO = ref(false)

const seoGroups = computed(() => {
  if (!seoResult.value) return []
  const map = new Map<string, typeof seoResult.value.checks>()
  for (const check of seoResult.value.checks) {
    const cat = check.category ?? 'Other'
    if (!map.has(cat)) map.set(cat, [])
    map.get(cat)!.push(check)
  }
  return Array.from(map.entries()).map(([title, checks]) => ({ title, checks }))
})

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

        <!-- Overlay SEO start -->
        <FloatingSidePanel
          title="SEO"
          :showSidebarPanel="showSEO"
          @closeSidebarPanel="closeSEO"
          position="left"
        >
          <!-- score indicator start -->
          <div class="pbx-overflow-y-auto">
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
                        <div class="pbx-text-center">
                          <span class="pbx-lg:pbx-text-7xl pbx-text-5xl">
                            {{ seoResult.score }}
                          </span>
                          <span class="pbx-text-xl">%</span>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
              <!-- score indicator end -->

              <!-- Checks start -->
              <div v-if="seoGroups.length" class="pbx-w-full pbx-space-y-6">
                <h3 class="pbx-text-xl pbx-font-semibold pbx-mb-4 pbx-text-center">
                  {{ translate('SEO Check Results') }}
                </h3>

                <div v-for="group in seoGroups" :key="group.title">
                  <!-- Group heading -->
                  <h4
                    class="pbx-text-sm pbx-font-semibold pbx-uppercase pbx-tracking-widest pbx-text-gray-400 pbx-mb-3 pbx-px-1"
                  >
                    {{ translate(group.title) }}
                  </h4>

                  <ul class="pbx-space-y-3">
                    <li
                      v-for="(check, index) in group.checks"
                      :key="index"
                      class="pbx-flex pbx-items-start pbx-gap-4 pbx-p-4 pbx-bg-white pbx-rounded-lg pbx-border-solid pbx-border-2"
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
                          {{ translate(check.check) }}
                        </p>
                        <p class="pbx-text-sm pbx-text-gray-600">
                          {{ check.details }}
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div v-else class="pbx-text-gray-500 pbx-text-center">
                {{ translate('No SEO checks available.') }}
              </div>
              <!-- Checks end -->
            </div>
          </div>

          <!-- score indicator end -->
        </FloatingSidePanel>
        <!-- Overlay SEO end -->
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
    </div>

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
  </div>
</template>
