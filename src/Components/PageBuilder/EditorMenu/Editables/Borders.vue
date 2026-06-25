<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import EditorAccordion from '../EditorAccordion.vue'
import tailwindBorderStyleWidthPlusColor from '../../../../utils/builder/tailwind-border-style-width-color'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import { getPageBuilder } from '../../../../composables/builderInstance'
import { useTranslations } from '../../../../composables/useTranslations'

const { translate } = useTranslations()
const pageBuilderService = getPageBuilder()

// Use shared store instance
const pageBuilderStateStore = sharedPageBuilderStore

const borderStyle = ref<string | null>(null)
const borderWidth = ref<string | null>(null)
const borderColor = ref<string | null>(null)
const getBorderStyle = computed(() => {
  return pageBuilderStateStore.getBorderStyle
})
const getBorderWidth = computed(() => {
  return pageBuilderStateStore.getBorderWidth
})
const getBorderColor = computed(() => {
  return pageBuilderStateStore.getBorderColor
})

watch(
  getBorderStyle,
  async (newValue) => {
    borderStyle.value = newValue
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
watch(
  getBorderWidth,
  async (newValue) => {
    borderWidth.value = newValue
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
watch(
  getBorderColor,
  async (newValue) => {
    borderColor.value = newValue
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
</script>

<template>
  <EditorAccordion>
    <template #title>{{ translate('Border Style, Width & Color') }}</template>
    <template #content>
      <p class="pbx-myPrimaryParagraph pbx-font-medium pbx-py-0 pbx-my-4">
        {{ translate('Border') }}
      </p>

      <div class="pbx-my-2 pbx-py-2">
        <label for="border-style" class="pbx-myPrimaryInputLabel">{{
          translate('Border Style')
        }}</label>
        <select
          id="border-style"
          v-model="borderStyle"
          class="pbx-myPrimarySelect"
          @change="pageBuilderService.handleBorderStyle(borderStyle ?? undefined)"
        >
          <option disabled value="">{{ translate('Select') }}</option>
          <option
            v-for="borderStyle in tailwindBorderStyleWidthPlusColor.borderStyle"
            :key="borderStyle"
          >
            {{ borderStyle }}
          </option>
        </select>
      </div>
      <hr />
      <div class="pbx-my-2 pbx-py-2">
        <label for="border-width" class="pbx-myPrimaryInputLabel">{{
          translate('Border Width')
        }}</label>
        <select
          id="border-width"
          v-model="borderWidth"
          class="pbx-myPrimarySelect"
          @change="pageBuilderService.handleBorderWidth(borderWidth ?? undefined)"
        >
          <option disabled value="">{{ translate('Select') }}</option>
          <option
            v-for="borderWidth in tailwindBorderStyleWidthPlusColor.borderWidth"
            :key="borderWidth"
          >
            {{ borderWidth }}
          </option>
        </select>
      </div>
      <hr />
      <div class="pbx-my-2 pbx-py-2">
        <label for="border-color" class="pbx-myPrimaryInputLabel">{{
          translate('Border Color')
        }}</label>
        <Listbox as="div" v-model="borderColor">
          <div class="pbx-relative pbx-mt-2">
            <ListboxButton class="pbx-myPrimarySelect" id="border-color">
              <span class="pbx-flex pbx-items-center pbx-gap-2">
                <div v-if="getBorderColor === 'none'">
                  <div class="pbx-myPrimaryColorPreview pbx-border-none">
                    <span class="material-symbols-outlined"> ev_shadow </span>
                  </div>
                </div>
                <div
                  v-if="borderColor !== 'none'"
                  class="pbx-aspect-square pbx-w-6 pbx-h-6 pbx-border-solid pbx-border pbx-border-gray-100 pbx-rounded-sm"
                  :class="`pbx-bg-${borderColor?.replace('pbx-border-', '')}`"
                ></div>
                <span class="pbx-block pbx-truncate">{{ borderColor }}</span>
              </span>
            </ListboxButton>

            <transition
              leave-active-class="pbx-transition pbx-ease-in pbx-duration-100"
              leave-from-class="pbx-opacity-100"
              leave-to-class="pbx-opacity-0"
            >
              <ListboxOptions
                class="pbx-absolute pbx-z-10 pbx-mt-1 pbx-max-h-56 pbx-w-full pbx-overflow-auto pbx-rounded-md pbx-bg-white pbx-text-base pbx-shadow-lg pbx-ring-1 pbx-ring-black pbx-ring-opacity-5 focus:pbx-outline-none sm:pbx-text-sm pbx-list-none pbx-p-0 pbx-m-0"
              >
                <ListboxOption
                  as="template"
                  v-for="color in tailwindBorderStyleWidthPlusColor.borderColor"
                  @click="pageBuilderService.handleBorderColor(borderColor ?? undefined)"
                  :key="color"
                  :value="color"
                  v-slot="{ active, borderColor }"
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
                      <div v-if="color === 'none'">
                        <div class="pbx-myPrimaryColorPreview pbx-border-none">
                          <span class="material-symbols-outlined"> ev_shadow </span>
                        </div>
                      </div>

                      <div
                        v-if="color !== 'none'"
                        class="pbx-aspect-square pbx-w-6 pbx-h-6 pbx-bg-gray-950"
                        :class="`pbx-bg-${color.replace('pbx-border-', '')}`"
                      ></div>
                      <span v-if="color === 'none'" class="pbx-ml-3">{{
                        translate('Transparent')
                      }}</span>
                      <span v-if="color !== 'none'" class="pbx-ml-3">{{ color }}</span>
                    </div>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
      </div>
    </template>
  </EditorAccordion>
</template>
