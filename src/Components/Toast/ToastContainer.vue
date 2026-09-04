<script setup lang="ts">
import { useToast } from '../../composables/useToast'
import type { ToastType } from '../../composables/useToast'

const { toasts, hideToast } = useToast()

const typeClass: Record<ToastType, string> = {
  success: 'pbx-toastSuccess',
  error: 'pbx-toastError',
  warning: 'pbx-toastWarning',
}
</script>

<template>
  <div
    class="pbx-pointer-events-none pbx-fixed pbx-right-6 pbx-top-6 pbx-z-[10010] pbx-flex pbx-flex-col pbx-items-end pbx-gap-3"
    aria-live="polite"
    aria-relevant="additions removals"
  >
    <TransitionGroup name="pbx-toast" tag="div" class="pbx-flex pbx-flex-col pbx-gap-2">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['pbx-toast', typeClass[toast.type]]"
        role="status"
      >
        <span class="pbx-font-sans pbx-toastMessage">{{ toast.message }}</span>
        <button
          type="button"
          class="pbx-h-6 pbx-w-6 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white focus-visible:pbx-outline-none focus-visible:pbx-ring-2 focus-visible:pbx-ring-myPrimaryLinkColor/30 pbx-text-black"
          :aria-label="'Close'"
          @click="hideToast(toast.id)"
        >
          <div class="pbx-materialIcon18"></div>
          <span class="material-symbols-outlined" aria-hidden="true"> close_small </span>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.pbx-toast-enter-active,
.pbx-toast-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.pbx-toast-enter-from,
.pbx-toast-leave-to {
  opacity: 0;
  transform: translateX(1rem);
}
</style>
