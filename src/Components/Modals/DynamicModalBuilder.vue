<script setup>
import ModalBuilder from './ModalBuilder.vue'

defineProps({
  showDynamicModalBuilder: {
    type: Boolean,
    default: false,
    required: true,
  },
  simpleModal: {
    type: Boolean,
    default: false,
    required: false,
  },
  disabled: {
    type: Boolean,
    default: false,
    required: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
    required: false,
  },
  disabledWhichButton: {
    type: String,
    default: '',
    required: false,
  },
  maxWidth: {
    type: String,
    required: false,
    default: '2xl',
  },
  gridColumnAmount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    required: true,
  },
  firstButtonText: {
    type: String,
  },
  secondButtonText: {
    type: String,
  },
  thirdButtonText: {
    type: String,
  },
})

const emit = defineEmits([
  'firstModalButtonFunctionDynamicModalBuilder',
  'secondModalButtonFunctionDynamicModalBuilder',
  'thirdModalButtonFunctionDynamicModalBuilder',
])

// first button function
const firstButtonBuilder = function () {
  emit('firstModalButtonFunctionDynamicModalBuilder')
}
// second button  function
const secondButtonBuilder = function () {
  emit('secondModalButtonFunctionDynamicModalBuilder')
}

// third button function
const thirdButtonBuilder = function () {
  emit('thirdModalButtonFunctionDynamicModalBuilder')
}
</script>

<template>
  <ModalBuilder
    :title="title"
    :showModalBuilder="showDynamicModalBuilder"
    :type="type"
    @closeMainModalBuilder="firstButtonBuilder"
    :maxWidth="maxWidth"
  >
    <slot name="content" />

    <div
      class="pbx-min-h-32 pbx-h-max pbx-font-sans pbx-w-full pbx-relative pbx-inline-block pbx-align-bottom pbx-text-left pbx-overflow-hidden pbx-transform pbx-transition-all sm:pbx-align-middle"
    >
      <div :class="{ 'pbx-pr-4 pbx-pb-4': !simpleModal }">
        <template v-if="simpleModal !== true">
          <div v-html="description" class="pbx-myPrimaryParagraph pbx-mb-6"></div>
        </template>

        <slot name="header"></slot>

        <slot></slot>
      </div>
    </div>

    <div
      class="pbx-border-0 pbx-border-solid pbx-border-t pbx-border-gray-200 pbx-mt-4 pbx-flex pbx-items-center pbx-justify-end"
    >
      <div
        v-if="simpleModal !== true && !isLoading"
        class="pbx-py-4 pbx-flex sm:pbx-justify-end pbx-justify-center"
      >
        <slot name="footer" />
        <div
          :class="{
            'sm:pbx-grid-cols-1': gridColumnAmount === 1,
            'sm:pbx-grid-cols-2': gridColumnAmount === 2,
            'sm:pbx-grid-cols-3': gridColumnAmount === 3,
          }"
          class="sm:pbx-grid-cols-2 sm:pbx-items-end sm:pbx-justify-end pbx-flex pbx-flex-row pbx-myPrimaryGap pbx-w-full"
        >
          <button
            v-if="firstButtonText"
            ref="firstButtonRef"
            class="pbx-mySecondaryButton"
            type="button"
            @click="firstButtonBuilder"
          >
            {{ firstButtonText }}
          </button>

          <button
            v-if="secondButtonText"
            class="pbx-myPrimaryButton pbx-bg-yellow-300 hover:pbx-bg-yellow-400 pbx-text-myPrimaryDarkGrayColor hover:pbx-text-myPrimaryDarkGrayColor focus:pbx-ring-yellow-400 pbx-w-full"
            type="button"
            @click="secondButtonBuilder"
          >
            {{ secondButtonText }}
          </button>

          <button
            v-if="thirdButtonText"
            class="pbx-myPrimaryButton pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-myPrimaryLinkColor focus:pbx-ring-myPrimaryLinkColor hover:pbx-bg-myPrimaryLinkColor pbx-w-full"
            :class="[
              type === 'danger' || type === 'delete'
                ? 'pbx-bg-red-600 focus-visible:pbx-ring-red-600 focus:pbx-ring-red-600 hover:pbx-bg-red-600'
                : 'pbx-bg-myPrimaryLinkColor focus-visible:pbx-ring-myPrimaryLinkColor focus:pbx-ring-myPrimaryLinkColor hover:pbx-bg-myPrimaryLinkColor',
            ]"
            type="button"
            @click="thirdButtonBuilder"
          >
            {{ thirdButtonText }}
          </button>
        </div>
      </div>

      <template v-if="isLoading">
        <div class="pbx-flex pbx-items-center pbx-my-2 pbx-py-4 pbx-px-2 pbx-justify-end">
          <div
            class="pbx-inline-block pbx-h-8 pbx-w-8 pbx-animate-spin pbx-rounded-full pbx-border-4 pbx-border-solid pbx-border-current pbx-border-r-transparent pbx-align-[-0.125em] motion-reduce:pbx-animate-[spin_1.5s_linear_infinite]"
          >
            <span
              class="!pbx-absolute !pbx-m-px !pbx-h-px !pbx-w-px !pbx-overflow-hidden !pbx-whitespace-nowrap !pbx-border-0 !pbx-p-0 !pbx-[clip:rect(0,0,0,0)]"
              >Loading...</span
            >
          </div>
        </div>
      </template>
    </div>
  </ModalBuilder>
</template>

<style scope>
/*
  Enter and leave animations can use different
  durations and timing functions.
*/
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>
