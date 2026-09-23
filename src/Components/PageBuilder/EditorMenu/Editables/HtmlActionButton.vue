<script setup lang="ts">
defineProps<{
  icon?: string
  label: string
  hint?: string
  isLoading?: boolean
  disabled?: boolean
  variant?: 'default' | 'danger'
  /** When set, renders as a link instead of a button. */
  href?: string
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :type="href ? undefined : 'button'"
    :href="href"
    :target="href ? '_blank' : undefined"
    :rel="href ? 'noopener noreferrer' : undefined"
    class="pbx-pageDesignOpenButton"
    :disabled="href ? undefined : isLoading || disabled"
    :class="[
      { 'pbx-pointer-events-none pbx-opacity-70': isLoading || disabled },
      { 'pbx-pageDesignOpenButton--danger': variant === 'danger' },
      { 'pbx-no-underline': href },
    ]"
    @click="$emit('click')"
  >
    <span class="pbx-pageDesignOpenButtonIcon" :class="[{ 'pbx-bg-red-50': variant === 'danger' }]">
      <span v-if="isLoading" class="material-symbols-outlined" aria-hidden="true">
        <span class="pbx-inline-block pbx-animate-spin">refresh</span>
      </span>
      <slot v-else name="icon">
        <span v-if="icon" class="material-symbols-outlined" aria-hidden="true">{{ icon }}</span>
      </slot>
    </span>
    <span class="pbx-pageDesignOpenButtonText">
      <span class="pbx-pageDesignOpenButtonLabel">{{ label }}</span>
      <span v-if="hint" class="pbx-pageDesignOpenButtonHint">{{ hint }}</span>
    </span>
    <span class="pbx-pageDesignOpenButtonArrow material-symbols-outlined" aria-hidden="true">
      {{ href ? 'arrow_outward' : 'arrow_forward' }}
    </span>
  </component>
</template>
