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
    class="pbx-inline-flex pbx-items-center pbx-rounded-md pbx-border pbx-border-solid pbx-border-gray-200 pbx-bg-white"
    :class="compact ? 'pbx-gap-0 pbx-p-0' : 'pbx-gap-0.5 pbx-p-0.5'"
  >
    <button
      type="button"
      class="pbx-flex pbx-shrink-0 pbx-cursor-pointer pbx-items-center pbx-justify-center pbx-border-none pbx-bg-transparent pbx-text-gray-500 pbx-transition-colors hover:pbx-bg-gray-100 hover:pbx-text-gray-900 focus-visible:pbx-outline-none"
      :class="compact ? 'pbx-h-6 pbx-w-6 pbx-rounded-sm' : 'pbx-h-7 pbx-w-7 pbx-rounded'"
      @click="$emit('decrement')"
    >
      <span class="material-symbols-outlined pbx-materialIcon18">remove</span>
    </button>
    <div
      class="pbx-flex pbx-flex-col pbx-items-center pbx-justify-center"
      :class="compact ? 'pbx-min-w-8' : sideLabel ? 'pbx-min-w-[2.75rem]' : 'pbx-min-w-[2.25rem]'"
    >
      <span
        v-if="sideLabel && !compact"
        class="pbx-text-[9px] pbx-font-medium pbx-uppercase pbx-text-gray-400 pbx-leading-none"
      >
        {{ sideLabel }}
      </span>
      <span
        class="pbx-font-semibold pbx-tabular-nums pbx-text-gray-800"
        :class="sideLabel && !compact ? 'pbx-text-xs' : 'pbx-text-sm'"
      >
        {{ value }}
      </span>
    </div>
    <button
      type="button"
      class="pbx-flex pbx-shrink-0 pbx-cursor-pointer pbx-items-center pbx-justify-center pbx-border-none pbx-bg-transparent pbx-text-gray-500 pbx-transition-colors hover:pbx-bg-gray-100 hover:pbx-text-gray-900 focus-visible:pbx-outline-none"
      :class="compact ? 'pbx-h-6 pbx-w-6 pbx-rounded-sm' : 'pbx-h-7 pbx-w-7 pbx-rounded'"
      @click="$emit('increment')"
    >
      <span class="material-symbols-outlined pbx-materialIcon18">add</span>
    </button>
  </div>
</template>
