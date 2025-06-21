// components/noticias/NewsStats.tsx

import React from 'react'

interface NewsStatsProps {
  totalNews: number
  selectedCategory: string
  searchTerm: string
  activeSources?: number
  lastUpdateMinutes?: number
  apiUptime?: number
}

const categories = [
  { key: 'market', label: 'Mercados' },
  { key: 'crypto', label: 'Crypto' },
  { key: 'economy', label: 'Economia' },
  { key: 'earnings', label: 'Resultados' },
  { key: 'general', label: 'Geral' }
]

export const NewsStats: React.FC<NewsStatsProps> = ({
  totalNews,
  selectedCategory,
  searchTerm,
  activeSources = 3,
  lastUpdateMinutes = 2,
  apiUptime = 99.9
}) => {
  return (
    <div className="space-y-6">
      {/* Estatísticas de Filtros */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <span>
          <strong className="text-foreground">{totalNews}</strong> notícias encontradas
        </span>
        {selectedCategory !== 'all' && (
          <span>
            Categoria: <strong className="text-foreground">
              {categories.find(c => c.key === selectedCategory)?.label || selectedCategory}
            </strong>
          </span>
        )}
        {searchTerm && (
          <span>
            Pesquisa: <strong className="text-foreground">"{searchTerm}"</strong>
          </span>
        )}
      </div>

      {/* Estatísticas do Sistema */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {totalNews}
          </div>
          <div className="text-sm text-muted-foreground">Artigos Hoje</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {activeSources}
          </div>
          <div className="text-sm text-muted-foreground">Fontes Ativas</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {lastUpdateMinutes}min
          </div>
          <div className="text-sm text-muted-foreground">Última Atualização</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {apiUptime}%
          </div>
          <div className="text-sm text-muted-foreground">Uptime API</div>
        </div>
      </div>
    </div>
  )
}
