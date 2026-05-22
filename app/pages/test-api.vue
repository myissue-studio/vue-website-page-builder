<script setup lang="ts">
const loading = ref(false)
const response = ref<any>(null)
const error = ref<string | null>(null)

const form = reactive({
  updatedOn: new Date().toISOString(),
  updatedBy: 'test@test.com',
  key: 'homepage',
  value: '<html>test</html>',
  version: 'test',
  state: 'published' as 'published' | 'draft',
})

async function callOdooCms() {
  loading.value = true
  error.value = null
  response.value = null
  try {
    const data = await $fetch('/api/proxy/odoo/cms', {
      method: 'POST',
      body: { ...form },
    })
    response.value = data
  } catch (err: any) {
    error.value = err?.data?.message ?? err?.message ?? 'Unknown error'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto p-8 space-y-6">
    <h1 class="text-2xl font-bold">API Tester — Odoo CMS Webhook</h1>
    <p class="text-sm text-gray-500">
      Calls <code class="bg-gray-100 px-1 rounded">POST /api/proxy/odoo/cms</code>
      → <code class="bg-gray-100 px-1 rounded">ODOO_BASE_URL/webhooks/cms</code>
    </p>

    <div class="space-y-4 bg-white border rounded-xl p-6 shadow-sm">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">updatedBy</label>
        <input v-model="form.updatedBy" type="text"
          class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">key</label>
        <input v-model="form.key" type="text"
          class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">value (HTML)</label>
        <textarea v-model="form.value" rows="4"
          class="w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-black" />
      </div>

      <div class="flex gap-4">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">version</label>
          <input v-model="form.version" type="text"
            class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
        </div>
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">state</label>
          <select v-model="form.state"
            class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black">
            <option value="published">published</option>
            <option value="draft">draft</option>
          </select>
        </div>
      </div>

      <button @click="callOdooCms" :disabled="loading"
        class="w-full bg-black text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition">
        {{ loading ? 'Sending…' : 'Send Request' }}
      </button>
    </div>

    <!-- Response -->
    <div v-if="response" class="bg-green-50 border border-green-200 rounded-xl p-4">
      <p class="text-sm font-medium text-green-700 mb-2">✓ Success</p>
      <pre class="text-xs text-green-800 whitespace-pre-wrap">{{ JSON.stringify(response, null, 2) }}</pre>
    </div>

    <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4">
      <p class="text-sm font-medium text-red-700 mb-2">✗ Error</p>
      <pre class="text-xs text-red-800 whitespace-pre-wrap">{{ error }}</pre>
    </div>
  </div>
</template>
