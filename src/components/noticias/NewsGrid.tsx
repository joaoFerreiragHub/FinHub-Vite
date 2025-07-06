// components/noticias/NewsGrid.tsx - VERSÃO COM VIEWMODE

import React from 'react'
import { ExternalLink, Clock, Tag, Eye } from 'lucide-react'
import { Button } from '../ui/button'
import { NewsArticle } from '../../types/news'
import { cn } from '../../lib/utils'

interface NewsGridProps {
  articles: NewsArticle[]
  onReadMore: (article: NewsArticle) => void
  loading?: boolean
  className?: string
  viewMode?: 'grid' | 'list' // ✅ Adicionada propriedade viewMode
}

const NewsCard: React.FC<{
  article: NewsArticle
  onReadMore: (article: NewsArticle) => void
  viewMode?: 'grid' | 'list'
}> = ({ article, onReadMore, viewMode = 'grid' }) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return 'Data inválida'
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      market: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      crypto: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      economy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      earnings: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      general: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    }
    return colors[category] || colors.general
  }

  const getSentimentColor = (sentiment?: string) => {
    if (!sentiment) return 'text-gray-500'
    const colors: Record<string, string> = {
      positive: 'text-green-600 dark:text-green-400',
      negative: 'text-red-600 dark:text-red-400',
      neutral: 'text-gray-600 dark:text-gray-400',
    }
    return colors[sentiment] || 'text-gray-500'
  }

  // === MODO LISTA ===
  if (viewMode === 'list') {
    return (
      <div className="bg-card rounded-lg border p-4 hover:shadow-md transition-shadow">
        <div className="flex gap-4">
          {/* Imagem pequena à esquerda */}
          {article.image && (
            <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Conteúdo principal */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                    getCategoryColor(article.category),
                  )}
                >
                  {article.category}
                </span>
                {article.sentiment && (
                  <span className={cn('text-xs font-medium', getSentimentColor(article.sentiment))}>
                    {article.sentiment}
                  </span>
                )}
              </div>

              {article.views && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  <span>{article.views.toLocaleString()}</span>
                </div>
              )}
            </div>

            <h3 className="font-semibold text-lg leading-tight line-clamp-2">{article.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{article.summary}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(article.publishedDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  <span>{article.source}</span>
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={() => onReadMore(article)}>
                <ExternalLink className="h-3 w-3 mr-2" />
                Ler Mais
              </Button>
            </div>

            {/* Tickers (se disponível) */}
            {article.tickers && article.tickers.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {article.tickers.slice(0, 5).map((ticker) => (
                  <span
                    key={ticker}
                    className="inline-flex items-center px-2 py-1 rounded bg-muted text-xs font-mono"
                  >
                    {ticker}
                  </span>
                ))}
                {article.tickers.length > 5 && (
                  <span className="text-xs text-muted-foreground">
                    +{article.tickers.length - 5} mais
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // === MODO GRID (PADRÃO) ===
  return (
    <div className="bg-card rounded-lg border p-4 hover:shadow-md transition-shadow">
      {/* Imagem (se disponível) */}
      {article.image && (
        <div className="aspect-video w-full mb-4 rounded-md overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Cabeçalho */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <span
            className={cn(
              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
              getCategoryColor(article.category),
            )}
          >
            {article.category}
          </span>
          <div className="flex items-center gap-2">
            {article.sentiment && (
              <span className={cn('text-xs font-medium', getSentimentColor(article.sentiment))}>
                {article.sentiment}
              </span>
            )}
            {article.views && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Eye className="h-3 w-3" />
                <span>{article.views.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        <h3 className="font-semibold text-lg leading-tight line-clamp-2">{article.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">{article.summary}</p>
      </div>

      {/* Metadados */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatDate(article.publishedDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            <span>{article.source}</span>
          </div>
        </div>

        {/* Tickers (se disponível) */}
        {article.tickers && article.tickers.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {article.tickers.slice(0, 3).map((ticker) => (
              <span
                key={ticker}
                className="inline-flex items-center px-2 py-1 rounded bg-muted text-xs font-mono"
              >
                {ticker}
              </span>
            ))}
            {article.tickers.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{article.tickers.length - 3} mais
              </span>
            )}
          </div>
        )}

        {/* Botão de ação */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onReadMore(article)}
          className="w-full mt-3"
        >
          <ExternalLink className="h-3 w-3 mr-2" />
          Ler Completa
        </Button>
      </div>
    </div>
  )
}

const LoadingSkeleton: React.FC<{ viewMode?: 'grid' | 'list' }> = ({ viewMode = 'grid' }) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-card rounded-lg border p-4 animate-pulse">
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="flex justify-between">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg border p-4 animate-pulse">
      <div className="aspect-video w-full mb-4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  )
}

export const NewsGrid: React.FC<NewsGridProps> = ({
  articles,
  onReadMore,
  loading = false,
  className,
  viewMode = 'grid', // ✅ Valor padrão
}) => {
  if (loading && articles.length === 0) {
    return (
      <div
        className={cn(
          viewMode === 'list'
            ? 'space-y-4'
            : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
          className,
        )}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <LoadingSkeleton key={i} viewMode={viewMode} />
        ))}
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <span className="text-2xl">📰</span>
        </div>
        <h3 className="text-lg font-medium mb-2">Nenhuma Notícia Encontrada</h3>
        <p className="text-muted-foreground">Tenta ajustar os filtros ou refrescar a página.</p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        viewMode === 'list' ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
        className,
      )}
    >
      {articles.map((article) => (
        <NewsCard key={article.id} article={article} onReadMore={onReadMore} viewMode={viewMode} />
      ))}
    </div>
  )
}
