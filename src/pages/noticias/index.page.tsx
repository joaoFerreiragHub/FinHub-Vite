// pages/noticias/index.page.tsx - VERSÃO DEBUG

import { useState, useEffect } from 'react'
import { RefreshCcw, AlertCircle } from 'lucide-react'

import SidebarLayout from '../../components/layout/SidebarLayout'
import { NewsHeader } from '../../components/noticias/NewsHeader'
import { NewsGrid } from '../../components/noticias/NewsGrid'
import { NewsStats } from '../../components/noticias/NewsStats'
import { Button } from '../../components/ui/button'
import { NewsArticle } from '../../types/news'
import { useNews } from '../../components/noticias/api/useNews'

export function Page() {
  const {
    news,
    allNews,
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
    totalCount,

    // Filtros
    filters,

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
    testAPI,
  } = useNews({
    autoLoad: true,
    autoRefresh: true,
    refreshInterval: 10 * 60 * 1000, // 10 minutos
  })

  const [showSettings, setShowSettings] = useState(false)
  const [showDebug, setShowDebug] = useState(process.env.NODE_ENV === 'development')

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

  const handleTestAPI = async () => {
    console.log('🧪 Testando API...')
    const result = await testAPI()
    console.log('📊 Resultado do teste:', result)
  }

  // === DEBUG LOGS ===
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('📰 News Page State Update:', {
        newsCount: news?.length,
        allNewsCount: allNews?.length,
        totalCount,
        isLoading,
        hasError,
        error,
        isDataFresh,
        needsRefresh,
        lastUpdate: lastUpdate?.toISOString(),
        filters,
        stats,
        hasNews,
        isEmpty,
      })
    }
  }, [
    news,
    allNews,
    totalCount,
    isLoading,
    hasError,
    error,
    isDataFresh,
    needsRefresh,
    lastUpdate,
    filters,
    stats,
    hasNews,
    isEmpty,
  ])

  // === ERROR STATE ===
  if (hasError) {
    return (
      <SidebarLayout>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
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
              <Button variant="outline" onClick={handleTestAPI}>
                Testar API
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

  return (
    <SidebarLayout>
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* === CABEÇALHO === */}
        <NewsHeader
          lastUpdate={lastUpdate}
          onRefresh={handleRefresh}
          onSettings={handleSettings}
          isLoading={isLoading}
          isDataFresh={isDataFresh}
          totalNews={totalCount}
          filteredNews={news.length}
        />

        {/* === DEBUG PANEL (só em desenvolvimento) === */}
        {/* {showDebug && (
          <Card className="mb-6 border-orange-200 bg-orange-50 dark:bg-orange-950">
            <CardHeader>
              <CardTitle className="text-sm text-orange-800 dark:text-orange-200">
                🐛 Debug Panel (Desenvolvimento)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <strong>Estados:</strong>
                  <br />• isLoading: {String(isLoading)}
                  <br />• hasError: {String(hasError)}
                  <br />• hasNews: {String(hasNews)}
                  <br />• isEmpty: {String(isEmpty)}
                </div>
                <div>
                  <strong>Dados:</strong>
                  <br />• news: {news?.length || 0}
                  <br />• allNews: {allNews?.length || 0}
                  <br />• totalCount: {totalCount}
                  <br />• filteredCount: {stats.filteredCount}
                </div>
                <div>
                  <strong>Status:</strong>
                  <br />• isDataFresh: {String(isDataFresh)}
                  <br />• needsRefresh: {String(needsRefresh)}
                  <br />• lastUpdate: {lastUpdate ? 'Sim' : 'Não'}
                  <br />• hasActiveFilters: {String(hasActiveFilters)}
                </div>
                <div>
                  <strong>Filtros:</strong>
                  <br />• category: {filters.category}
                  <br />• searchTerm: {filters.searchTerm || 'Vazio'}
                  <br />• source: {filters.source || 'Vazio'}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={handleTestAPI}>
                  Testar API
                </Button>
                <Button size="sm" variant="outline" onClick={() => console.log('news:', news)}>
                  Log News
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowDebug(false)}>
                  Ocultar Debug
                </Button>
              </div>
            </CardContent>
          </Card>
        )} */}

        {/* === ESTATÍSTICAS === */}
        <div className="mb-6">
          <NewsStats stats={stats} isLoading={isLoading} />
        </div>

        {/* === INDICADOR DE LOADING DURANTE REFRESH === */}
        {isLoading && hasNews && (
          <div className="flex items-center justify-center py-4 mb-6 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <RefreshCcw className="w-4 h-4 animate-spin mr-2" />
            <span className="text-sm text-muted-foreground">Atualizando notícias...</span>
          </div>
        )}

        {/* === EMPTY STATE === */}
        {isEmpty && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <span className="text-2xl">📰</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Nenhuma Notícia Encontrada</h3>
            <p className="text-muted-foreground mb-4">
              Não foi possível encontrar notícias no momento.
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleRefresh}>
                <RefreshCcw className="w-4 h-4 mr-2" />
                Tentar Carregar
              </Button>
              <Button variant="outline" onClick={handleTestAPI}>
                Testar Conexão
              </Button>
            </div>
          </div>
        )}

        {/* === GRID DE NOTÍCIAS === */}
        {hasNews && (
          <>
            <NewsGrid
              articles={news}
              onReadMore={handleReadMore}
              loading={isLoading}
              className="min-h-[600px]"
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
          </>
        )}

        {/* === FOOTER INFORMATIVO === */}
        <div className="text-center pt-8 border-t mt-8">
          <p className="text-sm text-muted-foreground">
            {lastUpdate && (
              <>
                Última atualização: {lastUpdate.toLocaleString('pt-PT')}
                {!isDataFresh && (
                  <span className="ml-2 text-orange-600">(dados podem estar desatualizados)</span>
                )}
              </>
            )}
          </p>

          {!showDebug && process.env.NODE_ENV === 'development' && (
            <Button variant="ghost" size="sm" onClick={() => setShowDebug(true)} className="mt-2">
              Mostrar Debug
            </Button>
          )}
        </div>
      </div>
    </SidebarLayout>
  )
}
