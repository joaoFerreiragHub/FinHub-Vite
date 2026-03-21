import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Eye, Star } from 'lucide-react'
import { Button } from '@/components/ui'
import { ContentGrid, FilterBar, PageHero } from '@/components/public'
import { useExploreHubContent } from '../hooks/useExploreHubContent'
import {
  EXPLORE_TYPE_OPTIONS,
  isExploreContentTypeFilter,
  type ExploreContentTypeFilter,
  type ExploreSortOption,
} from '../services/exploreHubService'

const PAGE_SIZE = 12
const TYPE_QUERY_PARAM = 'tipo'
const PAGE_QUERY_PARAM = 'page'

const SORT_OPTIONS: Array<{ label: string; value: ExploreSortOption }> = [
  { label: 'Mais recentes', value: 'recent' },
  { label: 'Mais populares', value: 'popular' },
  { label: 'Melhor avaliados', value: 'rating' },
  { label: 'Mais vistos', value: 'views' },
]

const readInitialType = (): ExploreContentTypeFilter => {
  if (typeof window === 'undefined') {
    return 'todos'
  }

  const rawValue = new URLSearchParams(window.location.search).get(TYPE_QUERY_PARAM)
  if (rawValue && isExploreContentTypeFilter(rawValue)) {
    return rawValue
  }

  return 'todos'
}

const readInitialPage = (): number => {
  if (typeof window === 'undefined') {
    return 1
  }

  const rawValue = new URLSearchParams(window.location.search).get(PAGE_QUERY_PARAM)
  if (!rawValue) {
    return 1
  }

  const parsedValue = Number(rawValue)
  return Number.isFinite(parsedValue) && parsedValue > 0 ? Math.floor(parsedValue) : 1
}

const formatDate = (value?: string): string => {
  if (!value) {
    return 'Sem data'
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return 'Sem data'
  }

  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed)
}

export function ExploreHubPage() {
  const [type, setType] = useState<ExploreContentTypeFilter>(() => readInitialType())
  const [page, setPage] = useState<number>(() => readInitialPage())
  const [sort, setSort] = useState<ExploreSortOption>('recent')

  const query = useExploreHubContent({
    type,
    page,
    limit: PAGE_SIZE,
    sort,
  })

  const toggleFilters = useMemo(
    () =>
      EXPLORE_TYPE_OPTIONS.map((option) => ({
        label: option.label,
        key: option.value,
        active: type === option.value,
      })),
    [type],
  )

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const params = new URLSearchParams(window.location.search)

    if (type === 'todos') {
      params.delete(TYPE_QUERY_PARAM)
    } else {
      params.set(TYPE_QUERY_PARAM, type)
    }

    if (page <= 1) {
      params.delete(PAGE_QUERY_PARAM)
    } else {
      params.set(PAGE_QUERY_PARAM, String(page))
    }

    const nextSearch = params.toString()
    const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}`
    window.history.replaceState(null, '', nextUrl)
  }, [type, page])

  const totalPages = Math.max(1, query.data?.pagination.pages ?? 1)
  const totalResults = query.data?.pagination.total ?? 0
  const canGoPrevious = page > 1
  const canGoNext = page < totalPages

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        title="Explore Conteudos"
        subtitle="Descobre artigos, videos, cursos, podcasts e livros num feed unificado."
      />

      <FilterBar
        sortOptions={SORT_OPTIONS}
        sortValue={sort}
        onSortChange={(value) => {
          setSort(value as ExploreSortOption)
          setPage(1)
        }}
        toggleFilters={toggleFilters}
        onToggleFilter={(key) => {
          if (!isExploreContentTypeFilter(key)) {
            return
          }
          setType(key)
          setPage(1)
        }}
        resultCount={totalResults}
        resultLabel="conteudos"
        hasActiveFilters={type !== 'todos'}
        onClearFilters={() => {
          setType('todos')
          setPage(1)
        }}
      />

      <section className="space-y-6 px-4 py-8 sm:px-6 md:px-10 lg:px-12">
        {query.isError ? (
          <div className="rounded-lg border border-danger/40 bg-danger/10 p-4 text-sm text-danger">
            Nao foi possivel carregar o conteudo neste momento. Tenta novamente em instantes.
          </div>
        ) : null}

        <ContentGrid columns={4} className="px-0 py-0">
          {query.isLoading
            ? Array.from({ length: PAGE_SIZE }).map((_, index) => (
                <div
                  key={`explore-loading-${index}`}
                  className="h-[320px] animate-pulse rounded-xl border border-border/60 bg-card/60"
                />
              ))
            : query.data?.items.map((item) => (
                <a
                  key={`${item.type}-${item.id}`}
                  href={item.href}
                  className="group overflow-hidden rounded-xl border border-border/60 bg-card transition-colors hover:border-primary/40"
                >
                  <div className="relative h-40 overflow-hidden bg-muted">
                    {item.coverImage ? (
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
                        Sem imagem
                      </div>
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-background/85 px-2 py-1 text-[11px] font-medium text-foreground">
                      {item.typeLabel}
                    </span>
                  </div>

                  <div className="space-y-3 p-4">
                    <h3 className="line-clamp-2 text-base font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="line-clamp-3 text-sm text-muted-foreground">{item.description}</p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{item.authorName}</span>
                      <span>{formatDate(item.publishedAt || item.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 tabular-nums">
                        <Eye className="h-3.5 w-3.5" />
                        {item.views}
                      </span>
                      <span className="inline-flex items-center gap-1 tabular-nums">
                        <Star className="h-3.5 w-3.5" />
                        {item.averageRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </a>
              ))}

          {!query.isLoading && (query.data?.items.length ?? 0) === 0 ? (
            <div className="col-span-full rounded-xl border border-dashed border-border/80 bg-card/30 p-10 text-center text-sm text-muted-foreground">
              Nao existem resultados para este filtro neste momento.
            </div>
          ) : null}
        </ContentGrid>

        <div className="flex flex-col gap-4 rounded-lg border border-border/60 bg-card/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm text-muted-foreground tabular-nums">
            Pagina {page} de {totalPages}
          </span>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!canGoPrevious}
              onClick={() => {
                if (!canGoPrevious) return
                setPage((currentPage) => Math.max(1, currentPage - 1))
              }}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Anterior
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!canGoNext}
              onClick={() => {
                if (!canGoNext) return
                setPage((currentPage) => currentPage + 1)
              }}
            >
              Seguinte
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
