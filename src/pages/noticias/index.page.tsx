import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  BarChart3,
  Clock,
  Filter,
  Grid3X3,
  List,
  RefreshCcw,
  Search,
  Settings,
  TrendingUp,
} from 'lucide-react'

import { HomepageLayout } from '@/components/home/HomepageLayout'
import { PageHero } from '@/components/public'
import { NewsGrid, CategoryFilterTabs, NewsFilters } from '@/features/hub/news/components'
import { Button, Card, CardContent, Badge } from '@/components/ui'
import { NewsArticle } from '@/features/hub/news/types'
import { useNews, useInfiniteNews } from '@/features/hub/news/hooks'
import { MarketSubNav } from '@/pages/mercados/_components/MarketSubNav'

export function Page() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [searchInput, setSearchInput] = useState('')

  const {
    filteredNews,
    stats,
    isLoading,
    isInitialLoading,
    hasError,
    error,
    hasNews,
    isEmpty,
    isDataFresh,
    totalCount,
    loadedItems,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    cache,
    filters,
    hasActiveFilters,
    filterSummary,
    activeFilterCount,
    getSourceInfo,
    forceRefresh,
    nextPage,
    prevPage,
    clearError,
    testAPI,
    setSearchTerm,
    setCategory,
    setSource,
    clearFilters,
  } = useNews({
    autoLoad: true,
    autoRefresh: true,
    refreshInterval: 5 * 60 * 1000,
  })

  const { loadMore, hasMore, isLoading: isLoadingMore, canLoadMore, progress } = useInfiniteNews()

  useEffect(() => {
    setSearchInput(filters.searchTerm || '')
  }, [filters.searchTerm])

  const yahooCount = useMemo(
    () => filteredNews.filter((article) => article.source.toLowerCase().includes('yahoo')).length,
    [filteredNews],
  )

  const uniqueSourceCount = useMemo(
    () => new Set(filteredNews.map((article) => article.source)).size,
    [filteredNews],
  )

  const isNetworkError = /failed to fetch|network|econnrefused/i.test(error || '')
  const showApiFallback = hasError && !isInitialLoading && !hasNews

  const handleRefresh = () => {
    clearError()
    forceRefresh()
  }

  const handleReadMore = (article: NewsArticle) => {
    window.open(article.url, '_blank', 'noopener,noreferrer')
  }

  const handleLoadMore = () => {
    if (canLoadMore && !isLoadingMore) {
      loadMore()
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term.trim())
  }

  const handleSourceChange = (source: string) => {
    setSource(source)
  }

  const activeSourceInfo = getSourceInfo(filters.source || 'all')

  return (
    <HomepageLayout>
      <div className="min-h-screen bg-background">
        <PageHero
          title="Noticias Financeiras"
          subtitle="Acompanha mercado, economia e empresas numa vista limpa e rapida."
          searchPlaceholder="Pesquisar noticias..."
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          onSearch={handleSearch}
          compact
          backgroundImage="https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1800&q=80"
        />

        <div className="px-4 pt-4 sm:px-6 md:px-10 lg:px-12">
          <MarketSubNav current="/mercados/noticias" />
        </div>

        <div className="sticky top-14 z-40 border-b border-border/50 bg-background/85 backdrop-blur-md md:top-16">
          <div className="flex items-center justify-between gap-3 overflow-x-auto px-4 py-3 sm:px-6 md:px-10 lg:px-12">
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-lg border border-border/60 bg-card/50 p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 w-8 p-0"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant={showFilters ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtros
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>

              <Badge variant="outline" className="gap-1 border-border/60 bg-card/50">
                {activeSourceInfo?.icon || 'Web'} {activeSourceInfo?.label || 'Todas as Fontes'}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleRefresh}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">
                  {isLoading ? 'A atualizar...' : 'Atualizar'}
                </span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => testAPI()} className="h-8 w-8 p-0">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6 px-4 py-6 sm:px-6 md:px-10 lg:px-12">
          {showFilters && (
            <Card className="border border-primary/30 bg-card/70 backdrop-blur-sm">
              <CardContent className="pt-6">
                <NewsFilters
                  filters={filters}
                  onSearchChange={setSearchTerm}
                  onCategoryChange={setCategory}
                  onSourceChange={handleSourceChange}
                  onClearFilters={clearFilters}
                  hasActiveFilters={hasActiveFilters}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          )}

          {showApiFallback ? (
            <Card className="border-amber-500/40 bg-card/85 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 py-6 text-center">
                  <AlertCircle className="h-10 w-10 text-amber-500" />
                  <h3 className="text-xl font-semibold text-foreground">
                    Nao estamos a conseguir carregar as noticias
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Houve um problema ao ligar a API. Tenta novamente dentro de momentos.
                  </p>
                  {isNetworkError && (
                    <p className="text-xs text-muted-foreground">
                      Verifica se a API local esta ativa em http://localhost:5000/api.
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap justify-center gap-3">
                    <Button onClick={handleRefresh}>
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Tentar novamente
                    </Button>
                    <Button variant="outline" onClick={() => testAPI()}>
                      Testar ligacao
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <CategoryFilterTabs
                activeCategory={filters.category || 'all'}
                onCategoryChange={setCategory}
                isLoading={isLoading}
                categoryCounts={stats.categories}
              />

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <Card className="border border-border/60 bg-card/70 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold text-foreground">{filteredNews.length}</p>
                        <p className="mt-1 text-xs text-muted-foreground">noticias filtradas</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-purple-500/40 bg-card/70 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Yahoo</p>
                        <p className="text-2xl font-bold text-purple-400">{yahooCount}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {Math.round((yahooCount / Math.max(filteredNews.length, 1)) * 100)}% do
                          total
                        </p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-emerald-500/30 bg-card/70 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Carregadas</p>
                        <p className="text-2xl font-bold text-emerald-400">{loadedItems}</p>
                        <p className="mt-1 text-xs text-muted-foreground">de {totalCount}</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-emerald-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-orange-500/30 bg-card/70 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Atualizacao</p>
                        <p className="text-sm font-semibold text-foreground">
                          {isDataFresh ? 'Recente' : 'Desatualizada'}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {cache.lastUpdate
                            ? new Date(cache.lastUpdate).toLocaleTimeString('pt-PT')
                            : 'Nunca'}
                        </p>
                      </div>
                      <Clock
                        className={`h-8 w-8 ${isDataFresh ? 'text-emerald-400' : 'text-orange-400'}`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {hasActiveFilters && !showApiFallback && (
            <Card className="border border-primary/40 bg-gradient-to-r from-primary/15 via-primary/10 to-transparent">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Filter className="h-4 w-4 text-primary" />
                    {filterSummary}
                  </div>
                  <Button variant="outline" size="sm" onClick={clearFilters} className="text-xs">
                    Limpar todos
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {hasError && !showApiFallback && (
            <Card className="border-red-500/40 bg-card/80">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="h-8 w-8 shrink-0 text-red-500" />
                  <div className="flex-1 space-y-2">
                    <h3 className="font-medium text-red-300">Erro ao carregar noticias</h3>
                    <p className="text-sm text-red-200/90">
                      {error || 'Ocorreu um erro inesperado'}
                    </p>
                    {isNetworkError && (
                      <p className="text-xs text-red-200/80">
                        Verifica se a API local esta ativa em http://localhost:5000/api.
                      </p>
                    )}
                  </div>
                  <Button onClick={handleRefresh} variant="outline" size="sm">
                    Tentar novamente
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {isInitialLoading && (
            <Card className="bg-card/70 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex justify-center py-12">
                  <div className="space-y-3 text-center">
                    <RefreshCcw className="mx-auto h-8 w-8 animate-spin text-primary" />
                    <h3 className="text-lg font-medium text-foreground">A carregar noticias...</h3>
                    <p className="text-muted-foreground">
                      A obter as ultimas atualizacoes do mercado.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {isEmpty && !isLoading && !hasError && (
            <Card className="border border-border/60 bg-card/70">
              <CardContent className="pt-6">
                <div className="space-y-4 py-12 text-center">
                  <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-medium text-foreground">Sem noticias para mostrar</h3>
                  <p className="mx-auto max-w-md text-muted-foreground">
                    {hasActiveFilters
                      ? 'Nao foram encontradas noticias com estes filtros. Ajusta os criterios.'
                      : 'Neste momento o feed principal nao devolveu noticias. Tenta atualizar.'}
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button onClick={handleRefresh} size="lg" className="px-8">
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Atualizar
                    </Button>
                    {hasActiveFilters && (
                      <Button variant="outline" size="lg" onClick={clearFilters} className="px-8">
                        Limpar filtros
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {hasNews && (
            <div className="space-y-6">
              <NewsGrid
                articles={filteredNews}
                onReadMore={handleReadMore}
                loading={isLoading}
                viewMode={viewMode}
                className="min-h-[600px]"
              />

              {totalPages > 1 && (
                <Card className="border border-border/60 bg-card/70 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Pagina {currentPage} de {totalPages} - {totalCount} noticias
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={prevPage}
                          disabled={!hasPrevPage || isLoading}
                        >
                          Anterior
                        </Button>
                        <Button
                          variant="outline"
                          onClick={nextPage}
                          disabled={!hasNextPage || isLoading}
                        >
                          Proxima
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {hasMore && (
                <Card className="border border-primary/40 bg-gradient-to-r from-primary/10 via-primary/15 to-transparent">
                  <CardContent className="pt-6">
                    <div className="space-y-4 text-center">
                      <div className="flex flex-wrap items-center justify-center gap-4">
                        <div className="text-muted-foreground">
                          <span className="text-lg font-semibold text-foreground">
                            {progress.loaded}
                          </span>{' '}
                          de{' '}
                          <span className="text-lg font-semibold text-foreground">
                            {progress.total}
                          </span>{' '}
                          noticias
                        </div>
                        <div className="h-3 w-56 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400 transition-all duration-500"
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>
                        <Badge variant="outline" className="px-3 py-1">
                          {progress.percentage}%
                        </Badge>
                      </div>

                      <Button
                        onClick={handleLoadMore}
                        disabled={!canLoadMore || isLoadingMore}
                        size="lg"
                        className="px-12"
                      >
                        {isLoadingMore ? (
                          <>
                            <RefreshCcw className="mr-2 h-5 w-5 animate-spin" />A carregar...
                          </>
                        ) : (
                          <>
                            <TrendingUp className="mr-2 h-5 w-5" />
                            Carregar mais noticias
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {hasNews && (
            <Card className="border border-border/60 bg-card/70 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-center text-sm text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                    <span>Feed ativo com {uniqueSourceCount} fonte(s) no resultado atual.</span>
                  </div>
                  {filters.source && filters.source !== 'all' && (
                    <div className="mt-2 text-xs">
                      Filtrado por: {activeSourceInfo?.icon} {activeSourceInfo?.label}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </HomepageLayout>
  )
}
