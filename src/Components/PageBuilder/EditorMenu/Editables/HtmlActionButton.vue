<script setup lang="ts">
defineProps<{
  icon: string
  label: string
  hint: string
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <button type="button" class="pbx-pageDesignOpenButton" @click="$emit('click')">
    <span class="material-symbols-outlined">{{ icon }}</span>
    <span class="pbx-pageDesignOpenButtonText">
      <span class="pbx-pageDesignOpenButtonLabel">{{ label }}</span>
      <span class="pbx-pageDesignOpenButtonHint">{{ hint }}</span>
    </span>
    <span class="pbx-pageDesignOpenButtonArrow material-symbols-outlined" aria-hidden="true">
      arrow_forward
    </span>
  </button>
</template>
