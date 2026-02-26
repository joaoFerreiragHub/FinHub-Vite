import type { PublicDirectoryVertical } from '@/features/markets/services/editorialPublicApi'

export interface EditorialVerticalRouteConfig {
  slug: string
  apiVertical: PublicDirectoryVertical
  label: string
  description: string
}

export const EDITORIAL_VERTICALS: EditorialVerticalRouteConfig[] = [
  {
    slug: 'corretoras',
    apiVertical: 'broker',
    label: 'Corretoras',
    description: 'Plataformas para negociacao de ativos com foco em seguranca e custos.',
  },
  {
    slug: 'exchanges',
    apiVertical: 'exchange',
    label: 'Exchanges',
    description: 'Exchanges para mercado cripto com filtros por reputacao e verificacao.',
  },
  {
    slug: 'sites',
    apiVertical: 'site',
    label: 'Sites',
    description: 'Portais e fontes de informacao para acompanhar o mercado.',
  },
  {
    slug: 'apps',
    apiVertical: 'app',
    label: 'Apps',
    description: 'Aplicacoes para acompanhamento, analise e execucao.',
  },
  {
    slug: 'podcasts',
    apiVertical: 'podcast',
    label: 'Podcasts',
    description: 'Conteudo em audio para estudo continuo do mercado.',
  },
  {
    slug: 'eventos',
    apiVertical: 'event',
    label: 'Eventos',
    description: 'Eventos e conferencias para networking e atualizacao tecnica.',
  },
  {
    slug: 'outros',
    apiVertical: 'other',
    label: 'Outros',
    description: 'Recursos complementares que nao entram noutras categorias.',
  },
]

export const getEditorialVerticalBySlug = (slug: string): EditorialVerticalRouteConfig | null => {
  const normalized = slug.toLowerCase().trim()
  return EDITORIAL_VERTICALS.find((item) => item.slug === normalized) ?? null
}
