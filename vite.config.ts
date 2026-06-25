import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig(({ mode }) => {
  const isLibMode = mode === 'lib'

  const baseConfig = {
    plugins: [
      vue(),
      ...(isLibMode
        ? [
            dts({
              entryRoot: './src',
              tsconfigPath: './tsconfig.app.json',
            }),
          ]
        : []),
    ],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    define: {},
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
        emptyOutDir: true, // Now safe to clear because vite-plugin-dts handles declarations
        cssCodeSplit: true,
      },
      esbuild: {
        target: 'esnext',
      },
    }
  }

  return {
    ...baseConfig,
    server: { port: 9998 },
  }
})
