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
    <title>save</title>
    <g fill="none">
      <path
        d="M16.586 7.08579C17.367 6.30474 18.6331 6.30474 19.4141 7.08579C20.1951 7.86684 20.1951 9.13289 19.4141 9.91391L11.9141 17.4139C11.1331 18.1949 9.86705 18.1949 9.086 17.4139L5.086 13.4139C4.30495 12.6329 4.30495 11.3668 5.086 10.5858C5.86705 9.80474 7.13308 9.80474 7.91412 10.5858L10.5001 13.1717L16.586 7.08579Z"
        fill="url(#save-icon-gradient-0)"
        data-glass="origin"
        mask="url(#save-icon-mask)"
      />
      <path
        d="M16.586 7.08579C17.367 6.30474 18.6331 6.30474 19.4141 7.08579C20.1951 7.86684 20.1951 9.13289 19.4141 9.91391L11.9141 17.4139C11.1331 18.1949 9.86705 18.1949 9.086 17.4139L5.086 13.4139C4.30495 12.6329 4.30495 11.3668 5.086 10.5858C5.86705 9.80474 7.13308 9.80474 7.91412 10.5858L10.5001 13.1717L16.586 7.08579Z"
        fill="url(#save-icon-gradient-0)"
        data-glass="clone"
        filter="url(#save-icon-filter)"
        clip-path="url(#save-icon-clip)"
      />
      <path
        d="M12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1ZM18.707 7.79297C18.3165 7.40245 17.6835 7.40244 17.293 7.79297L10.5 14.5859L7.20703 11.293C6.81651 10.9024 6.18349 10.9024 5.79297 11.293C5.40245 11.6835 5.40245 12.3165 5.79297 12.707L9.79297 16.707C10.1835 17.0976 10.8165 17.0976 11.207 16.707L18.707 9.20703C19.0976 8.81651 19.0976 8.18349 18.707 7.79297Z"
        fill="url(#save-icon-gradient-1)"
        data-glass="blur"
      />
      <path
        d="M12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1ZM12 1.75C6.33908 1.75 1.75 6.33908 1.75 12C1.75 17.6609 6.33908 22.25 12 22.25C17.6609 22.25 22.25 17.6609 22.25 12C22.25 6.33908 17.6609 1.75 12 1.75Z"
        fill="url(#save-icon-gradient-2)"
      />
      <defs>
        <linearGradient
          id="save-icon-gradient-0"
          x1="12.25"
          y1="6.5"
          x2="12.25"
          y2="18"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#575757" />
          <stop offset="1" stop-color="#151515" />
        </linearGradient>
        <linearGradient
          id="save-icon-gradient-1"
          x1="12"
          y1="1"
          x2="12"
          y2="23"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#E3E3E5" stop-opacity="0.6" />
          <stop offset="1" stop-color="#BBBBC0" stop-opacity="0.6" />
        </linearGradient>
        <linearGradient
          id="save-icon-gradient-2"
          x1="12"
          y1="1"
          x2="12"
          y2="13.74"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#fff" />
          <stop offset="1" stop-color="#fff" stop-opacity="0" />
        </linearGradient>
        <filter
          id="save-icon-filter"
          x="-100%"
          y="-100%"
          width="400%"
          height="400%"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
        >
          <feGaussianBlur
            stdDeviation="2"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            in="SourceGraphic"
            edgeMode="none"
            result="blur"
          />
        </filter>
        <clipPath id="save-icon-clip">
          <path
            d="M12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1ZM18.707 7.79297C18.3165 7.40245 17.6835 7.40244 17.293 7.79297L10.5 14.5859L7.20703 11.293C6.81651 10.9024 6.18349 10.9024 5.79297 11.293C5.40245 11.6835 5.40245 12.3165 5.79297 12.707L9.79297 16.707C10.1835 17.0976 10.8165 17.0976 11.207 16.707L18.707 9.20703C19.0976 8.81651 19.0976 8.18349 18.707 7.79297Z"
            fill="url(#save-icon-gradient-1)"
          />
        </clipPath>
        <mask id="save-icon-mask">
          <rect width="100%" height="100%" fill="#FFF" />
          <path
            d="M12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1ZM18.707 7.79297C18.3165 7.40245 17.6835 7.40244 17.293 7.79297L10.5 14.5859L7.20703 11.293C6.81651 10.9024 6.18349 10.9024 5.79297 11.293C5.40245 11.6835 5.40245 12.3165 5.79297 12.707L9.79297 16.707C10.1835 17.0976 10.8165 17.0976 11.207 16.707L18.707 9.20703C19.0976 8.81651 19.0976 8.18349 18.707 7.79297Z"
            fill="#000"
          />
        </mask>
      </defs>
    </g>
  </svg>
</template>
