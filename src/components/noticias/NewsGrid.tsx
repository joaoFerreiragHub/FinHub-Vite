// components/noticias/NewsGrid.tsx - VERSÃO ATUALIZADA COM BADGES DE FONTE

import React from 'react'
import { ExternalLink, Clock, Tag, Eye, TrendingUp } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { NewsArticle } from '../../types/news'
import { cn } from '../../lib/utils'
import { NewsSourceBadge } from './NewsSourceBadge' // ✅ NOVO
import { getSourceInfo, isYahooSource } from '@/features/hub/news/utils/sourceUtils'

interface NewsGridProps {
  articles: NewsArticle[]
  onReadMore: (article: NewsArticle) => void
  loading?: boolean
  className?: string
  viewMode?: 'grid' | 'list'
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
      forex: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    }
    return colors[category] || colors.general
  }

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 dark:text-green-400'
      case 'negative':
        return 'text-red-600 dark:text-red-400'
      case 'neutral':
        return 'text-gray-600 dark:text-gray-400'
      default:
        return 'text-muted-foreground'
    }
  }

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return '📈'
      case 'negative':
        return '📉'
      case 'neutral':
        return '➡️'
      default:
        return ''
    }
  }

  // ✅ NOVO: Obter informações da fonte
  const sourceInfo = getSourceInfo(article.source)
  const isFromYahoo = isYahooSource(article.source)

  // === MODO LIST ===
  if (viewMode === 'list') {
    return (
      <div
        className={cn(
          'bg-card rounded-lg border p-4 hover:shadow-md transition-all duration-200',
          isFromYahoo && 'border-l-4 border-l-purple-500', // ✅ Destaque especial para Yahoo
        )}
      >
        <div className="flex gap-4">
          {/* Imagem (menor no modo list) */}
          {article.image && (
            <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Conteúdo */}
          <div className="flex-1 space-y-2">
            {/* Header com badges */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                {/* ✅ NOVO: Badge da fonte */}
                <NewsSourceBadge source={article.source} variant="compact" size="sm" />

                {/* Badge da categoria */}
                <span
                  className={cn(
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                    getCategoryColor(article.category),
                  )}
                >
                  {article.category}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Sentimento */}
                {article.sentiment && (
                  <span
                    className={cn(
                      'text-xs font-medium flex items-center gap-1',
                      getSentimentColor(article.sentiment),
                    )}
                  >
                    <span>{getSentimentIcon(article.sentiment)}</span>
                    {article.sentiment}
                  </span>
                )}

                {/* Views */}
                {article.views && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    <span>{article.views.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Título */}
            <h3 className="font-semibold text-lg leading-tight line-clamp-2">{article.title}</h3>

            {/* Resumo */}
            <p className="text-sm text-muted-foreground line-clamp-2">{article.summary}</p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(article.publishedDate)}</span>
                </div>

                {/* ✅ Mostrar fonte original (além do badge) */}
                <div className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  <span title={sourceInfo.description}>{sourceInfo.label}</span>
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={() => onReadMore(article)}>
                <ExternalLink className="h-3 w-3 mr-2" />
                Ler Mais
              </Button>
            </div>

            {/* Tickers */}
            {article.tickers && article.tickers.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {article.tickers.slice(0, 5).map((ticker) => (
                  <span
                    key={ticker}
                    className="inline-flex items-center px-2 py-1 rounded bg-muted text-xs font-mono"
                  >
                    ${ticker}
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
    <div
      className={cn(
        'bg-card rounded-lg border p-4 hover:shadow-md transition-all duration-200',
        isFromYahoo && 'ring-2 ring-purple-200 dark:ring-purple-800', // ✅ Destaque para Yahoo
      )}
    >
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

      {/* Conteúdo */}
      <div className="space-y-3">
        {/* Header com badges */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {/* ✅ NOVO: Badge da fonte (destaque especial para Yahoo) */}
            <NewsSourceBadge
              source={article.source}
              variant={isFromYahoo ? 'default' : 'outline'}
              size="sm"
            />

            {/* Badge da categoria */}
            <span
              className={cn(
                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                getCategoryColor(article.category),
              )}
            >
              {article.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Sentimento */}
            {article.sentiment && (
              <div className="flex items-center gap-1">
                <span className="text-sm">{getSentimentIcon(article.sentiment)}</span>
                <span className={cn('text-xs font-medium', getSentimentColor(article.sentiment))}>
                  {article.sentiment}
                </span>
              </div>
            )}

            {/* Views */}
            {article.views && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Eye className="h-3 w-3" />
                <span>{article.views.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Título */}
        <h3 className="font-semibold text-lg leading-tight line-clamp-2">{article.title}</h3>

        {/* Resumo */}
        <p className="text-sm text-muted-foreground line-clamp-2">{article.summary}</p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatDate(article.publishedDate)}</span>
            </div>

            {/* ✅ Informação adicional da fonte */}
            {isFromYahoo && (
              <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                <TrendingUp className="h-3 w-3" />
                <span className="font-medium">Grátis</span>
              </div>
            )}
          </div>

          <Button variant="outline" size="sm" onClick={() => onReadMore(article)}>
            <ExternalLink className="h-3 w-3 mr-2" />
            Ler Mais
          </Button>
        </div>

        {/* Tickers */}
        {article.tickers && article.tickers.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {article.tickers.slice(0, 5).map((ticker) => (
              <span
                key={ticker}
                className="inline-flex items-center px-2 py-1 rounded bg-muted text-xs font-mono"
              >
                ${ticker}
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
  )
}

export const NewsGrid: React.FC<NewsGridProps> = ({
  articles,
  onReadMore,
  loading = false,
  className,
  viewMode = 'grid',
}) => {
  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-card rounded-lg border p-4 animate-pulse">
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-muted rounded"></div>
                <div className="h-6 w-20 bg-muted rounded"></div>
              </div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
              <div className="flex justify-between">
                <div className="h-3 bg-muted rounded w-1/4"></div>
                <div className="h-8 w-20 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <p className="text-muted-foreground">Nenhuma notícia encontrada</p>
      </div>
    )
  }

  // ✅ NOVO: Estatísticas das fontes
  const sourceStats = articles.reduce(
    (acc, article) => {
      const info = getSourceInfo(article.source)
      acc[info.label] = (acc[info.label] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const yahooCount = articles.filter((a) => isYahooSource(a.source)).length
  const yahooPercentage = Math.round((yahooCount / articles.length) * 100)

  return (
    <div className={cn('space-y-6', className)}>
      {/* ✅ NOVO: Header com estatísticas das fontes */}
      {articles.length > 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-4 border">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-4 text-sm">
              <span className="font-medium text-muted-foreground">
                📊 Fontes: {Object.keys(sourceStats).length}
              </span>

              {yahooCount > 0 && (
                <div className="flex items-center gap-1">
                  <span>📈</span>
                  <span className="font-medium text-purple-600 dark:text-purple-400">
                    Yahoo Finance: {yahooCount} ({yahooPercentage}%)
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {Object.entries(sourceStats)
                .slice(0, 3)
                .map(([source, count]) => (
                  <Badge key={source} variant="outline" className="text-xs">
                    {source}: {count}
                  </Badge>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Grid/List de notícias */}
      <div
        className={cn(
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4',
        )}
      >
        {articles.map((article) => (
          <NewsCard
            key={article.id}
            article={article}
            onReadMore={onReadMore}
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  )
}
