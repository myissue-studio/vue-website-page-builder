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

const fontVerticalMargin = ref<string | null>(null)
const fontHorizontalMargin = ref<string | null>(null)
const fontTopMargin = ref<string | null>(null)
const fontRightMargin = ref<string | null>(null)
const fontBottomMargin = ref<string | null>(null)
const fontLeftMargin = ref<string | null>(null)

const getFontVerticalMargin = computed(() => pageBuilderStateStore.getFontVerticalMargin)
const getFontHorizontalMargin = computed(() => pageBuilderStateStore.getFontHorizontalMargin)
const getFontTopMargin = computed(() => pageBuilderStateStore.getFontTopMargin)
const getFontRightMargin = computed(() => pageBuilderStateStore.getFontRightMargin)
const getFontBottomMargin = computed(() => pageBuilderStateStore.getFontBottomMargin)
const getFontLeftMargin = computed(() => pageBuilderStateStore.getFontLeftMargin)

watch(
  getFontVerticalMargin,
  async (v) => {
    fontVerticalMargin.value = v
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
watch(
  getFontHorizontalMargin,
  async (v) => {
    fontHorizontalMargin.value = v
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
watch(
  getFontTopMargin,
  async (v) => {
    fontTopMargin.value = v
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
watch(
  getFontRightMargin,
  async (v) => {
    fontRightMargin.value = v
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
watch(
  getFontBottomMargin,
  async (v) => {
    fontBottomMargin.value = v
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
watch(
  getFontLeftMargin,
  async (v) => {
    fontLeftMargin.value = v
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)

/** Extract numeric part from a Tailwind class, e.g. "pbx-mt-8" → "8" */
function displayVal(cls: string | null | undefined): string {
  if (!cls || cls === 'none') return '–'
  const m = cls.match(/-(\d[\d.]*)$/)
  return m ? m[1] : '–'
}

/** Effective value: prefer directional class, fall back to shorthand */
function effectiveTop(): string {
  return displayVal(
    fontTopMargin.value && fontTopMargin.value !== 'none'
      ? fontTopMargin.value
      : fontVerticalMargin.value,
  )
}
function effectiveBottom(): string {
  return displayVal(
    fontBottomMargin.value && fontBottomMargin.value !== 'none'
      ? fontBottomMargin.value
      : fontVerticalMargin.value,
  )
}
function effectiveLeft(): string {
  return displayVal(
    fontLeftMargin.value && fontLeftMargin.value !== 'none'
      ? fontLeftMargin.value
      : fontHorizontalMargin.value,
  )
}
function effectiveRight(): string {
  return displayVal(
    fontRightMargin.value && fontRightMargin.value !== 'none'
      ? fontRightMargin.value
      : fontHorizontalMargin.value,
  )
}

function stepVertical(dir: 1 | -1) {
  const arr = tailwindPaddingPlusMargin.verticalMargin
  const cur = fontVerticalMargin.value ?? 'none'
  const idx = arr.indexOf(cur)
  const next = arr[Math.max(0, Math.min(arr.length - 1, (idx < 0 ? 0 : idx) + dir))]
  fontVerticalMargin.value = next
  pageBuilderService.handleVerticalMargin(next)
}

function stepHorizontal(dir: 1 | -1) {
  const arr = tailwindPaddingPlusMargin.horizontalMargin
  const cur = fontHorizontalMargin.value ?? 'none'
  const idx = arr.indexOf(cur)
  const next = arr[Math.max(0, Math.min(arr.length - 1, (idx < 0 ? 0 : idx) + dir))]
  fontHorizontalMargin.value = next
  pageBuilderService.handleHorizontalMargin(next)
}

function stepTop(dir: 1 | -1) {
  const arr = tailwindPaddingPlusMargin.topMargin
  const cur = fontTopMargin.value ?? 'none'
  const idx = arr.indexOf(cur)
  const next = arr[Math.max(0, Math.min(arr.length - 1, (idx < 0 ? 0 : idx) + dir))]
  fontTopMargin.value = next
  pageBuilderService.handleTopMargin(next)
}

function stepRight(dir: 1 | -1) {
  const arr = tailwindPaddingPlusMargin.rightMargin
  const cur = fontRightMargin.value ?? 'none'
  const idx = arr.indexOf(cur)
  const next = arr[Math.max(0, Math.min(arr.length - 1, (idx < 0 ? 0 : idx) + dir))]
  fontRightMargin.value = next
  pageBuilderService.handleRightMargin(next)
}

function stepBottom(dir: 1 | -1) {
  const arr = tailwindPaddingPlusMargin.bottomMargin
  const cur = fontBottomMargin.value ?? 'none'
  const idx = arr.indexOf(cur)
  const next = arr[Math.max(0, Math.min(arr.length - 1, (idx < 0 ? 0 : idx) + dir))]
  fontBottomMargin.value = next
  pageBuilderService.handleBottomMargin(next)
}

function stepLeft(dir: 1 | -1) {
  const arr = tailwindPaddingPlusMargin.leftMargin
  const cur = fontLeftMargin.value ?? 'none'
  const idx = arr.indexOf(cur)
  const next = arr[Math.max(0, Math.min(arr.length - 1, (idx < 0 ? 0 : idx) + dir))]
  fontLeftMargin.value = next
  pageBuilderService.handleLeftMargin(next)
}
</script>

<template>
  <EditorAccordion>
    <template #title>{{ translate('Margin') }}</template>
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
                class="pbx-h-8 pbx-w-8 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white pbx-shadow"
                @click="stepVertical(-1)"
              >
                <span class="material-symbols-outlined"> remove </span>
              </button>
              <span
                class="pbx-text-xs pbx-font-semibold pbx-text-gray-700 pbx-w-10 pbx-text-center pbx-tabular-nums"
                >{{ displayVal(fontVerticalMargin) }}</span
              >
              <button
                class="pbx-h-8 pbx-w-8 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white pbx-shadow"
                @click="stepVertical(1)"
              >
                <span class="material-symbols-outlined"> add </span>
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
                class="pbx-h-8 pbx-w-8 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white pbx-shadow"
                @click="stepHorizontal(-1)"
              >
                <span class="material-symbols-outlined"> remove </span>
              </button>
              <span
                class="pbx-text-xs pbx-font-semibold pbx-text-gray-700 pbx-w-10 pbx-text-center pbx-tabular-nums"
                >{{ displayVal(fontHorizontalMargin) }}</span
              >
              <button
                class="pbx-h-8 pbx-w-8 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white pbx-shadow"
                @click="stepHorizontal(1)"
              >
                <span class="material-symbols-outlined"> add </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Box model visual -->
        <div
          class="pbx-relative pbx-rounded-xl pbx-border-2 pbx-border-dashed pbx-border-orange-300 pbx-bg-orange-50 pbx-pt-10 pbx-pb-10 pbx-px-3"
        >
          <!-- Top side -->
          <div class="pbx-flex pbx-justify-center pbx-mb-2">
            <div
              class="pbx-flex pbx-items-center pbx-justify-center pbx-mb-2 pbx-border pbx-border-gray-200 pbx-rounded-xl pbx-py-4 pbx-px-1"
            >
              <button
                class="pbx-h-8 pbx-w-8 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white pbx-shadow"
                @click="stepTop(-1)"
              >
                <span class="material-symbols-outlined"> remove </span>
              </button>
              <div class="pbx-flex pbx-flex-col pbx-items-center pbx-w-14">
                <span class="pbx-text-[10px] pbx-text-orange-400 pbx-leading-none pbx-mb-0.5">{{
                  translate('top')
                }}</span>
                <span class="pbx-text-sm pbx-font-semibold pbx-text-gray-700 pbx-tabular-nums">{{
                  effectiveTop()
                }}</span>
              </div>
              <button
                class="pbx-h-8 pbx-w-8 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white pbx-shadow"
                @click="stepTop(1)"
              >
                <span class="material-symbols-outlined"> add </span>
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
                class="pbx-h-8 pbx-w-8 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white pbx-shadow"
                @click="stepLeft(-1)"
              >
                <span class="material-symbols-outlined"> remove </span>
              </button>
              <div class="pbx-flex pbx-flex-col pbx-items-center pbx-w-8">
                <span class="pbx-text-[9px] pbx-text-orange-400 pbx-leading-none pbx-mb-0.5">{{
                  translate('left')
                }}</span>
                <span class="pbx-text-xs pbx-font-semibold pbx-text-gray-700 pbx-tabular-nums">{{
                  effectiveLeft()
                }}</span>
              </div>
              <button
                class="pbx-h-8 pbx-w-8 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white pbx-shadow"
                @click="stepLeft(1)"
              >
                <span class="material-symbols-outlined"> add </span>
              </button>
            </div>

            <!-- Center element placeholder -->
            <div
              class="pbx-bg-white pbx-border pbx-border-orange-200 pbx-rounded-lg pbx-h-10 pbx-flex pbx-items-center pbx-justify-center pbx-mx-1"
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
                class="pbx-h-8 pbx-w-8 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white pbx-shadow"
                @click="stepRight(-1)"
              >
                <span class="material-symbols-outlined"> remove </span>
              </button>
              <div class="pbx-flex pbx-flex-col pbx-items-center pbx-w-8">
                <span class="pbx-text-[9px] pbx-text-orange-400 pbx-leading-none pbx-mb-0.5">{{
                  translate('right')
                }}</span>
                <span class="pbx-text-xs pbx-font-semibold pbx-text-gray-700 pbx-tabular-nums">{{
                  effectiveRight()
                }}</span>
              </div>
              <button
                class="pbx-h-8 pbx-w-8 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white pbx-shadow"
                @click="stepRight(1)"
              >
                <span class="material-symbols-outlined"> add </span>
              </button>
            </div>
          </div>

          <!-- Bottom side -->
          <div class="pbx-flex pbx-justify-center pbx-mt-2">
            <div
              class="pbx-flex pbx-items-center pbx-justify-center pbx-mb-2 pbx-border pbx-border-gray-200 pbx-rounded-xl pbx-py-4 pbx-px-1"
            >
              <button
                class="pbx-h-8 pbx-w-8 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white pbx-shadow"
                @click="stepBottom(-1)"
              >
                <span class="material-symbols-outlined"> remove </span>
              </button>
              <div class="pbx-flex pbx-flex-col pbx-items-center pbx-w-14">
                <span class="pbx-text-[10px] pbx-text-orange-400 pbx-leading-none pbx-mb-0.5">{{
                  translate('bottom')
                }}</span>
                <span class="pbx-text-sm pbx-font-semibold pbx-text-gray-700 pbx-tabular-nums">{{
                  effectiveBottom()
                }}</span>
              </div>
              <button
                class="pbx-h-8 pbx-w-8 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white pbx-shadow"
                @click="stepBottom(1)"
              >
                <span class="material-symbols-outlined"> add </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </EditorAccordion>
</template>
