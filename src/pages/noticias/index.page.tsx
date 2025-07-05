// src/pages/noticias/index.page.tsx (ATUALIZADA)
import { useState, useEffect } from 'react'
import { RefreshCcw, Settings } from 'lucide-react'

import SidebarLayout from '../../components/layout/SidebarLayout'
import { NewsHeader } from '../../components/noticias/NewsHeader'
import { NewsFilters } from '../../components/noticias/NewsFilters'
import { NewsGrid } from '../../components/noticias/NewsGrid'
import { NewsStats } from '../../components/noticias/NewsStats'
import { Button } from '../../components/ui/button'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { NewsArticle } from '../../types/news'
import { useNews } from '../../components/noticias/api/useNews'

export function Page() {
  const {
    news,
    isLoading,
    isInitialLoading,
    hasError,
    error,
    hasNews,
    isEmpty,
    isDataFresh,
    needsRefresh,
    lastUpdate,
    stats,

    // Filtros
    filters,
    setSearchTerm,
    setCategory,
    clearFilters,
    hasActiveFilters,

    // Paginação
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,

    // Actions
    forceRefresh,
    clearError,
  } = useNews({
    autoLoad: true,
    autoRefresh: true,
    refreshInterval: 10 * 60 * 1000, // 10 minutos
  })

  const [showSettings, setShowSettings] = useState(false)

  // === HANDLERS ===
  const handleReadMore = (article: NewsArticle) => {
    if (!article?.url) {
      console.warn('❌ Artigo sem URL:', article)
      return
    }

    // Abrir em nova janela
    window.open(article.url, '_blank', 'noopener,noreferrer')

    // Log para analytics (opcional)
    console.log('📰 Artigo aberto:', article.title)
  }

  const handleRefresh = () => {
    console.log('🔄 Refresh manual solicitado')
    forceRefresh()
  }

  const handleSettings = () => {
    setShowSettings(!showSettings)
    console.log('⚙️ Configurações:', showSettings ? 'fechadas' : 'abertas')
  }

  // === DEBUG (apenas em desenvolvimento) ===
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('📰 News Page State:', {
        newsCount: news?.length,
        isLoading,
        hasError,
        isDataFresh,
        needsRefresh,
        lastUpdate: lastUpdate?.toISOString(),
        filters,
      })
    }
  }, [news?.length, isLoading, hasError, isDataFresh, needsRefresh, lastUpdate, filters])

  // === ERROR STATE ===
  if (hasError) {
    return (
      <SidebarLayout>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Erro ao Carregar Notícias</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleRefresh}>
                <RefreshCcw className="w-4 h-4 mr-2" />
                Tentar Novamente
              </Button>
              <Button variant="outline" onClick={clearError}>
                Limpar Erro
              </Button>
            </div>
          </div>
        </div>
      </SidebarLayout>
    )
  }

  // === INITIAL LOADING STATE ===
  if (isInitialLoading) {
    return (
      <SidebarLayout>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <RefreshCcw className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Carregando Notícias</h3>
            <p className="text-muted-foreground">A buscar as últimas notícias financeiras...</p>
          </div>
        </div>
      </SidebarLayout>
    )
  }

  // === EMPTY STATE ===
  if (isEmpty) {
    return (
      <SidebarLayout>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <NewsHeader
            lastUpdate={lastUpdate}
            onRefresh={handleRefresh}
            onSettings={handleSettings}
            isLoading={isLoading}
            isDataFresh={isDataFresh}
          />

          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <span className="text-2xl">📰</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Nenhuma Notícia Encontrada</h3>
            <p className="text-muted-foreground mb-4">
              Não foi possível encontrar notícias no momento.
            </p>
            <Button onClick={handleRefresh}>
              <RefreshCcw className="w-4 h-4 mr-2" />
              Carregar Notícias
            </Button>
          </div>
        </div>
      </SidebarLayout>
    )
  }

  // === MAIN CONTENT ===
  return (
    <SidebarLayout>
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        {/* === HEADER === */}
        <NewsHeader
          lastUpdate={lastUpdate}
          onRefresh={handleRefresh}
          onSettings={handleSettings}
          isLoading={isLoading}
          isDataFresh={isDataFresh}
        />

        {/* === ALERT PARA DADOS NÃO FRESCOS === */}
        {needsRefresh && !isLoading && (
          <Alert>
            <RefreshCcw className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>
                Os dados podem estar desatualizados. Última atualização:{' '}
                {lastUpdate?.toLocaleString()}
              </span>
              <Button size="sm" variant="outline" onClick={handleRefresh}>
                Atualizar Agora
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* === ESTATÍSTICAS === */}
        <NewsStats stats={stats} isLoading={isLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* === SIDEBAR COM FILTROS === */}
          <div className="lg:col-span-1 space-y-6">
            <NewsFilters
              filters={filters}
              onSearchChange={setSearchTerm}
              onCategoryChange={setCategory}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
              isLoading={isLoading}
            />

            {/* === CONFIGURAÇÕES RÁPIDAS === */}
            {showSettings && (
              <div className="p-4 border rounded-lg space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Configurações
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Auto-refresh:</span>
                    <span className="text-green-600">Ativo</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dados:</span>
                    <span className={isDataFresh ? 'text-green-600' : 'text-orange-600'}>
                      {isDataFresh ? 'Frescos' : 'Desatualizados'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span>{stats.totalNews} notícias</span>
                  </div>
                  {hasActiveFilters && (
                    <div className="flex justify-between">
                      <span>Filtradas:</span>
                      <span>{news.length} exibidas</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* === CONTEÚDO PRINCIPAL === */}
          <div className="lg:col-span-3 space-y-6">
            {/* === INDICADOR DE LOADING DURANTE REFRESH === */}
            {isLoading && hasNews && (
              <div className="flex items-center justify-center py-4">
                <RefreshCcw className="w-4 h-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">Atualizando notícias...</span>
              </div>
            )}

            {/* === GRID DE NOTÍCIAS === */}
            <NewsGrid
              articles={news}
              onReadMore={handleReadMore}
              loading={isLoading}
              className="min-h-[600px]" // Altura mínima para evitar layout shift
            />

            {/* === PAGINAÇÃO === */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6">
                <div className="text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevPage}
                    disabled={!hasPrevPage || isLoading}
                  >
                    Anterior
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextPage}
                    disabled={!hasNextPage || isLoading}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            )}

            {/* === FOOTER INFORMATIVO === */}
            <div className="text-center pt-8 border-t">
              <p className="text-sm text-muted-foreground">
                {lastUpdate && (
                  <>
                    Última atualização: {lastUpdate.toLocaleString('pt-PT')}
                    {!isDataFresh && (
                      <span className="ml-2 text-orange-600">
                        (dados podem estar desatualizados)
                      </span>
                    )}
                  </>
                )}
              </p>

              {process.env.NODE_ENV === 'development' && (
                <div className="mt-2 text-xs text-gray-500">
                  <details>
                    <summary className="cursor-pointer">Debug Info</summary>
                    <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-left">
                      <pre className="text-xs">
                        {JSON.stringify(
                          {
                            newsCount: news.length,
                            totalCount: stats.totalNews,
                            isLoading,
                            isDataFresh,
                            needsRefresh,
                            hasActiveFilters,
                            currentPage,
                            totalPages,
                          },
                          null,
                          2,
                        )}
                      </pre>
                    </div>
                  </details>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}
