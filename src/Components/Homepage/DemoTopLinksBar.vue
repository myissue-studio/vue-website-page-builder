<script setup lang="ts">
import { version } from '../../../package.json'
</script>

<template>
  <div
    class="pbx-flex pbx-flex-wrap pbx-items-center pbx-justify-between pbx-gap-2 lg:pbx-gap-3 lg:pbx-px-12 pbx-mx-2 pbx-py-3 pbx-border-t pbx-border-gray-300"
  >
    <p class="pbx-myPrimaryParagraph pbx-m-0">
      <a
        href="https://www.npmjs.com/package/@myissue/vue-website-page-builder"
        target="_blank"
        rel="noopener noreferrer"
        class="pbx-myPrimaryLink pbx-inline-flex pbx-items-center pbx-rounded-full pbx-border pbx-border-gray-300 pbx-bg-white pbx-px-3 pbx-py-1.5 lg:pbx-text-sm pbx-text-xs pbx-font-medium pbx-text-myPrimaryDarkGrayColor hover:pbx-bg-gray-100 hover:pbx-border-gray-400"
      >
        Install via npm
      </a>
    </p>

    <p class="pbx-myPrimaryParagraph pbx-m-0">
      <a
        href="https://github.com/myissue-studio/vue-website-page-builder"
        target="_blank"
        rel="noopener noreferrer"
        class="pbx-myPrimaryLink pbx-inline-flex pbx-items-center pbx-rounded-full pbx-border pbx-border-gray-300 pbx-bg-white pbx-px-3 pbx-py-1.5 lg:pbx-text-sm pbx-text-xs pbx-font-medium pbx-text-myPrimaryDarkGrayColor hover:pbx-bg-gray-100 hover:pbx-border-gray-400"
      >
        View on GitHub
      </a>
    </p>

    <p class="pbx-myPrimaryParagraph pbx-m-0">
      <a
        href="https://myissue-studio.github.io/vue-website-page-builder"
        target="_blank"
        rel="noopener noreferrer"
        class="pbx-myPrimaryLink pbx-inline-flex pbx-items-center pbx-rounded-full pbx-border pbx-border-gray-300 pbx-bg-white pbx-px-3 pbx-py-1.5 lg:pbx-text-sm pbx-text-xs pbx-font-medium pbx-text-myPrimaryDarkGrayColor hover:pbx-bg-gray-100 hover:pbx-border-gray-400"
      >
        Guide
      </a>
    </p>

    <p class="pbx-myPrimaryParagraph pbx-m-0">
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSeGgtmskw4T7o2Q50C6UCh3EidVbYDhrTXNUMsd6EykpzGTOQ/viewform"
        target="_blank"
        rel="noopener noreferrer"
        class="pbx-myPrimaryLink pbx-inline-flex pbx-items-center pbx-rounded-full pbx-border pbx-border-gray-300 pbx-bg-white pbx-px-3 pbx-py-1.5 lg:pbx-text-sm pbx-text-xs pbx-font-medium pbx-text-myPrimaryDarkGrayColor hover:pbx-bg-gray-100 hover:pbx-border-gray-400"
      >
        Contact us
      </a>
    </p>

    <p class="pbx-myPrimaryParagraph pbx-m-0">
      <span
        class="pbx-inline-flex pbx-items-center pbx-rounded-full pbx-bg-gray-100 pbx-px-3 pbx-py-1.5 lg:pbx-text-sm pbx-text-xs pbx-font-medium pbx-text-myPrimaryDarkGrayColor"
      >
        v{{ version }}
      </span>
    </p>
  </div>
</template>
