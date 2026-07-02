import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

type UseEditToolbarPopoverOptions = {
  width?: number
}

export function useEditToolbarPopover(options: UseEditToolbarPopoverOptions = {}) {
  const widthPx = options.width ?? 224

  const triggerRef = ref<HTMLElement | null>(null)
  const popoverRef = ref<HTMLElement | null>(null)
  const isOpen = ref(false)
  const popoverStyle = ref({
    top: '0px',
    left: '0px',
    width: `${widthPx}px`,
  })

  const updatePosition = function () {
    const trigger = triggerRef.value
    if (!trigger) return

    const rect = trigger.getBoundingClientRect()
    const margin = 8
    let left = rect.left + rect.width / 2 - widthPx / 2
    left = Math.max(margin, Math.min(left, window.innerWidth - widthPx - margin))

    popoverStyle.value = {
      top: `${Math.round(rect.bottom + 4)}px`,
      left: `${Math.round(left)}px`,
      width: `${widthPx}px`,
    }
  }

  let positionRaf = 0

  const trackPosition = function () {
    if (!isOpen.value) {
      positionRaf = 0
      return
    }

    updatePosition()
    positionRaf = requestAnimationFrame(trackPosition)
  }

  const startPositionTracking = function () {
    cancelAnimationFrame(positionRaf)
    void nextTick(() => {
      updatePosition()
      positionRaf = requestAnimationFrame(trackPosition)
    })
  }

  const stopPositionTracking = function () {
    cancelAnimationFrame(positionRaf)
    positionRaf = 0
  }

  const closeOnOutsideClick = function (event: Event) {
    if (!isOpen.value) return
    if (!(event.target instanceof Node)) return
    if (triggerRef.value?.contains(event.target)) return
    if (popoverRef.value?.contains(event.target)) return
    isOpen.value = false
  }

  const open = function () {
    isOpen.value = true
  }

  const close = function () {
    isOpen.value = false
  }

  const toggle = function () {
    isOpen.value = !isOpen.value
  }

  watch(isOpen, (openState) => {
    if (openState) {
      startPositionTracking()
      document.addEventListener('pointerdown', closeOnOutsideClick)
      return
    }

    stopPositionTracking()
    document.removeEventListener('pointerdown', closeOnOutsideClick)
  })

  onBeforeUnmount(() => {
    stopPositionTracking()
    document.removeEventListener('pointerdown', closeOnOutsideClick)
  })

  return {
    triggerRef,
    popoverRef,
    isOpen,
    popoverStyle,
    open,
    close,
    toggle,
    updatePosition,
  }
}
