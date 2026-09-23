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
  <div class="pbx-spacingStepper" :class="{ 'pbx-spacingStepper--compact': compact }">
    <button
      type="button"
      class="pbx-spacingStepperBtn"
      @click="$emit('decrement')"
    >
      <span class="material-symbols-outlined" aria-hidden="true">remove</span>
    </button>
    <div class="pbx-spacingStepperValue">
      <span v-if="sideLabel && !compact" class="pbx-spacingStepperSide">{{ sideLabel }}</span>
      <span class="pbx-spacingStepperNum">{{ value }}</span>
    </div>
    <button
      type="button"
      class="pbx-spacingStepperBtn"
      @click="$emit('increment')"
    >
      <span class="material-symbols-outlined" aria-hidden="true">add</span>
    </button>
  </div>
</template>
