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
        <span class="pbx-toastMessage">{{ toast.message }}</span>
        <button
          type="button"
          class="pbx-toastClose"
          :aria-label="'Close'"
          @click="hideToast(toast.id)"
        >
          <span class="material-symbols-outlined pbx-text-[18px]" aria-hidden="true">
            close_small
          </span>
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
