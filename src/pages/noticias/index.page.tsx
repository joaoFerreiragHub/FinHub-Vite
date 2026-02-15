// src/pages/noticias/index.page.tsx - VERSÃO ATUALIZADA COM YAHOO FINANCE

import { useState } from 'react'
import {
  RefreshCcw,
  AlertCircle,
  TrendingUp,
  Filter,
  Settings,
  Search,
  Clock,
  Grid3X3,
  List,
  BarChart3,
} from 'lucide-react'

import SidebarLayout from '@/shared/layouts/SidebarLayout'
import { NewsGrid, CategoryFilterTabs, NewsFilters } from '@/features/hub/news/components'
import { Button } from '@/components/ui'
import { Card, CardContent } from '@/components/ui'
import { Badge } from '@/components/ui'
import { NewsArticle } from '@/features/hub/news/types'
import { useNews, useInfiniteNews } from '@/features/hub/news/hooks'

export function Page() {
  // Estados locais para UI
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  // === HOOKS ESPECIALIZADOS ===
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
    filters, // ✅ Vem do store de filtros integrado
    hasActiveFilters, // ✅ Do store de filtros
    filterSummary, // ✅ NOVO
    activeFilterCount, // ✅ NOVO
    getSourceInfo, // ✅ NOVO
    // Actions
    forceRefresh,
    nextPage,
    prevPage,
    clearError,
    testAPI,
    setSearchTerm,
    setCategory,
    setSource, // ✅ NOVO
    clearFilters,
  } = useNews({
    autoLoad: true,
    autoRefresh: true,
    refreshInterval: 5 * 60 * 1000,
  })

  const { loadMore, hasMore, isLoading: isLoadingMore, canLoadMore, progress } = useInfiniteNews()

  // === HANDLERS ===
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

  const handleTestAPI = async () => {
    try {
      const result = await testAPI()
      console.log('API Test Result:', result)
    } catch (error) {
      console.error('API Test Failed:', error)
    }
  }

  // ✅ NOVO: Handler para mudança de fonte
  const handleSourceChange = (source: string) => {
    console.log(`🔄 [Page] Changing source to: ${source}`)
    setSource(source)
  }

  // ✅ NOVO: Informações da fonte ativa
  const activeSourceInfo = getSourceInfo(filters.source || 'all')

  return (
    <SidebarLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* === HEADER === */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              📰 Notícias Financeiras
            </h1>
            <p className="text-muted-foreground mt-1">
              Últimas notícias do mercado financeiro de múltiplas fontes
              {activeSourceInfo && filters.source !== 'all' && (
                <span className="ml-2 inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-xs font-medium">
                  {activeSourceInfo.icon} {activeSourceInfo.label}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center border rounded-lg p-1">
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

            {/* Filters Toggle */}
            <Button
              variant={showFilters ? 'default' : 'outline'}
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

            {/* Refresh */}
            <Button
              onClick={handleRefresh}
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Carregando...' : 'Atualizar'}
            </Button>

            {/* Settings */}
            <Button variant="outline" size="sm" onClick={handleTestAPI}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* === FILTERS === */}
        {showFilters && (
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <NewsFilters
                filters={filters}
                onSearchChange={setSearchTerm}
                onCategoryChange={setCategory}
                onSourceChange={handleSourceChange} // ✅ NOVO
                onClearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        )}

        {/* === CATEGORY TABS === */}
        <CategoryFilterTabs
          activeCategory={filters.category}
          onCategoryChange={setCategory}
          isLoading={isLoading} // ✅ CORRIGIDO: disabled → isLoading
          categoryCounts={stats.categories} // ✅ BONUS: Mostrar contadores
        />

        {/* === STATISTICS === */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{filteredNews.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">notícias</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          {/* ✅ NOVO: Estatística específica do Yahoo Finance */}
          <Card className="border-purple-200 dark:border-purple-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Yahoo Finance</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {filteredNews.filter((n) => n.source.toLowerCase().includes('yahoo')).length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round(
                      (filteredNews.filter((n) => n.source.toLowerCase().includes('yahoo')).length /
                        Math.max(filteredNews.length, 1)) *
                        100,
                    )}
                    % do total
                  </p>
                </div>
                <div className="text-2xl">📈</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Carregadas</p>
                  <p className="text-2xl font-bold text-green-600">{loadedItems}</p>
                  <p className="text-xs text-muted-foreground mt-1">de {totalCount}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Atualização</p>
                  <p className="text-sm font-bold">{isDataFresh ? 'Recente' : 'Desatualizada'}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {cache.lastUpdate
                      ? new Date(cache.lastUpdate).toLocaleTimeString('pt-PT')
                      : 'Nunca'}
                  </p>
                </div>
                <Clock
                  className={`h-8 w-8 ${isDataFresh ? 'text-green-600' : 'text-orange-600'}`}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* === FILTER SUMMARY === */}
        {hasActiveFilters && (
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    {filterSummary}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={clearFilters} className="text-xs">
                  Limpar Todos
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* === ERROR STATE === */}
        {hasError && (
          <Card className="border-red-200 dark:border-red-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <AlertCircle className="h-8 w-8 text-red-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium text-red-800 dark:text-red-200">
                    Erro ao carregar notícias
                  </h3>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {error || 'Ocorreu um erro inesperado'}
                  </p>
                </div>
                <Button onClick={handleRefresh} variant="outline" size="sm">
                  Tentar Novamente
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* === LOADING STATE === */}
        {isInitialLoading && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <RefreshCcw className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                  <h3 className="text-lg font-medium">Carregando notícias...</h3>
                  <p className="text-muted-foreground">Buscando as últimas notícias financeiras</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* === EMPTY STATE === */}
        {isEmpty && !isLoading && !hasError && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12 space-y-4">
                <Search className="h-12 w-12 text-muted-foreground mx-auto" />
                <h3 className="text-lg font-medium">Nenhuma notícia encontrada</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {hasActiveFilters
                    ? 'Não foram encontradas notícias com os filtros aplicados. Tenta ajustar os critérios.'
                    : 'Não foi possível encontrar notícias no momento. Tenta novamente mais tarde.'}
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={handleRefresh} size="lg" className="px-8">
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Tentar Carregar
                  </Button>
                  {hasActiveFilters && (
                    <Button variant="outline" size="lg" onClick={clearFilters} className="px-8">
                      Limpar Filtros
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* === NEWS GRID === */}
        {hasNews && (
          <div className="space-y-6">
            <NewsGrid
              articles={filteredNews}
              onReadMore={handleReadMore}
              loading={isLoading}
              viewMode={viewMode}
              className="min-h-[600px]"
            />

            {/* === PAGINATION === */}
            {totalPages > 1 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Página {currentPage} de {totalPages} • {totalCount} notícias
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
                        Próxima
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* === LOAD MORE === */}
            {hasMore && (
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-6">
                      <div className="text-muted-foreground">
                        <span className="text-lg font-semibold">{progress.loaded}</span> de{' '}
                        <span className="text-lg font-semibold">{progress.total}</span> notícias
                      </div>
                      <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500"
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
                      className="px-12 py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isLoadingMore ? (
                        <>
                          <RefreshCcw className="w-5 h-5 mr-2 animate-spin" />
                          Carregando...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-5 h-5 mr-2" />
                          Carregar Mais Notícias
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* === FOOTER INFO === */}
        {hasNews && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>
                    Dados atualizados em tempo real de{' '}
                    {[...new Set(filteredNews.map((n) => n.source))].length} fonte(s) diferentes
                  </span>
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
    </SidebarLayout>
  )
}
