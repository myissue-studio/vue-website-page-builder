<script setup lang="ts">
defineProps<{
  icon: string
  label: string
  hint: string
  isLoading?: boolean
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    type="button"
    class="pbx-pageDesignOpenButton"
    :disabled="isLoading"
    :class="{ 'pbx-pointer-events-none pbx-opacity-70': isLoading }"
    @click="$emit('click')"
  >
    <span class="pbx-pageDesignOpenButtonIcon">
      <span class="material-symbols-outlined" aria-hidden="true">
        <span v-if="!isLoading">{{ icon }}</span>
        <span v-if="isLoading" class="pbx-inline-block pbx-animate-spin">refresh</span>
      </span>
    </span>
    <span class="pbx-pageDesignOpenButtonText">
      <span class="pbx-pageDesignOpenButtonLabel">{{ label }}</span>
      <span class="pbx-pageDesignOpenButtonHint">{{ hint }}</span>
    </span>
    <span class="pbx-pageDesignOpenButtonArrow material-symbols-outlined" aria-hidden="true">
      arrow_forward
    </span>
  </button>
</template>
