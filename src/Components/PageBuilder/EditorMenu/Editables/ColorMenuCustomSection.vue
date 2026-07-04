<script setup lang="ts">
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
    class="pbx-w-full pbx-flex pbx-items-center pbx-gap-3 pbx-cursor-pointer pbx-py-2 pbx-px-2 pbx-rounded-none pbx-border-0 pbx-bg-transparent pbx-text-left pbx-text-myPrimaryDarkGrayColor hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white"
    @mousedown.stop
    @pointerdown.stop
    @click.stop="$emit('open')"
  >
    <div
      class="pbx-aspect-square pbx-w-6 pbx-h-6 pbx-flex pbx-items-center pbx-justify-center pbx-bg-white pbx-rounded-full pbx-border pbx-border-solid pbx-border-gray-100"
    >
      <span class="material-symbols-outlined pbx-text-[18px] pbx-text-gray-800" aria-hidden="true">
        <span class="material-symbols-outlined"> ink_marker </span>
      </span>
    </div>
    <span class="pbx-flex-1">{{ translate('Custom color') }}</span>
    <span
      v-if="modelValue"
      class="pbx-h-5 pbx-w-5 pbx-shrink-0 pbx-rounded-full pbx-border pbx-border-solid pbx-border-gray-200"
      :style="{ backgroundColor: modelValue }"
      aria-hidden="true"
    ></span>
  </button>
</template>
