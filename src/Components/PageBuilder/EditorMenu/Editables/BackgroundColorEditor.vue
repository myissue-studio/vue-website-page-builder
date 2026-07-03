<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import tailwindColors from '../../../../utils/builder/tailwaind-colors'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import { getPageBuilder } from '../../../../composables/builderInstance'
import { useTranslations } from '../../../../composables/useTranslations'
import { useThemeColorPresets } from '../../../../composables/useThemeColorPresets'
import { useEditToolbarPopover } from '../../../../composables/useEditToolbarPopover'
import { transparentSwatchStyle } from '../../../../utils/builder/transparent-swatch-style'

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

watch(
  getBackgroundColor,
  async (newValue) => {
    backgroundColor.value = newValue
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
</script>

<template>
  <Listbox v-if="globalPageLayout" as="div" v-model="backgroundColor">
    <div class="pbx-relative">
      <div class="pbx-flex pbx-flex-col pbx-border-solid pbx-border pbx-border-gray-400">
        <ListboxButton
          class="pbx-flex pbx-flex-row pbx-justify-between pbx-items-center pbx-pl-3 pbx-pr-3 pbx-py-5 pbx-cursor-pointer pbx-duration-200 hover:pbx-bg-myPrimaryLightGrayColor pbx-bg-white hover:pbx-text-black pbx-text-black pbx-font-sans pbx-font-medium pbx-border-0"
        >
          <div class="pbx-flex pbx-justify-start pbx-items-center pbx-gap-2">
            <div
              class="pbx-aspect-square pbx-w-6 pbx-h-6 pbx-border pbx-border-gray-600 pbx-rounded-sm pbx-border-solid"
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
            <div>{{ translate('Background Color') }}</div>
          </div>

          <span class="material-symbols-outlined"> chevron_right </span>
        </ListboxButton>
      </div>

      <transition
        leave-active-class="pbx-transition pbx-ease-in pbx-duration-100"
        leave-from-class="pbx-opacity-100"
        leave-to-class="pbx-opacity-0"
      >
        <ListboxOptions
          class="pbx-headless-dropdown pbx-absolute pbx-min-w-[12rem] pbx-z-40 pbx-mt-1 pbx-max-h-56 pbx-w-full pbx-overflow-auto pbx-rounded-md pbx-bg-gray-50 pbx-py-1 pbx-text-base pbx-shadow-lg pbx-ring-1 pbx-ring-black pbx-ring-opacity-5 focus:pbx-outline-none sm:pbx-text-sm"
        >
          <ListboxOption
            as="template"
            value="none"
            @click="pageBuilderService.handleBackgroundColor('none')"
            v-slot="{ active }"
          >
            <li
              :class="[
                active
                  ? 'pbx-bg-myPrimaryLinkColor pbx-text-white'
                  : 'pbx-text-myPrimaryDarkGrayColor',
                'pbx-relative pbx-cursor-default pbx-select-none pbx-py-2 pbx-pl-3 pbx-pr-9',
              ]"
            >
              <div class="pbx-flex pbx-items-center">
                <div
                  class="pbx-aspect-square pbx-w-6 pbx-h-6 pbx-border-solid pbx-border pbx-border-gray-300 pbx-rounded-sm pbx-shrink-0"
                  :style="transparentSwatchStyle"
                ></div>
                <span class="pbx-ml-3 hover:pbx-text-white">{{ translate('Transparent') }}</span>
              </div>
            </li>
          </ListboxOption>
          <div
            v-if="enabledThemeColorPresets.length > 0 || tailwindBackgroundColors.length > 0"
            class="pbx-my-1 pbx-border-0 pbx-border-t pbx-border-solid pbx-border-gray-200"
          ></div>
          <template v-if="enabledThemeColorPresets.length > 0">
            <div class="pbx-px-3 pbx-py-2 pbx-text-xs pbx-font-semibold pbx-text-gray-500">
              {{ translate('Theme Color Presets') }}
            </div>
            <ListboxOption
              as="template"
              v-for="preset in enabledThemeColorPresets"
              :key="preset.id"
              :value="`custom:${preset.color}`"
              @click="applyThemeBackgroundColor(preset.color)"
              v-slot="{ active }"
            >
              <li
                :class="[
                  active
                    ? 'pbx-bg-myPrimaryLinkColor pbx-text-white'
                    : 'pbx-text-myPrimaryDarkGrayColor',
                  'pbx-relative pbx-cursor-default pbx-select-none pbx-py-2 pbx-pl-3 pbx-pr-9',
                ]"
              >
                <div class="pbx-flex pbx-items-center">
                  <div
                    class="pbx-aspect-square pbx-w-6 pbx-h-6 pbx-border-solid pbx-border pbx-border-gray-100 pbx-rounded-sm"
                    :style="{ backgroundColor: preset.color }"
                  ></div>
                  <span class="pbx-ml-3">{{ translate(preset.label) }}</span>
                </div>
              </li>
            </ListboxOption>
            <div
              v-if="tailwindBackgroundColors.length > 0"
              class="pbx-my-1 pbx-border-0 pbx-border-t pbx-border-solid pbx-border-gray-200"
            ></div>
          </template>
          <div
            v-if="tailwindBackgroundColors.length > 0"
            class="pbx-px-3 pbx-py-2 pbx-text-xs pbx-font-semibold pbx-text-gray-500"
          >
            {{ translate('Built-in colors') }}
          </div>
          <ListboxOption
            as="template"
            v-for="color in tailwindBackgroundColors"
            @click="pageBuilderService.handleBackgroundColor(backgroundColor ?? undefined)"
            :key="color"
            :value="color"
            v-slot="{ active }"
          >
            <li
              :class="[
                active
                  ? 'pbx-bg-myPrimaryLinkColor pbx-text-white'
                  : 'pbx-text-myPrimaryDarkGrayColor',
                'pbx-relative pbx-cursor-default pbx-select-none pbx-py-2 pbx-pl-3 pbx-pr-9',
              ]"
            >
              <div class="pbx-flex pbx-items-center">
                <div
                  class="pbx-aspect-square pbx-w-6 pbx-h-6 pbx-border-solid pbx-border pbx-border-gray-100 pbx-rounded-sm"
                  :class="`pbx-bg-${color.replace('pbx-bg-', '')}`"
                ></div>
                <span class="pbx-ml-3">{{ color }}</span>
              </div>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>

  <div v-else class="pbx-shrink-0">
    <div
      ref="backgroundColorMenuTriggerRef"
      :title="translate('Background Color')"
      class="pbx-h-8 pbx-w-8 pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center pbx-aspect-square pbx-border pbx-border-gray-500 pbx-cursor-pointer pbx-transition-all pbx-duration-200 pbx-ease-in-out hover:pbx-shadow-md focus-visible:pbx-ring-0 hover:pbx-scale-105"
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
        class="pbx-fixed pbx-z-50 pbx-max-h-56 pbx-overflow-y-auto pbx-rounded-lg pbx-bg-white pbx-py-2 pbx-px-2 pbx-shadow-lg pbx-border pbx-border-solid pbx-border-gray-200"
        @mousedown.stop
        @pointerdown.stop
        @click.stop
      >
        <button
          type="button"
          class="pbx-w-full pbx-flex pbx-items-center pbx-gap-3 pbx-cursor-pointer pbx-py-2 pbx-px-2 pbx-rounded-none pbx-border-0 pbx-bg-transparent pbx-text-left pbx-text-myPrimaryDarkGrayColor hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white"
          :class="{
            'pbx-bg-myPrimaryLinkColor pbx-text-white': isBackgroundTransparent,
          }"
          @click="selectTailwindBackgroundColor('none')"
        >
          <div
            class="pbx-aspect-square pbx-w-6 pbx-h-6 pbx-border-solid pbx-border pbx-border-gray-300 pbx-rounded-sm pbx-shrink-0"
            :style="transparentSwatchStyle"
          ></div>
          <span class="pbx-text-black hover:pbx-text-white">{{ translate('Transparent') }}</span>
        </button>
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
            class="pbx-w-full pbx-flex pbx-items-center pbx-gap-3 pbx-cursor-pointer pbx-py-2 pbx-px-2 pbx-rounded-none pbx-border-0 pbx-bg-transparent pbx-text-left pbx-text-myPrimaryDarkGrayColor hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white"
            :class="{
              'pbx-bg-myPrimaryLinkColor pbx-text-white':
                backgroundColor === `custom:${preset.color}`,
            }"
            @click="applyThemeBackgroundColor(preset.color)"
          >
            <div
              class="pbx-aspect-square pbx-w-6 pbx-h-6 pbx-border-solid pbx-border pbx-border-gray-100 pbx-rounded-sm pbx-shrink-0"
              :style="{ backgroundColor: preset.color }"
            ></div>
            <span>{{ translate(preset.label) }}</span>
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
          class="pbx-w-full pbx-flex pbx-items-center pbx-gap-3 pbx-cursor-pointer pbx-py-2 pbx-px-2 pbx-rounded-none pbx-border-0 pbx-bg-transparent pbx-text-left pbx-text-myPrimaryDarkGrayColor hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white"
          :class="{
            'pbx-bg-myPrimaryLinkColor pbx-text-white': backgroundColor === color,
          }"
          @click="selectTailwindBackgroundColor(color)"
        >
          <div
            class="pbx-aspect-square pbx-w-6 pbx-h-6 pbx-border-solid pbx-border pbx-border-gray-100 pbx-rounded-sm pbx-shrink-0"
            :class="`pbx-bg-${color.replace('pbx-bg-', '')}`"
          ></div>
          <span>{{ color }}</span>
        </button>
      </div>
    </Teleport>
  </div>
</template>
