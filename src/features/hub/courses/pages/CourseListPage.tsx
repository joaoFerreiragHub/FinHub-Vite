import { useState } from 'react'
import { ContentList } from '@/features/hub/components'
import { useCourses } from '../hooks/useCourses'
import { ContentCategory, PublishStatus } from '../../types'
import type { ContentFilters } from '../../types'
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
 * Pagina publica de lista de cursos
 */
export function CourseListPage() {
  const [filters, setFilters] = useState<ContentFilters>({
    status: PublishStatus.PUBLISHED,
    sortBy: 'recent',
    limit: 12,
  })
  const [searchTerm, setSearchTerm] = useState('')
  const activeCategory = Array.isArray(filters.category) ? '' : (filters.category ?? '')

  const { data, isLoading } = useCourses(filters)
  const allCourses = data?.items || []

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

  const filtersRecord = filters as Record<string, unknown>
  const activeLevel = (filtersRecord.level as string) || ''
  const isFreeOnly = (filtersRecord.freeOnly as boolean) || false

  const toggleFilters = [
    { label: '⭐ Premium', key: 'premium', active: filters.isPremium || false },
    { label: '🆓 Gratuitos', key: 'free', active: isFreeOnly },
    { label: '🟢 Iniciante', key: 'beginner', active: activeLevel === 'beginner' },
    { label: '🟡 Intermédio', key: 'intermediate', active: activeLevel === 'intermediate' },
    { label: '🔴 Avançado', key: 'advanced', active: activeLevel === 'advanced' },
  ]

  const handleToggleFilter = (key: string) => {
    if (key === 'premium') {
      setFilters((prev) => ({ ...prev, isPremium: prev.isPremium ? undefined : true }))
    } else if (key === 'free') {
      setFilters((prev) => ({ ...prev, freeOnly: isFreeOnly ? undefined : true }) as ContentFilters)
    } else if (['beginner', 'intermediate', 'advanced'].includes(key)) {
      setFilters(
        (prev) =>
          ({
            ...prev,
            level: activeLevel === key ? undefined : key,
          }) as ContentFilters,
      )
    }
  }

  const hasActiveFilters = !!(
    filters.isPremium ||
    isFreeOnly ||
    activeLevel ||
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
        title="🎓 Cursos"
        subtitle="Aprende sobre finanças pessoais e investimentos com cursos estruturados"
        searchPlaceholder="Pesquisar cursos..."
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
        resultLabel="Curso"
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      />

      <section className="px-4 sm:px-6 md:px-10 lg:px-12 py-8">
        <ContentList
          items={allCourses}
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
