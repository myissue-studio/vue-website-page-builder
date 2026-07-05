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
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <title>stacks</title>
    <g fill="none">
      <path
        d="M14.5 10.2V20L12 19V10L11.5 9L7 6.5V5L13.4412 8.43529C14.0929 8.78288 14.5 9.46138 14.5 10.2Z"
        fill="currentColor"
        fill-opacity="0.3"
      />
      <path
        d="M19.5 8.7V18.5L17 17.5V8.5L16.5 7.5L12 5V3.5L18.4412 6.93529C19.0929 7.28288 19.5 7.96138 19.5 8.7Z"
        fill="currentColor"
        fill-opacity="0.3"
      />
      <path
        d="M17 17.5L20.5528 19.2764C21.2177 19.6088 22 19.1253 22 18.382V6.92705C22 6.35889 21.679 5.8395 21.1708 5.58541L13.4472 1.72361C12.7823 1.39116 12 1.87465 12 2.61803V5"
        stroke="currentColor"
      />
      <path
        d="M12 19L15.5528 20.7764C16.2177 21.1088 17 20.6253 17 19.882V8.42705C17 7.85889 16.679 7.3395 16.1708 7.08541L8.44721 3.22361C7.78231 2.89116 7 3.37465 7 4.11803V6.5"
        stroke="currentColor"
      />
      <path
        d="M2.82918 18.4146L10.5528 22.2764C11.2177 22.6088 12 22.1253 12 21.382V9.92705C12 9.35889 11.679 8.8395 11.1708 8.58541L3.44721 4.72361C2.78231 4.39116 2 4.87465 2 5.61803V17.0729C2 17.6411 2.321 18.1605 2.82918 18.4146Z"
        stroke="currentColor"
      />
    </g>
  </svg>
</template>
