import { useState } from 'react'
import { ContentList } from '@/features/hub/components'
import { usePodcasts } from '../hooks/usePodcasts'
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
 * Pagina publica de lista de podcasts
 */
export function PodcastListPage() {
  const [filters, setFilters] = useState<ContentFilters>({
    status: PublishStatus.PUBLISHED,
    sortBy: 'recent',
    limit: 12,
  })
  const [searchTerm, setSearchTerm] = useState('')
  const activeCategory = Array.isArray(filters.category) ? '' : (filters.category ?? '')

  const { data, isLoading } = usePodcasts(filters)
  const allPodcasts = data?.items || []

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
  const activeFrequency = (filtersRecord.frequency as string) || ''

  const toggleFilters = [
    { label: '⭐ Premium', key: 'premium', active: filters.isPremium || false },
    { label: '📅 Diário', key: 'daily', active: activeFrequency === 'daily' },
    { label: '📅 Semanal', key: 'weekly', active: activeFrequency === 'weekly' },
    { label: '📅 Quinzenal', key: 'biweekly', active: activeFrequency === 'biweekly' },
    { label: '📅 Mensal', key: 'monthly', active: activeFrequency === 'monthly' },
  ]

  const handleToggleFilter = (key: string) => {
    if (key === 'premium') {
      setFilters((prev) => ({ ...prev, isPremium: prev.isPremium ? undefined : true }))
    } else if (['daily', 'weekly', 'biweekly', 'monthly'].includes(key)) {
      setFilters(
        (prev) =>
          ({
            ...prev,
            frequency: activeFrequency === key ? undefined : key,
          }) as ContentFilters,
      )
    }
  }

  const hasActiveFilters = !!(
    filters.isPremium ||
    activeFrequency ||
    filters.category ||
    filters.search
  )

  const handleClearFilters = () => {
    setSearchTerm('')
    setFilters({ status: PublishStatus.PUBLISHED, sortBy: 'recent', limit: 12 })
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        title="🎙️ Podcasts"
        subtitle="Ouve conversas sobre finanças pessoais, investimentos e muito mais"
        searchPlaceholder="Pesquisar podcasts..."
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
        resultLabel="Podcast"
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      />

      <section className="px-4 sm:px-6 md:px-10 lg:px-12 py-8">
        <ContentList
          items={allPodcasts}
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
