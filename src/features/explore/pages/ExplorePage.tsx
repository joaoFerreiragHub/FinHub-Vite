import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@/lib/reactRouterDomCompat'
import { ArrowRight } from 'lucide-react'
import { FilterBar, PageHero } from '@/components/public'
import {
  EXPLORE_KINDS,
  fetchExploreFeed,
  getExploreKindMeta,
  type ExploreContentKind,
  type ExploreContentItem,
  type ExploreSortBy,
} from '@/features/explore/services/publicExploreService'
import { ExploreContentGrid } from '@/features/explore/components/ExploreContentGrid'

const SORT_OPTIONS: Array<{ label: string; value: ExploreSortBy }> = [
  { label: 'Mais recentes', value: 'recent' },
  { label: 'Mais populares', value: 'popular' },
  { label: 'Melhor avaliados', value: 'rating' },
  { label: 'Mais vistos', value: 'views' },
]

const FEATURED_LIMIT = 12
const SECTION_LIMIT = 4

const EMPTY_SECTION_MESSAGE = 'Sem conteudo disponivel nesta vertical por agora.'

const getSectionLabel = (kind: ExploreContentKind): string => getExploreKindMeta(kind).label

const getSectionPath = (kind: ExploreContentKind): string => getExploreKindMeta(kind).listPath

interface SectionBlockProps {
  kind: ExploreContentKind
  items: ExploreContentItem[]
}

const SectionBlock = ({ kind, items }: SectionBlockProps) => (
  <section className="space-y-4">
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-xl font-semibold text-foreground">{getSectionLabel(kind)}</h2>
      <Link
        to={getSectionPath(kind)}
        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        Ver tudo
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>

    <ExploreContentGrid items={items} emptyMessage={EMPTY_SECTION_MESSAGE} />
  </section>
)

export default function ExplorePage() {
  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<ExploreSortBy>('recent')

  const query = useQuery({
    queryKey: ['explore-feed', searchTerm, sortBy],
    queryFn: () =>
      fetchExploreFeed({
        search: searchTerm || undefined,
        sortBy,
        perTypeLimit: 8,
      }),
    staleTime: 60 * 1000,
    retry: 1,
  })

  const featuredItems = useMemo(
    () => (query.data?.items ?? []).slice(0, FEATURED_LIMIT),
    [query.data?.items],
  )

  const hasActiveFilters = searchTerm.length > 0 || sortBy !== 'recent'

  const handleSearch = (term: string) => {
    setSearchTerm(term.trim())
  }

  const handleClearFilters = () => {
    setSearchInput('')
    setSearchTerm('')
    setSortBy('recent')
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        title="Explorar Tudo"
        subtitle="Descobre artigos, videos, cursos, eventos, podcasts e livros num unico feed."
        searchPlaceholder="Pesquisar em todo o catalogo..."
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSearch={handleSearch}
      />

      <FilterBar
        sortOptions={SORT_OPTIONS}
        sortValue={sortBy}
        onSortChange={(value) => setSortBy(value as ExploreSortBy)}
        resultCount={query.data?.items.length ?? 0}
        resultLabel="resultados"
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      />

      <div className="space-y-10 px-4 py-8 sm:px-6 md:px-10 lg:px-12">
        {query.isError ? (
          <div className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300">
            Nao foi possivel carregar o feed agregado agora. Tenta novamente em instantes.
          </div>
        ) : null}

        {query.data?.hasErrors ? (
          <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-200">
            Algumas fontes podem estar temporariamente indisponiveis, mas o restante conteudo foi
            carregado.
          </div>
        ) : null}

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Mais relevantes agora</h2>
          <ExploreContentGrid
            items={featuredItems}
            isLoading={query.isLoading}
            emptyMessage="Nao ha resultados para os filtros atuais."
          />
        </section>

        {EXPLORE_KINDS.map((kind) => (
          <SectionBlock
            key={kind}
            kind={kind}
            items={(query.data?.byKind[kind] ?? []).slice(0, SECTION_LIMIT)}
          />
        ))}
      </div>
    </div>
  )
}
