<script setup>
import { ref, computed, nextTick } from 'vue'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import ModalBuilder from '../../../../Components/Modals/ModalBuilder.vue'
import EditorAccordion from '../EditorAccordion.vue'
import { getPageBuilder } from '../../../../composables/builderInstance'
import { useTranslations } from '../../../../composables/useTranslations'
import { delay } from '../../../../composables/delay'

const pageBuilderService = getPageBuilder()
const pageBuilderStateStore = sharedPageBuilderStore
const { translate } = useTranslations()

const props = defineProps({
  globalPage: {
    type: Boolean,
  },
})

const getElement = computed(() => pageBuilderStateStore.getElement)

const elementHTML = computed(() => {
  if (!getElement.value || !(getElement.value instanceof HTMLElement)) {
    return ''
  }
  return getElement.value.outerHTML
})

const showModalHTMLEditor = ref(false)

const editableHtml = ref('')
const editableComponents = ref('')

const handleShowHTMLEditor = async () => {
  showModalHTMLEditor.value = true

  if (!props.globalPage) {
    editableHtml.value = elementHTML.value
    return
  }

  editableComponents.value = await pageBuilderService.generateHtmlFromComponents()
}

const handleCloseHTMLEditor = () => {
  showModalHTMLEditor.value = false
}

const isLoading = ref(false)
const errSaveComponents = ref(null)

const handleSaveChangesElement = async () => {
  errSaveComponents.value = null
  isLoading.value = true
  await delay(300)

  const error = await pageBuilderService.applyModifiedHTML(editableHtml.value)

  if (error) {
    errSaveComponents.value = error
    isLoading.value = false
    return
  }

  showModalHTMLEditor.value = false
  isLoading.value = false
}

const handleSaveChangesComponents = async () => {
  errSaveComponents.value = null
  isLoading.value = true
  errSaveComponents.value = null
  await delay(300)

  const error = await pageBuilderService.applyModifiedComponents(editableComponents.value)

  if (error) {
    errSaveComponents.value = error
    isLoading.value = false
    return
  }

  showModalHTMLEditor.value = false
  isLoading.value = false
}
</script>
<template>
  <EditorAccordion>
    <template #title>{{ translate('HTML Editor') }}</template>
    <template #content>
      <div class="pbx-my-2 pbx-py-2">
        <label for="vertical-margin" class="pbx-myPrimaryInputLabel">{{
          translate('Gain full control over components by editing the raw HTML.')
        }}</label>
        <hr />
      </div>
      <button @click="handleShowHTMLEditor" type="button" class="pbx-myPrimaryButton">
        {{ translate('HTML Editor') }}
      </button>
    </template>
  </EditorAccordion>
  <ModalBuilder
    maxWidth="7xl"
    :showModalBuilder="showModalHTMLEditor"
    :title="translate('HTML Editor')"
    @closeMainModalBuilder="handleCloseHTMLEditor"
  >
    <template v-if="!globalPage">
      <textarea
        id="html-editor"
        v-model="editableHtml"
        class="pbx-h-full pbx-font-sans pbx-bg-gray-900 pbx-text-white pbx-w-full"
        style="overflow: auto; min-height: 400px"
      ></textarea>
      <div class="pbx-flex pbx-justify-end pbx-min-h-6">
        <p v-if="errSaveComponents" class="pbx-myPrimaryParagraphError">
          Error: {{ errSaveComponents }}
        </p>
      </div>
      <div
        class="pbx-border-0 pbx-border-solid pbx-border-t pbx-border-gray-200 pbx-flex pbx-items-center pbx-justify-end"
      >
        <div class="pbx-py-4 pbx-flex sm:pbx-justify-end pbx-justify-center">
          <div
            class="sm:pbx-grid-cols-2 sm:pbx-items-end sm:pbx-justify-end pbx-flex sm:pbx-flex-row pbx-flex-col pbx-myPrimaryGap sm:pbx-w-5/6 pbx-w-full"
          >
            <template v-if="!isLoading">
              <button @click="handleCloseHTMLEditor" type="button" class="pbx-mySecondaryButton">
                {{ translate('Close') }}
              </button>
              <button @click="handleSaveChangesElement" type="button" class="pbx-myPrimaryButton">
                {{ translate('Save') }}
              </button>
            </template>
            <template v-if="isLoading">
              <div class="pbx-flex pbx-items-center pbx-my-2 pbx-justify-end">
                <div
                  class="pbx-inline-block pbx-h-8 pbx-w-8 pbx-animate-spin pbx-rounded-full pbx-border-4 pbx-border-solid pbx-border-current pbx-border-r-transparent pbx-align-[-0.125em] motion-reduce:pbx-animate-[spin_1.5s_linear_infinite]"
                >
                  <span
                    class="!pbx-absolute !pbx-m-px !pbx-h-px !pbx-w-px !pbx-overflow-hidden !pbx-whitespace-nowrap !pbx-border-0 !pbx-p-0 !pbx-[clip:rect(0,0,0,0)]"
                    >Loading...</span
                  >
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>

    <template v-if="globalPage">
      <textarea
        id="html-editor"
        v-model="editableComponents"
        class="pbx-h-full pbx-font-sans pbx-bg-gray-900 pbx-text-white pbx-w-full"
        style="overflow: auto; min-height: 400px"
      ></textarea>
      <div class="pbx-flex pbx-justify-end pbx-min-h-6">
        <p v-if="errSaveComponents" class="pbx-myPrimaryParagraphError">
          Error: {{ errSaveComponents }}
        </p>
      </div>
      <div
        class="pbx-border-0 pbx-border-solid pbx-border-t pbx-border-gray-200 pbx-flex pbx-items-center pbx-justify-end"
      >
        <div class="pbx-py-4 pbx-flex sm:pbx-justify-end pbx-justify-center">
          <div
            class="sm:pbx-grid-cols-2 sm:pbx-items-end sm:pbx-justify-end pbx-flex sm:pbx-flex-row pbx-flex-col pbx-myPrimaryGap sm:pbx-w-5/6 pbx-w-full"
          >
            <template v-if="!isLoading">
              <button @click="handleCloseHTMLEditor" type="button" class="pbx-mySecondaryButton">
                {{ translate('Close') }}
              </button>
              <button
                @click="handleSaveChangesComponents"
                type="button"
                class="pbx-myPrimaryButton"
              >
                {{ translate('Save') }}
              </button>
            </template>
            <template v-if="isLoading">
              <div class="pbx-flex pbx-items-center pbx-my-2 pbx-justify-end">
                <div
                  class="pbx-inline-block pbx-h-8 pbx-w-8 pbx-animate-spin pbx-rounded-full pbx-border-4 pbx-border-solid pbx-border-current pbx-border-r-transparent pbx-align-[-0.125em] motion-reduce:pbx-animate-[spin_1.5s_linear_infinite]"
                >
                  <span
                    class="!pbx-absolute !pbx-m-px !pbx-h-px !pbx-w-px !pbx-overflow-hidden !pbx-whitespace-nowrap !pbx-border-0 !pbx-p-0 !pbx-[clip:rect(0,0,0,0)]"
                    >Loading...</span
                  >
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
  </ModalBuilder>
</template>
