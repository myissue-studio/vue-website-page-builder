import { createApp, createRouter, type EventHandler } from 'h3'
import { readdirSync, statSync, existsSync } from 'node:fs'
import { join, resolve, relative } from 'node:path'
import type { Plugin, ViteDevServer } from 'vite'

function collectApiFiles(dir: string): string[] {
  if (!existsSync(dir)) return []
  const result: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) result.push(...collectApiFiles(full))
    else if (entry.endsWith('.ts')) result.push(full)
  }
  return result
}

// Maps file path to { path, method }
// server/api/users.get.ts      → GET  /api/users
// server/api/users/index.ts    → ALL  /api/users
// server/api/proxy/images.ts   → ALL  /api/proxy/images
function fileToRoute(file: string, apiDir: string): { path: string; method: string | null } {
  const rel = relative(apiDir, file).replace(/\\/g, '/')
  const methodMatch = rel.match(/\.(get|post|put|patch|delete)\.ts$/)
  const method = methodMatch?.[1] ?? null
  const path =
    '/' +
    rel
      .replace(/\.(get|post|put|patch|delete)\.ts$/, '')
      .replace(/\.ts$/, '')
      .replace(/(\/|^)index$/, '')
  return { path: path || '/', method }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NodeHandler = (req: any, res: any) => void

async function buildHandler(server: ViteDevServer): Promise<NodeHandler> {
  const apiDir = resolve(process.cwd(), 'server/api')
  const files = collectApiFiles(apiDir)

  const app = createApp()
  const router = createRouter()

  for (const file of files) {
    const viteId = '/' + relative(process.cwd(), file).replace(/\\/g, '/')
    const mod = await server.ssrLoadModule(viteId)
    if (!mod.default) continue

    const { path, method } = fileToRoute(file, apiDir)
    const routePath = '/api' + path

    if (method) {
      ;(router as any)[method](routePath, mod.default as EventHandler)
    } else {
      router.use(routePath, mod.default as EventHandler)
    }

    console.log(`[server-routes] ${method?.toUpperCase() ?? 'ALL'} ${routePath}`)
  }

  app.use(router)

  // h3 v2: createApp returns an H3 instance with .fetch (Web standard).
  // srvx/node bridges it to Node.js IncomingMessage/ServerResponse.
  const { toNodeHandler } = await import('srvx/node')
  return toNodeHandler(app.fetch)
}

export function serverRoutesPlugin(): Plugin {
  let handler: NodeHandler | null = null

  return {
    name: 'vite-plugin-server-routes',
    apply: 'serve',

    async configureServer(server) {
      handler = await buildHandler(server)

      // Mount before Vite's own middleware so /api/* never reaches the SPA
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith('/api/') && handler) {
          handler(req, res)
        } else {
          next()
        }
      })
    },

    // Hot-reload routes when any file inside server/api/ changes
    async handleHotUpdate({ file, server }) {
      if (file.includes('/server/api/') || file.includes('\\server\\api\\')) {
        handler = await buildHandler(server)
        console.log('[server-routes] Routes reloaded')
        return []
      }
    },
  }
}
