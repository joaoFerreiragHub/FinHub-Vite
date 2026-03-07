import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FilterBar, PageHero } from '@/components/public'
import {
  fetchExploreByKind,
  type ExploreContentKind,
  type ExploreSortBy,
} from '@/features/explore/services/publicExploreService'
import { ExploreContentGrid } from './ExploreContentGrid'

const SORT_OPTIONS: Array<{ label: string; value: ExploreSortBy }> = [
  { label: 'Mais recentes', value: 'recent' },
  { label: 'Mais populares', value: 'popular' },
  { label: 'Melhor avaliados', value: 'rating' },
  { label: 'Mais vistos', value: 'views' },
]

interface ExploreCollectionPageProps {
  kind: ExploreContentKind
  title: string
  subtitle: string
  searchPlaceholder: string
}

export function ExploreCollectionPage({
  kind,
  title,
  subtitle,
  searchPlaceholder,
}: ExploreCollectionPageProps) {
  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<ExploreSortBy>('recent')

  const query = useQuery({
    queryKey: ['explore-collection', kind, searchTerm, sortBy],
    queryFn: () =>
      fetchExploreByKind(kind, {
        search: searchTerm || undefined,
        sortBy,
        limit: 24,
      }),
    staleTime: 60 * 1000,
    retry: 1,
  })

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
        title={title}
        subtitle={subtitle}
        searchPlaceholder={searchPlaceholder}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSearch={handleSearch}
      />

      <FilterBar
        sortOptions={SORT_OPTIONS}
        sortValue={sortBy}
        onSortChange={(value) => setSortBy(value as ExploreSortBy)}
        resultCount={query.data?.length ?? 0}
        resultLabel="resultados"
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      />

      <section className="px-4 py-8 sm:px-6 md:px-10 lg:px-12">
        {query.isError ? (
          <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300">
            Nao foi possivel carregar esta lista agora. Tenta novamente em instantes.
          </div>
        ) : null}

        <ExploreContentGrid
          items={query.data ?? []}
          isLoading={query.isLoading}
          emptyMessage="Sem conteudo com os filtros selecionados."
        />
      </section>
    </div>
  )
}

