<script setup lang="ts">
import StacksIcon from '../Icons/StacksIcon.vue'

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
    <span v-if="icon" class="pbx-modalFilterChipIcon" aria-hidden="true">
      <span class="material-symbols-outlined">{{ icon }}</span>
    </span>
    <span v-else-if="sliderIcon" class="pbx-modalFilterChipIcon" aria-hidden="true">
      <StacksIcon :size="20" />
    </span>
    <span class="pbx-modalFilterChipText">
      <span class="pbx-modalFilterChipLabel">{{ label }}</span>
      <span v-if="hint" class="pbx-modalFilterChipHint">{{ hint }}</span>
    </span>
  </button>
</template>
