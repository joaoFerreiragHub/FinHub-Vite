import { useState } from 'react'
import { ContentList } from '@/features/hub/components'
import { useBooks } from '../hooks/useBooks'
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
]

const SORT_OPTIONS = [
  { label: 'Mais Recentes', value: 'recent' },
  { label: 'Mais Populares', value: 'popular' },
  { label: 'Melhor Avaliados', value: 'rating' },
  { label: 'Mais Vistos', value: 'views' },
]

/**
 * Pagina publica de lista de livros
 */
export function BookListPage() {
  const [filters, setFilters] = useState<ContentFilters>({
    status: PublishStatus.PUBLISHED,
    sortBy: 'recent',
    limit: 12,
  })
  const [searchTerm, setSearchTerm] = useState('')
  const activeCategory = Array.isArray(filters.category) ? '' : (filters.category ?? '')

  const { data, isLoading } = useBooks(filters)
  const allBooks = data?.items || []

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
      sortBy: value as 'recent' | 'popular' | 'rating' | 'views',
    }))
  }

  const toggleFilters = [
    { label: '⭐ Premium', key: 'premium', active: filters.isPremium || false },
  ]

  const handleToggleFilter = (key: string) => {
    if (key === 'premium') {
      setFilters((prev) => ({ ...prev, isPremium: prev.isPremium ? undefined : true }))
    }
  }

  const hasActiveFilters = !!(filters.isPremium || filters.category || filters.search)

  const handleClearFilters = () => {
    setSearchTerm('')
    setFilters({ status: PublishStatus.PUBLISHED, sortBy: 'recent', limit: 12 })
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        title="📚 Livros"
        subtitle="Descobre os melhores livros sobre finanças pessoais e investimentos"
        searchPlaceholder="Pesquisar livros..."
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
        resultLabel="Livro"
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      />

      <section className="px-4 sm:px-6 md:px-10 lg:px-12 py-8">
        <ContentList
          items={allBooks}
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
