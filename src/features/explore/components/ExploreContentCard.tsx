import { Eye, Star } from 'lucide-react'
import type { ExploreContentItem } from '@/features/explore/services/publicExploreService'

interface ExploreContentCardProps {
  item: ExploreContentItem
}

const CATEGORY_LABELS: Record<string, string> = {
  personal_finance: 'Financas pessoais',
  budgeting: 'Orcamento',
  saving: 'Poupanca',
  debt: 'Dividas',
  stocks: 'Acoes',
  crypto: 'Crypto',
  real_estate: 'Imobiliario',
  funds: 'Fundos',
  basics: 'Basico',
  advanced: 'Avancado',
  trends: 'Tendencias',
  news: 'Noticias',
}

const TYPE_LABELS: Record<ExploreContentItem['type'], string> = {
  article: 'Artigo',
  video: 'Video',
  course: 'Curso',
  event: 'Evento',
  podcast: 'Podcast',
  book: 'Livro',
}

const toCategoryLabel = (value: string): string => {
  const normalized = value.trim().toLowerCase().replace(/\s+/g, '_')
  if (CATEGORY_LABELS[normalized]) return CATEGORY_LABELS[normalized]
  if (!normalized) return 'Geral'
  return normalized.replace(/_/g, ' ').replace(/\b\w/g, (match) => match.toUpperCase())
}

const formatCompactNumber = (value: number): string => {
  if (!Number.isFinite(value) || value <= 0) return '0'
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return `${Math.round(value)}`
}

const formatDate = (value?: string): string => {
  if (!value) return 'data indisponivel'

  const parsed = Date.parse(value)
  if (Number.isNaN(parsed)) return 'data indisponivel'

  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(parsed))
}

export function ExploreContentCard({ item }: ExploreContentCardProps) {
  const publishedAt = item.publishedAt || item.createdAt

  return (
    <article className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <a href={item.href} className="block">
        <div className="relative h-44 overflow-hidden bg-muted">
          {item.coverImage ? (
            <img
              src={item.coverImage}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-slate-700/40 via-slate-500/30 to-slate-800/50" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          <div className="absolute left-3 top-3 flex items-center gap-2">
            <span className="rounded-full bg-black/55 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
              {TYPE_LABELS[item.type]}
            </span>
            {item.isPremium ? (
              <span className="rounded-full bg-amber-500/90 px-2 py-1 text-[11px] font-semibold text-black">
                Premium
              </span>
            ) : null}
          </div>
        </div>

        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border border-border/60 bg-background/70 px-2 py-0.5">
              {toCategoryLabel(item.category)}
            </span>
            <span>{formatDate(publishedAt)}</span>
          </div>

          <h3 className="line-clamp-2 text-base font-semibold text-foreground">{item.title}</h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="truncate">{item.authorName}</span>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {formatCompactNumber(item.viewCount)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Star className="h-3.5 w-3.5 text-amber-400" />
                {item.averageRating.toFixed(1)} ({formatCompactNumber(item.ratingCount)})
              </span>
            </div>
          </div>
        </div>
      </a>
    </article>
  )
}
