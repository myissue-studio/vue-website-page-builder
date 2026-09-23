<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number | string
  }>(),
  {
    size: 18,
  },
)
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 18 18"
    fill="none"
    aria-hidden="true"
  >
    <title>shopping</title>
    <path
      d="M5.334 4.75H12.667C13.704 4.75 14.57 5.543 14.659 6.577L15.311 14.077C15.413 15.246 14.491 16.25 13.319 16.25H4.681C3.508 16.25 2.587 15.245 2.689 14.077L3.341 6.577C3.431 5.543 4.297 4.75 5.334 4.75Z"
      fill="currentColor"
      fill-opacity="0.3"
    />
    <path
      d="M6.75 4.75V3C6.75 1.757 7.757 0.75 9 0.75C10.243 0.75 11.25 1.757 11.25 3V4.75"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M5.334 4.75H12.667C13.704 4.75 14.57 5.543 14.659 6.577L15.311 14.077C15.413 15.246 14.491 16.25 13.319 16.25H4.681C3.508 16.25 2.587 15.245 2.689 14.077L3.341 6.577C3.431 5.543 4.297 4.75 5.334 4.75Z"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
