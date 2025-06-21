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

  const handleReadMore = (article: NewsArticle) => {
    // Abrir artigo em nova janela
    window.open(article.url, '_blank', 'noopener,noreferrer')

    // TODO: Implementar tracking de cliques se necessário
    console.log('Artigo clicado:', article.title)
  }

  const handleRefresh = () => {
    refreshNews()
  }

  const handleSettings = () => {
    setShowSettings(!showSettings)
    // TODO: Implementar página de configurações
    console.log('Abrir configurações')
  }

  if (error) {
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
          searchTerm={filters.searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={filters.category}
          setSelectedCategory={setCategory}
        />

        {/* Estatísticas */}
        <NewsStats
          totalNews={stats.filteredCount}
          selectedCategory={filters.category}
          searchTerm={filters.searchTerm}
          activeSources={stats.sources}
          lastUpdateMinutes={lastUpdate ? Math.floor((Date.now() - lastUpdate.getTime()) / (1000 * 60)) : undefined}
        />

        {/* Notícias em Destaque (só mostra se não há filtros ativos) */}
        {filters.category === 'all' && !filters.searchTerm && news.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              🔥 Notícias em Destaque
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Primeira notícia em destaque */}
              <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {news[0]?.image && (
                  <img
                    src={news[0].image}
                    alt={news[0].title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs font-semibold rounded">
                      DESTAQUE
                    </span>
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                      {news[0]?.source}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{news[0]?.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{news[0]?.summary}</p>
                  <Button onClick={() => handleReadMore(news[0])}>
                    Ler Artigo Completo
                  </Button>
                </div>
              </div>

              {/* Notícias secundárias */}
              <div className="space-y-4">
                {news.slice(1, 4).map(article => (
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
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 mb-1">{article.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{article.source}</span>
                        <span>•</span>
                        <span>{new Date(article.publishedDate).toLocaleDateString('pt-PT')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Grid Principal de Notícias */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {filters.category === 'all' && !filters.searchTerm
                ? 'Todas as Notícias'
                : 'Resultados da Pesquisa'
              }
            </h2>

            {!loading && (
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCcw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
            )}
          </div>

          <NewsGrid
            news={news}
            loading={loading}
            onReadMore={handleReadMore}
          />
        </section>

        {/* Load More Button */}
        {!loading && news.length > 0 && (
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
            📊 {stats.totalNews} notícias | 📰 {stats.sources} fontes |
            ✅ {stats.sentiments.positive} positivas |
            ❌ {stats.sentiments.negative} negativas |
            ➖ {stats.sentiments.neutral} neutras
          </p>
        </div>
      </div>
    </SidebarLayout>
  )
}

export default {
  Page
}
