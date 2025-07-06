// src/pages/noticias/index.page.tsx - VERSÃO PROFISSIONAL

import { useState } from 'react'
import {
  RefreshCcw,
  AlertCircle,
  TrendingUp,
  Filter,
  Settings,
  Search,
  Eye,
  Clock,
} from 'lucide-react'

import SidebarLayout from '../../components/layout/SidebarLayout'
import { NewsGrid } from '../../components/noticias/NewsGrid'
import { CategoryFilterTabs } from '../../components/noticias/CategoryFilterTabs'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'

import { NewsArticle } from '../../types/news'
import { useNews, useNewsFilters, useInfiniteNews } from '../../components/noticias/api/useNews'

export function Page() {
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
    // Actions
    forceRefresh,
    nextPage,
    prevPage,
    clearError,
    testAPI,
    setItemsPerPage,
  } = useNews({
    autoLoad: true,
    autoRefresh: true,
    refreshInterval: 5 * 60 * 1000,
  })

  const { filters, hasActiveFilters, setSearchTerm, changeCategory, clearFilters } =
    useNewsFilters()

  const { loadMore, hasMore, canLoadMore, isLoading: isLoadingMore, progress } = useInfiniteNews()

  // === LOCAL STATE ===
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [itemsPerPageLocal, setItemsPerPageLocal] = useState(20)

  // === HANDLERS ===
  const handleReadMore = (article: NewsArticle) => {
    if (!article?.url) return
    window.open(article.url, '_blank', 'noopener,noreferrer')
  }

  const handleRefresh = async () => {
    await forceRefresh()
  }

  const handleCategoryChange = (category: string) => {
    changeCategory(category)
  }

  const handleSearchChange = (searchTerm: string) => {
    setSearchTerm(searchTerm)
  }

  const handleItemsPerPageChange = (count: string) => {
    const numCount = parseInt(count)
    setItemsPerPageLocal(numCount)
    setItemsPerPage(numCount)
  }

  const handleLoadMore = async () => {
    await loadMore()
  }

  // === ERROR STATE ===
  if (hasError) {
    return (
      <SidebarLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-4xl mx-auto px-6 py-20">
            <Card className="border-red-200 bg-red-50/50 dark:border-red-800/50 dark:bg-red-950/50 backdrop-blur-sm">
              <CardContent className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center shadow-lg">
                  <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-red-900 dark:text-red-100">
                  Erro ao Carregar Notícias
                </h3>
                <p className="text-red-700 dark:text-red-300 mb-8 max-w-md mx-auto">{error}</p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={handleRefresh} className="bg-red-600 hover:bg-red-700">
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Tentar Novamente
                  </Button>
                  <Button onClick={clearError} variant="outline">
                    Limpar Erro
                  </Button>
                  <Button onClick={testAPI} variant="ghost">
                    Testar Conexão
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarLayout>
    )
  }

  // === INITIAL LOADING STATE ===
  if (isInitialLoading) {
    return (
      <SidebarLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
          <div className="max-w-4xl mx-auto px-6 py-20">
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-2xl">
              <CardContent className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shadow-lg">
                  <RefreshCcw className="w-10 h-10 animate-spin text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Carregando Notícias</h3>
                <p className="text-muted-foreground text-lg">
                  A buscar as últimas notícias financeiras...
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarLayout>
    )
  }

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {/* === HERO HEADER === */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 text-white shadow-2xl">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-3">
                  <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                    Notícias Financeiras
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-blue-100">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span className="font-medium">
                        {hasNews
                          ? `${loadedItems} de ${totalCount} notícias`
                          : 'Carregando notícias...'}
                      </span>
                    </div>
                    {cache.lastUpdate && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                          Atualizado há{' '}
                          {Math.round(
                            (Date.now() - new Date(cache.lastUpdate).getTime()) / (1000 * 60),
                          )}{' '}
                          min
                        </span>
                        <Badge
                          variant={isDataFresh ? 'secondary' : 'outline'}
                          className={
                            isDataFresh
                              ? 'bg-green-500/20 text-green-100 border-green-400/30'
                              : 'bg-orange-500/20 text-orange-100 border-orange-400/30'
                          }
                        >
                          {isDataFresh ? 'Atualizado' : 'Desatualizado'}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros Avançados
                    {hasActiveFilters && (
                      <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
                        {Object.values(filters).filter(Boolean).length}
                      </Badge>
                    )}
                  </Button>

                  <Button
                    size="lg"
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="bg-white text-blue-600 hover:bg-gray-100"
                  >
                    <RefreshCcw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Atualizar
                  </Button>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>

          {/* === SEARCH BAR === */}
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Pesquisar notícias, empresas, tickers..."
                    value={filters.searchTerm || ''}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 h-12 text-lg border-0 bg-gray-50 dark:bg-gray-800 focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                </div>
                <Select
                  value={viewMode}
                  onValueChange={(value: 'grid' | 'list') => setViewMode(value)}
                >
                  <SelectTrigger className="w-40 h-12 border-0 bg-gray-50 dark:bg-gray-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">📱 Grade</SelectItem>
                    <SelectItem value="list">📋 Lista</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* === CATEGORY FILTERS === */}
          <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8">
              <CategoryFilterTabs
                activeCategory={filters.category || 'all'}
                onCategoryChange={handleCategoryChange}
                categoryCounts={stats.categories}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>

          {/* === ADVANCED FILTERS === */}
          {showAdvancedFilters && (
            <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-3">
                    <Settings className="w-5 h-5 text-blue-600" />
                    Filtros Avançados
                  </CardTitle>
                  {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                      Limpar Todos os Filtros
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Items por Página
                    </label>
                    <Select
                      value={itemsPerPageLocal.toString()}
                      onValueChange={handleItemsPerPageChange}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 notícias</SelectItem>
                        <SelectItem value="20">20 notícias</SelectItem>
                        <SelectItem value="50">50 notícias</SelectItem>
                        <SelectItem value="100">100 notícias</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Stats Cards */}
                  <div className="md:col-span-2 lg:col-span-2">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl text-white">
                        <div className="text-2xl font-bold">{stats.totalNews || 0}</div>
                        <div className="text-blue-100 text-sm">Total</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl text-white">
                        <div className="text-2xl font-bold">{stats.sources || 0}</div>
                        <div className="text-green-100 text-sm">Fontes</div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl text-white">
                        <div className="text-2xl font-bold">
                          {Object.keys(stats.categories || {}).length}
                        </div>
                        <div className="text-purple-100 text-sm">Categorias</div>
                      </div>
                      <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-xl text-white">
                        <div className="text-2xl font-bold">
                          {(stats.sentiments?.positive || 0) +
                            (stats.sentiments?.negative || 0) +
                            (stats.sentiments?.neutral || 0)}
                        </div>
                        <div className="text-orange-100 text-sm">Com Análise</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* === LOADING INDICATOR === */}
          {isLoading && hasNews && (
            <Card className="bg-blue-50/80 dark:bg-blue-950/50 backdrop-blur-sm border-blue-200 dark:border-blue-800">
              <CardContent className="py-4">
                <div className="flex items-center justify-center gap-3">
                  <RefreshCcw className="w-5 h-5 animate-spin text-blue-600" />
                  <span className="text-blue-700 dark:text-blue-300 font-medium">
                    Atualizando notícias...
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* === EMPTY STATE === */}
          {isEmpty && (
            <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Nenhuma Notícia Encontrada</h3>
                <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto">
                  {hasActiveFilters
                    ? 'Não foram encontradas notícias com os filtros aplicados. Tenta ajustar os critérios de pesquisa.'
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
              </CardContent>
            </Card>
          )}

          {/* === NEWS GRID === */}
          {hasNews && (
            <div className="space-y-8">
              <NewsGrid
                articles={filteredNews}
                onReadMore={handleReadMore}
                loading={isLoading}
                viewMode={viewMode}
                className="min-h-[600px]"
              />

              {/* === LOAD MORE === */}
              {hasMore && (
                <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-0 shadow-xl">
                  <CardContent className="py-8">
                    <div className="text-center space-y-6">
                      <div className="flex items-center justify-center gap-6">
                        <div className="text-muted-foreground">
                          <span className="text-lg font-semibold">{progress.loaded}</span> de{' '}
                          <span className="text-lg font-semibold">{progress.total}</span> notícias
                        </div>
                        <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
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
                            <RefreshCcw className="w-5 h-5 mr-3 animate-spin" />
                            Carregando...
                          </>
                        ) : (
                          <>
                            <TrendingUp className="w-5 h-5 mr-3" />
                            Carregar Mais Notícias
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* === PAGINATION === */}
              {totalPages > 1 && (
                <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-0 shadow-xl">
                  <CardContent className="py-6">
                    <div className="flex items-center justify-between">
                      <div className="text-muted-foreground">
                        Página <span className="font-semibold">{currentPage}</span> de{' '}
                        <span className="font-semibold">{totalPages}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={prevPage}
                          disabled={!hasPrevPage || isLoading}
                          className="px-6"
                        >
                          ← Anterior
                        </Button>
                        <Button
                          variant="outline"
                          onClick={nextPage}
                          disabled={!hasNextPage || isLoading}
                          className="px-6"
                        >
                          Próxima →
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* === FOOTER === */}
          <Card className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 border-0 shadow-xl">
            <CardContent className="py-6 text-center">
              {cache.lastUpdate && (
                <div className="flex items-center justify-center gap-4 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>
                    Última atualização: {new Date(cache.lastUpdate).toLocaleString('pt-PT')}
                  </span>
                  {!isDataFresh && (
                    <Badge variant="outline" className="border-orange-300 text-orange-600">
                      Dados podem estar desatualizados
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  )
}
