// src/features/hub/news/components/NewsCard.tsx

import React from 'react'
import { Clock, ExternalLink, Eye } from 'lucide-react'
import { Button } from '@/components/ui'
import { Badge } from '@/components/ui'
import { NewsArticle } from '~/features/hub/news/types/news'

interface NewsCardProps {
  article: NewsArticle
  onReadMore?: (article: NewsArticle) => void
}

const categories = [
  { key: 'market', label: 'Mercados' },
  { key: 'crypto', label: 'Crypto' },
  { key: 'economy', label: 'Economia' },
  { key: 'earnings', label: 'Resultados' },
  { key: 'general', label: 'Geral' },
]

export const NewsCard: React.FC<NewsCardProps> = ({ article, onReadMore }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffHours < 1) return 'Agora mesmo'
    if (diffHours === 1) return 'Há 1 hora'
    if (diffHours < 24) return `Há ${diffHours} horas`
    return date.toLocaleDateString('pt-PT')
  }

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'negative':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'market':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'crypto':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'economy':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'earnings':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  const handleReadMore = () => {
    if (onReadMore) {
      onReadMore(article)
    } else {
      // Abrir em nova janela se não houver handler customizado
      window.open(article.url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <article className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 group">
      {article.image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className={getCategoryColor(article.category)}>
              {categories.find((c) => c.key === article.category)?.label || 'Geral'}
            </Badge>
            {article.sentiment && (
              <Badge className={getSentimentColor(article.sentiment)}>
                {article.sentiment === 'positive'
                  ? '↗'
                  : article.sentiment === 'negative'
                    ? '↘'
                    : '→'}
              </Badge>
            )}
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <span className="font-medium">{article.source}</span>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDate(article.publishedDate)}</span>
          </div>
          {article.views && (
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{article.views.toLocaleString()}</span>
            </div>
          )}
        </div>

        <h3 className="font-semibold text-lg leading-tight mb-3 group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
          {article.title}
        </h3>

        <p className="text-muted-foreground mb-4 line-clamp-3">{article.summary}</p>

        <div className="flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {article.tickers?.slice(0, 3).map((ticker) => (
              <Badge key={ticker} variant="outline" className="text-xs">
                {ticker}
              </Badge>
            ))}
            {article.tickers && article.tickers.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{article.tickers.length - 3}
              </Badge>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleReadMore}
            className="group-hover:bg-muted"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Ler mais
          </Button>
        </div>
      </div>
    </article>
  )
}
