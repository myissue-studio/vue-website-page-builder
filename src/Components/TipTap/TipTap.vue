<script setup lang="ts">
import { getPageBuilder } from '../../composables/usePageBuilder'
import { useTranslations } from '../../composables/useTranslations'

const { translate } = useTranslations()
const pageBuilderService = getPageBuilder()
</script>

<template>
  <div>
    <template v-if="pageBuilderService.isSelectedElementValidText()">
      <div class="pbx-flex pbx-flex-col pbx-border-solid pbx-border pbx-border-gray-400">
        <div
          @click="pageBuilderService.toggleTipTapModal(true)"
          class="pbx-flex pbx-flex-row pbx-justify-between pbx-items-center pbx-pl-3 pbx-pr-3 pbx-py-5 pbx-cursor-pointer pbx-duration-200 hover:pbx-bg-myPrimaryLightGrayColor pbx-bg-white"
        >
          <p class="pbx-myPrimaryParagraph pbx-font-medium pbx-my-0 pbx-py-0">
            {{ translate('Text') }}
          </p>
          <span class="material-symbols-outlined"> chevron_right </span>
        </div>
      </div>
    </template>
  </div>
</template>
