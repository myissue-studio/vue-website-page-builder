<script setup>
const version = __APP_VERSION__
</script>

<template>
  <div
    class="pbx-flex pbx-justify-between pbx-gap-2 lg:pbx-px-12 pbx-mx-2 pbx-py-3 pbx-border-t pbx-border-t-gray-900"
  >
    <p class="pbx-myPrimaryParagraph pbx-text-xs pbx-font-medium pbx-underline">
      <a
        href="https://www.npmjs.com/package/@myissue/vue-website-page-builder"
        target="_blank"
        class="pbx-myPrimaryLink pbx-text-myPrimaryDarkGrayColor"
      >
        Install via npm
      </a>
    </p>

    <p class="pbx-myPrimaryParagraph pbx-text-xs pbx-font-medium pbx-underline">
      <a
        href="https://github.com/myissue-studio/vue-website-page-builder"
        target="_blank"
        class="pbx-myPrimaryLink pbx-text-myPrimaryDarkGrayColor"
      >
        View on GitHub
      </a>
    </p>
    <p class="pbx-myPrimaryParagraph pbx-text-xs pbx-font-medium pbx-underline">
      <span class="pbx-text-myPrimaryDarkGrayColor">{{ version }}</span>
    </p>
  </div>
</template>
