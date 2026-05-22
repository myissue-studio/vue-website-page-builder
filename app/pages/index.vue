<script setup lang="ts">
import { PageBuilder, getPageBuilder } from '@myissue/vue-website-page-builder'

const configPageBuilder = {
  updateOrCreate: {
    formType: 'create' as const,
    formName: 'page',
  },
}

onMounted(async () => {
  const builder = getPageBuilder()
  const result = await builder.startBuilder(configPageBuilder)
  console.info('Page Builder ready:', result)
})
</script>

<template>
  <div>
    <client-only>
      <PageBuilder />
    </client-only>
  </div>
</template>
