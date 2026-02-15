import { useState, type FormEvent } from 'react'
import { ContentList } from '@/features/hub/components'
import { useCourses } from '../hooks/useCourses'
import { Card, Button, Input } from '@/components/ui'
import { ContentCategory } from '../../types'
import type { ContentFilters } from '../../types'

/**
 * Pagina publica de lista de cursos
 */
export function CourseListPage() {
  const [filters, setFilters] = useState<ContentFilters>({
    status: 'published',
    sortBy: 'recent',
    limit: 12,
  })
  const [searchTerm, setSearchTerm] = useState('')

  const { data, isLoading } = useCourses(filters)
  const allCourses = data?.items || []

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    setFilters((prev) => ({ ...prev, search: searchTerm }))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4 py-16">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Cursos</h1>
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Aprende sobre financas pessoais e investimentos com cursos estruturados
          </p>

          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Pesquisar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            <Button type="submit" variant="default">
              Pesquisar
            </Button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
          <aside className="space-y-6">
            <Card className="p-6">
              <h3 className="mb-4 font-semibold">Filtros</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categoria</label>
                  <select
                    value={filters.category || ''}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        category: (e.target.value as ContentCategory) || undefined,
                      }))
                    }
                    className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
                  >
                    <option value="">Todas</option>
                    <option value={ContentCategory.PERSONAL_FINANCE}>Financas Pessoais</option>
                    <option value={ContentCategory.BUDGETING}>Orcamento</option>
                    <option value={ContentCategory.SAVING}>Poupanca</option>
                    <option value={ContentCategory.DEBT}>Dividas</option>
                    <option value={ContentCategory.STOCKS}>Acoes</option>
                    <option value={ContentCategory.CRYPTO}>Crypto</option>
                    <option value={ContentCategory.BASICS}>Basico</option>
                    <option value={ContentCategory.ADVANCED}>Avancado</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Nivel</label>
                  <select
                    value={((filters as Record<string, unknown>).level as string) || ''}
                    onChange={(e) =>
                      setFilters(
                        (prev) =>
                          ({
                            ...prev,
                            level: e.target.value || undefined,
                          }) as ContentFilters,
                      )
                    }
                    className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
                  >
                    <option value="">Todos</option>
                    <option value="beginner">Iniciante</option>
                    <option value="intermediate">Intermedio</option>
                    <option value="advanced">Avancado</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Ordenar por</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        sortBy: e.target.value as 'recent' | 'popular' | 'rating' | 'views',
                      }))
                    }
                    className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
                  >
                    <option value="recent">Mais Recentes</option>
                    <option value="popular">Mais Populares</option>
                    <option value="rating">Melhor Avaliados</option>
                    <option value="views">Mais Vistos</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="premiumOnly"
                    checked={filters.isPremium || false}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        isPremium: e.target.checked || undefined,
                      }))
                    }
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="premiumOnly" className="text-sm font-medium">
                    Apenas Premium
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="freeOnly"
                    checked={((filters as Record<string, unknown>).freeOnly as boolean) || false}
                    onChange={(e) =>
                      setFilters(
                        (prev) =>
                          ({
                            ...prev,
                            freeOnly: e.target.checked || undefined,
                          }) as ContentFilters,
                      )
                    }
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="freeOnly" className="text-sm font-medium">
                    Apenas Gratuitos
                  </label>
                </div>
              </div>
            </Card>
          </aside>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {data?.total || 0} {data?.total === 1 ? 'Curso' : 'Cursos'}
              </h2>
            </div>

            <ContentList
              items={allCourses}
              variant="grid"
              columns={3}
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
          </div>
        </div>
      </div>
    </div>
  )
}
