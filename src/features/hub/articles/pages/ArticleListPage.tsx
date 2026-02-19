import { useState } from 'react'
import { ContentList } from '@/features/hub/components'
import { useArticles } from '../hooks/useArticles'
import { ContentCategory } from '../../types'
import type { ArticleFilters } from '../types'
import { PageHero, FilterBar } from '@/components/public'

const CATEGORIES = [
  { label: 'Todas', value: '' },
  { label: 'Finanças Pessoais', value: ContentCategory.PERSONAL_FINANCE },
  { label: 'Orçamento', value: ContentCategory.BUDGETING },
  { label: 'Poupança', value: ContentCategory.SAVING },
  { label: 'Dívidas', value: ContentCategory.DEBT },
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
 * Pagina publica de lista de artigos
 */
export function ArticleListPage() {
  const [filters, setFilters] = useState<ArticleFilters>({
    status: 'published',
    sortBy: 'recent',
    limit: 12,
  })
  const [searchTerm, setSearchTerm] = useState('')

  const { data, isLoading } = useArticles(filters)
  const allArticles = data?.items || []

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
    {
      label: '⭐ Premium',
      key: 'premium',
      active: filters.isPremium || false,
    },
    {
      label: '🔥 Destaque',
      key: 'featured',
      active: filters.isFeatured || false,
    },
  ]

  const handleToggleFilter = (key: string) => {
    if (key === 'premium') {
      setFilters((prev) => ({
        ...prev,
        isPremium: prev.isPremium ? undefined : true,
      }))
    } else if (key === 'featured') {
      setFilters((prev) => ({
        ...prev,
        isFeatured: prev.isFeatured ? undefined : true,
      }))
    }
  }

  const hasActiveFilters = !!(
    filters.isPremium ||
    filters.isFeatured ||
    filters.category ||
    filters.search
  )

  const handleClearFilters = () => {
    setSearchTerm('')
    setFilters({
      status: 'published',
      sortBy: 'recent',
      limit: 12,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        title="📰 Artigos"
        subtitle="Aprende sobre finanças pessoais e investimentos com conteúdo de qualidade"
        searchPlaceholder="Pesquisar artigos..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onSearch={handleSearch}
        categories={CATEGORIES}
        activeCategory={filters.category || ''}
        onCategoryChange={handleCategoryChange}
      />

      <FilterBar
        sortOptions={SORT_OPTIONS}
        sortValue={filters.sortBy || 'recent'}
        onSortChange={handleSortChange}
        toggleFilters={toggleFilters}
        onToggleFilter={handleToggleFilter}
        resultCount={data?.total}
        resultLabel="Artigo"
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      />

      <section className="px-4 sm:px-6 md:px-10 lg:px-12 py-8">
        <ContentList
          items={allArticles}
          variant="grid"
          columns={4}
          isLoading={isLoading}
          hasMore={data?.hasMore ?? false}
          onLoadMore={() =>
            setFilters((prev) => ({
              ...prev,
              limit: (prev.limit ?? 12) + 12,
            }))
          }
          showPagination
        />
      </section>
    </div>
  )
}
