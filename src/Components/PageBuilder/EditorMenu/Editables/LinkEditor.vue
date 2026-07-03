<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import EditorAccordion from '../EditorAccordion.vue'
import { Switch } from '@headlessui/vue'
import { getPageBuilder } from '../../../../composables/usePageBuilder'
import { useTranslations } from '../../../../composables/useTranslations'
const pageBuilderService = getPageBuilder()
const { translate } = useTranslations()

// Use shared store instance
const pageBuilderStateStore = sharedPageBuilderStore

const hyperlinkEnable = ref(false)
const urlInput = ref<string | null>(null)
const openHyperlinkInNewTab = ref(false)
const getElementContainsHyperlink = computed(() => {
  return pageBuilderStateStore.getElementContainsHyperlink
})
const getHyperlinkAbility = computed(() => {
  return pageBuilderStateStore.getHyperlinkAbility
})
const getHyperlinkMessage = computed(() => {
  return pageBuilderStateStore.getHyperlinkMessage
})
const getHyperlinkError = computed(() => {
  return pageBuilderStateStore.getHyperlinkError
})
const getHyperlinkInput = computed(() => {
  return pageBuilderStateStore.getHyperlinkInput
})
const getHyberlinkEnable = computed(() => {
  return pageBuilderStateStore.getHyberlinkEnable
})

const getOpenHyperlinkInNewTab = computed(() => {
  return pageBuilderStateStore.getOpenHyperlinkInNewTab
})

watch(getHyperlinkInput, (newValue) => {
  urlInput.value = newValue
})
watch(getHyberlinkEnable, (newValue) => {
  hyperlinkEnable.value = newValue
})
watch(getOpenHyperlinkInNewTab, (newValue) => {
  openHyperlinkInNewTab.value = newValue ?? false
})

// remove hyperlink
watch(hyperlinkEnable, (hyperlinkEnableNewValue) => {
  hyperlinkEnable.value = hyperlinkEnableNewValue
  pageBuilderStateStore.setHyberlinkEnable(hyperlinkEnable.value)
})

const handleToggleHyperlinkEnable = async function (data: string) {
  await nextTick()

  // remove hyperlink
  if (hyperlinkEnable.value === false) {
    pageBuilderService.handleHyperlink(hyperlinkEnable.value, data)
  }
}
// add hyperlink
const handleHyperlink = function () {
  pageBuilderService.handleHyperlink(
    hyperlinkEnable.value,
    urlInput.value,
    openHyperlinkInNewTab.value,
  )
}

const handleToggleOpenHyperlinkInNewTab = async function () {
  await nextTick()

  pageBuilderService.handleHyperlink(
    hyperlinkEnable.value,
    urlInput.value,
    openHyperlinkInNewTab.value,
  )
}
</script>

<template>
  <EditorAccordion>
    <template #title>{{ translate('Link') }}</template>
    <template #content>
      <!-- Hyperlink ability / start -->
      <div v-if="getHyperlinkAbility === false" class="pbx-rounded-md pbx-bg-red-50 pbx-p-2">
        <div class="pbx-flex pbx-items-center">
          <div class="pbx-flex-shrink-0">
            <span class="pbx-myMediumIcon material-symbols-outlined"> warning </span>
          </div>
          <div class="pbx-ml-2">
            <p class="pbx-text-sm pbx-font-medium pbx-text-green-800">
              {{ translate('Not able to add hyperlink on this element') }}
            </p>
          </div>
          <div class="pbx-ml-auto pbx-pl-3">
            <div class="pbx-mx-1.5 pbx-my-1.5">
              <button
                type="button"
                class="pbx-inline-flex pbx-rounded-md pbx-bg-green-50 pbx-p-1.5 pbx-text-green-500 hover:pbx-bg-green-100 focus:pbx-outline-none focus:pbx-ring-2 focus:pbx-ring-green-600 focus:pbx-ring-offset-2 focus:pbx-ring-offset-green-50"
              ></button>
            </div>
          </div>
        </div>
      </div>
      <!-- Hyperlink ability / end -->
      <div v-if="getHyperlinkAbility === true">
        <div class="pbx-my-2 pbx-py-2">
          <div class="pbx-flex pbx-items-center pbx-justify-between pbx-gap-2 pbx-w-full">
            <p class="pbx-myPrimaryParagraph">{{ translate('Enable hyperlink') }}</p>
            <!-- Toggle start -->
            <Switch
              v-model="hyperlinkEnable"
              @click="handleToggleHyperlinkEnable('removeHyperlink')"
              :class="[
                hyperlinkEnable ? 'pbx-bg-myPrimaryLinkColor' : 'pbx-bg-gray-200',
                'pbx-relative pbx-inline-flex pbx-h-6 pbx-w-11 pbx-flex-shrink-0 pbx-cursor-pointer pbx-rounded-full pbx-border-2 pbx-border-transparent pbx-transition-colors pbx-duration-200 pbx-ease-in-out focus:pbx-outline-none focus:pbx-ring-2 focus:pbx-ring-myPrimaryLinkColor focus:pbx-ring-offset-2',
              ]"
            >
              <span class="pbx-sr-only">Use setting</span>
              <span
                :style="hyperlinkEnable ? { transform: 'translateX(1.25rem)' } : { transform: 'translateX(0)' }"
                :class="[
                  'pbx-pointer-events-none pbx-relative pbx-inline-block pbx-h-5 pbx-w-5 pbx-rounded-full pbx-bg-white pbx-shadow pbx-ring-0 pbx-transition pbx-duration-200 pbx-ease-in-out',
                ]"
              >
                <span
                  :class="[
                    hyperlinkEnable
                      ? 'pbx-opacity-0 pbx-ease-out pbx-duration-100'
                      : 'pbx-opacity-100 pbx-ease-in pbx-duration-200',
                    'pbx-absolute pbx-inset-0 pbx-flex pbx-h-full pbx-w-full pbx-items-center pbx-justify-center pbx-transition-opacity',
                  ]"
                  aria-hidden="true"
                >
                  <svg class="pbx-h-3 pbx-w-3 pbx-text-gray-400" fill="none" viewBox="0 0 12 12">
                    <path
                      d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
                <span
                  :class="[
                    hyperlinkEnable
                      ? 'pbx-opacity-100 pbx-ease-in pbx-duration-200'
                      : 'pbx-opacity-0 pbx-ease-out pbx-duration-100',
                    'pbx-absolute pbx-inset-0 pbx-flex pbx-h-full pbx-w-full pbx-items-center pbx-justify-center pbx-transition-opacity',
                  ]"
                  aria-hidden="true"
                >
                  <svg
                    class="pbx-h-3 pbx-w-3 pbx-text-myPrimaryLinkColor"
                    fill="currentColor"
                    viewBox="0 0 12 12"
                  >
                    <path
                      d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z"
                    />
                  </svg>
                </span>
              </span>
            </Switch>
            <!-- Toggle end -->
          </div>
        </div>
        <!-- attached url - start -->
        <div
          v-if="getElementContainsHyperlink === true"
          class="pbx-rounded-md pbx-bg-green-50 pbx-p-2"
        >
          <div class="pbx-flex pbx-items-center">
            <div class="pbx-flex-shrink-0">
              <span class="pbx-myMediumIcon material-symbols-outlined"> check </span>
            </div>
            <div class="pbx-ml-2">
              <p class="pbx-text-sm pbx-font-medium pbx-text-green-800">
                {{ translate('Hyperlink added') }}
              </p>
            </div>
            <div class="pbx-ml-auto pbx-pl-3">
              <div class="pbx-mx-1.5 pbx-my-1.5">
                <button
                  type="button"
                  class="pbx-inline-flex pbx-rounded-md pbx-bg-green-50 pbx-p-1.5 pbx-text-green-500 hover:pbx-bg-green-100 focus:pbx-outline-none focus:pbx-ring-2 focus:pbx-ring-green-600 focus:pbx-ring-offset-2 focus:pbx-ring-offset-green-50"
                ></button>
              </div>
            </div>
          </div>
        </div>
        <!-- attached url - end -->
        <!-- no attached url - start -->
        <div
          v-if="getElementContainsHyperlink === false"
          class="pbx-rounded-md pbx-bg-red-50 pbx-p-2"
        >
          <div class="pbx-flex pbx-items-center">
            <div class="pbx-flex-shrink-0">
              <span class="pbx-myMediumIcon material-symbols-outlined"> warning </span>
            </div>
            <div class="pbx-ml-2">
              <p class="pbx-text-sm pbx-font-medium pbx-text-green-800">
                {{ translate('No hyperlink added') }}
              </p>
            </div>
            <div class="pbx-ml-auto pbx-pl-3">
              <div class="pbx-mx-1.5 pbx-my-1.5">
                <button
                  type="button"
                  class="pbx-inline-flex pbx-rounded-md pbx-bg-green-50 pbx-p-1.5 pbx-text-green-500 hover:pbx-bg-green-100 focus:pbx-outline-none focus:pbx-ring-2 focus:pbx-ring-green-600 focus:pbx-ring-offset-2 focus:pbx-ring-offset-green-50"
                ></button>
              </div>
            </div>
          </div>
        </div>
        <!-- no attached url - end -->
        <div v-if="hyperlinkEnable === true" class="pbx-my-2 pbx-py-2">
          <div
            class="pbx-relative pbx-flex pbx-items-center pbx-w-full pbx-border-solid pbx-border pbx-border-gray-200 pbx-myPrimaryInput pbx-py-0 pbx-p-0"
          >
            <input
              v-model="urlInput"
              type="text"
              :placeholder="translate('URL..')"
              autocomplete="off"
              class="pbx-myPrimaryInput pbx-border-none pbx-rounded-r-none pbx-ml-0 pbx-w-full"
              @keydown.enter.tab.prevent="handleHyperlink()"
            />
            <div
              class="pbx-border-none pbx-rounded pbx-flex pbx-items-center pbx-justify-center pbx-h-full pbx-w-8"
            >
              <kbd class="pbx-myPrimaryParagraph pbx-text-gray-400 pbx-border-none"> ⏎ </kbd>
            </div>
          </div>

          <p
            v-if="getHyperlinkMessage !== null"
            class="pbx-myPrimaryParagraph pbx-text-myPrimarySuccesColor pbx-mt-1"
          >
            {{ getHyperlinkMessage }}
          </p>
          <p v-if="getHyperlinkError !== null" class="pbx-myPrimaryParagraphError pbx-mt-1">
            {{ getHyperlinkError }}
          </p>

          <div class="pbx-my-2 pbx-py-2">
            <div class="pbx-flex pbx-items-center pbx-justify-between pbx-gap-2 pbx-w-full">
              <p class="pbx-myPrimaryParagraph">{{ translate('Open in new tab') }}</p>
              <!-- Toggle start -->
              <Switch
                v-model="openHyperlinkInNewTab"
                @click="handleToggleOpenHyperlinkInNewTab"
                :class="[
                  openHyperlinkInNewTab ? 'pbx-bg-myPrimaryLinkColor' : 'pbx-bg-gray-200',
                  'pbx-relative pbx-inline-flex pbx-h-6 pbx-w-11 pbx-flex-shrink-0 pbx-cursor-pointer pbx-rounded-full pbx-border-2 pbx-border-transparent pbx-transition-colors pbx-duration-200 pbx-ease-in-out focus:pbx-outline-none focus:pbx-ring-2 focus:pbx-ring-myPrimaryLinkColor focus:pbx-ring-offset-2',
                ]"
              >
                <span class="pbx-sr-only">Use setting</span>
                <span
                  :style="openHyperlinkInNewTab ? { transform: 'translateX(1.25rem)' } : { transform: 'translateX(0)' }"
                  :class="[
                    'pbx-pointer-events-none pbx-relative pbx-inline-block pbx-h-5 pbx-w-5 pbx-rounded-full pbx-bg-white pbx-shadow pbx-ring-0 pbx-transition pbx-duration-200 pbx-ease-in-out',
                  ]"
                >
                  <span
                    :class="[
                      openHyperlinkInNewTab
                        ? 'pbx-opacity-0 pbx-ease-out pbx-duration-100'
                        : 'pbx-opacity-100 pbx-ease-in pbx-duration-200',
                      'pbx-absolute pbx-inset-0 pbx-flex pbx-h-full pbx-w-full pbx-items-center pbx-justify-center pbx-transition-opacity',
                    ]"
                    aria-hidden="true"
                  >
                    <svg class="pbx-h-3 pbx-w-3 pbx-text-gray-400" fill="none" viewBox="0 0 12 12">
                      <path
                        d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span>
                  <span
                    :class="[
                      openHyperlinkInNewTab
                        ? 'pbx-opacity-100 pbx-ease-in pbx-duration-200'
                        : 'pbx-opacity-0 pbx-ease-out pbx-duration-100',
                      'pbx-absolute pbx-inset-0 pbx-flex pbx-h-full pbx-w-full pbx-items-center pbx-justify-center pbx-transition-opacity',
                    ]"
                    aria-hidden="true"
                  >
                    <svg
                      class="pbx-h-3 pbx-w-3 pbx-text-myPrimaryLinkColor"
                      fill="currentColor"
                      viewBox="0 0 12 12"
                    >
                      <path
                        d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z"
                      />
                    </svg>
                  </span>
                </span>
              </Switch>
              <!-- Toggle end -->
            </div>
          </div>
        </div>
      </div>
    </template>
  </EditorAccordion>
</template>
