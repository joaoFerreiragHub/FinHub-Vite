import fs from 'node:fs'
import { stat } from 'node:fs/promises'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { renderPage } from 'vike/server'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const clientDistDir = path.join(rootDir, 'dist', 'client')
const serverEntryPath = path.join(rootDir, 'dist', 'server', 'entry.mjs')

const host = process.env.HOST || '0.0.0.0'
const port = Number.parseInt(process.env.PORT || '4173', 10)

const MIME_BY_EXTENSION = {
  '.css': 'text/css; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
}

const isSafePath = (candidatePath) => {
  const normalizedClientRoot = `${path.resolve(clientDistDir)}${path.sep}`
  return candidatePath.startsWith(normalizedClientRoot)
}

const tryServeStatic = async (pathname, res) => {
  if (pathname === '/' || pathname.endsWith('/')) return false

  const relative = pathname.replace(/^\/+/, '')
  if (!relative) return false

  const absolutePath = path.resolve(clientDistDir, relative)
  if (!isSafePath(absolutePath)) return false

  try {
    const fileStats = await stat(absolutePath)
    if (!fileStats.isFile()) return false

    const ext = path.extname(absolutePath).toLowerCase()
    const mimeType = MIME_BY_EXTENSION[ext] || 'application/octet-stream'

    res.statusCode = 200
    res.setHeader('Content-Type', mimeType)
    res.setHeader('Cache-Control', 'public, max-age=604800, immutable')

    await new Promise((resolve, reject) => {
      const stream = fs.createReadStream(absolutePath)
      stream.on('error', reject)
      stream.on('end', resolve)
      stream.pipe(res)
    })

    return true
  } catch {
    return false
  }
}

const setHttpResponseHeaders = (res, headers) => {
  if (!headers) return

  if (Array.isArray(headers)) {
    for (const entry of headers) {
      if (!Array.isArray(entry) || entry.length !== 2) continue
      const [name, value] = entry
      if (typeof name !== 'string') continue
      if (typeof value === 'undefined') continue
      res.setHeader(name, String(value))
    }
    return
  }

  if (typeof headers === 'object') {
    for (const [name, value] of Object.entries(headers)) {
      if (typeof value === 'undefined') continue
      res.setHeader(name, String(value))
    }
  }
}

if (!fs.existsSync(serverEntryPath) || !fs.existsSync(clientDistDir)) {
  console.error(
    '[web] dist assets em falta. Executa "yarn build" antes de iniciar o servidor de producao.'
  )
  process.exit(1)
}

await import(pathToFileURL(serverEntryPath).href)

const server = http.createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)
    const { pathname } = requestUrl

    if (req.method === 'GET' || req.method === 'HEAD') {
      const servedStatic = await tryServeStatic(pathname, res)
      if (servedStatic) return
    }

    const pageContext = await renderPage({
      urlOriginal: req.url || '/',
      headersOriginal: req.headers,
    })

    const httpResponse = pageContext.httpResponse
    if (!httpResponse) {
      res.statusCode = 404
      res.end('Not Found')
      return
    }

    const { body, statusCode, headers } = httpResponse
    setHttpResponseHeaders(res, headers)
    res.statusCode = statusCode
    res.end(body)
  } catch (error) {
    console.error('[web] Erro nao tratado:', error)
    if (!res.headersSent) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.end('Internal Server Error')
    }
  }
})

server.listen(port, host, () => {
  console.info(`[web] FinHub frontend pronto em http://${host}:${port}`)
})
