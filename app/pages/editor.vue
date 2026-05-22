<script setup lang="ts">
definePageMeta({ layout: 'editor' })

const route = useRoute()
const pageId = computed(() => Number(route.query.pageId))
const pageName = computed(() => (route.query.pageName as string) ?? 'Untitled')
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Editor header -->
    <div class="shrink-0 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
      <NuxtLink
        to="/"
        class="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        ← Pages
      </NuxtLink>
      <span class="text-sm font-medium text-gray-900">{{ pageName }}</span>
      <!-- spacer keeps title centred -->
      <span class="w-16" />
    </div>

    <!-- Page builder fills remaining height -->
    <div class="flex-1 overflow-hidden">
      <PageBuilderWrapper :page-id="pageId" :page-name="pageName" />
    </div>
  </div>
</template>
