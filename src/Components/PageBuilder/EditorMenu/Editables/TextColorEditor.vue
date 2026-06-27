<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import tailwindColors from '../../../../utils/builder/tailwaind-colors'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import { getPageBuilder } from '../../../../composables/builderInstance'
import { useTranslations } from '../../../../composables/useTranslations'
import { useThemeColorPresets } from '../../../../composables/useThemeColorPresets'

const { translate } = useTranslations()

const pageBuilderService = getPageBuilder()

// Use shared store instance
const pageBuilderStateStore = sharedPageBuilderStore

defineProps({
  globalPageLayout: {
    type: Boolean,
  },
})

const textColor = ref<string | null>(null)
const showThemeColorPresetsModal = ref(false)
const getTextColor = computed(() => {
  return pageBuilderStateStore.getTextColor
})
const getPageBuilderConfig = computed(() => {
  return pageBuilderStateStore.getPageBuilderConfig
})
const { enabledThemeColorPresets } = useThemeColorPresets(getPageBuilderConfig)

const selectedCustomTextColor = computed(() => {
  return textColor.value?.startsWith('custom:') ? textColor.value.replace('custom:', '') : ''
})

function applyThemeTextColor(color: string): void {
  textColor.value = `custom:${color}`
  pageBuilderService.handleCustomTextColor(color)
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
  <Listbox as="div" v-model="textColor">
    <div class="pbx-relative">
      <div
        :class="[
          globalPageLayout
            ? 'pbx-flex pbx-flex-col pbx-border-solid pbx-border pbx-border-gray-400'
            : 'pbx-flex pbx-gap-2 pbx-items-center',
        ]"
      >
        <ListboxButton
          v-if="globalPageLayout"
          class="pbx-flex pbx-flex-row pbx-justify-between pbx-items-center pbx-pl-3 pbx-pr-3 pbx-py-5 pbx-cursor-pointer pbx-duration-200 hover:pbx-bg-myPrimaryLightGrayColor pbx-bg-white hover:pbx-text-black pbx-text-black pbx-font-sans pbx-font-medium pbx-border-0"
        >
          <div class="pbx-flex pbx-justify-start pbx-items-center pbx-gap-2">
            <div
              class="pbx-aspect-square pbx-w-6 pbx-h-6 pbx-border pbx-border-gray-600 pbx-rounded-sm pbx-bg-none pbx-border-solid"
              :class="
                !selectedCustomTextColor ? `pbx-bg-${textColor?.replace('pbx-text-', '')}` : ''
              "
              :style="
                selectedCustomTextColor ? { backgroundColor: selectedCustomTextColor } : undefined
              "
            ></div>
            <div>
              <div>{{ translate('Text Color') }}</div>
            </div>
          </div>

          <span v-if="globalPageLayout" class="material-symbols-outlined"> chevron_right </span>
        </ListboxButton>
        <button
          v-if="globalPageLayout"
          type="button"
          class="pbx-m-2 pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-rounded-xl pbx-border-0 pbx-bg-gray-100 pbx-text-myPrimaryDarkGrayColor hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white"
          :title="translate('Theme Color Presets')"
          @click.stop="showThemeColorPresetsModal = true"
        >
          <span class="material-symbols-outlined"> palette </span>
        </button>

        <ListboxButton
          v-if="!globalPageLayout"
          as="div"
          class="pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-flex pbx-items-center pbx-justify-center hover:pbx-bg-gray-100 pbx-aspect-square pbx-text-myPrimaryDarkGrayColor pbx-bg-gray-100 pbx-rounded-xl hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white"
        >
          <div class="pbx-flex pbx-flex-col">
            <div class="pbx-flex pbx-gap-2 pbx-items-center">
              <span
                class="material-symbols-outlined"
                style="text-shadow: rgb(0 0 0 / 10%) 1.5px 1.5px 0px"
                :class="
                  !selectedCustomTextColor ? `pbx-text-${textColor?.replace('pbx-text-', '')}` : ''
                "
                :style="selectedCustomTextColor ? { color: selectedCustomTextColor } : undefined"
              >
                format_color_text
              </span>
            </div>
          </div>
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
              class="pbx-my-1 pbx-border-0 pbx-border-t pbx-border-solid pbx-border-gray-200"
            ></div>
          </template>
          <ListboxOption
            as="template"
            v-for="color in tailwindColors.textColorVariables"
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
              <div v-if="color === 'none'" class="pbx-flex pbx-items-center">
                <span class="material-symbols-outlined"> invert_colors </span>
                <span class="pbx-ml-3">{{ translate('Default black') }}</span>
              </div>
              <div v-if="color !== 'none'" class="pbx-flex pbx-items-center">
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
</template>
