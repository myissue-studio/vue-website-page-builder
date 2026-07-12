<script setup lang="ts">
import SliderIcon from '@/Components/Icons/SliderIcon.vue'
import { useTranslations } from '../../../../composables/useTranslations'

defineProps<{
  modelValue: string
}>()

defineEmits<{
  open: []
}>()

const { translate } = useTranslations()
</script>

<template>
  <button
    type="button"
    class="pbx-text-sm pbx-font-sans pbx-w-full pbx-flex pbx-items-center pbx-gap-3 pbx-cursor-pointer pbx-py-2 pbx-px-2 pbx-rounded-none pbx-border-0 pbx-bg-transparent pbx-text-left pbx-text-myPrimaryDarkGrayColor hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white"
    @mousedown.stop
    @pointerdown.stop
    @click.stop="$emit('open')"
  >
    <div class="pbx-w-6 pbx-h-6 pbx-flex pbx-items-center pbx-justify-center">
      <SliderIcon></SliderIcon>
    </div>
    <span class="pbx-flex-1">{{ translate('Custom color') }}</span>
    <span
      v-if="modelValue"
      class="pbx-h-3 pbx-w-3 pbx-shrink-0 pbx-rounded-full pbx-border pbx-border-solid pbx-border-gray-200"
      :style="{ backgroundColor: modelValue }"
      aria-hidden="true"
    ></span>
  </button>
</template>
