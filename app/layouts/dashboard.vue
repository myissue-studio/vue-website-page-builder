<script setup lang="ts">
const { user, logout } = useAuth()
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <span class="font-semibold text-gray-900 text-sm">RubikX Builder</span>
        <div class="flex items-center gap-4">
          <span v-if="user" class="text-sm text-gray-500">{{ user.email }}</span>
          <button
            class="text-sm text-gray-600 hover:text-gray-900"
            @click="logout"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
    <main class="max-w-5xl mx-auto px-6 py-8">
      <slot />
    </main>
  </div>
</template>
