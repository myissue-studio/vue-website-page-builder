<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import EditorAccordion from '../EditorAccordion.vue'
import SpacingStepper from './SpacingStepper.vue'
import tailwindPaddingPlusMargin from '../../../../utils/builder/tailwind-padding-margin'
import { getPageBuilder } from '../../../../composables/usePageBuilder'
import { useTranslations } from '../../../../composables/useTranslations'

const props = defineProps<{
  mode: 'padding' | 'margin'
}>()

const { translate } = useTranslations()
const pageBuilderService = getPageBuilder()
const pageBuilderStateStore = sharedPageBuilderStore

const isPadding = computed(() => props.mode === 'padding')

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
  (v) => {
    vertical.value = v
  },
  { immediate: true },
)
watch(
  getHorizontal,
  (v) => {
    horizontal.value = v
  },
  { immediate: true },
)
watch(
  getTop,
  (v) => {
    top.value = v
  },
  { immediate: true },
)
watch(
  getRight,
  (v) => {
    right.value = v
  },
  { immediate: true },
)
watch(
  getBottom,
  (v) => {
    bottom.value = v
  },
  { immediate: true },
)
watch(
  getLeft,
  (v) => {
    left.value = v
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
      <div class="pbx-spacingPanel">
        <div class="pbx-spacingHeader">
          <p class="pbx-spacingTitle">{{ translate('All sides') }}</p>
          <p class="pbx-spacingHint">{{ translate('Applies across all screen sizes') }}</p>
        </div>

        <div class="pbx-spacingGroup">
          <div class="pbx-spacingRow">
            <span class="pbx-spacingLabel">{{ translate('Vertical') }}</span>
            <SpacingStepper
              :value="displayVal(vertical)"
              @decrement="stepVertical(-1)"
              @increment="stepVertical(1)"
            />
          </div>
          <div class="pbx-spacingRow">
            <span class="pbx-spacingLabel">{{ translate('Horizontal') }}</span>
            <SpacingStepper
              :value="displayVal(horizontal)"
              @decrement="stepHorizontal(-1)"
              @increment="stepHorizontal(1)"
            />
          </div>
        </div>

        <div class="pbx-spacingHeader pbx-spacingHeader--spaced">
          <p class="pbx-spacingTitle">{{ translate('Per side') }}</p>
        </div>

        <div class="pbx-spacingBox">
          <div class="pbx-spacingBoxGrid">
            <div class="pbx-spacingBoxCell pbx-spacingBoxCell--empty"></div>
            <div class="pbx-spacingBoxCell">
              <SpacingStepper
                :value="effectiveTop()"
                :side-label="translate('top')"
                @decrement="stepTop(-1)"
                @increment="stepTop(1)"
              />
            </div>
            <div class="pbx-spacingBoxCell pbx-spacingBoxCell--empty"></div>

            <div class="pbx-spacingBoxCell">
              <SpacingStepper
                :value="effectiveLeft()"
                compact
                @decrement="stepLeft(-1)"
                @increment="stepLeft(1)"
              />
            </div>
            <div class="pbx-spacingBoxCell">
              <div class="pbx-spacingBoxCenter">
                <span>{{ translate('element') }}</span>
              </div>
            </div>
            <div class="pbx-spacingBoxCell">
              <SpacingStepper
                :value="effectiveRight()"
                compact
                @decrement="stepRight(-1)"
                @increment="stepRight(1)"
              />
            </div>

            <div class="pbx-spacingBoxCell pbx-spacingBoxCell--empty"></div>
            <div class="pbx-spacingBoxCell">
              <SpacingStepper
                :value="effectiveBottom()"
                :side-label="translate('bottom')"
                @decrement="stepBottom(-1)"
                @increment="stepBottom(1)"
              />
            </div>
            <div class="pbx-spacingBoxCell pbx-spacingBoxCell--empty"></div>
          </div>
        </div>
      </div>
    </template>
  </EditorAccordion>
</template>
