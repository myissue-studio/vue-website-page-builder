<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import tailwindOpacities from '../../../../utils/builder/tailwind-opacities'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { getPageBuilder } from '../../../../composables/builderInstance'
import { useTranslations } from '../../../../composables/useTranslations'
const pageBuilderService = getPageBuilder()
const { translate } = useTranslations()

// Use shared store instance
const pageBuilderStateStore = sharedPageBuilderStore
const opacityVueModel = ref<string | null>(null)
const getBackgroundOpacity = computed(() => {
  return pageBuilderStateStore.getBackgroundOpacity
})

watch(
  getBackgroundOpacity,
  async (newValue) => {
    opacityVueModel.value = newValue
    await pageBuilderService.initializeElementStyles()
  },
  { immediate: true },
)
</script>

<template>
  <div class="pbx-my-2 pbx-py-2">
    <label for="bg-opacity" class="pbx-myPrimaryInputLabel">
      {{ translate('Background Opacity') }}</label
    >

    <Listbox as="div" v-model="opacityVueModel">
      <div class="pbx-relative">
        <ListboxButton class="pbx-myPrimarySelect" id="bg-opacity">
          <span class="pbx-flex pbx-items-center pbx-gap-2">
            <div v-if="opacityVueModel === 'none'">
              <div class="pbx-myPrimaryColorPreview pbx-border-none">
                <span class="material-symbols-outlined"> ev_shadow </span>
              </div>
            </div>

            <div
              v-if="opacityVueModel !== 'none'"
              class="pbx-aspect-square pbx-w-6 pbx-h-6 pbx-bg-gray-950"
              :class="`${opacityVueModel}`"
            ></div>

            <span class="pbx-block pbx-truncate" :class="[opacityVueModel !== 'none' ? '' : '']">{{
              opacityVueModel === 'none' ? translate('Transparent') : opacityVueModel
            }}</span>
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
              v-for="backgroundOpacity in tailwindOpacities.backgroundOpacities"
              @click="pageBuilderService.handleBackgroundOpacity(backgroundOpacity)"
              :key="backgroundOpacity"
              :value="backgroundOpacity"
              v-slot="{ active }"
            >
              <li
                :class="[
                  active
                    ? 'pbx-bg-myPrimaryLinkColor text-white'
                    : 'pbx-text-myPrimaryDarkGrayColor',
                  'pbx-relative pbx-cursor-default pbx-select-none pbx-py-2 pbx-pl-3 pbx-pr-9',
                ]"
              >
                <div class="pbx-flex pbx-items-center">
                  <div v-if="backgroundOpacity === 'none'">
                    <div class="pbx-myPrimaryColorPreview pbx-border-none">
                      <span class="material-symbols-outlined"> ev_shadow </span>
                    </div>
                  </div>

                  <div
                    v-if="backgroundOpacity !== 'none'"
                    class="pbx-aspect-square pbx-w-6 pbx-h-6 pbx-bg-gray-950"
                    :class="`${backgroundOpacity}`"
                  ></div>
                  <span v-if="backgroundOpacity === 'none'" class="pbx-ml-3">{{
                    translate('Transparent')
                  }}</span>
                  <span v-if="backgroundOpacity !== 'none'" class="pbx-ml-3">{{
                    backgroundOpacity
                  }}</span>
                </div>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>
