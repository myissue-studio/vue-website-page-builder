<script setup lang="ts">
import { computed } from 'vue'
import { useTranslations } from '../../composables/useTranslations'

const { translate } = useTranslations()

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  showModalBuilder: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'success',
  },
  maxWidth: {
    type: String,
    default: '2xl',
  },
  minHeight: {
    type: String,
  },
  maxHeight: {
    type: String,
  },
  noBackgroundOpacity: {
    type: Boolean,
  },
  zIndex: {
    type: Number,
    default: 9999,
  },
  showActions: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['closeMainModalBuilder'])

const handleClose = () => {
  emit('closeMainModalBuilder')
}

const maxWidthClass = computed(() => {
  return {
    sm: 'md:pbx-max-w-sm pbx-w-screen',
    md: 'md:pbx-max-w-md pbx-w-screen',
    lg: 'md:pbx-max-w-lg pbx-w-screen',
    xl: 'md:pbx-max-w-xl pbx-w-screen',
    '2xl': 'md:pbx-max-w-2xl pbx-w-screen',
    '3xl': 'md:pbx-max-w-3xl pbx-w-screen',
    '4xl': 'md:pbx-max-w-4xl pbx-w-screen',
    '5xl': 'md:pbx-max-w-5xl pbx-w-screen',
    '6xl': 'md:pbx-max-w-6xl pbx-w-screen',
    '7xl': 'md:pbx-max-w-7xl pbx-w-screen',
    full: 'md:pbx-max-w-full pbx-w-screen', // 100% width
    screen: 'md:pbx-w-screen pbx-w-screen pbx-max-w-none', // truly full screen
  }[props.maxWidth]
})
</script>

<template>
  <teleport to="body">
    <div id="pbx-modal" class="pbx-font-sans">
      <!-- Modal -->
      <div
        v-if="showModalBuilder"
        class="pbx-fixed pbx-inset-0 pbx-flex pbx-items-center pbx-justify-center pbx-mx-4"
        :style="{ zIndex }"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <!-- Backdrop -->
        <div
          class="pbx-fixed pbx-inset-0 pbx-bg-black/50 pbx-transition-opacity"
          :class="[noBackgroundOpacity ? 'pbx-bg-black/100' : '']"
          @click="handleClose"
        ></div>

        <div
          class="pbx-relative pbx-flex pbx-flex-col pbx-bg-white pbx-rounded-3xl pbx-text-left pbx-shadow-xl pbx-transform pbx-transition-all pbx-max-w-[96vh] lg:pbx-max-h-[98vh] pbx-max-h-[85vh] pbx-w-full pbx-overflow-hidden"
          :class="[
            maxWidthClass ? maxWidthClass : '',
            minHeight ? minHeight : '',
            maxHeight ? maxHeight : '',
          ]"
        >
          <div
            class="pbx-h-16 pbx-shrink-0 pbx-px-4 pbx-border-0 pbx-border-solid pbx-border-b pbx-border-gray-200 pbx-flex pbx-items-center pbx-justify-between"
            :class="[
              type === 'success' ? 'pbx-bg-white' : '',
              type === 'warning' ? 'pbx-bg-white' : '',
              type === 'danger' ? 'pbx-bg-white' : '',
              type === 'delete' ? 'pbx-bg-white' : '',
            ]"
          >
            <h3
              id="dialog-title"
              class="pbx-myQuaternaryHeader pbx-my-0 pbx-py-0"
              :class="[
                type === 'success' ? 'pbx-text-black' : '',
                type === 'warning' ? 'pbx-text-black' : '',
                type === 'danger' ? 'pbx-text-black' : '',
                type === 'delete' ? 'pbx-text-black' : '',
              ]"
            >
              {{ title }}
            </h3>
            <button
              type="button"
              class="pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white focus-visible:pbx-outline-none focus-visible:pbx-ring-2 focus-visible:pbx-ring-myPrimaryLinkColor/30 pbx-text-black"
              :aria-label="translate('Close')"
              @click="handleClose"
            >
              <span class="material-symbols-outlined" aria-hidden="true"> close </span>
            </button>
          </div>
          <div class="pbx-min-h-0 pbx-flex-1 pbx-overflow-y-auto pbx-px-4">
            <div class="pbx-min-h-32">
              <slot></slot>
            </div>
          </div>
          <div
            v-if="$slots.actions && showActions"
            class="pbx-shrink-0 pbx-border-0 pbx-border-solid pbx-border-t pbx-border-gray-200 pbx-bg-white pbx-px-4 pbx-py-4"
          >
            <div
              class="pbx-flex pbx-w-full pbx-flex-row pbx-items-center pbx-justify-end pbx-gap-2"
            >
              <slot name="actions"></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>
