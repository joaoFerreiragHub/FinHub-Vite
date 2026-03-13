import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..')
const publicDir = resolve(projectRoot, 'public')

const siteUrl = (process.env.VITE_SITE_URL || 'https://finhub.pt').replace(/\/+$/, '')
const lastMod = new Date().toISOString().slice(0, 10)

const publicRoutes = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/explorar/tudo', changefreq: 'daily', priority: '0.9' },
  { path: '/explorar/artigos', changefreq: 'daily', priority: '0.8' },
  { path: '/explorar/videos', changefreq: 'daily', priority: '0.8' },
  { path: '/explorar/cursos', changefreq: 'daily', priority: '0.8' },
  { path: '/explorar/eventos', changefreq: 'weekly', priority: '0.7' },
  { path: '/explorar/podcasts', changefreq: 'weekly', priority: '0.7' },
  { path: '/explorar/livros', changefreq: 'weekly', priority: '0.7' },
  { path: '/criadores', changefreq: 'daily', priority: '0.8' },
  { path: '/criadores/top', changefreq: 'daily', priority: '0.7' },
  { path: '/recursos', changefreq: 'weekly', priority: '0.8' },
  { path: '/recursos/corretoras', changefreq: 'weekly', priority: '0.7' },
  { path: '/recursos/plataformas', changefreq: 'weekly', priority: '0.7' },
  { path: '/recursos/exchanges', changefreq: 'weekly', priority: '0.7' },
  { path: '/recursos/apps', changefreq: 'weekly', priority: '0.7' },
  { path: '/recursos/sites', changefreq: 'weekly', priority: '0.7' },
  { path: '/recursos/podcasts', changefreq: 'weekly', priority: '0.7' },
  { path: '/recursos/livros', changefreq: 'weekly', priority: '0.7' },
  { path: '/aprender', changefreq: 'weekly', priority: '0.7' },
  { path: '/aprender/noticias', changefreq: 'daily', priority: '0.7' },
  { path: '/aprender/glossario', changefreq: 'weekly', priority: '0.6' },
  { path: '/aprender/cursos-gratuitos', changefreq: 'weekly', priority: '0.6' },
  { path: '/aprender/guias', changefreq: 'weekly', priority: '0.6' },
  { path: '/mercados', changefreq: 'daily', priority: '0.8' },
  { path: '/mercados/acoes', changefreq: 'daily', priority: '0.7' },
  { path: '/mercados/etfs', changefreq: 'daily', priority: '0.7' },
  { path: '/mercados/reits', changefreq: 'daily', priority: '0.7' },
  { path: '/mercados/cripto', changefreq: 'daily', priority: '0.7' },
  { path: '/mercados/watchlist', changefreq: 'daily', priority: '0.7' },
  { path: '/ferramentas', changefreq: 'daily', priority: '0.7' },
  { path: '/sobre', changefreq: 'monthly', priority: '0.5' },
  { path: '/contacto', changefreq: 'monthly', priority: '0.5' },
  { path: '/faq', changefreq: 'monthly', priority: '0.5' },
  { path: '/termos', changefreq: 'monthly', priority: '0.4' },
  { path: '/privacidade', changefreq: 'monthly', priority: '0.4' },
  { path: '/cookies', changefreq: 'monthly', priority: '0.4' },
  { path: '/aviso-legal', changefreq: 'monthly', priority: '0.4' },
]

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
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ]

  for (const route of publicRoutes) {
    const loc = route.path === '/' ? `${siteUrl}/` : `${siteUrl}${route.path}`
    lines.push('  <url>')
    lines.push(`    <loc>${loc}</loc>`)
    lines.push(`    <lastmod>${lastMod}</lastmod>`)
    lines.push(`    <changefreq>${route.changefreq}</changefreq>`)
    lines.push(`    <priority>${route.priority}</priority>`)
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
