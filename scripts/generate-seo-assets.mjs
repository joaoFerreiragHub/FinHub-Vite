import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..')
const publicDir = resolve(projectRoot, 'public')

const siteUrl = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://finhub.pt').replace(
  /\/+$/,
  '',
)
const lastMod = new Date().toISOString().slice(0, 10)

const fallbackRoutes = ['/', '/hub/conteudos', '/criadores', '/recursos', '/ferramentas/fire', '/precos', '/comunidade']

const disallowPaths = [
  '/admin/',
  '/dashboard/',
  '/conta',
  '/meus-favoritos',
  '/a-seguir',
  '/notificacoes',
  '/login',
  '/registar',
  '/esqueci-password',
  '/reset-password',
  '/oauth/',
  '/verificar-email',
]

const renderSitemap = () => {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!-- fallback estático — sitemap dinâmico em server/index.mjs -->',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ]

  for (const route of fallbackRoutes) {
    const loc = route === '/' ? `${siteUrl}/` : `${siteUrl}${route}`
    lines.push('  <url>')
    lines.push(`    <loc>${loc}</loc>`)
    lines.push(`    <lastmod>${lastMod}</lastmod>`)
    lines.push('  </url>')
  }

  lines.push('</urlset>', '')
  return lines.join('\n')
}

const renderRobots = () => {
  const lines = ['User-agent: *', 'Allow: /', '', '# Areas privadas e utilitarias']
  for (const path of disallowPaths) {
    lines.push(`Disallow: ${path}`)
  }
  lines.push('', `Sitemap: ${siteUrl}/sitemap.xml`, '')
  return lines.join('\n')
}

mkdirSync(publicDir, { recursive: true })
writeFileSync(resolve(publicDir, 'sitemap.xml'), renderSitemap(), 'utf8')
writeFileSync(resolve(publicDir, 'robots.txt'), renderRobots(), 'utf8')

console.log('[seo] Generated public/sitemap.xml and public/robots.txt')
