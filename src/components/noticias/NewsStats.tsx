// components/noticias/NewsStats.tsx

import React from 'react'
import { TrendingUp, BarChart3, Globe, Clock } from 'lucide-react'
import { NewsStats as NewsStatsType } from '../../stores/useNewsStore'

interface NewsStatsProps {
  stats: NewsStatsType // ✅ Adicionado
  isLoading?: boolean // ✅ Adicionado
  // lastUpdate removido pois não era usado
}

export const NewsStats: React.FC<NewsStatsProps> = ({ stats, isLoading = false }) => {
  const { totalNews, filteredCount, categories, sources, sentiments } = stats

  const categoryEntries = Object.entries(categories).slice(0, 3) // Top 3 categorias

  if (isLoading && totalNews === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card rounded-lg p-4 border animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total de Notícias */}
      <div className="bg-card rounded-lg p-4 border">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-muted-foreground">Total</span>
        </div>
        <p className="text-2xl font-bold mt-1">{totalNews.toLocaleString()}</p>
        {filteredCount !== totalNews && (
          <p className="text-xs text-muted-foreground">{filteredCount} filtradas</p>
        )}
      </div>

      {/* Categorias */}
      <div className="bg-card rounded-lg p-4 border">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-600" />
          <span className="text-sm text-muted-foreground">Categorias</span>
        </div>
        <div className="mt-1">
          {categoryEntries.length > 0 ? (
            categoryEntries.map(([category, count]) => (
              <div key={category} className="flex justify-between text-xs">
                <span className="capitalize">{category}</span>
                <span className="font-medium">{count}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Sem dados</p>
          )}
        </div>
      </div>

      {/* Fontes */}
      <div className="bg-card rounded-lg p-4 border">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-purple-600" />
          <span className="text-sm text-muted-foreground">Fontes</span>
        </div>
        <p className="text-2xl font-bold mt-1">{sources}</p>
        <p className="text-xs text-muted-foreground">Fontes ativas</p>
      </div>

      {/* Sentimentos */}
      <div className="bg-card rounded-lg p-4 border">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-orange-600" />
          <span className="text-sm text-muted-foreground">Sentimento</span>
        </div>
        <div className="mt-1 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-green-600">Positivo</span>
            <span>{sentiments.positive}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-red-600">Negativo</span>
            <span>{sentiments.negative}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Neutro</span>
            <span>{sentiments.neutral}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
