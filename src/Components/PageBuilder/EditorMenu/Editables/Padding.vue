<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import EditorAccordion from '../EditorAccordion.vue'
import tailwindPaddingPlusMargin from '../../../../utils/builder/tailwind-padding-margin'
import { getPageBuilder } from '../../../../composables/builderInstance'
import { useTranslations } from '../../../../composables/useTranslations'

const { translate } = useTranslations()
const pageBuilderService = getPageBuilder()
const pageBuilderStateStore = sharedPageBuilderStore

const fontVerticalPadding = ref<string | null>(null)
const fontHorizontalPadding = ref<string | null>(null)
const fontTopPadding = ref<string | null>(null)
const fontRightPadding = ref<string | null>(null)
const fontBottomPadding = ref<string | null>(null)
const fontLeftPadding = ref<string | null>(null)

const getFontVerticalPadding = computed(() => pageBuilderStateStore.getFontVerticalPadding)
const getFontHorizontalPadding = computed(() => pageBuilderStateStore.getFontHorizontalPadding)
const getFontTopPadding = computed(() => pageBuilderStateStore.getFontTopPadding)
const getFontRightPadding = computed(() => pageBuilderStateStore.getFontRightPadding)
const getFontBottomPadding = computed(() => pageBuilderStateStore.getFontBottomPadding)
const getFontLeftPadding = computed(() => pageBuilderStateStore.getFontLeftPadding)

watch(
  getFontVerticalPadding,
  async (v) => {
    fontVerticalPadding.value = v
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
watch(
  getFontHorizontalPadding,
  async (v) => {
    fontHorizontalPadding.value = v
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
watch(
  getFontTopPadding,
  async (v) => {
    fontTopPadding.value = v
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
watch(
  getFontRightPadding,
  async (v) => {
    fontRightPadding.value = v
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
watch(
  getFontBottomPadding,
  async (v) => {
    fontBottomPadding.value = v
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
watch(
  getFontLeftPadding,
  async (v) => {
    fontLeftPadding.value = v
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)

/** Extract the numeric part from a Tailwind class for display, e.g. "pbx-pt-8" → "8" */
function displayVal(cls: string | null | undefined): string {
  if (!cls || cls === 'none') return '–'
  const m = cls.match(/-(\d[\d.]*)$/)
  return m ? m[1] : '–'
}

/** Effective displayed value: prefers the directional class, falls back to shorthand */
function effectiveTop(): string {
  return displayVal(
    fontTopPadding.value && fontTopPadding.value !== 'none'
      ? fontTopPadding.value
      : fontVerticalPadding.value,
  )
}
function effectiveBottom(): string {
  return displayVal(
    fontBottomPadding.value && fontBottomPadding.value !== 'none'
      ? fontBottomPadding.value
      : fontVerticalPadding.value,
  )
}
function effectiveLeft(): string {
  return displayVal(
    fontLeftPadding.value && fontLeftPadding.value !== 'none'
      ? fontLeftPadding.value
      : fontHorizontalPadding.value,
  )
}
function effectiveRight(): string {
  return displayVal(
    fontRightPadding.value && fontRightPadding.value !== 'none'
      ? fontRightPadding.value
      : fontHorizontalPadding.value,
  )
}

function stepVertical(dir: 1 | -1) {
  const arr = tailwindPaddingPlusMargin.verticalPadding
  const cur = fontVerticalPadding.value ?? 'none'
  const idx = arr.indexOf(cur)
  const next = arr[Math.max(0, Math.min(arr.length - 1, (idx < 0 ? 0 : idx) + dir))]
  fontVerticalPadding.value = next
  pageBuilderService.handleVerticalPadding(next)
}

function stepHorizontal(dir: 1 | -1) {
  const arr = tailwindPaddingPlusMargin.horizontalPadding
  const cur = fontHorizontalPadding.value ?? 'none'
  const idx = arr.indexOf(cur)
  const next = arr[Math.max(0, Math.min(arr.length - 1, (idx < 0 ? 0 : idx) + dir))]
  fontHorizontalPadding.value = next
  pageBuilderService.handleHorizontalPadding(next)
}

function stepTop(dir: 1 | -1) {
  const arr = tailwindPaddingPlusMargin.topPadding
  const cur = fontTopPadding.value ?? 'none'
  const idx = arr.indexOf(cur)
  const next = arr[Math.max(0, Math.min(arr.length - 1, (idx < 0 ? 0 : idx) + dir))]
  fontTopPadding.value = next
  pageBuilderService.handleTopPadding(next)
}

function stepRight(dir: 1 | -1) {
  const arr = tailwindPaddingPlusMargin.rightPadding
  const cur = fontRightPadding.value ?? 'none'
  const idx = arr.indexOf(cur)
  const next = arr[Math.max(0, Math.min(arr.length - 1, (idx < 0 ? 0 : idx) + dir))]
  fontRightPadding.value = next
  pageBuilderService.handleRightPadding(next)
}

function stepBottom(dir: 1 | -1) {
  const arr = tailwindPaddingPlusMargin.bottomPadding
  const cur = fontBottomPadding.value ?? 'none'
  const idx = arr.indexOf(cur)
  const next = arr[Math.max(0, Math.min(arr.length - 1, (idx < 0 ? 0 : idx) + dir))]
  fontBottomPadding.value = next
  pageBuilderService.handleBottomPadding(next)
}

function stepLeft(dir: 1 | -1) {
  const arr = tailwindPaddingPlusMargin.leftPadding
  const cur = fontLeftPadding.value ?? 'none'
  const idx = arr.indexOf(cur)
  const next = arr[Math.max(0, Math.min(arr.length - 1, (idx < 0 ? 0 : idx) + dir))]
  fontLeftPadding.value = next
  pageBuilderService.handleLeftPadding(next)
}
</script>

<template>
  <EditorAccordion>
    <template #title>{{ translate('Padding') }}</template>
    <template #content>
      <div class="pbx-py-3 pbx-px-1">
        <p class="pbx-text-xs pbx-text-gray-400 pbx-mb-3">
          {{ translate('Applies across all screen sizes') }}
        </p>

        <!-- Shorthand quick-set row -->
        <div class="pbx-flex pbx-flex-col pbx-gap-2 pbx-mb-4">
          <!-- Vertical shorthand -->
          <div
            class="pbx-flex pbx-items-center pbx-justify-between pbx-bg-gray-50 pbx-rounded-lg pbx-px-3 pbx-py-2"
          >
            <span class="pbx-text-xs pbx-text-gray-500 pbx-font-medium pbx-w-20">{{
              translate('Vertical')
            }}</span>
            <div
              class="pbx-flex pbx-items-center pbx-justify-center pbx-mb-2 pbx-border pbx-border-gray-200 pbx-rounded-xl pbx-py-4 pbx-px-1"
            >
              <button
                class="pbx-h-8 pbx-w-8 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white pbx-shadow""
                @click="stepVertical(-1)"
              >
                −
              </button>
              <span
                class="pbx-text-xs pbx-font-semibold pbx-text-gray-700 pbx-w-10 pbx-text-center pbx-tabular-nums"
                >{{ displayVal(fontVerticalPadding) }}</span
              >
              <button
                class="pbx-h-8 pbx-w-8 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white pbx-shadow""
                @click="stepVertical(1)"
              >
                +
              </button>
            </div>
          </div>

          <!-- Horizontal shorthand -->
          <div
            class="pbx-flex pbx-items-center pbx-justify-between pbx-bg-gray-50 pbx-rounded-lg pbx-px-3 pbx-py-2"
          >
            <span class="pbx-text-xs pbx-text-gray-500 pbx-font-medium pbx-w-20">{{
              translate('Horizontal')
            }}</span>
            <div
              class="pbx-flex pbx-items-center pbx-justify-center pbx-mb-2 pbx-border pbx-border-gray-200 pbx-rounded-xl pbx-py-4 pbx-px-1"
            >
              <button
                class="pbx-h-8 pbx-w-8 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white pbx-shadow""
                @click="stepHorizontal(-1)"
              >
                −
              </button>
              <span
                class="pbx-text-xs pbx-font-semibold pbx-text-gray-700 pbx-w-10 pbx-text-center pbx-tabular-nums"
                >{{ displayVal(fontHorizontalPadding) }}</span
              >
              <button
                class="pbx-h-8 pbx-w-8 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white pbx-shadow""
                @click="stepHorizontal(1)"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <!-- Box model visual -->
        <div
          class="pbx-relative pbx-rounded-xl pbx-border-2 pbx-border-dashed pbx-border-green-300 pbx-bg-green-50 pbx-pt-10 pbx-pb-10 pbx-px-3"
        >
          <!-- Top side -->
          <div class="pbx-flex pbx-justify-center pbx-mb-2">
            <div
              class="pbx-flex pbx-items-center pbx-justify-center pbx-mb-2 pbx-border pbx-border-gray-200 pbx-rounded-xl pbx-py-4 pbx-px-1"
            >
              <button
                class="pbx-h-8 pbx-w-8 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white pbx-shadow""
                @click="stepTop(-1)"
              >
                −
              </button>
              <div class="pbx-flex pbx-flex-col pbx-items-center pbx-w-14">
                <span class="pbx-text-[10px] pbx-text-green-500 pbx-leading-none pbx-mb-0.5">{{
                  translate('top')
                }}</span>
                <span class="pbx-text-sm pbx-font-semibold pbx-text-gray-700 pbx-tabular-nums">{{
                  effectiveTop()
                }}</span>
              </div>
              <button
                class="pbx-h-8 pbx-w-8 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white pbx-shadow""
                @click="stepTop(1)"
              >
                +
              </button>
            </div>
          </div>

          <!-- Middle row: left | center | right — CSS grid keeps right inside the box -->
          <div
            class="pbx-items-center pbx-gap-1"
            style="display: grid; grid-template-columns: auto 1fr auto"
          >
            <!-- Left -->
            <div
              class="pbx-flex pbx-items-center pbx-justify-center pbx-mb-2 pbx-border pbx-border-gray-200 pbx-rounded-xl pbx-py-4 pbx-px-1"
            >
              <button
                class="pbx-h-8 pbx-w-8 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white pbx-shadow""
                @click="stepLeft(-1)"
              >
                −
              </button>
              <div class="pbx-flex pbx-flex-col pbx-items-center pbx-w-8">
                <span class="pbx-text-[9px] pbx-text-green-500 pbx-leading-none pbx-mb-0.5">{{
                  translate('left')
                }}</span>
                <span class="pbx-text-xs pbx-font-semibold pbx-text-gray-700 pbx-tabular-nums">{{
                  effectiveLeft()
                }}</span>
              </div>
              <button
                class="pbx-h-8 pbx-w-8 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white pbx-shadow""
                @click="stepLeft(1)"
              >
                +
              </button>
            </div>

            <!-- Center element placeholder -->
            <div
              class="pbx-bg-white pbx-border pbx-border-green-200 pbx-rounded-lg pbx-h-10 pbx-flex pbx-items-center pbx-justify-center pbx-mx-1"
            >
              <span class="pbx-text-[10px] pbx-text-gray-300 pbx-select-none">{{
                translate('element')
              }}</span>
            </div>

            <!-- Right -->
            <div
              class="pbx-flex pbx-items-center pbx-justify-center pbx-mb-2 pbx-border pbx-border-gray-200 pbx-rounded-xl pbx-py-4 pbx-px-1"
            >
              <button
                class="pbx-h-8 pbx-w-8 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white pbx-shadow""
                @click="stepRight(-1)"
              >
                −
              </button>
              <div class="pbx-flex pbx-flex-col pbx-items-center pbx-w-8">
                <span class="pbx-text-[9px] pbx-text-green-500 pbx-leading-none pbx-mb-0.5">{{
                  translate('right')
                }}</span>
                <span class="pbx-text-xs pbx-font-semibold pbx-text-gray-700 pbx-tabular-nums">{{
                  effectiveRight()
                }}</span>
              </div>
              <button
                class="pbx-h-8 pbx-w-8 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white pbx-shadow""
                @click="stepRight(1)"
              >
                +
              </button>
            </div>
          </div>

          <!-- Bottom side -->
          <div class="pbx-flex pbx-justify-center pbx-mt-2">
            <div
              class="pbx-flex pbx-items-center pbx-justify-center pbx-mb-2 pbx-border pbx-border-gray-200 pbx-rounded-xl pbx-py-4 pbx-px-1"
            >
              <button
                class="pbx-h-8 pbx-w-8 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white pbx-shadow""
                @click="stepBottom(-1)"
              >
                −
              </button>
              <div class="pbx-flex pbx-flex-col pbx-items-center pbx-w-14">
                <span class="pbx-text-[10px] pbx-text-green-500 pbx-leading-none pbx-mb-0.5">{{
                  translate('bottom')
                }}</span>
                <span class="pbx-text-sm pbx-font-semibold pbx-text-gray-700 pbx-tabular-nums">{{
                  effectiveBottom()
                }}</span>
              </div>
              <button
                class="pbx-h-8 pbx-w-8 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white pbx-shadow""
                @click="stepBottom(1)"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </EditorAccordion>
</template>