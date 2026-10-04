import { createHash } from 'node:crypto'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join, posix } from 'node:path'

const outputDirectory = fileURLToPath(new URL('../dist/', import.meta.url))
const cacheableExtensions = new Set(['.css', '.html', '.js', '.png', '.svg', '.webmanifest'])

async function listFiles(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(entries.map(async (entry) => {
    const name = posix.join(prefix, entry.name)
    if (entry.isDirectory()) return listFiles(join(directory, entry.name), name)
    return [name]
  }))
  return files.flat()
}

const files = (await listFiles(outputDirectory))
  .filter((file) => cacheableExtensions.has(posix.extname(file)) && file !== 'sw.js')
  .sort()

if (!files.includes('index.html') || !files.includes('manifest.webmanifest')) {
  throw new Error('The PWA build is missing index.html or manifest.webmanifest.')
}

const hash = createHash('sha256')
for (const file of files) {
  hash.update(file)
  hash.update(await readFile(join(outputDirectory, file)))
}

const cacheName = `personal-library-static-${hash.digest('hex').slice(0, 16)}`
const precacheUrls = files.map((file) => `/${file}`)

const serviceWorker = `// Generated from the production build. Do not edit dist/sw.js.
const CACHE_NAME = ${JSON.stringify(cacheName)}
const PRECACHE_URLS = ${JSON.stringify(precacheUrls)}
const PRECACHE_PATHS = new Set(PRECACHE_URLS)
const APP_ROUTES = new Set(['/', '/library', '/library/', '/upload', '/upload/', '/google-drive', '/google-drive/'])

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names
        .filter((name) => name.startsWith('personal-library-static-') && name !== CACHE_NAME)
        .map((name) => caches.delete(name))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    if (!APP_ROUTES.has(url.pathname)) return
    event.respondWith(fetch(request).catch(() => caches.match('/index.html')))
    return
  }

  if (!PRECACHE_PATHS.has(url.pathname)) return
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request)))
})
`

await writeFile(join(outputDirectory, 'sw.js'), serviceWorker)
console.log(`Generated Personal Library service worker with ${precacheUrls.length} static files.`)
