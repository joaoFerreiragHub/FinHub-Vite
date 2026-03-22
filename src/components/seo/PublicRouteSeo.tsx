import { Helmet } from '@/lib/helmet'
import { useLocation } from 'react-router-dom'
import { usePlatformRuntimeConfig } from '@/features/platform/hooks/usePlatformRuntimeConfig'
import { platformRuntimeConfigService } from '@/features/platform/services/platformRuntimeConfigService'

type SeoMeta = {
  title: string
  description: string
}

const withBrand = (title: string, siteName: string) => `${title} | ${siteName}`

const normalizePath = (value: string): string => {
  if (!value) return '/'
  const trimmed = value.trim()
  if (!trimmed) return '/'
  if (!trimmed.startsWith('/')) return `/${trimmed}`
  return trimmed.length > 1 && trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed
}

const resolveAbsoluteUrl = (baseUrl: string, value: string): string => {
  const normalized = value.trim()
  if (!normalized) return `${baseUrl}/vite.svg`
  if (normalized.startsWith('http://') || normalized.startsWith('https://')) return normalized
  if (normalized.startsWith('/')) return `${baseUrl}${normalized}`
  return `${baseUrl}/${normalized}`
}

const shouldIndexPath = (
  pathname: string,
  noIndexExactPaths: string[],
  noIndexPrefixes: string[],
): boolean => {
  const exact = new Set(noIndexExactPaths.map(normalizePath))
  if (exact.has(pathname)) return false

  return !noIndexPrefixes
    .map(normalizePath)
    .some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}

const resolveSeoMeta = (
  pathname: string,
  siteName: string,
  defaultDescription: string,
): SeoMeta => {
  if (pathname === '/') {
    return {
      title: withBrand('Inicio', siteName),
      description:
        'Aprende sobre financas pessoais, explora conteudos e acompanha criadores com dados reais.',
    }
  }

  if (pathname === '/explorar/tudo') {
    return {
      title: withBrand('Explorar Conteudo', siteName),
      description: 'Descobre artigos, videos, cursos, eventos, podcasts e livros num feed unico.',
    }
  }

  if (pathname.startsWith('/explorar/')) {
    return {
      title: withBrand('Explorar', siteName),
      description:
        'Pesquisa conteudo por vertical e encontra recursos relevantes para o teu perfil.',
    }
  }

  if (pathname.startsWith('/artigos/')) {
    return {
      title: withBrand('Artigo', siteName),
      description: 'Le artigo de literacia financeira com insights praticos e analise objetiva.',
    }
  }

  if (pathname.startsWith('/videos/')) {
    return {
      title: withBrand('Video', siteName),
      description: 'Assiste a videos educativos de financas e investimento na comunidade FinHub.',
    }
  }

  if (pathname.startsWith('/cursos/')) {
    return {
      title: withBrand('Curso', siteName),
      description:
        'Consulta detalhes de cursos para desenvolver conhecimentos financeiros passo a passo.',
    }
  }

  if (pathname.startsWith('/criadores/')) {
    return {
      title: withBrand('Criador', siteName),
      description: 'Conhece perfis de criadores e acompanha conteudo especializado.',
    }
  }

  if (pathname === '/criadores') {
    return {
      title: withBrand('Criadores', siteName),
      description: 'Explora criadores em destaque por tema, rating e relevancia.',
    }
  }

  if (pathname.startsWith('/recursos')) {
    return {
      title: withBrand('Recursos', siteName),
      description: 'Compara corretoras, plataformas e outros recursos com informacao centralizada.',
    }
  }

  if (pathname.startsWith('/aprender')) {
    return {
      title: withBrand('Aprender', siteName),
      description:
        'Acede a noticias, glossario e guias para consolidar a tua base de literacia financeira.',
    }
  }

  if (pathname.startsWith('/mercados') || pathname.startsWith('/stocks')) {
    return {
      title: withBrand('Mercados', siteName),
      description:
        'Analisa mercados com ferramentas praticas para acoes, ETFs, REITs, cripto e watchlist.',
    }
  }

  if (pathname === '/legal/termos' || pathname === '/termos') {
    return {
      title: withBrand('Termos e Condicoes', siteName),
      description: 'Consulta os termos e condicoes de utilizacao da plataforma FinHub.',
    }
  }

  if (pathname === '/legal/privacidade' || pathname === '/privacidade') {
    return {
      title: withBrand('Politica de Privacidade', siteName),
      description: 'Consulta a politica de privacidade e tratamento de dados da FinHub.',
    }
  }

  if (pathname === '/legal/cookies' || pathname === '/cookies') {
    return {
      title: withBrand('Politica de Cookies', siteName),
      description: 'Consulta a politica de cookies e a gestao de consentimentos na FinHub.',
    }
  }

  if (pathname === '/aviso-legal') {
    return {
      title: withBrand('Aviso Legal Financeiro', siteName),
      description:
        'Conhece o aviso legal financeiro da FinHub e os limites de responsabilidade do conteudo.',
    }
  }

  if (pathname === '/faq') {
    return {
      title: withBrand('FAQ', siteName),
      description: 'Perguntas frequentes sobre a plataforma, conteudo e operacao da FinHub.',
    }
  }

  if (pathname === '/contacto') {
    return {
      title: withBrand('Contacto', siteName),
      description: 'Entra em contacto com a equipa FinHub para suporte ou esclarecimentos.',
    }
  }

  if (pathname === '/sobre') {
    return {
      title: withBrand('Sobre', siteName),
      description: 'Conhece a visao e missao da FinHub na literacia financeira em portugues.',
    }
  }

  if (pathname === '/login') {
    return {
      title: withBrand('Entrar', siteName),
      description: 'Inicia sessao na tua conta FinHub.',
    }
  }

  if (pathname === '/registar') {
    return {
      title: withBrand('Criar Conta', siteName),
      description: 'Cria a tua conta FinHub e comeca a aprender e explorar ferramentas.',
    }
  }

  if (pathname === '/esqueci-password') {
    return {
      title: withBrand('Recuperar Password', siteName),
      description: 'Recupera o acesso a tua conta FinHub com seguranca.',
    }
  }

  if (pathname === '/reset-password') {
    return {
      title: withBrand('Redefinir Password', siteName),
      description: 'Define uma nova password para a tua conta FinHub.',
    }
  }

  if (pathname === '/verificar-email') {
    return {
      title: withBrand('Verificar Email', siteName),
      description: 'Conclui a verificacao de email da tua conta FinHub.',
    }
  }

  return {
    title: withBrand('Plataforma Financeira', siteName),
    description: defaultDescription,
  }
}

export function PublicRouteSeo() {
  const location = useLocation()
  const runtimeConfigQuery = usePlatformRuntimeConfig()
  const runtimeConfig = runtimeConfigQuery.data ?? platformRuntimeConfigService.getFallback()

  const pathname = normalizePath(location.pathname || '/')
  const siteName = runtimeConfig.seo.siteName
  const siteUrl = runtimeConfig.seo.siteUrl.replace(/\/$/, '')
  const defaultImage = resolveAbsoluteUrl(siteUrl, runtimeConfig.seo.defaultImage)
  const meta = resolveSeoMeta(pathname, siteName, runtimeConfig.seo.defaultDescription)
  const canonical = `${siteUrl}${pathname}`
  const robotsContent = shouldIndexPath(
    pathname,
    runtimeConfig.seo.noIndexExactPaths,
    runtimeConfig.seo.noIndexPrefixes,
  )
    ? 'index,follow'
    : 'noindex,nofollow'

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={defaultImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={defaultImage} />
    </Helmet>
  )
}
