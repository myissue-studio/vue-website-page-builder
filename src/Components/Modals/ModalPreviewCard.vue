<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
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
    <p v-if="description" class="pbx-modalPreviewCardDesc">{{ description }}</p>
  </button>
</template>
