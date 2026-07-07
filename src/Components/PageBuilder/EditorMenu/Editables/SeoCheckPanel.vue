<script setup lang="ts">
import type { SEOSummary } from '../../../../types'
import { computed } from 'vue'
import { useTranslations } from '../../../../composables/useTranslations'

const props = defineProps<{
  seoResult: SEOSummary | null
}>()

const { translate } = useTranslations()

const seoGroups = computed(() => {
  if (!props.seoResult) return []
  const map = new Map<string, typeof props.seoResult.checks>()
  for (const check of props.seoResult.checks) {
    const cat = check.category ?? 'Other'
    if (!map.has(cat)) map.set(cat, [])
    map.get(cat)!.push(check)
  }
  return Array.from(map.entries()).map(([title, checks]) => ({ title, checks }))
})
</script>

<template>
  <div class="pbx-overflow-y-auto">
    <div v-if="seoResult" class="pbx-flex pbx-items-center pbx-justify-center pbx-gap-2">
      <div
        class="pbx-relative pbx-my-4 pbx-rounded-full pbx-flex pbx-items-center pbx-justify-center pbx-w-36 pbx-h-36"
        :style="{
          background: `conic-gradient(${
            seoResult.score < 50 ? '#ef4444' : '#50C878'
          } ${seoResult.score}%, #e5e7eb 0)`,
        }"
      >
        <div
          class="pbx-bg-gray-100 pbx-rounded-full pbx-w-32 pbx-h-32 pbx-flex pbx-items-center pbx-justify-center"
        >
          <div class="pbx-text-center">
            <span class="pbx-lg:pbx-text-7xl pbx-text-5xl">{{ seoResult.score }}</span>
            <span class="pbx-text-xl">%</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="seoGroups.length" class="pbx-w-full pbx-space-y-5">
      <h3 class="pbx-text-base pbx-font-semibold pbx-text-center pbx-text-myPrimaryDarkGrayColor">
        {{ translate('SEO Check Results') }}
      </h3>

      <div v-for="group in seoGroups" :key="group.title" class="pbx-space-y-2">
        <h4 class="pbx-seoCheckGroupTitle">{{ translate(group.title) }}</h4>

        <ul class="pbx-space-y-2">
          <li
            v-for="(check, index) in group.checks"
            :key="index"
            class="pbx-seoCheckRow"
            :class="check.passed ? 'pbx-seoCheckRow--pass' : 'pbx-seoCheckRow--fail'"
          >
            <span
              class="pbx-seoCheckRowIcon material-symbols-outlined"
              :class="check.passed ? 'pbx-seoCheckRowIcon--pass' : 'pbx-seoCheckRowIcon--fail'"
              aria-hidden="true"
            >
              {{ check.passed ? 'check' : 'close' }}
            </span>
            <span class="pbx-pageDesignOpenButtonText">
              <span class="pbx-pageDesignOpenButtonLabel">{{ translate(check.check) }}</span>
              <span class="pbx-pageDesignOpenButtonHint">{{ check.details }}</span>
            </span>
          </li>
        </ul>
      </div>
    </div>

    <div v-else class="pbx-text-gray-500 pbx-text-center pbx-py-8">
      {{ translate('No SEO checks available.') }}
    </div>
  </div>
</template>
