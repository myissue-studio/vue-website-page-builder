<script setup lang="ts">
defineProps<{
  icon?: string
  label: string
  hint?: string
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <button type="button" class="pbx-group pbx-modalLibraryCard" @click="$emit('click')">
    <span v-if="icon" class="pbx-modalLibraryCardIcon material-symbols-outlined" aria-hidden="true">
      {{ icon }}
    </span>
    <span class="pbx-modalLibraryCardText">
      <span class="pbx-modalLibraryCardLabel">{{ label }}</span>
      <span v-if="hint" class="pbx-modalLibraryCardHint">{{ hint }}</span>
      <slot name="preview" />
    </span>
    <span class="pbx-modalFilterChipIcon">
      <span class="material-symbols-outlined" aria-hidden="true">add</span>
    </span>
  </button>
</template>
