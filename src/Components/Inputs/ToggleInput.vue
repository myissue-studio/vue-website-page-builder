<script setup lang="ts">
defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<template>
  <div
    @click="$emit('update:modelValue', !modelValue)"
    :class="modelValue ? 'pbx-bg-myPrimaryLinkColor' : 'pbx-bg-gray-200'"
    class="pbx-relative pbx-inline-flex pbx-h-6 pbx-w-11 pbx-shrink-0 pbx-cursor-pointer pbx-rounded-full pbx-p-0.5 pbx-ring-1 pbx-ring-inset pbx-ring-gray-900/10 pbx-transition-colors pbx-duration-200 pbx-ease-in-out"
    role="switch"
    :aria-checked="modelValue"
  >
    <span
      :class="modelValue ? 'pbx-translate-x-5' : 'pbx-translate-x-0'"
      class="pbx-relative pbx-size-5 pbx-rounded-full pbx-bg-white pbx-shadow-sm pbx-ring-1 pbx-ring-gray-900/5 pbx-transition-transform pbx-duration-200 pbx-ease-in-out"
    >
      <!-- X icon shown when off -->
      <span
        :class="modelValue ? 'pbx-opacity-0' : 'pbx-opacity-100'"
        class="pbx-absolute pbx-inset-0 pbx-flex pbx-size-full pbx-items-center pbx-justify-center pbx-transition-opacity pbx-duration-200 pbx-ease-in"
        aria-hidden="true"
      >
        <svg class="pbx-size-3 pbx-text-gray-400" fill="none" viewBox="0 0 12 12">
          <path
            d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
      <!-- Check icon shown when on -->
      <span
        :class="modelValue ? 'pbx-opacity-100' : 'pbx-opacity-0'"
        class="pbx-absolute pbx-inset-0 pbx-flex pbx-size-full pbx-items-center pbx-justify-center pbx-transition-opacity pbx-duration-200 pbx-ease-in"
        aria-hidden="true"
      >
        <svg class="pbx-size-3 pbx-text-myPrimaryLinkColor" fill="currentColor" viewBox="0 0 12 12">
          <path
            d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z"
          />
        </svg>
      </span>
    </span>
  </div>
</template>
