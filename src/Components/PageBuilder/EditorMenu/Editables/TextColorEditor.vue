<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import CustomDropdown from '../../../Inputs/CustomDropdown.vue'
import tailwindColors from '../../../../utils/builder/tailwind-colors'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import { getPageBuilder } from '../../../../composables/usePageBuilder'
import { useTranslations } from '../../../../composables/useTranslations'
import { useThemeColorPresets } from '../../../../composables/useThemeColorPresets'
import { useEditToolbarPopover } from '../../../../composables/useEditToolbarPopover'
import { transparentSwatchStyle } from '../../../../utils/builder/transparent-swatch-style'
import SliderIcon from '../../../Icons/SliderIcon.vue'
import ColorMenuCustomSection from './ColorMenuCustomSection.vue'
import CustomHexColorModal from './CustomHexColorModal.vue'

const { translate } = useTranslations()

const pageBuilderService = getPageBuilder()

const pageBuilderStateStore = sharedPageBuilderStore

defineProps({
  globalPageLayout: {
    type: Boolean,
  },
})

const textColor = ref<string | null>(null)
const getTextColor = computed(() => {
  return pageBuilderStateStore.getTextColor
})
const getPageBuilderConfig = computed(() => {
  return pageBuilderStateStore.getPageBuilderConfig
})
const { enabledThemeColorPresets } = useThemeColorPresets(getPageBuilderConfig)

const {
  triggerRef: textColorMenuTriggerRef,
  popoverRef: textColorMenuPopoverRef,
  isOpen: isTextColorMenuOpen,
  popoverStyle: textColorMenuPopoverStyle,
  close: closeTextColorMenu,
  toggle: toggleTextColorMenu,
} = useEditToolbarPopover({ width: 224 })

const showCustomHexModal = ref(false)

const selectedCustomTextColor = computed(() => {
  return textColor.value?.startsWith('custom:') ? textColor.value.replace('custom:', '') : ''
})

const textColorSwatchClass = computed(() => {
  if (selectedCustomTextColor.value) return ''

  if (!textColor.value || textColor.value === 'none') {
    return 'pbx-bg-transparent'
  }

  if (textColor.value.startsWith('pbx-text-')) {
    return `pbx-bg-${textColor.value.replace('pbx-text-', '')}`
  }

  return 'pbx-bg-transparent'
})

const textColorSwatchStyle = computed(() => {
  if (selectedCustomTextColor.value) {
    return { backgroundColor: selectedCustomTextColor.value }
  }

  return undefined
})

const isTextTransparent = computed(() => {
  return !textColor.value || textColor.value === 'none'
})

const textColorBarClass = computed(() => {
  if (selectedCustomTextColor.value) return ''

  if (!textColor.value || textColor.value === 'none') {
    return 'pbx-bg-black'
  }

  if (textColor.value.startsWith('pbx-text-')) {
    return `pbx-bg-${textColor.value.replace('pbx-text-', '')}`
  }

  return 'pbx-bg-black'
})

const textColorBarStyle = computed(() => {
  if (selectedCustomTextColor.value) {
    return { backgroundColor: selectedCustomTextColor.value }
  }

  return undefined
})

const tailwindTextColors = computed(() => {
  return tailwindColors.textColorVariables.filter((color) => color !== 'none')
})

const textColorOptions = computed(() => {
  const options: Array<{ value: string; label: string; disabled?: boolean }> = [
    { value: 'none', label: translate('Transparent') },
    { value: '__custom__', label: translate('Custom color') },
  ]

  if (enabledThemeColorPresets.value.length > 0) {
    options.push({
      value: '__section_theme_presets__',
      label: translate('Theme Color Presets'),
      disabled: true,
    })
    options.push(
      ...enabledThemeColorPresets.value.map((preset) => ({
        value: `custom:${preset.color}`,
        label: translate(preset.label),
      })),
    )
  }

  if (tailwindTextColors.value.length > 0) {
    options.push({
      value: '__section_builtin_colors__',
      label: translate('Built-in colors'),
      disabled: true,
    })
    options.push(...tailwindTextColors.value.map((color) => ({ value: color, label: color })))
  }

  return options
})

function applyThemeTextColor(color: string): void {
  textColor.value = `custom:${color}`
  pageBuilderService.handleCustomTextColor(color)
  closeTextColorMenu()
}

function selectTailwindTextColor(color: string): void {
  textColor.value = color
  pageBuilderService.handleTextColor(color)
  closeTextColorMenu()
}

function applyCustomHexColor(color: string): void {
  textColor.value = `custom:${color}`
  pageBuilderService.handleCustomTextColor(color)
}

function handleTextColorSelect(value: string): void {
  if (value.startsWith('__section_')) return

  if (value === '__custom__') {
    openCustomHexModal()
    return
  }

  if (value.startsWith('custom:')) {
    const color = value.replace('custom:', '')
    applyThemeTextColor(color)
    return
  }

  selectTailwindTextColor(value)
}

function openCustomHexModal(): void {
  closeTextColorMenu()
  showCustomHexModal.value = true
}

function closeCustomHexModal(): void {
  showCustomHexModal.value = false
}

watch(
  getTextColor,
  (newValue) => {
    textColor.value = newValue
  },
  { immediate: true },
)
</script>

<template>
  <CustomDropdown
    v-if="globalPageLayout"
    v-model="textColor"
    :options="textColorOptions"
    button-class="pbx-flex pbx-w-full pbx-flex-row pbx-justify-between pbx-items-center pbx-pl-3 pbx-pr-3 pbx-py-5 pbx-cursor-pointer pbx-duration-200 hover:pbx-bg-myPrimaryLightGrayColor pbx-bg-white hover:pbx-text-black pbx-text-black pbx-font-sans pbx-font-medium pbx-border pbx-border-solid pbx-border-gray-400"
    menu-class="pbx-headless-dropdown pbx-absolute pbx-min-w-[12rem] pbx-z-40 pbx-mt-1 pbx-max-h-72 pbx-w-full pbx-max-w-full pbx-overflow-x-hidden pbx-overflow-y-auto pbx-rounded-md pbx-bg-gray-50 pbx-py-1 pbx-text-base pbx-shadow-lg pbx-ring-1 pbx-ring-black pbx-ring-opacity-5 focus:pbx-outline-none sm:pbx-text-sm"
    @select="handleTextColorSelect"
  >
    <template #button>
      <div class="pbx-flex pbx-min-w-0 pbx-justify-start pbx-items-center pbx-gap-2">
        <div
          class="pbx-aspect-square pbx-w-6 pbx-h-6 pbx-shrink-0 pbx-border pbx-border-gray-600 pbx-rounded-full pbx-border-solid"
          :class="selectedCustomTextColor ? '' : isTextTransparent ? '' : textColorSwatchClass"
          :style="
            selectedCustomTextColor
              ? { backgroundColor: selectedCustomTextColor }
              : isTextTransparent
                ? transparentSwatchStyle
                : textColorSwatchStyle
          "
        ></div>
        <div class="pbx-min-w-0 pbx-break-words">{{ translate('Text Color') }}</div>
      </div>

      <span class="material-symbols-outlined pbx-shrink-0">chevron_right</span>
    </template>
    <template #option="{ option, selected }">
      <div
        v-if="option.value.startsWith('__section_')"
        class="pbx-px-2 pbx-py-2 pbx-text-xs pbx-font-semibold pbx-text-gray-500"
      >
        {{ option.label || option.value }}
      </div>
      <div v-else class="pbx-flex pbx-w-full pbx-min-w-0 pbx-items-center pbx-gap-3">
        <div
          v-if="option.value === 'none'"
          class="pbx-aspect-square pbx-w-6 pbx-h-6 pbx-border-solid pbx-border pbx-border-gray-300 pbx-rounded-sm pbx-shrink-0"
          :style="transparentSwatchStyle"
        ></div>
        <div
          v-else-if="option.value === '__custom__'"
          class="pbx-w-6 pbx-h-6 pbx-flex pbx-items-center pbx-justify-center pbx-shrink-0"
        >
          <SliderIcon />
        </div>
        <div
          v-else
          class="pbx-aspect-square pbx-w-6 pbx-h-6 pbx-border-solid pbx-border pbx-border-gray-100 pbx-rounded-sm pbx-shrink-0"
          :class="
            option.value.startsWith('pbx-text-')
              ? `pbx-bg-${option.value.replace('pbx-text-', '')}`
              : ''
          "
          :style="
            option.value.startsWith('custom:')
              ? { backgroundColor: option.value.replace('custom:', '') }
              : undefined
          "
        ></div>
        <span class="pbx-flex-1 pbx-min-w-0 pbx-break-words">{{
          option.label || option.value
        }}</span>
        <span
          v-if="selected && option.value !== '__custom__'"
          class="pbx-h-3 pbx-w-3 pbx-shrink-0 pbx-rounded-full pbx-border pbx-border-solid pbx-border-gray-200"
          :class="
            option.value.startsWith('pbx-text-')
              ? `pbx-bg-${option.value.replace('pbx-text-', '')}`
              : ''
          "
          :style="
            option.value === 'none'
              ? transparentSwatchStyle
              : option.value.startsWith('custom:')
                ? { backgroundColor: option.value.replace('custom:', '') }
                : undefined
          "
          aria-hidden="true"
        ></span>
        <span
          v-else-if="option.value === '__custom__' && selectedCustomTextColor"
          class="pbx-h-3 pbx-w-3 pbx-shrink-0 pbx-rounded-full pbx-border pbx-border-solid pbx-border-gray-200"
          :style="{ backgroundColor: selectedCustomTextColor }"
          aria-hidden="true"
        ></span>
      </div>
    </template>
  </CustomDropdown>

  <div v-else class="pbx-shrink-0">
    <div
      ref="textColorMenuTriggerRef"
      :title="translate('Text Color')"
      class="pbx-h-8 pbx-w-8 pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center pbx-aspect-square pbx-border pbx-border-gray-500 pbx-cursor-pointer pbx-transition-all pbx-duration-200 pbx-ease-in-out hover:pbx-shadow-md focus-visible:pbx-ring-0"
      :class="{
        'pbx-bg-myPrimaryLinkColor pbx-text-white': isTextColorMenuOpen,
      }"
      @click.stop="toggleTextColorMenu"
    >
      <span
        class="pbx-flex pbx-flex-col pbx-items-center pbx-justify-center pbx-leading-none"
        aria-hidden="true"
      >
        <span
          class="pbx-text-sm pbx-font-bold pbx-leading-none"
          :class="isTextColorMenuOpen ? 'pbx-text-white' : 'pbx-text-myPrimaryDarkGrayColor'"
        >
          A
        </span>
        <span
          class="pbx-mt-0.5 pbx-h-1 pbx-w-4 pbx-rounded-full pbx-shrink-0"
          :class="textColorBarClass"
          :style="textColorBarStyle"
        ></span>
      </span>
    </div>

    <Teleport to="body">
      <div
        v-if="isTextColorMenuOpen"
        ref="textColorMenuPopoverRef"
        data-pbx-edit-toolbar-popover
        data-pbx-text-color-menu-popover
        :style="textColorMenuPopoverStyle"
        class="pbx-fixed pbx-z-50 pbx-max-h-72 pbx-w-72 pbx-max-w-[calc(100vw-2rem)] pbx-overflow-x-hidden pbx-overflow-y-auto pbx-rounded-lg pbx-bg-white pbx-py-2 pbx-px-2 pbx-shadow-lg pbx-border pbx-border-solid pbx-border-gray-200"
        @mousedown.stop
        @pointerdown.stop
        @click.stop
      >
        <button
          type="button"
          class="pbx-text-sm pbx-font-sans pbx-w-full pbx-min-w-0 pbx-overflow-hidden pbx-flex pbx-items-center pbx-gap-3 pbx-cursor-pointer pbx-py-2 pbx-px-2 pbx-rounded-none pbx-border-0 pbx-bg-transparent pbx-text-left pbx-text-myPrimaryDarkGrayColor hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white hover:[&_span]:pbx-text-white"
          :class="{
            'pbx-bg-myPrimaryLinkColor ': !textColor || textColor === 'none',
          }"
          @click="selectTailwindTextColor('none')"
        >
          <div
            class="pbx-aspect-square pbx-w-6 pbx-h-6 pbx-border-solid pbx-border pbx-border-gray-300 pbx-rounded-sm pbx-shrink-0 pbx-bg-black"
          ></div>
          <span>{{ translate('Default black') }}</span>
        </button>
        <div class="pbx-my-1 pbx-border-0 pbx-border-t pbx-border-solid pbx-border-gray-200"></div>
        <ColorMenuCustomSection :model-value="selectedCustomTextColor" @open="openCustomHexModal" />
        <div
          v-if="enabledThemeColorPresets.length > 0 || tailwindTextColors.length > 0"
          class="pbx-my-1 pbx-border-0 pbx-border-t pbx-border-solid pbx-border-gray-200"
        ></div>
        <template v-if="enabledThemeColorPresets.length > 0">
          <div class="pbx-px-2 pbx-py-2 pbx-text-xs pbx-font-semibold pbx-text-gray-500">
            {{ translate('Theme Color Presets') }}
          </div>
          <button
            v-for="preset in enabledThemeColorPresets"
            :key="preset.id"
            type="button"
            class="pbx-text-sm pbx-font-sans pbx-w-full pbx-min-w-0 pbx-overflow-hidden pbx-flex pbx-items-center pbx-gap-3 pbx-cursor-pointer pbx-py-2 pbx-px-2 pbx-rounded-none pbx-border-0 pbx-bg-transparent pbx-text-left pbx-text-myPrimaryDarkGrayColor hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white hover:[&_span]:pbx-text-white"
            @click="applyThemeTextColor(preset.color)"
          >
            <div
              class="pbx-aspect-square pbx-w-6 pbx-h-6 pbx-border-solid pbx-border pbx-border-gray-100 pbx-rounded-sm pbx-shrink-0"
              :style="{ backgroundColor: preset.color }"
            ></div>
            <span class="pbx-flex-1">{{ translate(preset.label) }}</span>
            <span
              v-if="textColor === `custom:${preset.color}`"
              class="pbx-h-3 pbx-w-3 pbx-shrink-0 pbx-rounded-full pbx-border pbx-border-solid pbx-border-gray-200"
              :style="{ backgroundColor: preset.color }"
              aria-hidden="true"
            ></span>
          </button>
          <div
            v-if="tailwindTextColors.length > 0"
            class="pbx-my-1 pbx-border-0 pbx-border-t pbx-border-solid pbx-border-gray-200"
          ></div>
        </template>
        <div
          v-if="tailwindTextColors.length > 0"
          class="pbx-px-2 pbx-py-2 pbx-text-xs pbx-font-semibold pbx-text-gray-500"
        >
          {{ translate('Built-in colors') }}
        </div>
        <button
          v-for="color in tailwindTextColors"
          :key="color"
          type="button"
          class="pbx-text-sm pbx-font-sans pbx-w-full pbx-min-w-0 pbx-overflow-hidden pbx-flex pbx-items-center pbx-gap-3 pbx-cursor-pointer pbx-py-2 pbx-px-2 pbx-rounded-none pbx-border-0 pbx-bg-transparent pbx-text-left pbx-text-myPrimaryDarkGrayColor hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white hover:[&_span]:pbx-text-white"
          @click="selectTailwindTextColor(color)"
        >
          <div
            class="pbx-aspect-square pbx-w-6 pbx-h-6 pbx-border-solid pbx-border pbx-border-gray-100 pbx-rounded-sm pbx-shrink-0"
            :class="`pbx-bg-${color.replace('pbx-text-', '')}`"
          ></div>
          <span class="pbx-flex-1 pbx-min-w-0 pbx-break-words">{{ color }}</span>
          <span
            v-if="textColor === color"
            class="pbx-h-3 pbx-w-3 pbx-shrink-0 pbx-rounded-full pbx-border pbx-border-solid pbx-border-gray-200"
            :class="`pbx-bg-${color.replace('pbx-text-', '')}`"
            aria-hidden="true"
          ></span>
        </button>
      </div>
    </Teleport>
  </div>

  <CustomHexColorModal
    :show="showCustomHexModal"
    :initial-color="selectedCustomTextColor"
    :title="translate('Text Color')"
    @close="closeCustomHexModal"
    @apply="applyCustomHexColor"
  />
</template>
