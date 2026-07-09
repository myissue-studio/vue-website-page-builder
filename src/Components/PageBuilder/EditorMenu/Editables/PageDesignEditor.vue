<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTranslations } from '../../../../composables/useTranslations'
import { getPageBuilder } from '../../../../composables/usePageBuilder'
import ToggleInput from '../../../Inputs/ToggleInput.vue'
import TypographyControl from './TypographyControl.vue'
import ClassEditor from './ClassEditor.vue'
import StyleEditor from './StyleEditor.vue'
import PaddingControl from './PaddingControl.vue'
import MarginControl from './MarginControl.vue'
import BorderRadiusControl from './BorderRadiusControl.vue'
import BackgroundColorEditor from './BackgroundColorEditor.vue'
import TextColorEditor from './TextColorEditor.vue'
import BorderControls from './BorderControls.vue'
import HtmlActionButton from './HtmlActionButton.vue'
import ConfirmActionModal from '../../../Modals/ConfirmActionModal.vue'
import { useToast } from '../../../../composables/useToast'

defineOptions({
  name: 'PageDesignEditor',
})

defineProps({
  isLoading: {
    type: Boolean,
    required: true,
    default: true,
  },
})

const { translate } = useTranslations()
const { showToast } = useToast()

const pageBuilderService = getPageBuilder()

const globalFullWidthTick = ref(0)
const isGlobalFullWidth = computed(() => {
  void globalFullWidthTick.value
  return pageBuilderService.isGlobalFullWidth()
})

const updateGlobalFullWidth = async (enabled: boolean) => {
  const promise = pageBuilderService.setGlobalFullWidth(enabled)
  globalFullWidthTick.value++
  await promise
}

const isClearingPageDesignStyles = ref(false)
const showClearPageDesignModal = ref(false)

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

const clearPageClassesAndStyles = async () => {
  isClearingPageDesignStyles.value = true
  try {
    await pageBuilderService.clearHtmlSelection()
    await pageBuilderService.globalPageStyles()
    await pageBuilderService.clearClassesFromPage()
    await pageBuilderService.clearInlineStylesFromPage()
    await pageBuilderService.stopGlobalStylesSync()
    await pageBuilderService.globalPageStyles()
    showToast(translate('Page design styles cleared'), 'success')
  } catch {
    showToast(translate('Could not clear page design styles'), 'error')
  } finally {
    isClearingPageDesignStyles.value = false
    showClearPageDesignModal.value = false
  }
}

const openClearPageDesignModal = () => {
  showClearPageDesignModal.value = true
  typeModal.value = 'delete'
  gridColumnModal.value = 2
  titleModal.value = translate('Clear page classes & styles')
  descriptionModal.value = translate(
    'Are you sure you want to remove global page classes and inline styles?',
  )
  firstButtonModal.value = translate('Close')
  secondButtonModal.value = null
  thirdButtonModal.value = translate('Delete')

  firstModalButtonFunctionDynamicModalBuilder.value = () => {
    showClearPageDesignModal.value = false
  }
  secondModalButtonFunctionDynamicModalBuilder.value = () => {}
  thirdModalButtonFunctionDynamicModalBuilder.value = async () => {
    await clearPageClassesAndStyles()
  }
}
</script>

<template>
  <div
    class="pbx-pageDesignEditor"
    :class="[isLoading ? 'pbx-min-h-screen ' : 'pbx-min-h-[60rem]']"
  >
    <div
      v-if="isLoading"
      class="pbx-pageDesignLoading pbx-flex pbx-items-center pbx-justify-center pbx-min-h-screen"
    >
      <div
        class="pbx-inline-block pbx-h-8 pbx-w-8 pbx-animate-spin pbx-rounded-full pbx-border-4 pbx-border-solid pbx-border-current pbx-border-r-transparent"
        role="status"
      />
    </div>

    <div v-if="!isLoading">
      <p class="pbx-editorSectionDesc pbx-pageDesignIntro">
        {{
          translate(
            'Apply styles that affect the entire page. These settings include global font family, text color, background color, and other universal styles that apply to all sections.',
          )
        }}
      </p>

      <section class="pbx-pageDesignSection">
        <h4 class="pbx-pageDesignSectionTitle">{{ translate('Layout') }}</h4>
        <div class="pbx-pageDesignCard">
          <div class="pbx-pageDesignToggleRow">
            <div class="pbx-pageDesignToggleCopy">
              <p class="pbx-pageDesignToggleLabel">{{ translate('Full-width page') }}</p>
              <p class="pbx-pageDesignToggleHint">
                {{ translate('Stretch all sections across browser width') }}
              </p>
            </div>
            <ToggleInput
              :model-value="isGlobalFullWidth"
              @update:model-value="updateGlobalFullWidth"
            />
          </div>
        </div>
      </section>

      <section class="pbx-pageDesignSection">
        <div class="pbx-pageDesignCard pbx-pageDesignCardWide">
          <TypographyControl
            :default-open="true"
            :pretty-header="true"
            :split-basic-advanced="true"
          />
        </div>
      </section>

      <section class="pbx-pageDesignSection">
        <h4 class="pbx-pageDesignSectionTitle">{{ translate('Colors') }}</h4>
        <div class="pbx-pageDesignGrid">
          <div class="pbx-pageDesignCard">
            <p class="pbx-pageDesignCardLabel pbx-px-2">{{ translate('Text Color') }}</p>
            <TextColorEditor :globalPageLayout="true" />
          </div>
          <div class="pbx-pageDesignCard">
            <p class="pbx-pageDesignCardLabel pbx-px-2">{{ translate('Background Color') }}</p>
            <BackgroundColorEditor :globalPageLayout="true" />
          </div>
        </div>
      </section>

      <section class="pbx-pageDesignSection">
        <h4 class="pbx-pageDesignSectionTitle">{{ translate('Spacing') }}</h4>
        <div class="pbx-pageDesignGrid">
          <div class="pbx-pageDesignCard">
            <PaddingControl />
          </div>
          <div class="pbx-pageDesignCard">
            <MarginControl />
          </div>
        </div>
      </section>

      <section class="pbx-pageDesignSection">
        <h4 class="pbx-pageDesignSectionTitle">{{ translate('Borders') }}</h4>
        <div class="pbx-pageDesignGrid">
          <div class="pbx-pageDesignCard">
            <BorderRadiusControl />
          </div>
          <div class="pbx-pageDesignCard">
            <BorderControls />
          </div>
        </div>
      </section>

      <section class="pbx-pageDesignSection">
        <h4 class="pbx-pageDesignSectionTitle">{{ translate('Advanced') }}</h4>
        <div class="pbx-pageDesignGrid">
          <div class="pbx-pageDesignCard">
            <ClassEditor />
          </div>
          <div class="pbx-pageDesignCard">
            <StyleEditor />
          </div>
        </div>
      </section>

      <div
        class="pbx-grid pbx-grid-cols-1 lg:pbx-grid-cols-2 pbx-gap-4 pbx-mt-24 pbx-border-0 pbx-border-t pbx-border-gray-200 pbx-pt-8"
      >
        <div class="pbx-p-4 pbx-border pbx-border-gray-200 pbx-rounded-2xl"></div>
        <div class="pbx-p-4 pbx-border pbx-border-gray-200 pbx-rounded-2xl">
          <section class="pbx-pageDesignSection pbx-pageDesignLayoutAction">
            <HtmlActionButton
              icon="delete_forever"
              :label="translate('Clear page classes & styles')"
              :hint="translate('Remove global page classes and inline styles from the wrapper')"
              variant="danger"
              :is-loading="isClearingPageDesignStyles"
              @click="openClearPageDesignModal"
            />
          </section>
        </div>
      </div>
    </div>
  </div>

  <ConfirmActionModal
    :showDynamicModalBuilder="showClearPageDesignModal"
    :type="typeModal"
    :gridColumnAmount="gridColumnModal"
    :title="titleModal"
    :description="descriptionModal"
    :isLoading="isClearingPageDesignStyles"
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
