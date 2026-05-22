<script setup lang="ts">
import { PageBuilder, getPageBuilder } from '@myissue/vue-website-page-builder'
import type { PageBuilderConfig } from '@myissue/vue-website-page-builder'

const props = defineProps<{
  pageId?: number
  pageName?: string
}>()

const config: PageBuilderConfig = {
  updateOrCreate: {
    formType: 'create',
    formName: 'page',
  },
  resourceData: props.pageId ? { title: props.pageName ?? 'page', id: props.pageId } : null,
}

onMounted(async () => {
  const builder = getPageBuilder()
  await builder.startBuilder(config)
})
</script>

<template>
  <PageBuilder />
</template>
