// components/noticias/NewsGrid.tsx

import React from 'react'
import { Search } from 'lucide-react'
import { NewsCard } from './NewsCard'
import { NewsArticle } from '../../types/news'

interface NewsGridProps {
  news: NewsArticle[]
  loading: boolean
  onReadMore?: (article: NewsArticle) => void
}

export const NewsGrid: React.FC<NewsGridProps> = ({ news, loading, onReadMore }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted rounded-lg overflow-hidden">
              <div className="h-48 bg-muted-foreground/20" />
              <div className="p-6 space-y-3">
                <div className="h-4 bg-muted-foreground/20 rounded" />
                <div className="h-6 bg-muted-foreground/20 rounded" />
                <div className="h-4 bg-muted-foreground/20 rounded w-3/4" />
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-muted-foreground/20 rounded w-16" />
                  <div className="h-8 bg-muted-foreground/20 rounded w-20" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <Search className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">Nenhuma notícia encontrada</h3>
        <p className="text-muted-foreground">
          Tenta ajustar os filtros ou termo de pesquisa para encontrar mais resultados.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.map(article => (
        <NewsCard
          key={article.id}
          article={article}
          onReadMore={onReadMore}
        />
      ))}
    </div>
  )
}
