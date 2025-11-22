<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: false,
    default: null,
  },
  showSidebarPanel: {
    type: Boolean,
    default: false,
  },
  position: {
    type: String,
    required: true,
    default: 'right',
    validator(value) {
      const allowed = ['left', 'right'] as const
      const isValid = allowed.includes(value as 'left' | 'right')
      if (!isValid) {
        console.warn(`Invalid prop: position must be 'left' or 'right', got '${value}'`)
      }
      return isValid
    },
  },
})

const emit = defineEmits(['closeSidebarPanel'])

const handleClose = () => {
  emit('closeSidebarPanel')
}
</script>
<template>
  <transition name="popup-fade">
    <div v-if="showSidebarPanel" class="pbx-fixed pbx-inset-0 pbx-z-50">
      <!-- Overlay -->
      <div
        class="pbx-fixed pbx-inset-0 pbx-bg-black pbx-opacity-20 pbx-z-40"
        @click="handleClose"
      ></div>
      <!-- Right-aligned Modal -->

      <div
        class="pbx-fixed pbx-top-0 pbx-rounded-3xl pbx-py-2 pbx-px-2 pbx-border pbx-border-gray-200 pbx-max-h-[80vh] lg:pbx-min-h-[98%] pbx-min-h-[80vh] lg:pbx-min-w-96 lg:pbx-w-96 pbx-w-[96%] pbx-overflow-y-auto pbx-z-50 pbx-bg-white lg:pbx-mt-2 pbx-mt-2"
        :class="[
          position === 'left' ? 'pbx-left-0 pbx-ml-[1%]' : '',
          position === 'right' ? 'pbx-right-0 pbx-mr-[1%]' : '',
        ]"
        @click.stop
      >
        <!-- Close -->
        <div
          class="pbx-flex pbx-gap-2 pbx-justify-between pbx-items-center pbx-py-2 pbx-px-2 pbx-mb-2 pbx-border-b pbx-border-gray-200"
        >
          <span class="pbx-myQuaternaryHeader pbx-my-0 pbx-py-0 pbx-text-black">{{ title }}</span>
          <span @click="handleClose">
            <div
              class="pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white focus-visible:pbx-ring-0 pbx-text-black"
            >
              <span class="material-symbols-outlined"> close </span>
            </div>
          </span>
        </div>
        <!-- Content start -->
        <div class="pbx-pt-4 pbx-px-2">
          <slot></slot>
        </div>
        <!-- Content end -->
      </div>
    </div>
  </transition>
</template>
