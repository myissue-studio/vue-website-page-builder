<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { hexToHsv, hsvToHex, normalizeHexColor } from '../../utils/builder/color-utils'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const PICKER_WIDTH = 242
const PICKER_HEIGHT = 151

const hue = ref(0)
const saturation = ref(100)
const brightness = ref(100)
const hexInput = ref(props.modelValue)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const hueTrackRef = ref<HTMLElement | null>(null)
const isDraggingCanvas = ref(false)
const isDraggingHue = ref(false)

const currentHex = computed(() =>
  hsvToHex({ h: hue.value, s: saturation.value, v: brightness.value }),
)

const cursorPositionStyle = computed(() => ({
  left: `${saturation.value}%`,
  top: `${100 - brightness.value}%`,
  transform: 'translate(-50%, -50%)',
}))

const cursorFillStyle = computed(() => ({
  backgroundColor: currentHex.value,
  borderRadius: '50%',
  boxShadow: '0 0 0 2px #ffffff, 0 0 0 3px rgba(0, 0, 0, 0.25)',
}))

const hueThumbPositionStyle = computed(() => ({
  left: `${(hue.value / 360) * 100}%`,
  transform: 'translate(-50%, -50%)',
}))

const hueThumbFillStyle = computed(() => ({
  backgroundColor: `hsl(${hue.value}, 100%, 50%)`,
  borderRadius: '50%',
  boxShadow: '0 0 0 2px #ffffff, 0 0 0 3px rgba(0, 0, 0, 0.25)',
}))

const previewStyle = computed(() => ({
  backgroundColor: currentHex.value,
}))

function syncFromHex(hex: string, emitUpdate = false): void {
  const normalized = normalizeHexColor(hex) ?? normalizeHexColor(props.modelValue) ?? '#000000'
  const hsv = hexToHsv(normalized)
  hue.value = hsv.h
  saturation.value = hsv.s
  brightness.value = hsv.v
  hexInput.value = normalized
  if (emitUpdate) {
    emit('update:modelValue', normalized)
  }
  drawCanvas()
}

function emitCurrentColor(): void {
  const nextHex = currentHex.value
  hexInput.value = nextHex
  emit('update:modelValue', nextHex)
}

function drawCanvas(): void {
  const canvas = canvasRef.value
  if (!canvas) return

  const context = canvas.getContext('2d')
  if (!context) return

  context.clearRect(0, 0, PICKER_WIDTH, PICKER_HEIGHT)
  context.fillStyle = `hsl(${hue.value}, 100%, 50%)`
  context.fillRect(0, 0, PICKER_WIDTH, PICKER_HEIGHT)

  const whiteGradient = context.createLinearGradient(0, 0, PICKER_WIDTH, 0)
  whiteGradient.addColorStop(0, '#ffffff')
  whiteGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
  context.fillStyle = whiteGradient
  context.fillRect(0, 0, PICKER_WIDTH, PICKER_HEIGHT)

  const blackGradient = context.createLinearGradient(0, 0, 0, PICKER_HEIGHT)
  blackGradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
  blackGradient.addColorStop(1, '#000000')
  context.fillStyle = blackGradient
  context.fillRect(0, 0, PICKER_WIDTH, PICKER_HEIGHT)
}

function updateFromCanvasPointer(clientX: number, clientY: number): void {
  const canvas = canvasRef.value
  if (!canvas) return

  const rect = canvas.getBoundingClientRect()
  if (!rect.width || !rect.height) return

  const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
  const y = Math.max(0, Math.min(clientY - rect.top, rect.height))

  saturation.value = (x / rect.width) * 100
  brightness.value = 100 - (y / rect.height) * 100
  emitCurrentColor()
}

function updateFromHuePointer(clientX: number): void {
  const track = hueTrackRef.value
  if (!track) return

  const rect = track.getBoundingClientRect()
  if (!rect.width) return

  const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
  hue.value = (x / rect.width) * 360
  emitCurrentColor()
  drawCanvas()
}

function stopDragging(): void {
  isDraggingCanvas.value = false
  isDraggingHue.value = false
  window.removeEventListener('pointermove', onWindowPointerMove)
  window.removeEventListener('pointerup', onWindowPointerUp)
  window.removeEventListener('pointercancel', onWindowPointerUp)
}

function onWindowPointerMove(event: PointerEvent): void {
  if (isDraggingCanvas.value) {
    updateFromCanvasPointer(event.clientX, event.clientY)
  }
  if (isDraggingHue.value) {
    updateFromHuePointer(event.clientX)
  }
}

function onWindowPointerUp(): void {
  stopDragging()
}

function startCanvasDrag(event: PointerEvent): void {
  event.preventDefault()
  isDraggingCanvas.value = true
  window.addEventListener('pointermove', onWindowPointerMove)
  window.addEventListener('pointerup', onWindowPointerUp)
  window.addEventListener('pointercancel', onWindowPointerUp)
  updateFromCanvasPointer(event.clientX, event.clientY)
}

function startHueDrag(event: PointerEvent): void {
  event.preventDefault()
  isDraggingHue.value = true
  window.addEventListener('pointermove', onWindowPointerMove)
  window.addEventListener('pointerup', onWindowPointerUp)
  window.addEventListener('pointercancel', onWindowPointerUp)
  updateFromHuePointer(event.clientX)
}

function onHexInput(event: Event): void {
  const input = event.target as HTMLInputElement
  hexInput.value = input.value
  const normalized = normalizeHexColor(input.value)
  if (!normalized) return
  syncFromHex(normalized, true)
}

function onHexBlur(): void {
  const normalized = normalizeHexColor(hexInput.value)
  if (normalized) {
    syncFromHex(normalized, true)
    return
  }
  hexInput.value = currentHex.value
}

watch(
  () => props.modelValue,
  (nextValue) => {
    if (normalizeHexColor(nextValue) === normalizeHexColor(currentHex.value)) return
    syncFromHex(nextValue)
  },
)

watch(hue, () => {
  void nextTick(drawCanvas)
})

watch(canvasRef, (canvas) => {
  if (canvas) drawCanvas()
})

onMounted(() => {
  syncFromHex(props.modelValue)
  void nextTick(drawCanvas)
})

onBeforeUnmount(() => {
  stopDragging()
})
</script>

<template>
  <div class="pbx-flex pbx-flex-col pbx-gap-3">
    <div class="pbx-relative pbx-w-full">
      <div
        class="pbx-relative pbx-overflow-hidden pbx-rounded-lg pbx-border pbx-border-solid pbx-border-gray-200"
        :style="{ width: `${PICKER_WIDTH}px`, height: `${PICKER_HEIGHT}px` }"
      >
        <canvas
          ref="canvasRef"
          class="pbx-block pbx-h-full pbx-w-full pbx-cursor-crosshair pbx-touch-none"
          :width="PICKER_WIDTH"
          :height="PICKER_HEIGHT"
          @pointerdown="startCanvasDrag"
        ></canvas>
        <div
          class="pbx-pointer-events-none pbx-absolute pbx-h-4 pbx-w-4"
          :style="cursorPositionStyle"
        >
          <span class="pbx-block pbx-h-4 pbx-w-4" :style="cursorFillStyle"></span>
        </div>
      </div>

      <div
        class="pbx-relative pbx-mt-1 pbx-py-2 pbx-cursor-pointer pbx-touch-none"
        :style="{ width: `${PICKER_WIDTH}px` }"
        @pointerdown="startHueDrag"
      >
        <div
          ref="hueTrackRef"
          data-pbx-hue-track
          class="pbx-h-3 pbx-rounded-full"
          style="
            background: linear-gradient(
              to right,
              #ff0000,
              #ffff00,
              #00ff00,
              #00ffff,
              #0000ff,
              #ff00ff,
              #ff0000
            );
          "
        ></div>
        <div
          class="pbx-pointer-events-none pbx-absolute pbx-top-1/2 pbx-h-5 pbx-w-5"
          :style="hueThumbPositionStyle"
        >
          <span class="pbx-block pbx-h-5 pbx-w-5" :style="hueThumbFillStyle"></span>
        </div>
      </div>
    </div>

    <div class="pbx-flex pbx-items-center pbx-gap-2">
      <div
        class="pbx-h-9 pbx-w-9 pbx-shrink-0 pbx-rounded-md pbx-border pbx-border-solid pbx-border-gray-200"
        :style="previewStyle"
      ></div>
      <div class="pbx-relative pbx-flex-1">
        <label for="hex-input" class="pbx-sr-only">Hex Color</label>

        <div class="pbx-relative">
          <span
            class="pbx-absolute pbx-left-3 pbx-top-1/2 pbx-z-50 pbx-pointer-events-none"
            style="transform: translateY(-50%)"
          >
            #
          </span>

          <input
            id="hex-input"
            :value="hexInput.replace(/^#/, '')"
            type="text"
            maxlength="6"
            spellcheck="false"
            class="pbx-myPrimaryInput pbx-w-full pbx-uppercase pbx-text-sm"
            style="padding-left: 25px"
            @input="onHexInput"
            @blur="onHexBlur"
          />
        </div>
      </div>
    </div>
  </div>
</template>
