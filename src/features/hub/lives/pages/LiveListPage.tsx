import { useState } from 'react'
import { ContentList } from '@/features/hub/components'
import { useLives } from '../hooks/useLives'
import { ContentCategory, PublishStatus } from '../../types'
import type { ContentFilters } from '../../types'
import { PageHero, FilterBar } from '@/components/public'

const CATEGORIES = [
  { label: 'Todas', value: '' },
  { label: 'Finanças Pessoais', value: ContentCategory.PERSONAL_FINANCE },
  { label: 'Ações', value: ContentCategory.STOCKS },
  { label: 'Crypto', value: ContentCategory.CRYPTO },
  { label: 'Básico', value: ContentCategory.BASICS },
  { label: 'Avançado', value: ContentCategory.ADVANCED },
  { label: 'Tendências', value: ContentCategory.TRENDS },
]

const SORT_OPTIONS = [
  { label: 'Mais Recentes', value: 'recent' },
  { label: 'Mais Populares', value: 'popular' },
  { label: 'Melhor Avaliados', value: 'rating' },
]

/**
 * Pagina publica de lista de eventos
 */
export function LiveListPage() {
  const [filters, setFilters] = useState<ContentFilters>({
    status: PublishStatus.PUBLISHED,
    sortBy: 'recent',
    limit: 12,
  })
  const [searchTerm, setSearchTerm] = useState('')
  const activeCategory = Array.isArray(filters.category) ? '' : (filters.category ?? '')

  const { data, isLoading } = useLives(filters)
  const allLives = data?.items || []

  const handleSearch = (term: string) => {
    setFilters((prev) => ({ ...prev, search: term }))
  }

  const handleCategoryChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      category: (value as ContentCategory) || undefined,
    }))
  }

  const handleSortChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: value as 'recent' | 'popular' | 'rating',
    }))
  }

  const filtersRecord = filters as Record<string, unknown>
  const activeEventType = (filtersRecord.eventType as string) || ''
  const isFreeOnly = (filtersRecord.freeOnly as boolean) || false

  const toggleFilters = [
    { label: '🆓 Gratuitos', key: 'free', active: isFreeOnly },
    { label: '💻 Online', key: 'online', active: activeEventType === 'online' },
    { label: '🏢 Presencial', key: 'presencial', active: activeEventType === 'presencial' },
    { label: '🔄 Híbrido', key: 'hybrid', active: activeEventType === 'hybrid' },
  ]

  const handleToggleFilter = (key: string) => {
    if (key === 'free') {
      setFilters((prev) => ({ ...prev, freeOnly: isFreeOnly ? undefined : true }) as ContentFilters)
    } else if (['online', 'presencial', 'hybrid'].includes(key)) {
      setFilters(
        (prev) =>
          ({
            ...prev,
            eventType: activeEventType === key ? undefined : key,
          }) as ContentFilters,
      )
    }
  }

  const hasActiveFilters = !!(isFreeOnly || activeEventType || filters.category || filters.search)

  const handleClearFilters = () => {
    setSearchTerm('')
    setFilters({ status: PublishStatus.PUBLISHED, sortBy: 'recent', limit: 12 })
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        title="📅 Eventos"
        subtitle="Participa em eventos ao vivo, workshops e sessões de Q&A"
        searchPlaceholder="Pesquisar eventos..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onSearch={handleSearch}
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      <FilterBar
        sortOptions={SORT_OPTIONS}
        sortValue={filters.sortBy || 'recent'}
        onSortChange={handleSortChange}
        toggleFilters={toggleFilters}
        onToggleFilter={handleToggleFilter}
        resultCount={data?.total}
        resultLabel="Evento"
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      />

      <section className="px-4 sm:px-6 md:px-10 lg:px-12 py-8">
        <ContentList
          items={allLives}
          variant="grid"
          columns={4}
          isLoading={isLoading}
          hasMore={data?.hasMore ?? false}
          onLoadMore={() => setFilters((prev) => ({ ...prev, limit: (prev.limit ?? 12) + 12 }))}
          showPagination
        />
      </section>
    </div>
  )
}
