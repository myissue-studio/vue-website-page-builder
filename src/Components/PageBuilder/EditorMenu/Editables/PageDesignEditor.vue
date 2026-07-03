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
import HTMLEditor from './HTMLEditor.vue'

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
</script>

<template>
  <div class="pbx-pageDesignEditor">
    <div v-if="isLoading" class="pbx-pageDesignLoading">
      <div
        class="pbx-inline-block pbx-h-8 pbx-w-8 pbx-animate-spin pbx-rounded-full pbx-border-4 pbx-border-solid pbx-border-current pbx-border-r-transparent"
        role="status"
      />
    </div>

    <template v-else>
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
        <h4 class="pbx-pageDesignSectionTitle">{{ translate('Typographies') }}</h4>
        <div class="pbx-pageDesignCard pbx-pageDesignCardWide">
          <TypographyControl />
        </div>
      </section>

      <section class="pbx-pageDesignSection">
        <h4 class="pbx-pageDesignSectionTitle">{{ translate('Colors') }}</h4>
        <div class="pbx-pageDesignGrid">
          <div class="pbx-pageDesignCard">
            <p class="pbx-pageDesignCardLabel">{{ translate('Text Color') }}</p>
            <TextColorEditor :globalPageLayout="true" />
          </div>
          <div class="pbx-pageDesignCard">
            <p class="pbx-pageDesignCardLabel">{{ translate('Background Color') }}</p>
            <BackgroundColorEditor :globalPageLayout="true" />
          </div>
        </div>
      </section>

      <section class="pbx-pageDesignSection">
        <h4 class="pbx-pageDesignSectionTitle">{{ translate('Spacing') }}</h4>
        <div class="pbx-pageDesignGrid">
          <div class="pbx-pageDesignCard">
            <p class="pbx-pageDesignCardLabel">{{ translate('Padding') }}</p>
            <PaddingControl />
          </div>
          <div class="pbx-pageDesignCard">
            <p class="pbx-pageDesignCardLabel">{{ translate('Margin') }}</p>
            <MarginControl />
          </div>
        </div>
      </section>

      <section class="pbx-pageDesignSection">
        <h4 class="pbx-pageDesignSectionTitle">{{ translate('Borders') }}</h4>
        <div class="pbx-pageDesignGrid">
          <div class="pbx-pageDesignCard">
            <p class="pbx-pageDesignCardLabel">{{ translate('Border Radius') }}</p>
            <BorderRadiusControl />
          </div>
          <div class="pbx-pageDesignCard">
            <p class="pbx-pageDesignCardLabel">{{ translate('Border') }}</p>
            <BorderControls />
          </div>
        </div>
      </section>

      <section class="pbx-pageDesignSection">
        <h4 class="pbx-pageDesignSectionTitle">{{ translate('Advanced') }}</h4>
        <div class="pbx-pageDesignGrid">
          <div class="pbx-pageDesignCard">
            <p class="pbx-pageDesignCardLabel">{{ translate('Generated CSS') }}</p>
            <ClassEditor />
          </div>
          <div class="pbx-pageDesignCard">
            <p class="pbx-pageDesignCardLabel">{{ translate('Inline Styles') }}</p>
            <StyleEditor />
          </div>
        </div>
        <div class="pbx-pageDesignCard pbx-pageDesignCardWide pbx-mt-3">
          <p class="pbx-pageDesignCardLabel">{{ translate('HTML Editor') }}</p>
          <HTMLEditor />
        </div>
      </section>
    </template>
  </div>
</template>
