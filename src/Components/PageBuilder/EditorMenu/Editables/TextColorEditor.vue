<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import tailwindColors from '../../../../utils/builder/tailwind-colors'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import { getPageBuilder } from '../../../../composables/usePageBuilder'
import { useTranslations } from '../../../../composables/useTranslations'
import { useThemeColorPresets } from '../../../../composables/useThemeColorPresets'
import { useEditToolbarPopover } from '../../../../composables/useEditToolbarPopover'
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

function openCustomHexModal(): void {
  closeTextColorMenu()
  showCustomHexModal.value = true
}

function closeCustomHexModal(): void {
  showCustomHexModal.value = false
}

watch(
  getTextColor,
  async (newValue) => {
    textColor.value = newValue
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
</script>

<template>
  <Listbox v-if="globalPageLayout" as="div" v-model="textColor">
    <div class="pbx-relative">
      <div class="pbx-flex pbx-flex-col pbx-border-solid pbx-border pbx-border-gray-400">
        <ListboxButton
          class="pbx-flex pbx-flex-row pbx-justify-between pbx-items-center pbx-pl-3 pbx-pr-3 pbx-py-5 pbx-cursor-pointer pbx-duration-200 hover:pbx-bg-myPrimaryLightGrayColor pbx-bg-white hover:pbx-text-black pbx-text-black pbx-font-sans pbx-font-medium pbx-border-0"
        >
          <div class="pbx-flex pbx-justify-start pbx-items-center pbx-gap-2">
            <div
              class="pbx-aspect-square pbx-w-6 pbx-h-6 pbx-border pbx-border-gray-600 pbx-rounded-full pbx-border-solid"
              :class="
                selectedCustomTextColor
                  ? ''
                  : !textColor || textColor === 'none'
                    ? 'pbx-bg-black'
                    : `pbx-bg-${textColor.replace('pbx-text-', '')}`
              "
              :style="
                selectedCustomTextColor ? { backgroundColor: selectedCustomTextColor } : undefined
              "
            ></div>
            <div>
              <div>{{ translate('Text Color') }}</div>
            </div>
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
            @click="pageBuilderService.handleTextColor('none')"
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
                  class="pbx-aspect-square pbx-w-6 pbx-h-6 pbx-border-solid pbx-border pbx-border-gray-300 pbx-rounded-sm pbx-shrink-0 pbx-bg-black"
                ></div>
                <span class="pbx-ml-3 hover:pbx-text-white">{{ translate('Default black') }}</span>
              </div>
            </li>
          </ListboxOption>
          <div
            class="pbx-my-1 pbx-border-0 pbx-border-t pbx-border-solid pbx-border-gray-200"
          ></div>
          <ColorMenuCustomSection
            :model-value="selectedCustomTextColor"
            @open="openCustomHexModal"
          />
          <div
            v-if="enabledThemeColorPresets.length > 0 || tailwindTextColors.length > 0"
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
              @click="applyThemeTextColor(preset.color)"
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
              v-if="tailwindTextColors.length > 0"
              class="pbx-my-1 pbx-border-0 pbx-border-t pbx-border-solid pbx-border-gray-200"
            ></div>
          </template>
          <div
            v-if="tailwindTextColors.length > 0"
            class="pbx-px-3 pbx-py-2 pbx-text-xs pbx-font-semibold pbx-text-gray-500"
          >
            {{ translate('Built-in colors') }}
          </div>
          <ListboxOption
            as="template"
            v-for="color in tailwindTextColors"
            @click="pageBuilderService.handleTextColor(textColor ?? undefined)"
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
                  :class="`pbx-bg-${color.replace('pbx-text-', '')}`"
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
        class="pbx-fixed pbx-z-50 pbx-max-h-56 pbx-overflow-y-auto pbx-rounded-lg pbx-bg-white pbx-py-2 pbx-px-2 pbx-shadow-lg pbx-border pbx-border-solid pbx-border-gray-200"
        @mousedown.stop
        @pointerdown.stop
        @click.stop
      >
        <button
          type="button"
          class="pbx-w-full pbx-flex pbx-items-center pbx-gap-3 pbx-cursor-pointer pbx-py-2 pbx-px-2 pbx-rounded-none pbx-border-0 pbx-bg-transparent pbx-text-left pbx-text-myPrimaryDarkGrayColor hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white"
          :class="{
            'pbx-bg-myPrimaryLinkColor pbx-text-white': !textColor || textColor === 'none',
          }"
          @click="selectTailwindTextColor('none')"
        >
          <div
            class="pbx-aspect-square pbx-w-6 pbx-h-6 pbx-border-solid pbx-border pbx-border-gray-300 pbx-rounded-sm pbx-shrink-0 pbx-bg-black"
          ></div>
          <span class="pbx-text-black hover:pbx-text-white">{{ translate('Default black') }}</span>
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
            class="pbx-w-full pbx-flex pbx-items-center pbx-gap-3 pbx-cursor-pointer pbx-py-2 pbx-px-2 pbx-rounded-none pbx-border-0 pbx-bg-transparent pbx-text-left pbx-text-myPrimaryDarkGrayColor hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white"
            :class="{
              'pbx-bg-myPrimaryLinkColor pbx-text-myPrimaryDarkGrayColor':
                textColor === `custom:${preset.color}`,
            }"
            @click="applyThemeTextColor(preset.color)"
          >
            <div
              class="pbx-aspect-square pbx-w-6 pbx-h-6 pbx-border-solid pbx-border pbx-border-gray-100 pbx-rounded-sm pbx-shrink-0"
              :style="{ backgroundColor: preset.color }"
            ></div>
            <span>{{ translate(preset.label) }}</span>
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
          class="pbx-w-full pbx-flex pbx-items-center pbx-gap-3 pbx-cursor-pointer pbx-py-2 pbx-px-2 pbx-rounded-none pbx-border-0 pbx-bg-transparent pbx-text-left pbx-text-myPrimaryDarkGrayColor hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white"
          :class="{
            'pbx-bg-myPrimaryLinkColor pbx-text-white': textColor === color,
          }"
          @click="selectTailwindTextColor(color)"
        >
          <div
            class="pbx-aspect-square pbx-w-6 pbx-h-6 pbx-border-solid pbx-border pbx-border-gray-100 pbx-rounded-sm pbx-shrink-0"
            :class="`pbx-bg-${color.replace('pbx-text-', '')}`"
          ></div>
          <span>{{ color }}</span>
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
