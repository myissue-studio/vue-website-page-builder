<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import EditorAccordion from '../EditorAccordion.vue'
import SpacingStepper from './SpacingStepper.vue'
import tailwindPaddingPlusMargin from '../../../../utils/builder/tailwind-padding-margin'
import { getPageBuilder } from '../../../../composables/builderInstance'
import { useTranslations } from '../../../../composables/useTranslations'

const props = defineProps<{
  mode: 'padding' | 'margin'
}>()

const { translate } = useTranslations()
const pageBuilderService = getPageBuilder()
const pageBuilderStateStore = sharedPageBuilderStore

const isPadding = computed(() => props.mode === 'padding')

const boxBgColor = computed(() => (isPadding.value ? 'pbx-bg-emerald-50/40' : 'pbx-bg-amber-50/40'))
const boxBorderColor = computed(() =>
  isPadding.value ? 'pbx-border-emerald-200/60' : 'pbx-border-amber-200/60',
)

const vertical = ref<string | null>(null)
const horizontal = ref<string | null>(null)
const top = ref<string | null>(null)
const right = ref<string | null>(null)
const bottom = ref<string | null>(null)
const left = ref<string | null>(null)

const getVertical = computed(() =>
  isPadding.value
    ? pageBuilderStateStore.getFontVerticalPadding
    : pageBuilderStateStore.getFontVerticalMargin,
)
const getHorizontal = computed(() =>
  isPadding.value
    ? pageBuilderStateStore.getFontHorizontalPadding
    : pageBuilderStateStore.getFontHorizontalMargin,
)
const getTop = computed(() =>
  isPadding.value
    ? pageBuilderStateStore.getFontTopPadding
    : pageBuilderStateStore.getFontTopMargin,
)
const getRight = computed(() =>
  isPadding.value
    ? pageBuilderStateStore.getFontRightPadding
    : pageBuilderStateStore.getFontRightMargin,
)
const getBottom = computed(() =>
  isPadding.value
    ? pageBuilderStateStore.getFontBottomPadding
    : pageBuilderStateStore.getFontBottomMargin,
)
const getLeft = computed(() =>
  isPadding.value
    ? pageBuilderStateStore.getFontLeftPadding
    : pageBuilderStateStore.getFontLeftMargin,
)

watch(
  getVertical,
  async (v) => {
    vertical.value = v
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
watch(
  getHorizontal,
  async (v) => {
    horizontal.value = v
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
watch(
  getTop,
  async (v) => {
    top.value = v
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
watch(
  getRight,
  async (v) => {
    right.value = v
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
watch(
  getBottom,
  async (v) => {
    bottom.value = v
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
watch(
  getLeft,
  async (v) => {
    left.value = v
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)

function displayVal(cls: string | null | undefined): string {
  if (!cls || cls === 'none') return '–'
  const m = cls.match(/-(\d[\d.]*)$/)
  return m ? m[1] : '–'
}

function effectiveTop(): string {
  return displayVal(top.value && top.value !== 'none' ? top.value : vertical.value)
}
function effectiveBottom(): string {
  return displayVal(bottom.value && bottom.value !== 'none' ? bottom.value : vertical.value)
}
function effectiveLeft(): string {
  return displayVal(left.value && left.value !== 'none' ? left.value : horizontal.value)
}
function effectiveRight(): string {
  return displayVal(right.value && right.value !== 'none' ? right.value : horizontal.value)
}

function stepArray(arr: string[], cur: string | null, dir: 1 | -1): string {
  const idx = arr.indexOf(cur ?? 'none')
  return arr[Math.max(0, Math.min(arr.length - 1, Math.max(0, idx) + dir))]
}

function stepVertical(dir: 1 | -1) {
  const arr = isPadding.value
    ? tailwindPaddingPlusMargin.verticalPadding
    : tailwindPaddingPlusMargin.verticalMargin
  const next = stepArray(arr, vertical.value, dir)
  vertical.value = next
  if (isPadding.value) pageBuilderService.handleVerticalPadding(next)
  else pageBuilderService.handleVerticalMargin(next)
}

function stepHorizontal(dir: 1 | -1) {
  const arr = isPadding.value
    ? tailwindPaddingPlusMargin.horizontalPadding
    : tailwindPaddingPlusMargin.horizontalMargin
  const next = stepArray(arr, horizontal.value, dir)
  horizontal.value = next
  if (isPadding.value) pageBuilderService.handleHorizontalPadding(next)
  else pageBuilderService.handleHorizontalMargin(next)
}

function stepTop(dir: 1 | -1) {
  const arr = isPadding.value
    ? tailwindPaddingPlusMargin.topPadding
    : tailwindPaddingPlusMargin.topMargin
  const next = stepArray(arr, top.value, dir)
  top.value = next
  if (isPadding.value) pageBuilderService.handleTopPadding(next)
  else pageBuilderService.handleTopMargin(next)
}

function stepRight(dir: 1 | -1) {
  const arr = isPadding.value
    ? tailwindPaddingPlusMargin.rightPadding
    : tailwindPaddingPlusMargin.rightMargin
  const next = stepArray(arr, right.value, dir)
  right.value = next
  if (isPadding.value) pageBuilderService.handleRightPadding(next)
  else pageBuilderService.handleRightMargin(next)
}

function stepBottom(dir: 1 | -1) {
  const arr = isPadding.value
    ? tailwindPaddingPlusMargin.bottomPadding
    : tailwindPaddingPlusMargin.bottomMargin
  const next = stepArray(arr, bottom.value, dir)
  bottom.value = next
  if (isPadding.value) pageBuilderService.handleBottomPadding(next)
  else pageBuilderService.handleBottomMargin(next)
}

function stepLeft(dir: 1 | -1) {
  const arr = isPadding.value
    ? tailwindPaddingPlusMargin.leftPadding
    : tailwindPaddingPlusMargin.leftMargin
  const next = stepArray(arr, left.value, dir)
  left.value = next
  if (isPadding.value) pageBuilderService.handleLeftPadding(next)
  else pageBuilderService.handleLeftMargin(next)
}
</script>

<template>
  <EditorAccordion>
    <template #title>{{ translate(isPadding ? 'Padding' : 'Margin') }}</template>
    <template #content>
      <p class="pbx-editorSectionTitle">
        {{ translate('All sides') }}
      </p>
      <p class="pbx-editorSectionDesc">
        {{ translate('Applies across all screen sizes') }}
      </p>

      <!-- Shorthand rows -->
      <div
        class="pbx-mb-4 pbx-space-y-2 pbx-rounded-xl pbx-border pbx-border-solid pbx-border-gray-200 pbx-bg-white pbx-p-3"
      >
        <div class="pbx-flex pbx-items-center pbx-justify-between pbx-gap-3">
          <span class="pbx-text-xs pbx-font-medium pbx-text-gray-500">{{
            translate('Vertical')
          }}</span>
          <SpacingStepper
            :value="displayVal(vertical)"
            @decrement="stepVertical(-1)"
            @increment="stepVertical(1)"
          />
        </div>
        <div class="pbx-h-px pbx-bg-gray-100"></div>
        <div class="pbx-flex pbx-items-center pbx-justify-between pbx-gap-3">
          <span class="pbx-text-xs pbx-font-medium pbx-text-gray-500">{{
            translate('Horizontal')
          }}</span>
          <SpacingStepper
            :value="displayVal(horizontal)"
            @decrement="stepHorizontal(-1)"
            @increment="stepHorizontal(1)"
          />
        </div>
      </div>

      <hr />
      <div class="pbx-editorSectionTitle">
        {{ translate(isPadding ? 'Padding' : 'Margin') }}
      </div>

      <!-- Box model -->
      <div
        class="pbx-relative pbx-rounded-full pbx-border pbx-border-solid pbx-p-8 pbx-pt-8 pbx-flex pbx-items-center pbx-justify-center"
        :class="[boxBgColor, boxBorderColor]"
      >
        <div class="pbx-flex pbx-flex-col pbx-items-center pbx-justify-center">
          <!-- Top -->
          <div class="pbx-mb-3 pbx-flex pbx-justify-center">
            <SpacingStepper
              :value="effectiveTop()"
              :side-label="translate('top')"
              @decrement="stepTop(-1)"
              @increment="stepTop(1)"
            />
          </div>

          <!-- Middle: left | element | right -->
          <div
            class="pbx-items-center pbx-gap-2"
            style="display: grid; grid-template-columns: auto 1fr auto"
          >
            <SpacingStepper
              :value="effectiveLeft()"
              :side-label="translate('left')"
              compact
              @decrement="stepLeft(-1)"
              @increment="stepLeft(1)"
            />

            <div
              class="pbx-flex pbx-h-10 pbx-items-center pbx-justify-center pbx-rounded-lg pbx-border pbx-border-solid pbx-border-gray-200/80 pbx-bg-white pbx-shadow-sm"
            >
              <span class="pbx-select-none pbx-text-[10px] pbx-font-medium pbx-text-gray-400">{{
                translate('element')
              }}</span>
            </div>

            <SpacingStepper
              :value="effectiveRight()"
              :side-label="translate('right')"
              compact
              @decrement="stepRight(-1)"
              @increment="stepRight(1)"
            />
          </div>

          <!-- Bottom -->
          <div class="pbx-mt-3 pbx-flex pbx-justify-center">
            <SpacingStepper
              :value="effectiveBottom()"
              :side-label="translate('bottom')"
              @decrement="stepBottom(-1)"
              @increment="stepBottom(1)"
            />
          </div>
        </div>
      </div>
    </template>
  </EditorAccordion>
</template>
