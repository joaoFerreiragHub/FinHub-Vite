import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

type SeoMeta = {
  title: string
  description: string
}

const SITE_NAME = 'FinHub'
const DEFAULT_DESCRIPTION =
  'Plataforma de literacia financeira com conteudo, criadores e ferramentas para melhorar decisoes de investimento.'
const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://finhub.pt').replace(/\/$/, '')
const DEFAULT_IMAGE = `${SITE_URL}/vite.svg`
const NO_INDEX_EXACT_PATHS = new Set([
  '/login',
  '/registar',
  '/esqueci-password',
  '/reset-password',
  '/verificar-email',
  '/conta',
  '/meus-favoritos',
  '/a-seguir',
  '/notificacoes',
])
const NO_INDEX_PREFIXES = ['/admin', '/dashboard', '/oauth']

const withBrand = (title: string) => `${title} | ${SITE_NAME}`

const shouldIndexPath = (pathname: string): boolean => {
  if (NO_INDEX_EXACT_PATHS.has(pathname)) return false
  return !NO_INDEX_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

const resolveSeoMeta = (pathname: string): SeoMeta => {
  if (pathname === '/') {
    return {
      title: withBrand('Inicio'),
      description:
        'Aprende sobre financas pessoais, explora conteudos e acompanha criadores com dados reais.',
    }
  }

  if (pathname === '/explorar/tudo') {
    return {
      title: withBrand('Explorar Conteudo'),
      description: 'Descobre artigos, videos, cursos, eventos, podcasts e livros num feed unico.',
    }
  }

  if (pathname.startsWith('/explorar/')) {
    return {
      title: withBrand('Explorar'),
      description:
        'Pesquisa conteudo por vertical e encontra recursos relevantes para o teu perfil.',
    }
  }

  if (pathname.startsWith('/artigos/')) {
    return {
      title: withBrand('Artigo'),
      description: 'Le artigo de literacia financeira com insights praticos e analise objetiva.',
    }
  }

  if (pathname.startsWith('/videos/')) {
    return {
      title: withBrand('Video'),
      description: 'Assiste a videos educativos de financas e investimento na comunidade FinHub.',
    }
  }

  if (pathname.startsWith('/cursos/')) {
    return {
      title: withBrand('Curso'),
      description:
        'Consulta detalhes de cursos para desenvolver conhecimentos financeiros passo a passo.',
    }
  }

  if (pathname.startsWith('/criadores/')) {
    return {
      title: withBrand('Criador'),
      description: 'Conhece perfis de criadores e acompanha conteudo especializado.',
    }
  }

  if (pathname === '/criadores') {
    return {
      title: withBrand('Criadores'),
      description: 'Explora criadores em destaque por tema, rating e relevancia.',
    }
  }

  if (pathname.startsWith('/recursos')) {
    return {
      title: withBrand('Recursos'),
      description: 'Compara corretoras, plataformas e outros recursos com informacao centralizada.',
    }
  }

  if (pathname.startsWith('/aprender')) {
    return {
      title: withBrand('Aprender'),
      description:
        'Acede a noticias, glossario e guias para consolidar a tua base de literacia financeira.',
    }
  }

  if (pathname.startsWith('/mercados') || pathname.startsWith('/stocks')) {
    return {
      title: withBrand('Mercados'),
      description:
        'Analisa mercados com ferramentas praticas para acoes, ETFs, REITs, cripto e watchlist.',
    }
  }

  if (pathname === '/termos') {
    return {
      title: withBrand('Termos e Condicoes'),
      description: 'Consulta os termos e condicoes de utilizacao da plataforma FinHub.',
    }
  }

  if (pathname === '/privacidade') {
    return {
      title: withBrand('Politica de Privacidade'),
      description: 'Consulta a politica de privacidade e tratamento de dados da FinHub.',
    }
  }

  if (pathname === '/cookies') {
    return {
      title: withBrand('Politica de Cookies'),
      description: 'Consulta a politica de cookies e a gestao de consentimentos na FinHub.',
    }
  }

  if (pathname === '/aviso-legal') {
    return {
      title: withBrand('Aviso Legal Financeiro'),
      description:
        'Conhece o aviso legal financeiro da FinHub e os limites de responsabilidade do conteudo.',
    }
  }

  if (pathname === '/faq') {
    return {
      title: withBrand('FAQ'),
      description: 'Perguntas frequentes sobre a plataforma, conteudo e operacao da FinHub.',
    }
  }

  if (pathname === '/contacto') {
    return {
      title: withBrand('Contacto'),
      description: 'Entra em contacto com a equipa FinHub para suporte ou esclarecimentos.',
    }
  }

  if (pathname === '/sobre') {
    return {
      title: withBrand('Sobre'),
      description: 'Conhece a visao e missao da FinHub na literacia financeira em portugues.',
    }
  }

  if (pathname === '/login') {
    return {
      title: withBrand('Entrar'),
      description: 'Inicia sessao na tua conta FinHub.',
    }
  }

  if (pathname === '/registar') {
    return {
      title: withBrand('Criar Conta'),
      description: 'Cria a tua conta FinHub e comeca a aprender e explorar ferramentas.',
    }
  }

  if (pathname === '/esqueci-password') {
    return {
      title: withBrand('Recuperar Password'),
      description: 'Recupera o acesso a tua conta FinHub com seguranca.',
    }
  }

  if (pathname === '/reset-password') {
    return {
      title: withBrand('Redefinir Password'),
      description: 'Define uma nova password para a tua conta FinHub.',
    }
  }

  if (pathname === '/verificar-email') {
    return {
      title: withBrand('Verificar Email'),
      description: 'Conclui a verificacao de email da tua conta FinHub.',
    }
  }

  return {
    title: withBrand('Plataforma Financeira'),
    description: DEFAULT_DESCRIPTION,
  }
}

export function PublicRouteSeo() {
  const location = useLocation()
  const pathname = location.pathname || '/'
  const meta = resolveSeoMeta(pathname)
  const canonical = `${SITE_URL}${pathname}`
  const robotsContent = shouldIndexPath(pathname) ? 'index,follow' : 'noindex,nofollow'

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={DEFAULT_IMAGE} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={DEFAULT_IMAGE} />
    </Helmet>
  )
}
