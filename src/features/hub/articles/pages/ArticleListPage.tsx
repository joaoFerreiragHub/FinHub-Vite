import { useState } from 'react'
import { ContentList } from '@/features/hub/components'
import { useArticles } from '../hooks/useArticles'
import { Card, Button, Input } from '@/shared/ui'
import { ContentCategory } from '../../types'
import type { ArticleFilters } from '../types'

/**
 * Página pública de lista de artigos
 */
export function ArticleListPage() {
  const [filters, setFilters] = useState<ArticleFilters>({
    status: 'published',
    sortBy: 'recent',
    limit: 12,
  })

  const [searchTerm, setSearchTerm] = useState('')

  const { data, isLoading, fetchNextPage, hasNextPage } = useArticles(filters)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters({ ...filters, search: searchTerm })
  }

  const allArticles = data?.items || []

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b border-border bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4 py-16">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">📰 Artigos</h1>
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Aprende sobre finanças pessoais e investimentos com conteúdo de qualidade
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Pesquisar artigos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            <Button type="submit" variant="default">
              🔍 Pesquisar
            </Button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
          {/* Sidebar Filters */}
          <aside className="space-y-6">
            <Card padding="default">
              <h3 className="mb-4 font-semibold">Filtros</h3>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoria</label>
                <select
                  value={filters.category || ''}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      category: e.target.value as ContentCategory || undefined,
                    })
                  }
                  className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
                >
                  <option value="">Todas</option>
                  <option value={ContentCategory.PERSONAL_FINANCE}>Finanças Pessoais</option>
                  <option value={ContentCategory.BUDGETING}>Orçamento</option>
                  <option value={ContentCategory.SAVING}>Poupança</option>
                  <option value={ContentCategory.DEBT}>Dívidas</option>
                  <option value={ContentCategory.STOCKS}>Ações</option>
                  <option value={ContentCategory.CRYPTO}>Crypto</option>
                  <option value={ContentCategory.BASICS}>Básico</option>
                  <option value={ContentCategory.ADVANCED}>Avançado</option>
                </select>
              </div>

              {/* Sort Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Ordenar por</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      sortBy: e.target.value as 'recent' | 'popular' | 'rating' | 'views',
                    })
                  }
                  className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
                >
                  <option value="recent">Mais Recentes</option>
                  <option value="popular">Mais Populares</option>
                  <option value="rating">Melhor Avaliados</option>
                  <option value="views">Mais Vistos</option>
                </select>
              </div>

              {/* Premium Filter */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="premiumOnly"
                  checked={filters.isPremium || false}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      isPremium: e.target.checked || undefined,
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="premiumOnly" className="text-sm font-medium">
                  ⭐ Apenas Premium
                </label>
              </div>

              {/* Featured Filter */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featuredOnly"
                  checked={filters.isFeatured || false}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      isFeatured: e.target.checked || undefined,
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="featuredOnly" className="text-sm font-medium">
                  🌟 Em Destaque
                </label>
              </div>
            </Card>
          </aside>

          {/* Articles Grid */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {data?.total || 0} {data?.total === 1 ? 'Artigo' : 'Artigos'}
              </h2>
            </div>

            <ContentList
              items={allArticles}
              variant="grid"
              columns={3}
              isLoading={isLoading}
              hasMore={hasNextPage}
              onLoadMore={() => fetchNextPage()}
              showPagination
            />
          </div>
        </div>
      </div>
    </div>
  )
}
