// components/noticias/NewsFilters.tsx

import React from 'react'
import { Search, TrendingUp, Globe } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

interface NewsFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

const categories = [
  { key: 'all', label: 'Todas', icon: Globe },
  { key: 'market', label: 'Mercados', icon: TrendingUp },
  { key: 'crypto', label: 'Crypto', icon: TrendingUp },
  { key: 'economy', label: 'Economia', icon: TrendingUp },
  { key: 'earnings', label: 'Resultados', icon: TrendingUp },
  { key: 'general', label: 'Geral', icon: Globe }
]

export const NewsFilters: React.FC<NewsFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Barra de Pesquisa */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar notícias..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filtros de Categoria */}
      <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
        {categories.map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={selectedCategory === key ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(key)}
            className="whitespace-nowrap flex items-center gap-2"
          >
            <Icon className="w-4 h-4" />
            {label}
          </Button>
        ))}
      </div>
    </div>
  )
}
