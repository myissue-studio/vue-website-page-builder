<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number | string
  }>(),
  {
    size: 16,
  },
)
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 20 20"
    aria-hidden="true"
  >
    <title>timeline</title>
    <line
      x1="4"
      y1="17"
      x2="4"
      y2="3"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    ></line>
    <circle cx="4" cy="10" r="2.5" fill="currentColor" stroke-width="0"></circle>
    <rect
      x="8"
      y="3"
      width="9"
      height="5"
      rx="1.5"
      ry="1.5"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    ></rect>
    <rect
      x="8"
      y="12"
      width="9"
      height="5"
      rx="1.5"
      ry="1.5"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    ></rect>
  </svg>
</template>
