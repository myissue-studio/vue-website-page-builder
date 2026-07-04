<script setup lang="ts">
defineProps<{
  title?: string
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <button type="button" class="pbx-modalPreviewCard" @click="$emit('click')">
    <div class="pbx-modalPreviewCardMedia">
      <slot />
    </div>
    <p v-if="title" class="pbx-modalPreviewCardTitle">{{ title }}</p>
  </button>
</template>
