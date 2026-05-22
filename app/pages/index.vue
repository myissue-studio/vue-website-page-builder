<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

interface Website {
  id: number
  name: string
  domain: string
}

interface Page {
  id: number
  name: string
  slug: string
  version: number
  updatedAt: string
  status: 'published' | 'draft'
}

const { data: websites } = await useFetch<Website[]>('/api/websites')

const selectedWebsiteId = ref<number | null>(null)
const pages = ref<Page[]>([])
const loadingPages = ref(false)

watchEffect(() => {
  if (websites.value?.length && !selectedWebsiteId.value) {
    selectedWebsiteId.value = websites.value[0].id
  }
})

watch(
  selectedWebsiteId,
  async (id) => {
    if (!id) return
    loadingPages.value = true
    try {
      pages.value = await $fetch<Page[]>('/api/pages', { query: { websiteId: id } })
    } finally {
      loadingPages.value = false
    }
  },
  { immediate: true },
)

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="space-y-6">
    <!-- Website selector -->
    <div class="flex items-center gap-3">
      <label class="text-sm font-medium text-gray-700 shrink-0">Website</label>
      <select
        v-model="selectedWebsiteId"
        class="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
      >
        <option v-for="site in websites" :key="site.id" :value="site.id">
          {{ site.name }} — {{ site.domain }}
        </option>
      </select>
    </div>

    <!-- Pages list -->
    <div>
      <h2 class="text-sm font-medium text-gray-700 mb-3">Pages</h2>

      <div
        v-if="loadingPages"
        class="py-12 text-center text-sm text-gray-400"
      >
        Loading…
      </div>

      <div
        v-else-if="pages.length"
        class="overflow-hidden rounded-xl border border-gray-200 bg-white"
      >
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 text-left text-gray-500">
              <th class="px-4 py-3 font-medium">Page</th>
              <th class="px-4 py-3 font-medium">Version</th>
              <th class="px-4 py-3 font-medium">Updated</th>
              <th class="px-4 py-3 font-medium">Status</th>
              <th class="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="page in pages"
              :key="page.id"
              class="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
            >
              <td class="px-4 py-3 font-medium text-gray-900">{{ page.name }}</td>
              <td class="px-4 py-3 text-gray-500">v{{ page.version }}</td>
              <td class="px-4 py-3 text-gray-500">{{ formatDate(page.updatedAt) }}</td>
              <td class="px-4 py-3">
                <span
                  class="rounded-full px-2 py-0.5 text-xs font-medium"
                  :class="
                    page.status === 'published'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-amber-50 text-amber-700'
                  "
                >
                  {{ page.status }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <NuxtLink
                  :to="`/editor?pageId=${page.id}&pageName=${encodeURIComponent(page.name)}`"
                  class="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Edit →
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-else
        class="py-12 text-center text-sm text-gray-400"
      >
        No pages found for this website.
      </div>
    </div>
  </div>
</template>
