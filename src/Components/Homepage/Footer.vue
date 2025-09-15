<script setup>
const version = __APP_VERSION__
</script>

<template>
  <div
    class="pbx-flex pbx-justify-between pbx-gap-2 lg:pbx-px-12 pbx-mx-2 pbx-py-3 pbx-border-t pbx-border-t-gray-900"
  >
    <p
      class="pbx-myPrimaryParagraph lg:pbx-text-base pbx-text-xs lg:pbx-font-semibold pbx-font-medium pbx-border-b pbx-border-gray-400"
    >
      <a
        href="https://www.npmjs.com/package/@myissue/vue-website-page-builder"
        target="_blank"
        class="pbx-myPrimaryLink pbx-text-myPrimaryDarkGrayColor"
      >
        Install via npm
      </a>
    </p>

    <p
      class="pbx-myPrimaryParagraph lg:pbx-text-base pbx-text-xs lg:pbx-font-semibold pbx-font-medium pbx-border-b pbx-border-gray-400"
    >
      <a
        href="https://github.com/myissue-studio/vue-website-page-builder"
        target="_blank"
        class="pbx-myPrimaryLink pbx-text-myPrimaryDarkGrayColor"
      >
        View on GitHub
      </a>
    </p>

    <p
      class="pbx-myPrimaryParagraph lg:pbx-text-base pbx-text-xs lg:pbx-font-semibold pbx-font-medium pbx-border-b pbx-border-gray-400"
    >
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSd-0aBo4kNjTi9_7HFrMHmMJV93lrrnl6fc67AT7cFWcqZLOQ/viewform"
        target="_blank"
        class="pbx-myPrimaryLink pbx-text-myPrimaryDarkGrayColor"
      >
        Contact us
      </a>
    </p>

    <p
      class="pbx-myPrimaryParagraph lg:pbx-text-base pbx-text-xs lg:pbx-font-semibold pbx-font-medium pbx-border-b pbx-border-gray-400"
    >
      <span class="pbx-text-myPrimaryDarkGrayColor">v{{ version }}</span>
    </p>
  </div>
</template>
