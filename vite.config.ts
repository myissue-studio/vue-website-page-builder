import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { serverRoutesPlugin } from './vite-plugins/server-routes'

export default defineConfig(({ mode }) => {
  const isLibMode = mode === 'lib'

  const baseConfig = {
    plugins: [vue(), ...(isLibMode ? [] : [serverRoutesPlugin()])],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    define: { __APP_VERSION__: JSON.stringify(process.env.npm_package_version) },
  }

  if (isLibMode) {
    return {
      ...baseConfig,
      build: {
        lib: {
          entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
          name: 'VueWebsitePageBuilder',
          fileName: (format) =>
            `vue-website-page-builder.${format === 'es' ? 'js' : format === 'umd' ? 'umd.cjs' : 'js'}`,
        },
        rollupOptions: {
          external: ['vue'],
          output: {
            globals: {
              vue: 'Vue',
            },
            assetFileNames: 'style.css',
          },
        },
        emptyOutDir: true,
        cssCodeSplit: true,
      },
      esbuild: {
        target: 'esnext',
      },
    }
  }

  return {
    ...baseConfig,
    server: { port: 9999 },
  }
})
