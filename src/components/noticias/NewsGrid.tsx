// components/noticias/NewsGrid.tsx

import React from 'react'
import { ExternalLink, Clock, Tag } from 'lucide-react'
import { Button } from '../ui/button'
import { NewsArticle } from '../../types/news'
import { cn } from '../../lib/utils'

interface NewsGridProps {
  articles: NewsArticle[] // ✅ Adicionado
  onReadMore: (article: NewsArticle) => void // ✅ Adicionado
  loading?: boolean // ✅ Adicionado
  className?: string // ✅ Adicionado
}

const NewsCard: React.FC<{
  article: NewsArticle
  onReadMore: (article: NewsArticle) => void
}> = ({ article, onReadMore }) => {
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
      market: 'bg-blue-100 text-blue-800',
      crypto: 'bg-purple-100 text-purple-800',
      economy: 'bg-green-100 text-green-800',
      earnings: 'bg-orange-100 text-orange-800',
      general: 'bg-gray-100 text-gray-800',
    }
    return colors[category] || colors.general
  }

  const getSentimentColor = (sentiment?: string) => {
    if (!sentiment) return 'text-gray-500'
    const colors: Record<string, string> = {
      positive: 'text-green-600',
      negative: 'text-red-600',
      neutral: 'text-gray-600',
    }
    return colors[sentiment] || 'text-gray-500'
  }

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
          {article.sentiment && (
            <span className={cn('text-xs font-medium', getSentimentColor(article.sentiment))}>
              {article.sentiment}
            </span>
          )}
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

const LoadingSkeleton: React.FC = () => (
  <div className="bg-card rounded-lg border p-4 animate-pulse">
    <div className="aspect-video w-full mb-4 bg-gray-200 rounded-md"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-20"></div>
      <div className="h-6 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
    <div className="mt-4 space-y-2">
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="h-8 bg-gray-200 rounded"></div>
    </div>
  </div>
)

export const NewsGrid: React.FC<NewsGridProps> = ({
  articles,
  onReadMore,
  loading = false,
  className,
}) => {
  if (loading && articles.length === 0) {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <LoadingSkeleton key={i} />
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
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
      {articles.map((article) => (
        <NewsCard key={article.id} article={article} onReadMore={onReadMore} />
      ))}
    </div>
  )
}
