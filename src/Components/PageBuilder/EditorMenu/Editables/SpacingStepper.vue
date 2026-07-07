<script setup lang="ts">
defineProps<{
  value: string
  sideLabel?: string
  compact?: boolean
}>()

defineEmits<{
  decrement: []
  increment: []
}>()
</script>

<template>
  <div
    class="pbx-flex pbx-items-center pbx-gap-0.5 pbx-rounded-lg pbx-bg-gray-100/80 pbx-p-0.5"
    :class="compact ? 'pbx-scale-90 pbx-origin-center' : ''"
  >
    <button
      type="button"
      class="pbx-flex pbx-h-7 pbx-w-7 pbx-shrink-0 pbx-cursor-pointer pbx-items-center pbx-justify-center pbx-rounded-md pbx-border-none pbx-bg-white pbx-text-gray-600 pbx-shadow-sm pbx-transition-colors hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white focus-visible:pbx-outline-none"
      @click="$emit('decrement')"
    >
      <span class="material-symbols-outlined pbx-text-[18px]">remove</span>
    </button>
    <div
      class="pbx-flex pbx-flex-col pbx-items-center pbx-justify-center"
      :class="sideLabel ? 'pbx-min-w-[2.75rem]' : 'pbx-min-w-[2.25rem]'"
    >
      <span
        v-if="sideLabel"
        class="pbx-text-[9px] pbx-font-medium pbx-uppercase pbx-tracking-wide pbx-text-gray-400 pbx-leading-none"
      >
        {{ sideLabel }}
      </span>
      <span
        class="pbx-font-semibold pbx-tabular-nums pbx-text-gray-800"
        :class="sideLabel ? 'pbx-text-xs' : 'pbx-text-sm'"
      >
        {{ value }}
      </span>
    </div>
    <button
      type="button"
      class="pbx-flex pbx-h-7 pbx-w-7 pbx-shrink-0 pbx-cursor-pointer pbx-items-center pbx-justify-center pbx-rounded-md pbx-border-none pbx-bg-white pbx-text-gray-600 pbx-shadow-sm pbx-transition-colors hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white focus-visible:pbx-outline-none"
      @click="$emit('increment')"
    >
      <span class="material-symbols-outlined pbx-text-[18px]">add</span>
    </button>
  </div>
</template>
