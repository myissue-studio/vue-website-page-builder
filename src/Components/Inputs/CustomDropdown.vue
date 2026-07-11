<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

interface DropdownOption {
  value: string
  label?: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue: string | null
    options: DropdownOption[]
    id?: string
    buttonClass?: string
    menuClass?: string
    menuItemClass?: string
  }>(),
  {
    id: undefined,
    buttonClass: 'pbx-myPrimarySelect pbx-w-full pbx-text-left',
    menuClass:
      'pbx-headless-dropdown pbx-absolute pbx-z-50 pbx-mt-1 pbx-max-h-72 pbx-w-full pbx-overflow-auto pbx-rounded-md pbx-bg-white pbx-text-base pbx-shadow-lg pbx-ring-1 pbx-ring-black pbx-ring-opacity-5 focus:pbx-outline-none sm:pbx-text-sm pbx-list-none pbx-p-0 pbx-m-0',
    menuItemClass:
      'pbx-relative pbx-w-full pbx-flex pbx-items-center pbx-cursor-default pbx-select-none pbx-py-2 pbx-pl-3 pbx-pr-9 pbx-text-left pbx-border-0 pbx-bg-transparent pbx-text-myPrimaryDarkGrayColor hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  select: [value: string]
}>()

const rootRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)

const selectedOption = computed(() => {
  return props.options.find((option) => option.value === props.modelValue) || null
})

const toggle = () => {
  isOpen.value = !isOpen.value
}

const close = () => {
  isOpen.value = false
}

const handleSelect = (option: DropdownOption) => {
  if (option.disabled) return
  emit('update:modelValue', option.value)
  emit('select', option.value)
  close()
}

const handleOutsideClick = (event: Event) => {
  if (!isOpen.value) return
  if (!(event.target instanceof Node)) return
  if (rootRef.value?.contains(event.target)) return
  close()
}

watch(isOpen, (open) => {
  if (open) {
    document.addEventListener('pointerdown', handleOutsideClick)
    return
  }

  document.removeEventListener('pointerdown', handleOutsideClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleOutsideClick)
})
</script>

<template>
  <div ref="rootRef" class="pbx-relative">
    <button :id="id" type="button" :class="buttonClass" :aria-expanded="isOpen" @click="toggle">
      <slot name="button" :selected-option="selectedOption">
        <span class="pbx-block pbx-truncate">{{ selectedOption?.label || modelValue || '' }}</span>
      </slot>
    </button>

    <transition
      leave-active-class="pbx-transition pbx-ease-in pbx-duration-100"
      leave-from-class="pbx-opacity-100"
      leave-to-class="pbx-opacity-0"
    >
      <ul v-if="isOpen" :class="menuClass" role="listbox">
        <li
          v-for="option in options"
          :key="option.value"
          class="pbx-w-full"
          role="option"
          :aria-selected="modelValue === option.value"
        >
          <button
            type="button"
            :disabled="option.disabled"
            :class="[
              menuItemClass,
              modelValue === option.value
                ? 'pbx-bg-gray-100 pbx-text-myPrimaryDarkGrayColor hover:pbx-bg-gray-100 hover:pbx-text-myPrimaryDarkGrayColor'
                : '',
            ]"
            @click="handleSelect(option)"
          >
            <slot name="option" :option="option" :selected="modelValue === option.value">
              <span class="pbx-block pbx-truncate">{{ option.label || option.value }}</span>
            </slot>
          </button>
        </li>
      </ul>
    </transition>
  </div>
</template>
