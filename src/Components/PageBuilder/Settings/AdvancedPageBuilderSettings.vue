<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTranslations } from '../../../composables/useTranslations'
import { getPageBuilder } from '../../../composables/builderInstance'
import ToggleInput from '../../Inputs/ToggleInput.vue'
import Typography from '../EditorMenu/Editables/Typography.vue'
import ClassEditor from '../EditorMenu/Editables/ClassEditor.vue'
import StyleEditor from '../EditorMenu/Editables/StyleEditor.vue'
import PaddingControl from '../EditorMenu/Editables/PaddingControl.vue'
import MarginControl from '../EditorMenu/Editables/MarginControl.vue'
import BorderRadius from '../EditorMenu/Editables/BorderRadius.vue'
import BackgroundColorEditor from '../EditorMenu/Editables/BackgroundColorEditor.vue'
import TextColorEditor from '../EditorMenu/Editables/TextColorEditor.vue'
import BorderControls from '../EditorMenu/Editables/BorderControls.vue'
import HTMLEditor from '../EditorMenu/Editables/HTMLEditor.vue'

defineProps({
  isLoading: {
    type: Boolean,
    required: true,
    default: true,
  },
})

const { translate } = useTranslations()

const pageBuilderService = getPageBuilder()

// Global full-width — reactive tick forces re-read of DOM state after toggle
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
</script>

<template>
  <div>
    <div>
      <!-- loading spinner start -->
      <div v-if="isLoading">
        <div class="pbx-flex pbx-items-top pbx-justify-center pbx-mt-4 pbx-min-h-screen">
          <div
            class="pbx-inline-block pbx-h-8 pbx-w-8 pbx-animate-spin pbx-rounded-full pbx-border-4 pbx-border-solid pbx-border-current pbx-border-r-transparent pbx-align-[-0.125em] motion-reduce:pbx-animate-[spin_1.5s_linear_infinite]"
          >
            <span
              class="!pbx-absolute !pbx-m-px !pbx-h-px !pbx-w-px !pbx-overflow-hidden !pbx-whitespace-nowrap !pbx-border-0 !pbx-p-0 !pbx-[clip:rect(0,0,0,0)]"
              >Loading...</span
            >
          </div>
        </div>
      </div>
      <!-- loading spinner end -->

      <!-- globalPageStyles start -->
      <div v-if="!isLoading" class="pbx-min-h-screen">
        <div>
          <p class="pbx-myPrimaryParagraph pbx-mt-6 pbx-mb-10">
            {{
              translate(
                'Apply styles that affect the entire page. These settings include global font family, text color, background color, and other universal styles that apply to all sections.',
              )
            }}
          </p>

          <!-- Global full-width toggle -->
          <div
            class="pbx-rounded-2xl pbx-border pbx-border-solid pbx-border-gray-100 pbx-bg-gray-50 pbx-px-4 pbx-py-3 pbx-mb-6"
          >
            <div class="pbx-flex pbx-items-center pbx-justify-between pbx-gap-4">
              <div class="pbx-flex pbx-flex-col pbx-gap-1">
                <p class="pbx-text-sm pbx-font-semibold pbx-text-myPrimaryDarkGrayColor">
                  {{ translate('Full-width page') }}
                </p>
                <p class="pbx-text-xs pbx-text-gray-500 pbx-my-0">
                  {{ translate('Stretch all sections across browser width') }}
                </p>
              </div>
              <ToggleInput
                :model-value="isGlobalFullWidth"
                @update:model-value="updateGlobalFullWidth"
              />
            </div>
          </div>

          <div
            class="pbx-grid lg:pbx-grid-cols-2 pbx-grid-cols-1 lg:pbx-gap-4 pbx-gap-4 pbx-py-4 pbx-mb-12"
          >
            <article
              class="pbx-my-1 pbx-bg-gray-50 pbx-px-4 pbx-pt-2 pbx-pb-8 pbx-border pbx-border-gray-400 lg:pbx-col-span-2"
            >
              <p class="pbx-myPrimaryParagraph pbx-italic pbx-pb-2 lg:pbx-mt-6 pbx-mt-8">
                Typography
              </p>
              <Typography></Typography>
            </article>
            <article
              class="pbx-my-1 pbx-bg-gray-50 pbx-px-4 pbx-pt-2 pbx-pb-8 pbx-border pbx-border-gray-400"
            >
              <p class="pbx-myPrimaryParagraph pbx-italic pbx-pb-2 lg:pbx-mt-6 pbx-mt-8">
                Text color
              </p>
              <TextColorEditor :globalPageLayout="true"></TextColorEditor>
            </article>
            <article
              class="pbx-my-1 pbx-bg-gray-50 pbx-px-4 pbx-pt-2 pbx-pb-8 pbx-border pbx-border-gray-400"
            >
              <p class="pbx-myPrimaryParagraph pbx-italic pbx-pb-2 lg:pbx-mt-6 pbx-mt-8">
                Background color
              </p>
              <BackgroundColorEditor :globalPageLayout="true"></BackgroundColorEditor>
            </article>
            <article
              class="pbx-my-1 pbx-bg-gray-50 pbx-px-4 pbx-pt-2 pbx-pb-8 pbx-border pbx-border-gray-400"
            >
              <p class="pbx-myPrimaryParagraph pbx-italic pbx-pb-2 lg:pbx-mt-6 pbx-mt-8">Padding</p>
              <PaddingControl> </PaddingControl>
            </article>
            <article
              class="pbx-my-1 pbx-bg-gray-50 pbx-px-4 pbx-pt-2 pbx-pb-8 pbx-border pbx-border-gray-400"
            >
              <p class="pbx-myPrimaryParagraph pbx-italic pbx-pb-2 lg:pbx-mt-6 pbx-mt-8">Margin</p>
              <MarginControl> </MarginControl>
            </article>
            <article
              class="pbx-my-1 pbx-bg-gray-50 pbx-px-4 pbx-pt-2 pbx-pb-8 pbx-border pbx-border-gray-400"
            >
              <p class="pbx-myPrimaryParagraph pbx-italic pbx-pb-2 lg:pbx-mt-6 pbx-mt-8">
                Border radius
              </p>
              <BorderRadius></BorderRadius>
            </article>
            <article
              class="pbx-my-1 pbx-bg-gray-50 pbx-px-4 pbx-pt-2 pbx-pb-8 pbx-border pbx-border-gray-400"
            >
              <p class="pbx-myPrimaryParagraph pbx-italic pbx-pb-2 lg:pbx-mt-6 pbx-mt-8">
                Border style
              </p>
              <BorderControls />
            </article>
            <article
              class="pbx-my-1 pbx-bg-gray-50 pbx-px-4 pbx-pt-2 pbx-pb-8 pbx-border pbx-border-gray-400"
            >
              <p class="pbx-myPrimaryParagraph pbx-italic pbx-pb-2 lg:pbx-mt-6 pbx-mt-8">CSS</p>
              <ClassEditor></ClassEditor>
            </article>
            <article
              class="pbx-my-1 pbx-bg-gray-50 pbx-px-4 pbx-pt-2 pbx-pb-8 pbx-border pbx-border-gray-400"
            >
              <p class="pbx-myPrimaryParagraph pbx-italic pbx-pb-2 lg:pbx-mt-6 pbx-mt-8">
                Inline style
              </p>
              <StyleEditor></StyleEditor>
            </article>
            <article
              class="pbx-my-1 pbx-bg-gray-50 pbx-px-4 pbx-pt-2 pbx-pb-8 pbx-border pbx-border-gray-400 lg:pbx-col-span-2"
            >
              <p class="pbx-myPrimaryParagraph pbx-italic pbx-pb-2 lg:pbx-mt-6 pbx-mt-8">
                HTML editor
              </p>
              <HTMLEditor></HTMLEditor>
            </article>
          </div>
        </div>
      </div>
      <!-- globalPageStyles end -->
    </div>
  </div>
</template>
