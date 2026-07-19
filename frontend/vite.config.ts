import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const docsRoot = path.resolve(__dirname, '../docs')

function serveDocs(): Plugin {
  return {
    name: 'serve-docs',
    configureServer(server) {
      server.middlewares.use('/docs', (req, res, next) => {
        const url = decodeURIComponent((req.url || '/').split('?')[0])
        const filePath = path.join(docsRoot, url)
        if (!filePath.startsWith(docsRoot) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
          next()
          return
        }
        const ext = path.extname(filePath).toLowerCase()
        const types: Record<string, string> = {
          '.md': 'text/markdown; charset=utf-8',
          '.svg': 'image/svg+xml',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.webp': 'image/webp',
        }
        res.statusCode = 200
        res.setHeader('Content-Type', types[ext] || 'application/octet-stream')
        res.end(fs.readFileSync(filePath))
      })
    },
  }
}

export default defineConfig({
  base: process.env.VITE_BASE || '/family-quest-rpg/',
  plugins: [react(), tailwindcss(), serveDocs()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  server: {
    fs: { allow: [path.resolve(__dirname, '..')] },
  },
})
