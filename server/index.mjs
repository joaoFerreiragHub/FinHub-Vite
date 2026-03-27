import fs from 'node:fs'
import { readFile, stat } from 'node:fs/promises'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { renderPage } from 'vike/server'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const clientDistDir = path.join(rootDir, 'dist', 'client')
const publicDir = path.join(rootDir, 'public')
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

const toOrigin = (rawValue) => {
  if (typeof rawValue !== 'string' || rawValue.trim().length === 0) return null
  try {
    const url = new URL(rawValue)
    return `${url.protocol}//${url.host}`
  } catch {
    return null
  }
}

const apiOrigins = Array.from(
  new Set(
    [
      process.env.FINHUB_API_ORIGIN,
      process.env.API_ORIGIN,
      process.env.API_URL,
      process.env.VITE_API_URL,
    ]
      .map(toOrigin)
      .filter((value) => Boolean(value)),
  ),
)

const parseAbsoluteUrl = (rawValue) => {
  if (typeof rawValue !== 'string' || rawValue.trim().length === 0) return null
  try {
    return new URL(rawValue.trim())
  } catch {
    return null
  }
}

const normalizeBaseUrl = (value) => value.replace(/\/+$/, '')

const buildSitemapApiPath = (basePath) => {
  const normalizedBasePath = basePath.replace(/\/+$/, '')

  if (!normalizedBasePath || normalizedBasePath === '/') {
    return '/api/sitemap'
  }

  if (normalizedBasePath.endsWith('/api')) {
    return `${normalizedBasePath}/sitemap`
  }

  if (normalizedBasePath.endsWith('/api/sitemap')) {
    return normalizedBasePath
  }

  return `${normalizedBasePath}/sitemap`
}

const resolveSitemapApiUrl = () => {
  for (const candidate of [
    process.env.SITEMAP_API_URL,
    process.env.FINHUB_SITEMAP_API_URL,
    process.env.API_BASE_URL,
  ]) {
    const parsed = parseAbsoluteUrl(candidate)
    if (!parsed) continue
    parsed.pathname = buildSitemapApiPath(parsed.pathname)
    parsed.search = ''
    parsed.hash = ''
    return parsed.toString()
  }

  for (const candidate of [process.env.VITE_API_URL, process.env.API_URL, process.env.FINHUB_API_URL]) {
    const parsed = parseAbsoluteUrl(candidate)
    if (!parsed) continue
    const basePath = parsed.pathname.replace(/\/+$/, '')
    if (!basePath || basePath === '/') {
      parsed.pathname = '/api/sitemap'
    } else if (basePath.endsWith('/api')) {
      parsed.pathname = `${basePath}/sitemap`
    } else {
      parsed.pathname = `${basePath}/sitemap`
    }
    parsed.search = ''
    parsed.hash = ''
    return parsed.toString()
  }

  for (const candidate of [process.env.FINHUB_API_ORIGIN, process.env.API_ORIGIN]) {
    const parsed = parseAbsoluteUrl(candidate)
    if (!parsed) continue
    parsed.pathname = '/api/sitemap'
    parsed.search = ''
    parsed.hash = ''
    return parsed.toString()
  }

  return 'http://localhost:5000/api/sitemap'
}

const sitemapApiUrl = resolveSitemapApiUrl()

const sitemapFetchTimeoutMsRaw = Number.parseInt(process.env.SITEMAP_FETCH_TIMEOUT_MS || '5000', 10)
const sitemapFetchTimeoutMs =
  Number.isFinite(sitemapFetchTimeoutMsRaw) && sitemapFetchTimeoutMsRaw > 0
    ? sitemapFetchTimeoutMsRaw
    : 5000

const sitemapStaticCandidates = [
  path.join(clientDistDir, 'sitemap.xml'),
  path.join(publicDir, 'sitemap.xml'),
]

const sitemapStaticPaths = [
  '/',
  '/hub/conteudos',
  '/criadores',
  '/recursos',
  '/ferramentas/fire',
  '/precos',
  '/comunidade',
]

const betaModeEnabled = process.env.BETA_MODE === 'true'
const betaStaticAssetPattern = /\.(js|css|png|jpg|jpeg|ico|svg|woff2?|ttf|map|webp)$/i
const betaExactExemptPaths = new Set(['/beta', '/login', '/registar'])
const betaPrefixExemptPaths = [
  '/privacidade',
  '/termos',
  '/cookies',
  '/aviso-legal',
  '/faq',
  '/sobre',
  '/contacto',
  '/legal/privacidade',
  '/legal/termos',
  '/legal/cookies',
]

const isBetaExemptPath = (pathname) => {
  if (pathname === '/api' || pathname.startsWith('/api/')) return true
  if (pathname === '/assets' || pathname.startsWith('/assets/')) return true
  if (pathname === '/@' || pathname.startsWith('/@')) return true
  if (pathname === '/_vike' || pathname.startsWith('/_vike')) return true
  if (betaStaticAssetPattern.test(pathname)) return true
  if (betaExactExemptPaths.has(pathname)) return true
  return betaPrefixExemptPaths.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

const hasValidBetaSession = (rawCookies) =>
  rawCookies
    .split(';')
    .some((cookiePart) => cookiePart.trim().startsWith('betaSession=valid'))

// NOTE: unsafe-inline in script-src is required for JSON-LD inline scripts.
const cspHeaderValue = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: https:",
  `connect-src 'self' https://api.posthog.com https://eu.posthog.com${apiOrigins.length > 0 ? ` ${apiOrigins.join(' ')}` : ''}`,
  "frame-ancestors 'none'",
].join('; ')

const applySecurityHeaders = (res) => {
  res.setHeader('Content-Security-Policy', cspHeaderValue)
}

const normalizeHeaderValue = (value) => {
  if (Array.isArray(value)) {
    return value[0] || ''
  }
  return typeof value === 'string' ? value : ''
}

const resolveRequestSiteUrl = (req) => {
  const forwardedProtoHeader = normalizeHeaderValue(req.headers['x-forwarded-proto'])
  const forwardedHostHeader = normalizeHeaderValue(req.headers['x-forwarded-host'])
  const directHostHeader = normalizeHeaderValue(req.headers.host)

  const protocol = (forwardedProtoHeader.split(',', 1)[0] || '').trim() || 'http'
  const host = (forwardedHostHeader.split(',', 1)[0] || '').trim() || directHostHeader.trim()
  if (!host) return null

  const candidate = `${protocol}://${host}`
  const parsed = parseAbsoluteUrl(candidate)
  if (!parsed) return null

  return `${parsed.protocol}//${parsed.host}`
}

const resolveSiteUrl = (req) => {
  const configuredSiteUrl =
    toOrigin(process.env.SITE_URL) ||
    toOrigin(process.env.VITE_SITE_URL) ||
    toOrigin(process.env.FRONTEND_URL)

  if (configuredSiteUrl) {
    return normalizeBaseUrl(configuredSiteUrl)
  }

  const requestSiteUrl = resolveRequestSiteUrl(req)
  if (requestSiteUrl) {
    return normalizeBaseUrl(requestSiteUrl)
  }

  return 'https://finhub.pt'
}

const escapeXml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const toIsoDateTime = (value) => {
  if (typeof value !== 'string') return null
  const timestamp = Date.parse(value)
  if (!Number.isFinite(timestamp)) return null
  return new Date(timestamp).toISOString()
}

const normalizeStringArray = (value, key) => {
  if (!Array.isArray(value)) return []

  const entries = []
  for (const item of value) {
    if (!item || typeof item !== 'object') continue
    const rawValue = item[key]
    if (typeof rawValue !== 'string') continue
    const normalizedValue = rawValue.trim()
    if (!normalizedValue) continue
    entries.push({
      value: normalizedValue,
      updatedAt: toIsoDateTime(item.updatedAt) || new Date().toISOString(),
    })
  }

  return entries
}

const normalizeSitemapPayload = (payload) => {
  const source = payload && typeof payload === 'object' ? payload : {}

  return {
    articles: normalizeStringArray(source.articles, 'slug'),
    courses: normalizeStringArray(source.courses, 'slug'),
    videos: normalizeStringArray(source.videos, 'slug'),
    podcasts: normalizeStringArray(source.podcasts, 'slug'),
    books: normalizeStringArray(source.books, 'slug'),
    creators: normalizeStringArray(source.creators, 'username'),
    brands: normalizeStringArray(source.brands, 'slug'),
  }
}

const buildSitemapXml = (siteUrl, payload) => {
  const entries = []
  const seenPaths = new Set()
  const addEntry = (pathValue, lastmod) => {
    const normalizedPath = pathValue.trim()
    if (!normalizedPath || seenPaths.has(normalizedPath)) return
    seenPaths.add(normalizedPath)
    entries.push({
      path: normalizedPath,
      lastmod,
    })
  }

  const defaultLastmod = new Date().toISOString()
  for (const staticPath of sitemapStaticPaths) {
    addEntry(staticPath, defaultLastmod)
  }

  for (const item of payload.articles) {
    addEntry(`/artigos/${encodeURIComponent(item.value)}`, item.updatedAt)
  }
  for (const item of payload.courses) {
    addEntry(`/cursos/${encodeURIComponent(item.value)}`, item.updatedAt)
  }
  for (const item of payload.videos) {
    addEntry(`/videos/${encodeURIComponent(item.value)}`, item.updatedAt)
  }
  for (const item of payload.podcasts) {
    addEntry(`/hub/podcasts/${encodeURIComponent(item.value)}`, item.updatedAt)
  }
  for (const item of payload.books) {
    addEntry(`/hub/books/${encodeURIComponent(item.value)}`, item.updatedAt)
  }
  for (const item of payload.creators) {
    addEntry(`/criadores/${encodeURIComponent(item.value)}`, item.updatedAt)
  }
  for (const item of payload.brands) {
    addEntry(`/recursos/${encodeURIComponent(item.value)}`, item.updatedAt)
  }

  const lines = ['<?xml version="1.0" encoding="UTF-8"?>']
  lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

  for (const entry of entries) {
    lines.push('  <url>')
    lines.push(`    <loc>${escapeXml(`${siteUrl}${entry.path}`)}</loc>`)
    lines.push(`    <lastmod>${entry.lastmod}</lastmod>`)
    lines.push('  </url>')
  }

  lines.push('</urlset>', '')
  return lines.join('\n')
}

const loadStaticSitemap = async () => {
  for (const filePath of sitemapStaticCandidates) {
    try {
      const fileStats = await stat(filePath)
      if (!fileStats.isFile()) continue

      const xml = await readFile(filePath, 'utf8')
      if (xml.trim().length === 0) continue

      return {
        xml,
        mtime: fileStats.mtime.toUTCString(),
      }
    } catch {
      // Try next candidate.
    }
  }

  return null
}

const tryServeDynamicSitemap = async (req, res) => {
  try {
    const upstreamResponse = await fetch(sitemapApiUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(sitemapFetchTimeoutMs),
    })

    if (!upstreamResponse.ok) {
      return false
    }

    const payload = normalizeSitemapPayload(await upstreamResponse.json())
    const body = buildSitemapXml(resolveSiteUrl(req), payload)

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    res.setHeader('Cache-Control', 'public, max-age=3600')
    res.setHeader('Last-Modified', new Date().toUTCString())

    if (req.method === 'HEAD') {
      res.end()
      return true
    }

    res.end(body)
    return true
  } catch (error) {
    console.warn('[web] Falha ao obter sitemap dinamico da API. A usar fallback estatico.', error)
    return false
  }
}

const tryServeStaticSitemapFallback = async (req, res) => {
  const staticSitemap = await loadStaticSitemap()
  if (!staticSitemap) return false

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=3600')
  res.setHeader('Last-Modified', staticSitemap.mtime)

  if (req.method === 'HEAD') {
    res.end()
    return true
  }

  res.end(staticSitemap.xml)
  return true
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
    applySecurityHeaders(res)

    const requestUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)
    const { pathname } = requestUrl

    if (betaModeEnabled) {
      const isExempt = isBetaExemptPath(pathname)
      if (!isExempt) {
        const rawCookies =
          typeof req.headers.cookie === 'string' ? req.headers.cookie : ''
        const hasBetaSession = hasValidBetaSession(rawCookies)
        if (!hasBetaSession) {
          res.statusCode = 302
          res.setHeader('Location', '/beta')
          res.end()
          return
        }
      }
    }

    if ((req.method === 'GET' || req.method === 'HEAD') && pathname === '/sitemap.xml') {
      const servedDynamicSitemap = await tryServeDynamicSitemap(req, res)
      if (servedDynamicSitemap) return

      const servedFallbackSitemap = await tryServeStaticSitemapFallback(req, res)
      if (servedFallbackSitemap) return
    }

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
      applySecurityHeaders(res)
      res.statusCode = 500
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.end('Internal Server Error')
    }
  }
})

server.listen(port, host, () => {
  console.info(`[web] FinHub frontend pronto em http://${host}:${port}`)
})
