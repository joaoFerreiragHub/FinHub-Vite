// pages/noticias/index.page.tsx

import { useState } from 'react'

import SidebarLayout from '../../components/layout/SidebarLayout'
import { NewsHeader } from '../../components/noticias/NewsHeader'
import { NewsFilters } from '../../components/noticias/NewsFilters'
import { NewsGrid } from '../../components/noticias/NewsGrid'
import { NewsStats } from '../../components/noticias/NewsStats'
import { Button } from '../../components/ui/button'

import { NewsArticle } from '../../types/news'
import { useNews } from '../../components/noticias/api/useNews'
import { RefreshCcw } from 'lucide-react'

export function Page() {
  const {
    news,
    loading,
    error,
    lastUpdate,
    filters,
    setSearchTerm,
    setCategory,
    refreshNews,
    stats
  } = useNews()

  const [showSettings, setShowSettings] = useState(false)

  // Debug: Adicionar logs para identificar o problema
  console.log('Page render:', { loading, error, newsCount: news?.length, stats })

  const handleReadMore = (article: NewsArticle) => {
    if (!article?.url) {
      console.warn('Artigo sem URL:', article)
      return
    }

    // Abrir artigo em nova janela
    window.open(article.url, '_blank', 'noopener,noreferrer')

    // TODO: Implementar tracking de cliques se necessário
    console.log('Artigo clicado:', article.title)
  }

  const handleRefresh = () => {
    console.log('Refresh solicitado')
    refreshNews()
  }

  const handleSettings = () => {
    setShowSettings(!showSettings)
    // TODO: Implementar página de configurações
    console.log('Abrir configurações')
  }

  // Verificação mais robusta de erro
  if (error) {
    console.error('Erro na página:', error)
    return (
      <SidebarLayout>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Erro ao Carregar Notícias</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={handleRefresh}>
              <RefreshCcw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
          </div>
        </div>
      </SidebarLayout>
    )
  }

  // Loading state mais específico
  if (loading && (!news || news.length === 0)) {
    return (
      <SidebarLayout>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center animate-pulse">
              <RefreshCcw className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Carregando Notícias...</h3>
            <p className="text-muted-foreground">Por favor aguarde enquanto buscamos as últimas notícias.</p>
          </div>
        </div>
      </SidebarLayout>
    )
  }

  // Verificações de segurança
  const safeNews = news || []
  const safeStats = stats || {
    totalNews: 0,
    filteredCount: 0,
    sources: 0,
    sentiments: { positive: 0, negative: 0, neutral: 0 }
  }
  const safeFilters = filters || { category: 'all', searchTerm: '' }

  const featuredArticle = safeNews[0]
  const secondaryArticles = safeNews.slice(1, 4)

  return (
    <SidebarLayout>
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <NewsHeader
          onRefresh={handleRefresh}
          onSettings={handleSettings}
          lastUpdate={lastUpdate}
        />

        {/* Filtros */}
        <NewsFilters
          searchTerm={safeFilters.searchTerm || ''}
          setSearchTerm={setSearchTerm}
          selectedCategory={safeFilters.category || 'all'}
          setSelectedCategory={setCategory}
        />

        {/* Estatísticas */}
        <NewsStats
          totalNews={safeStats.filteredCount}
          selectedCategory={safeFilters.category}
          searchTerm={safeFilters.searchTerm}
          activeSources={safeStats.sources}
          lastUpdateMinutes={lastUpdate ? Math.floor((Date.now() - lastUpdate.getTime()) / (1000 * 60)) : undefined}
        />

        {/* Estado vazio */}
        {!loading && safeNews.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <span className="text-2xl">📰</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Nenhuma notícia encontrada</h3>
            <p className="text-muted-foreground mb-4">
              {safeFilters.searchTerm || safeFilters.category !== 'all'
                ? 'Tente ajustar os filtros ou fazer uma nova pesquisa.'
                : 'Não foi possível carregar as notícias no momento.'
              }
            </p>
            <Button onClick={handleRefresh}>
              <RefreshCcw className="w-4 h-4 mr-2" />
              Recarregar
            </Button>
          </div>
        )}

        {/* Notícias em Destaque (só mostra se há notícias e não há filtros ativos) */}
        {safeFilters.category === 'all' && !safeFilters.searchTerm && safeNews.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              🔥 Notícias em Destaque
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Primeira notícia em destaque */}
              {featuredArticle && (
                <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  {featuredArticle.image && (
                    <img
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs font-semibold rounded">
                        DESTAQUE
                      </span>
                      {featuredArticle.source && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                          {featuredArticle.source}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">{featuredArticle.title}</h3>
                    {featuredArticle.summary && (
                      <p className="text-muted-foreground mb-4 line-clamp-3">{featuredArticle.summary}</p>
                    )}
                    <Button onClick={() => handleReadMore(featuredArticle)}>
                      Ler Artigo Completo
                    </Button>
                  </div>
                </div>
              )}

              {/* Notícias secundárias */}
              {secondaryArticles.length > 0 && (
                <div className="space-y-4">
                  {secondaryArticles.map(article => (
                    <div
                      key={article.id}
                      className="flex gap-4 p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleReadMore(article)}
                    >
                      {article.image && (
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-20 h-16 object-cover rounded flex-shrink-0"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2 mb-1">{article.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {article.source && <span>{article.source}</span>}
                          {article.source && article.publishedDate && <span>•</span>}
                          {article.publishedDate && (
                            <span>{new Date(article.publishedDate).toLocaleDateString('pt-PT')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Grid Principal de Notícias */}
        {safeNews.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {safeFilters.category === 'all' && !safeFilters.searchTerm
                  ? 'Todas as Notícias'
                  : 'Resultados da Pesquisa'
                }
              </h2>

              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
                <RefreshCcw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Atualizando...' : 'Atualizar'}
              </Button>
            </div>

            <NewsGrid
              news={safeNews}
              loading={loading}
              onReadMore={handleReadMore}
            />
          </section>
        )}

        {/* Load More Button */}
        {!loading && safeNews.length > 0 && (
          <div className="text-center pt-8">
            <Button variant="outline" size="lg" onClick={handleRefresh}>
              <RefreshCcw className="w-4 h-4 mr-2" />
              Carregar mais notícias
            </Button>
          </div>
        )}

        {/* Footer informativo */}
        <div className="text-center text-sm text-muted-foreground pt-8 border-t border-border">
          <p>
            As notícias são atualizadas automaticamente.
            Última atualização: {lastUpdate ? lastUpdate.toLocaleString('pt-PT') : 'Nunca'}
          </p>
          <p className="mt-2">
            📊 {safeStats.totalNews} notícias | 📰 {safeStats.sources} fontes |
            ✅ {safeStats.sentiments.positive} positivas |
            ❌ {safeStats.sentiments.negative} negativas |
            ➖ {safeStats.sentiments.neutral} neutras
          </p>
        </div>
      </div>
    </SidebarLayout>
  )
}

export default {
  Page
}
