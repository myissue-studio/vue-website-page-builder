<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number | string
  }>(),
  {
    size: 24,
  },
)
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <title>preview</title>
    <circle
      cx="12"
      cy="12"
      r="3"
      fill="currentColor"
      stroke="currentColor"
      stroke-linecap="square"
      stroke-miterlimit="10"
      stroke-width="2"
    />
    <path
      d="m1.125,12S4.989,4,12,4s10.875,8,10.875,8c0,0-3.865,8-10.875,8S1.125,12,1.125,12Z"
      fill="none"
      stroke="currentColor"
      stroke-linecap="square"
      stroke-miterlimit="10"
      stroke-width="2"
    />
  </svg>
</template>
