import { ChangeEvent, FormEvent, useMemo, useState } from 'react'
import { Compass, Search, Users } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Button, Card } from '@/components/ui'
import LoadingSpinner from '@/components/ui/loading-spinner'
import { HomepageLayout } from '@/components/home/HomepageLayout'
import { PageHero } from '@/components/public'
import { PublicSurfaceDisabledState } from '@/features/platform/components/PublicSurfaceDisabledState'
import { usePublicSurfaceControl } from '@/features/platform/hooks/usePublicSurfaceControl'
import {
  fetchCreatorPublicationStats,
  fetchPublicCreatorsPage,
  mapCreatorFilterToContentType,
  PUBLIC_CREATOR_CONTENT_FILTER_OPTIONS,
  PublicCreatorPublicationStats,
} from '@/features/creators/services/publicCreatorsService'

type SortOption = 'followers' | 'rating' | 'newest'
type CreatorTypeFilter = (typeof PUBLIC_CREATOR_CONTENT_FILTER_OPTIONS)[number]['value']

const PAGE_SIZE = 20

const SORT_OPTIONS: Array<{ label: string; value: SortOption }> = [
  { label: 'Mais populares', value: 'followers' },
  { label: 'Melhor avaliados', value: 'rating' },
  { label: 'Mais recentes', value: 'newest' },
]

const typeLabelByKey: Record<'article' | 'video' | 'course' | 'podcast' | 'book', string> = {
  article: 'Artigos',
  video: 'Videos',
  course: 'Cursos',
  podcast: 'Podcasts',
  book: 'Livros',
}

const getInitials = (name: string, username: string): string => {
  const source = name.trim() || username.trim()
  if (!source) return 'CR'
  const parts = source.split(/\s+/)
  const first = parts[0]?.charAt(0) || source.charAt(0)
  const last = parts.length > 1 ? parts[parts.length - 1]?.charAt(0) : source.charAt(1)
  return `${first}${last || ''}`.toUpperCase()
}

const formatDate = (value?: string): string => {
  if (!value) return 'Data indisponivel'
  const parsed = Date.parse(value)
  if (!Number.isFinite(parsed)) return 'Data indisponivel'
  return new Date(parsed).toLocaleDateString('pt-PT')
}

export default function CreatorsListPage() {
  const creatorPageSurface = usePublicSurfaceControl('creator_page')
  const [searchDraft, setSearchDraft] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<SortOption>('followers')
  const [typeFilter, setTypeFilter] = useState<CreatorTypeFilter>('todos')

  const creatorsQuery = useQuery({
    queryKey: ['public-creators-page', page, sortBy, search],
    queryFn: () =>
      fetchPublicCreatorsPage({
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        sortBy,
        sortOrder: 'desc',
      }),
    staleTime: 60 * 1000,
    retry: 1,
  })

  const creators = useMemo(() => creatorsQuery.data?.items ?? [], [creatorsQuery.data])
  const creatorIds = useMemo(() => creators.map((creator) => creator.id), [creators])

  const publicationsQuery = useQuery({
    queryKey: ['public-creators-publications', creatorIds.join(',')],
    queryFn: async () => {
      const rows = await Promise.all(
        creatorIds.map(async (creatorId) => {
          const stats = await fetchCreatorPublicationStats(creatorId)
          return [creatorId, stats] as const
        }),
      )

      return rows.reduce<Record<string, PublicCreatorPublicationStats>>(
        (acc, [creatorId, stats]) => {
          acc[creatorId] = stats
          return acc
        },
        {},
      )
    },
    enabled: creatorIds.length > 0,
    staleTime: 60 * 1000,
    retry: 1,
  })

  const statsByCreator = useMemo(() => publicationsQuery.data ?? {}, [publicationsQuery.data])
  const selectedContentType = mapCreatorFilterToContentType(typeFilter)

  const filteredCreators = useMemo(() => {
    if (!selectedContentType) {
      return creators
    }

    return creators.filter((creator) => {
      const stats = statsByCreator[creator.id]
      if (stats) {
        return stats[selectedContentType] > 0
      }

      return creator.contentTypes.includes(selectedContentType)
    })
  }, [creators, selectedContentType, statsByCreator])

  const handleSubmitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPage(1)
    setSearch(searchDraft.trim())
  }

  const handleChangeSort = (event: ChangeEvent<HTMLSelectElement>) => {
    setPage(1)
    setSortBy(event.target.value as SortOption)
  }

  const handleChangeType = (value: CreatorTypeFilter) => {
    setPage(1)
    setTypeFilter(value)
  }

  const pagination = creatorsQuery.data?.pagination
  const pageLabel = pagination
    ? `Pagina ${pagination.page} de ${pagination.pages}`
    : 'Pagina 1 de 1'
  const loading = creatorsQuery.isLoading

  if (creatorPageSurface.data && !creatorPageSurface.data.enabled) {
    return (
      <HomepageLayout>
        <PublicSurfaceDisabledState
          title="Pagina de creators temporariamente indisponivel"
          message={
            creatorPageSurface.data.publicMessage ??
            'A descoberta de creators foi temporariamente desativada enquanto decorre revisao operacional.'
          }
        />
      </HomepageLayout>
    )
  }

  return (
    <HomepageLayout>
      <div className="min-h-screen bg-background">
        <PageHero
          title="Criadores em destaque"
          subtitle="Explora perfis publicos, acompanha novos especialistas e encontra o teu estilo de aprendizagem."
          searchPlaceholder="Pesquisar criadores por nome..."
          searchValue={searchDraft}
          onSearchChange={setSearchDraft}
          onSearch={() => {
            setPage(1)
            setSearch(searchDraft.trim())
          }}
          backgroundImage="https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?w=1800&q=80"
        >
          <div className="flex flex-wrap justify-center gap-2">
            <span className="filter-bar__pill border-border/40 bg-background/60 text-foreground">
              <Users className="mr-1 h-3.5 w-3.5" />
              {pagination?.total ?? creators.length} criadores
            </span>
            <span className="filter-bar__pill border-border/40 bg-background/60 text-foreground">
              <Compass className="mr-1 h-3.5 w-3.5" />
              Lista publica paginada
            </span>
          </div>
        </PageHero>

        <section className="space-y-4 px-4 py-6 sm:px-6 md:px-10 lg:px-12">
          <form
            onSubmit={handleSubmitSearch}
            className="flex flex-col gap-3 md:flex-row md:items-center"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchDraft}
                onChange={(event) => setSearchDraft(event.target.value)}
                placeholder="Pesquisar criador por nome ou username"
                className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <Button type="submit" size="sm">
              Aplicar pesquisa
            </Button>

            <select
              value={sortBy}
              onChange={handleChangeSort}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </form>

          <div className="flex flex-wrap gap-2">
            {PUBLIC_CREATOR_CONTENT_FILTER_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleChangeType(option.value)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  option.value === typeFilter
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground hover:border-primary/40'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <section className="px-4 pb-12 sm:px-6 md:px-10 lg:px-12">
          {creatorsQuery.isError ? (
            <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
              Nao foi possivel carregar a lista de criadores da API neste momento.
            </div>
          ) : null}

          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : filteredCreators.length === 0 ? (
            <div className="rounded-lg border border-border bg-card/70 p-10 text-center text-sm text-muted-foreground">
              Nenhum criador encontrado com os filtros selecionados.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredCreators.map((creator) => {
                const stats = statsByCreator[creator.id]
                const publicationCount =
                  creator.publicationsCount !== null ? creator.publicationsCount : stats?.total
                const publicationLabel =
                  typeof publicationCount === 'number'
                    ? publicationCount
                    : publicationsQuery.isLoading
                      ? '...'
                      : '--'

                return (
                  <a
                    key={creator.id}
                    href={`/creators/${encodeURIComponent(creator.username)}`}
                    className="group block"
                  >
                    <Card className="h-full border-border/70 bg-card/70 p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
                      <div className="flex items-start gap-4">
                        {creator.avatar ? (
                          <img
                            src={creator.avatar}
                            alt={creator.name}
                            className="h-14 w-14 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                            {getInitials(creator.name, creator.username)}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-base font-semibold text-foreground">
                            {creator.name}
                          </h3>
                          <p className="truncate text-xs text-muted-foreground">
                            @{creator.username}
                          </p>
                          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                            {creator.bio || 'Criador da comunidade FinHub.'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 rounded-md border border-border/60 bg-background/60 p-3 text-sm">
                        <div>
                          <p className="text-xs uppercase text-muted-foreground">Seguidores</p>
                          <p className="tabular-nums font-semibold text-foreground">
                            {creator.followersCount}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-muted-foreground">Publicacoes</p>
                          <p className="tabular-nums font-semibold text-foreground">
                            {publicationLabel}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Rating {creator.ratingAverage.toFixed(1)}</span>
                        <span>Criado em {formatDate(creator.createdAt)}</span>
                      </div>

                      {creator.contentTypes.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {creator.contentTypes.map((type) => (
                            <span
                              key={`${creator.id}-${type}`}
                              className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
                            >
                              {typeLabelByKey[type]}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </Card>
                  </a>
                )
              })}
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/70 bg-card/60 px-4 py-3 text-sm">
            <p className="text-muted-foreground">{pageLabel}</p>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!pagination || pagination.page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                Pagina anterior
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!pagination || pagination.page >= pagination.pages}
                onClick={() => setPage((current) => current + 1)}
              >
                Pagina seguinte
              </Button>
            </div>
          </div>
        </section>
      </div>
    </HomepageLayout>
  )
}
