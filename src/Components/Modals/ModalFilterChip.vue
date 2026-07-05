<script setup lang="ts">
defineProps<{
  icon?: string
  sliderIcon?: boolean
  label: string
  hint?: string
  active?: boolean
}>()
</script>

<template>
  <button
    type="button"
    class="pbx-modalFilterChip"
    :class="{ 'pbx-modalFilterChip--active': active }"
    :aria-pressed="active"
  >
    <span v-if="sliderIcon" class="pbx-modalFilterChipIcon" aria-hidden="true">
      <span class="material-symbols-outlined"> stack_group </span>
    </span>
    <span
      v-else-if="icon"
      class="pbx-modalFilterChipIcon material-symbols-outlined"
      aria-hidden="true"
    >
      {{ icon }}
    </span>
    <span class="pbx-modalFilterChipText">
      <span class="pbx-modalFilterChipLabel">{{ label }}</span>
      <span v-if="hint" class="pbx-modalFilterChipHint">{{ hint }}</span>
    </span>
  </button>
</template>
