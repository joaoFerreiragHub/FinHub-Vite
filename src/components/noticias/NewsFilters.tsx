// components/noticias/NewsFilters.tsx

import React from 'react'
import { Search, Filter, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { NewsFilters as NewsFiltersType } from '../../types/news'

interface NewsFiltersProps {
  filters: NewsFiltersType // ✅ Adicionado
  onSearchChange: (searchTerm: string) => void // ✅ Adicionado
  onCategoryChange: (category: string) => void // ✅ Adicionado
  onClearFilters: () => void // ✅ Adicionado
  hasActiveFilters: boolean // ✅ Adicionado
  isLoading?: boolean // ✅ Adicionado
}

const categories = [
  { value: 'all', label: 'Todas as Categorias' },
  { value: 'market', label: 'Mercados' },
  { value: 'crypto', label: 'Criptomoedas' },
  { value: 'economy', label: 'Economia' },
  { value: 'earnings', label: 'Resultados' },
  { value: 'general', label: 'Geral' },
]

export const NewsFilters: React.FC<NewsFiltersProps> = ({
  filters,
  onSearchChange,
  onCategoryChange,
  onClearFilters,
  hasActiveFilters,
  isLoading = false,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4" />
        <h3 className="font-medium">Filtros</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="ml-auto text-xs"
            disabled={isLoading}
          >
            <X className="h-3 w-3 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      {/* Pesquisa */}
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

      {/* Categoria */}
      <div>
        <label className="text-sm font-medium mb-2 block">Categoria</label>
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

      {/* Indicador de filtros ativos */}
      {hasActiveFilters && (
        <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
          <div className="flex items-center gap-1">
            <Filter className="h-3 w-3" />
            <span>Filtros ativos:</span>
          </div>
          <div className="mt-1 space-y-1">
            {filters.category !== 'all' && (
              <div className="flex justify-between">
                <span>Categoria:</span>
                <span className="font-medium">
                  {categories.find((c) => c.value === filters.category)?.label}
                </span>
              </div>
            )}
            {filters.searchTerm && (
              <div className="flex justify-between">
                <span>Pesquisa:</span>
                <span className="font-medium truncate max-w-20">"{filters.searchTerm}"</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
