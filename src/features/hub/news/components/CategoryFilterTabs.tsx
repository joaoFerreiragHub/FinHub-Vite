// src/features/hub/news/components/CategoryFilterTabs.tsx

import React from 'react'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import { TrendingUp, DollarSign, Building2, PieChart, Globe, X } from 'lucide-react'

interface Category {
  id: string
  label: string
  icon: React.ReactNode
  color: string
  description: string
  count?: number
}

interface CategoryFilterTabsProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
  categoryCounts?: Record<string, number>
  isLoading?: boolean
  className?: string
}

const categories: Category[] = [
  {
    id: 'all',
    label: 'Todas',
    icon: <Globe className="w-4 h-4" />,
    color:
      'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
    description: 'Ver todas as notícias',
  },
  {
    id: 'market',
    label: 'Market',
    icon: <TrendingUp className="w-4 h-4" />,
    color:
      'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800',
    description: 'Notícias do mercado financeiro',
  },
  {
    id: 'earnings',
    label: 'Earnings',
    icon: <DollarSign className="w-4 h-4" />,
    color:
      'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800',
    description: 'Resultados e relatórios de empresas',
  },
  {
    id: 'economy',
    label: 'Economy',
    icon: <PieChart className="w-4 h-4" />,
    color:
      'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:hover:bg-purple-800',
    description: 'Notícias económicas e indicadores',
  },
  {
    id: 'crypto',
    label: 'Crypto',
    icon: <Building2 className="w-4 h-4" />,
    color:
      'bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:hover:bg-orange-800',
    description: 'Criptomoedas e blockchain',
  },
  {
    id: 'general',
    label: 'General',
    icon: <Globe className="w-4 h-4" />,
    color:
      'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
    description: 'Notícias gerais relacionadas com finanças',
  },
]

export const CategoryFilterTabs: React.FC<CategoryFilterTabsProps> = ({
  activeCategory,
  onCategoryChange,
  categoryCounts = {},
  isLoading = false,
  className,
}) => {
  const handleCategoryClick = (categoryId: string) => {
    onCategoryChange(categoryId)
  }

  const clearFilter = () => {
    onCategoryChange('all')
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header com título e botão clear */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Filtrar por Categoria</h3>
          <p className="text-sm text-muted-foreground">
            Seleciona uma categoria para filtrar as notícias
          </p>
        </div>

        {activeCategory !== 'all' && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilter}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Limpar Filtro
          </Button>
        )}
      </div>

      {/* Tabs de categorias */}
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => {
          const isActive = activeCategory === category.id
          const count = categoryCounts[category.id] || 0

          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              disabled={isLoading}
              className={cn(
                'flex items-center gap-2 px-4 py-3 rounded-lg border transition-all duration-200',
                'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/20',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                isActive
                  ? 'border-primary bg-primary text-primary-foreground shadow-md scale-105'
                  : `border-muted ${category.color}`,
                'transform hover:scale-102',
              )}
              title={category.description}
            >
              {/* Ícone */}
              <div
                className={cn(
                  'flex items-center justify-center',
                  isActive && 'text-primary-foreground',
                )}
              >
                {category.icon}
              </div>

              {/* Label */}
              <span className="font-medium text-sm">{category.label}</span>

              {/* Count badge */}
              {count > 0 && (
                <Badge
                  variant={isActive ? 'secondary' : 'outline'}
                  className={cn(
                    'ml-1 px-2 py-0.5 text-xs font-semibold',
                    isActive
                      ? 'bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30'
                      : 'bg-background/80',
                  )}
                >
                  {count}
                </Badge>
              )}
            </button>
          )
        })}
      </div>

      {/* Indicador da categoria ativa */}
      {activeCategory !== 'all' && (
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-dashed">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Filtrando por:</span>
            <Badge variant="secondary" className="flex items-center gap-1">
              {categories.find((c) => c.id === activeCategory)?.icon}
              {categories.find((c) => c.id === activeCategory)?.label}
            </Badge>
            <span className="text-muted-foreground">
              ({categoryCounts[activeCategory] || 0} notícias)
            </span>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            Carregando categorias...
          </div>
        </div>
      )}
    </div>
  )
}
