<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    classes?: string[] | string | null
    removable?: boolean
    emptyPlaceholder?: boolean
  }>(),
  {
    removable: false,
    emptyPlaceholder: false,
  },
)

const emit = defineEmits<{
  remove: [className: string]
}>()

const classList = computed(() => {
  if (!props.classes) return []
  if (Array.isArray(props.classes)) return props.classes.filter(Boolean)
  return props.classes.split(/\s+/).filter(Boolean)
})

function handleTagClick(className: string) {
  if (!props.removable) return
  emit('remove', className)
}
</script>

<template>
  <div v-if="classList.length" class="pbx-flex pbx-flex-row pbx-flex-wrap pbx-gap-2">
    <div
      v-for="className in classList"
      :key="className"
      class="pbx-myPrimaryTag pbx-text-xs pbx-py-2 pbx-font-medium"
      :class="
        removable
          ? 'pbx-cursor-pointer hover:pbx-bg-myPrimaryErrorColor hover:pbx-text-white'
          : ''
      "
      @click="handleTagClick(className)"
    >
      <div class="pbx-flex pbx-items-center pbx-gap-1">
        <span class="pbx-mr-1">{{ className }}</span>
      </div>
    </div>
  </div>
  <span v-else-if="emptyPlaceholder" class="pbx-inspectorValue">—</span>
</template>
