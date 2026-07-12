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
    menuClass: '',
    menuItemClass: '',
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

const selectedLabel = computed(() => {
  return selectedOption.value?.label || props.modelValue || ''
})

const optionLabel = (option: DropdownOption) => option.label || option.value

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
  <div ref="rootRef" class="pbx-custom-dropdown">
    <button
      :id="id"
      type="button"
      class="pbx-custom-dropdown__trigger"
      :class="buttonClass"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      <slot name="button" :selected-option="selectedOption">
        <span class="pbx-custom-dropdown__wrap">{{ selectedLabel }}</span>
      </slot>
    </button>

    <transition
      leave-active-class="pbx-transition pbx-ease-in pbx-duration-100"
      leave-from-class="pbx-opacity-100"
      leave-to-class="pbx-opacity-0"
    >
      <ul
        v-if="isOpen"
        class="pbx-custom-dropdown__menu pbx-headless-dropdown"
        :class="menuClass"
        role="listbox"
      >
        <li
          v-for="option in options"
          :key="option.value"
          class="pbx-custom-dropdown__option"
          role="option"
          :aria-selected="modelValue === option.value"
        >
          <button
            type="button"
            :disabled="option.disabled"
            class="pbx-custom-dropdown__item"
            :class="[
              menuItemClass,
              modelValue === option.value ? 'pbx-custom-dropdown__item--selected' : '',
            ]"
            @click="handleSelect(option)"
          >
            <span class="pbx-custom-dropdown__item-body">
              <slot name="option" :option="option" :selected="modelValue === option.value">
                <span class="pbx-custom-dropdown__wrap">{{ optionLabel(option) }}</span>
              </slot>
            </span>
          </button>
        </li>
      </ul>
    </transition>
  </div>
</template>

<style scoped>
.pbx-custom-dropdown {
  position: relative;
  min-width: 0;
  max-width: 100%;
}

.pbx-custom-dropdown__trigger {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: hidden;
}

.pbx-custom-dropdown__menu {
  position: absolute;
  z-index: 50;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  max-height: 18rem;
  margin: 0.25rem 0 0;
  padding: 0;
  overflow-x: hidden;
  overflow-y: auto;
  list-style: none;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 0.375rem;
  background-color: #fff;
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.pbx-custom-dropdown__option {
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.pbx-custom-dropdown__item {
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  margin: 0;
  padding: 0.5rem 2.25rem 0.5rem 0.75rem;
  overflow-x: hidden;
  border: 0;
  background: transparent;
  color: #111827;
  font: inherit;
  text-align: left;
  cursor: default;
}

.pbx-custom-dropdown__item:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.pbx-custom-dropdown__item:hover:not(:disabled):not(.pbx-custom-dropdown__item--selected) {
  background-color: rgb(var(--pbx-brand-color-rgb, 22 163 74));
  color: #fff;
}

.pbx-custom-dropdown__item:hover:not(:disabled):not(.pbx-custom-dropdown__item--selected)
  :deep(span) {
  color: inherit;
}

.pbx-custom-dropdown__item--selected,
.pbx-custom-dropdown__item--selected:hover:not(:disabled) {
  background-color: #f3f4f6;
  color: #111827;
}

.pbx-custom-dropdown__item--selected:hover:not(:disabled) :deep(span) {
  color: inherit;
}

.pbx-custom-dropdown__item-body {
  display: block;
  flex: 1 1 0%;
  min-width: 0;
  max-width: 100%;
  overflow-x: hidden;
}

/* Keep swatch + label on one row; only the text node wraps. */
.pbx-custom-dropdown__item-body :deep(.pbx-flex),
.pbx-custom-dropdown__item-body :deep([class*='pbx-flex']) {
  flex-wrap: nowrap;
  align-items: flex-start;
  min-width: 0;
  max-width: 100%;
}

.pbx-custom-dropdown__item-body :deep(.pbx-flex-1),
.pbx-custom-dropdown__item-body :deep([class*='pbx-flex-1']),
.pbx-custom-dropdown__item-body :deep(.pbx-break-words),
.pbx-custom-dropdown__item-body :deep([class*='pbx-break-words']) {
  flex: 1 1 0%;
  min-width: 0;
  max-width: 100%;
  overflow-wrap: anywhere;
  word-break: break-word;
  white-space: normal;
}

.pbx-custom-dropdown__wrap {
  display: block;
  min-width: 0;
  max-width: 100%;
  overflow-wrap: anywhere;
  word-break: break-word;
  white-space: normal;
}
</style>
