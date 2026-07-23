#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TMP_DIR="$ROOT_DIR/.tmp/nuxt-smoke"

printf '\n[nuxt-smoke] Packing local library...\n'
cd "$ROOT_DIR"
PACKAGE_TGZ="$(npm pack --silent | tail -n 1)"
PACKAGE_PATH="$ROOT_DIR/$PACKAGE_TGZ"

cleanup() {
  rm -f "$PACKAGE_PATH"
}
trap cleanup EXIT

printf '[nuxt-smoke] Preparing temp Nuxt project at %s\n' "$TMP_DIR"
rm -rf "$TMP_DIR"
mkdir -p "$TMP_DIR/plugins" "$TMP_DIR/pages"

cat > "$TMP_DIR/package.json" << 'EOF'
{
  "name": "nuxt-smoke-test",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "nuxt build"
  },
  "dependencies": {
    "nuxt": "3.17.6",
    "vue": "^3.5.13"
  }
}
EOF

cat > "$TMP_DIR/nuxt.config.ts" << 'EOF'
export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: false },
})
EOF

cat > "$TMP_DIR/plugins/page-builder.client.ts" << 'EOF'
import { pageBuilder } from '@myissue/vue-website-page-builder'
import '@myissue/vue-website-page-builder/style.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(pageBuilder)
})
EOF

cat > "$TMP_DIR/pages/index.vue" << 'EOF'
<script setup lang="ts">
import { onMounted } from 'vue'
import { PageBuilder, getPageBuilder } from '@myissue/vue-website-page-builder'

onMounted(async () => {
  const service = getPageBuilder()
  await service.startBuilder({
    updateOrCreate: {
      formType: 'create',
      formName: 'article',
    },
  })
})
</script>

<template>
  <ClientOnly>
    <PageBuilder />
  </ClientOnly>
</template>
EOF

printf '[nuxt-smoke] Installing Nuxt app dependencies...\n'
cd "$TMP_DIR"
# Avoid npm arborist peer-resolution crash (edgesOut) on some Nuxt graphs.
npm install --legacy-peer-deps

printf '[nuxt-smoke] Installing packed page builder package...\n'
npm install --legacy-peer-deps "$PACKAGE_PATH"

printf '[nuxt-smoke] Running Nuxt build...\n'
npm run build

printf '\n[nuxt-smoke] PASS: Nuxt build completed with @myissue/vue-website-page-builder integration.\n'
