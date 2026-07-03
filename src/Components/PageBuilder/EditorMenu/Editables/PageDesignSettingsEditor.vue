<script setup lang="ts">
import EditorAccordion from '../EditorAccordion.vue'
import SliderIcon from '../../../Icons/SliderIcon.vue'
import { useTranslations } from '../../../../composables/useTranslations'

defineOptions({
  name: 'PageDesignSettingsEditor',
})

const { translate } = useTranslations()

defineEmits<{
  open: []
}>()
</script>

<template>
  <EditorAccordion>
    <template #title>{{ translate('Page Design') }}</template>
    <template #content>
      <p class="pbx-editorSectionDesc">
        {{ translate('Page design description') }}
      </p>

      <button type="button" class="pbx-pageDesignOpenButton" @click="$emit('open')">
        <SliderIcon></SliderIcon>
        <span class="pbx-pageDesignOpenButtonText">
          <span class="pbx-pageDesignOpenButtonLabel">{{ translate('Open page design') }}</span>
          <span class="pbx-pageDesignOpenButtonHint">
            {{ translate('Typography, colors, spacing & more') }}
          </span>
        </span>
        <span class="pbx-pageDesignOpenButtonArrow material-symbols-outlined" aria-hidden="true">
          arrow_forward
        </span>
      </button>
    </template>
  </EditorAccordion>
</template>
