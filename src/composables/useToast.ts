import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning'

export type Toast = {
  id: number
  message: string
  type: ToastType
}

const toasts = ref<Toast[]>([])
let nextToastId = 1

export function useToast() {
  function hideToast(id: number): void {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  function showToast(message: string, type: ToastType = 'success', durationMs = 1000): void {
    const id = nextToastId++
    toasts.value.push({ id, message, type })

    if (durationMs > 0) {
      globalThis.setTimeout(() => {
        hideToast(id)
      }, durationMs)
    }
  }

  return {
    toasts,
    showToast,
    hideToast,
  }
}
