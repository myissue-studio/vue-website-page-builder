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

const backgroundColor = ref<string | null>(null)
const getBackgroundColor = computed(() => {
  return pageBuilderStateStore.getBackgroundColor
})
const getPageBuilderConfig = computed(() => {
  return pageBuilderStateStore.getPageBuilderConfig
})
const { enabledThemeColorPresets } = useThemeColorPresets(getPageBuilderConfig)

const {
  triggerRef: backgroundColorMenuTriggerRef,
  popoverRef: backgroundColorMenuPopoverRef,
  isOpen: isBackgroundColorMenuOpen,
  popoverStyle: backgroundColorMenuPopoverStyle,
  close: closeBackgroundColorMenu,
  toggle: toggleBackgroundColorMenu,
} = useEditToolbarPopover({ width: 224 })

const showCustomHexModal = ref(false)

const selectedCustomBackgroundColor = computed(() => {
  return backgroundColor.value?.startsWith('custom:')
    ? backgroundColor.value.replace('custom:', '')
    : ''
})

const backgroundColorSwatchClass = computed(() => {
  if (selectedCustomBackgroundColor.value) return ''

  if (!backgroundColor.value || backgroundColor.value === 'none') {
    return 'pbx-bg-transparent'
  }

  if (backgroundColor.value.startsWith('pbx-bg-')) {
    return backgroundColor.value
  }

  return 'pbx-bg-transparent'
})

const backgroundColorSwatchStyle = computed(() => {
  if (selectedCustomBackgroundColor.value) {
    return { backgroundColor: selectedCustomBackgroundColor.value }
  }

  return undefined
})

const isBackgroundTransparent = computed(() => {
  return !backgroundColor.value || backgroundColor.value === 'none'
})

const tailwindBackgroundColors = computed(() => {
  return tailwindColors.backgroundColorVariables.filter((color) => color !== 'none')
})

const backgroundColorOptions = computed(() => {
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

  if (tailwindBackgroundColors.value.length > 0) {
    options.push({
      value: '__section_builtin_colors__',
      label: translate('Built-in colors'),
      disabled: true,
    })
    options.push(...tailwindBackgroundColors.value.map((color) => ({ value: color, label: color })))
  }

  return options
})

function applyThemeBackgroundColor(color: string): void {
  backgroundColor.value = `custom:${color}`
  pageBuilderService.handleCustomBackgroundColor(color)
  closeBackgroundColorMenu()
}

function selectTailwindBackgroundColor(color: string): void {
  backgroundColor.value = color
  pageBuilderService.handleBackgroundColor(color)
  closeBackgroundColorMenu()
}

function applyCustomHexColor(color: string): void {
  backgroundColor.value = `custom:${color}`
  pageBuilderService.handleCustomBackgroundColor(color)
}

function handleBackgroundColorSelect(value: string): void {
  if (value.startsWith('__section_')) return

  if (value === '__custom__') {
    openCustomHexModal()
    return
  }

  if (value.startsWith('custom:')) {
    const color = value.replace('custom:', '')
    applyThemeBackgroundColor(color)
    return
  }

  selectTailwindBackgroundColor(value)
}

function openCustomHexModal(): void {
  closeBackgroundColorMenu()
  showCustomHexModal.value = true
}

function closeCustomHexModal(): void {
  showCustomHexModal.value = false
}

watch(
  getBackgroundColor,
  (newValue) => {
    backgroundColor.value = newValue
  },
  { immediate: true },
)
</script>

<template>
  <CustomDropdown
    v-if="globalPageLayout"
    v-model="backgroundColor"
    :options="backgroundColorOptions"
    button-class="pbx-flex pbx-w-full pbx-flex-row pbx-justify-between pbx-items-center pbx-pl-3 pbx-pr-3 pbx-py-5 pbx-cursor-pointer pbx-duration-200 hover:pbx-bg-myPrimaryLightGrayColor pbx-bg-white hover:pbx-text-black pbx-text-black pbx-font-sans pbx-font-medium pbx-border pbx-border-solid pbx-border-gray-400"
    menu-class="pbx-headless-dropdown pbx-absolute pbx-min-w-[12rem] pbx-z-40 pbx-mt-1 pbx-max-h-72 pbx-w-full pbx-max-w-full pbx-overflow-x-hidden pbx-overflow-y-auto pbx-rounded-md pbx-bg-gray-50 pbx-py-1 pbx-text-base pbx-shadow-lg pbx-ring-1 pbx-ring-black pbx-ring-opacity-5 focus:pbx-outline-none sm:pbx-text-sm"
    @select="handleBackgroundColorSelect"
  >
    <template #button>
      <div class="pbx-flex pbx-min-w-0 pbx-justify-start pbx-items-center pbx-gap-2">
        <div
          class="pbx-aspect-square pbx-w-6 pbx-h-6 pbx-shrink-0 pbx-border pbx-border-gray-600 pbx-rounded-full pbx-border-solid"
          :class="
            selectedCustomBackgroundColor
              ? ''
              : isBackgroundTransparent
                ? ''
                : backgroundColorSwatchClass
          "
          :style="
            selectedCustomBackgroundColor
              ? { backgroundColor: selectedCustomBackgroundColor }
              : isBackgroundTransparent
                ? transparentSwatchStyle
                : backgroundColorSwatchStyle
          "
        ></div>
        <div class="pbx-min-w-0 pbx-break-words">{{ translate('Background Color') }}</div>
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
            option.value.startsWith('pbx-bg-')
              ? `pbx-bg-${option.value.replace('pbx-bg-', '')}`
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
          :class="option.value.startsWith('pbx-bg-') ? option.value : ''"
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
          v-else-if="option.value === '__custom__' && selectedCustomBackgroundColor"
          class="pbx-h-3 pbx-w-3 pbx-shrink-0 pbx-rounded-full pbx-border pbx-border-solid pbx-border-gray-200"
          :style="{ backgroundColor: selectedCustomBackgroundColor }"
          aria-hidden="true"
        ></span>
      </div>
    </template>
  </CustomDropdown>

  <div v-else class="pbx-shrink-0">
    <div
      ref="backgroundColorMenuTriggerRef"
      :title="translate('Background Color')"
      class="pbx-h-8 pbx-w-8 pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center pbx-aspect-square pbx-border pbx-border-gray-500 pbx-cursor-pointer pbx-transition-all pbx-duration-200 pbx-ease-in-out hover:pbx-shadow-md focus-visible:pbx-ring-0"
      :class="{
        'pbx-bg-myPrimaryLinkColor pbx-text-white': isBackgroundColorMenuOpen,
      }"
      @click.stop="toggleBackgroundColorMenu"
    >
      <span
        class="pbx-h-5 pbx-w-5 pbx-rounded-full pbx-border pbx-border-solid pbx-border-gray-300 pbx-shrink-0"
        :class="isBackgroundTransparent ? '' : backgroundColorSwatchClass"
        :style="isBackgroundTransparent ? transparentSwatchStyle : backgroundColorSwatchStyle"
        aria-hidden="true"
      ></span>
    </div>

    <Teleport to="body">
      <div
        v-if="isBackgroundColorMenuOpen"
        ref="backgroundColorMenuPopoverRef"
        data-pbx-edit-toolbar-popover
        data-pbx-background-color-menu-popover
        :style="backgroundColorMenuPopoverStyle"
        class="pbx-fixed pbx-z-50 pbx-max-h-72 pbx-w-72 pbx-max-w-[calc(100vw-2rem)] pbx-overflow-x-hidden pbx-overflow-y-auto pbx-rounded-lg pbx-bg-white pbx-py-2 pbx-px-2 pbx-shadow-lg pbx-border pbx-border-solid pbx-border-gray-200"
        @mousedown.stop
        @pointerdown.stop
        @click.stop
      >
        <button
          type="button"
          class="pbx-text-sm pbx-font-sans pbx-w-full pbx-min-w-0 pbx-overflow-hidden pbx-flex pbx-items-center pbx-gap-3 pbx-cursor-pointer pbx-py-2 pbx-px-2 pbx-rounded-none pbx-border-0 pbx-bg-transparent pbx-text-left pbx-text-myPrimaryDarkGrayColor hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white hover:[&_span]:pbx-text-white"
          :class="{
            'pbx-bg-myPrimaryLinkColor ': isBackgroundTransparent,
          }"
          @click="selectTailwindBackgroundColor('none')"
        >
          <div
            class="pbx-aspect-square pbx-w-6 pbx-h-6 pbx-border-solid pbx-border pbx-border-gray-300 pbx-rounded-sm pbx-shrink-0"
            :style="transparentSwatchStyle"
          ></div>
          <span>{{ translate('Transparent') }}</span>
        </button>
        <div class="pbx-my-1 pbx-border-0 pbx-border-t pbx-border-solid pbx-border-gray-200"></div>
        <ColorMenuCustomSection
          :model-value="selectedCustomBackgroundColor"
          @open="openCustomHexModal"
        />
        <div
          v-if="enabledThemeColorPresets.length > 0 || tailwindBackgroundColors.length > 0"
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
            @click="applyThemeBackgroundColor(preset.color)"
          >
            <div
              class="pbx-aspect-square pbx-w-6 pbx-h-6 pbx-border-solid pbx-border pbx-border-gray-100 pbx-rounded-sm pbx-shrink-0"
              :style="{ backgroundColor: preset.color }"
            ></div>
            <span class="pbx-flex-1">{{ translate(preset.label) }}</span>
            <span
              v-if="backgroundColor === `custom:${preset.color}`"
              class="pbx-h-3 pbx-w-3 pbx-shrink-0 pbx-rounded-full pbx-border pbx-border-solid pbx-border-gray-200"
              :style="{ backgroundColor: preset.color }"
              aria-hidden="true"
            ></span>
          </button>
          <div
            v-if="tailwindBackgroundColors.length > 0"
            class="pbx-my-1 pbx-border-0 pbx-border-t pbx-border-solid pbx-border-gray-200"
          ></div>
        </template>
        <div
          v-if="tailwindBackgroundColors.length > 0"
          class="pbx-px-2 pbx-py-2 pbx-text-xs pbx-font-semibold pbx-text-gray-500"
        >
          {{ translate('Built-in colors') }}
        </div>
        <button
          v-for="color in tailwindBackgroundColors"
          :key="color"
          type="button"
          class="pbx-text-sm pbx-font-sans pbx-w-full pbx-min-w-0 pbx-overflow-hidden pbx-flex pbx-items-center pbx-gap-3 pbx-cursor-pointer pbx-py-2 pbx-px-2 pbx-rounded-none pbx-border-0 pbx-bg-transparent pbx-text-left pbx-text-myPrimaryDarkGrayColor hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white hover:[&_span]:pbx-text-white"
          @click="selectTailwindBackgroundColor(color)"
        >
          <div
            class="pbx-aspect-square pbx-w-6 pbx-h-6 pbx-border-solid pbx-border pbx-border-gray-100 pbx-rounded-sm pbx-shrink-0"
            :class="`pbx-bg-${color.replace('pbx-bg-', '')}`"
          ></div>
          <span class="pbx-flex-1 pbx-min-w-0 pbx-break-words">{{ color }}</span>
          <span
            v-if="backgroundColor === color"
            class="pbx-h-3 pbx-w-3 pbx-shrink-0 pbx-rounded-full pbx-border pbx-border-solid pbx-border-gray-200"
            :class="color"
            aria-hidden="true"
          ></span>
        </button>
      </div>
    </Teleport>
  </div>

  <CustomHexColorModal
    :show="showCustomHexModal"
    :initial-color="selectedCustomBackgroundColor"
    :title="translate('Background Color')"
    @close="closeCustomHexModal"
    @apply="applyCustomHexColor"
  />
</template>
