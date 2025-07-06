import React from 'react'
import { Search, Filter, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { NewsFilters as NewsFiltersType } from '../../types/news'

interface NewsFiltersProps {
  filters: NewsFiltersType
  onSearchChange: (searchTerm: string) => void
  onCategoryChange: (category: string) => void
  onSourceChange: (source: string) => void // ✅ NOVO
  onClearFilters: () => void
  hasActiveFilters: boolean
  isLoading?: boolean
}

const categories = [
  { value: 'all', label: 'Todas as Categorias' },
  { value: 'market', label: 'Mercados' },
  { value: 'crypto', label: 'Criptomoedas' },
  { value: 'economy', label: 'Economia' },
  { value: 'earnings', label: 'Resultados' },
  { value: 'general', label: 'Geral' },
]

// ✅ NOVO: Fontes disponíveis
const sources = [
  { value: 'all', label: 'Todas as Fontes', icon: '🌐' },
  { value: 'yahoo', label: 'Yahoo Finance', icon: '📈' },
  { value: 'fmp', label: 'Financial Modeling Prep', icon: '💼' },
  { value: 'newsapi', label: 'News API', icon: '📰' },
  { value: 'alphavantage', label: 'Alpha Vantage', icon: '📊' },
  { value: 'polygon', label: 'Polygon', icon: '🔺' },
]

export const NewsFilters: React.FC<NewsFiltersProps> = ({
  filters,
  onSearchChange,
  onCategoryChange,
  onSourceChange, // ✅ NOVO
  onClearFilters,
  hasActiveFilters,
  isLoading = false,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <h3 className="font-medium">Filtros</h3>
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-medium">
              {
                Object.values(filters).filter(
                  (v) => v && v !== 'all' && (typeof v !== 'string' || v.trim()),
                ).length
              }{' '}
              ativo(s)
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-xs hover:bg-red-50 hover:text-red-600"
            disabled={isLoading}
          >
            <X className="h-3 w-3 mr-1" />
            Limpar Filtros
          </Button>
        )}
      </div>

      {/* ✅ NOVO: Filtros Rápidos de Fonte */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Fontes de Notícias</label>
        <div className="flex flex-wrap gap-2">
          {sources.map((source) => {
            const isActive = (filters.source || 'all') === source.value
            return (
              <Button
                key={source.value}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSourceChange(source.value)}
                disabled={isLoading}
                className={`h-9 transition-all duration-200 ${
                  isActive
                    ? 'shadow-md scale-105 bg-gradient-to-r from-blue-600 to-purple-600'
                    : 'hover:scale-102'
                }`}
              >
                <span className="mr-2">{source.icon}</span>
                <span className="font-medium">{source.label}</span>
              </Button>
            )
          })}
        </div>

        {/* Indicador de fonte ativa */}
        {filters.source && filters.source !== 'all' && (
          <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg border">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-blue-700 dark:text-blue-300">
              Mostrando apenas:{' '}
              <strong>{sources.find((s) => s.value === filters.source)?.label}</strong>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSourceChange('all')}
              className="ml-auto h-6 px-2 text-xs hover:bg-white/50"
            >
              Remover
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pesquisa */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Pesquisar</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar notícias..."
              value={filters.searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Categoria */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Categoria</label>
          <Select value={filters.category} onValueChange={onCategoryChange} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Resumo de filtros ativos */}
      {hasActiveFilters && (
        <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Filtros Aplicados:
            </span>
          </div>

          <div className="space-y-1 text-sm">
            {filters.category !== 'all' && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Categoria:</span>
                <span className="font-medium">
                  {categories.find((c) => c.value === filters.category)?.label}
                </span>
              </div>
            )}

            {filters.source && filters.source !== 'all' && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Fonte:</span>
                <div className="flex items-center gap-1">
                  <span>{sources.find((s) => s.value === filters.source)?.icon}</span>
                  <span className="font-medium">
                    {sources.find((s) => s.value === filters.source)?.label}
                  </span>
                </div>
              </div>
            )}

            {filters.searchTerm && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Pesquisa:</span>
                <span className="font-medium truncate max-w-32 bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">
                  "{filters.searchTerm}"
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
