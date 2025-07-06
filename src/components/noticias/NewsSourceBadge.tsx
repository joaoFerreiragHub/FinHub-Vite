import React from 'react'
import { Badge } from '../ui/badge'
import { getSourceInfo } from '../../utils/sourceUtils'

interface NewsSourceBadgeProps {
  source: string
  className?: string
  showIcon?: boolean
  variant?: 'default' | 'outline' | 'compact'
  size?: 'sm' | 'md' | 'lg'
}

export const NewsSourceBadge: React.FC<NewsSourceBadgeProps> = ({
  source,
  className = '',
  showIcon = true,
  variant = 'default',
  size = 'md',
}) => {
  // ✅ Usar utility function importada
  const config = getSourceInfo(source)

  // Tamanhos diferentes
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1.5',
  }

  // Variante compacta (só ícone + texto simples)
  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-1 ${sizeClasses[size]} ${className}`}>
        {showIcon && (
          <span className={size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'}>
            {config.icon}
          </span>
        )}
        <span
          className={`font-medium text-muted-foreground ${size === 'sm' ? 'text-xs' : 'text-sm'}`}
        >
          {config.label}
        </span>
      </div>
    )
  }

  // Variante outline
  if (variant === 'outline') {
    return (
      <Badge
        variant="outline"
        className={`${config.color} border ${sizeClasses[size]} font-medium ${className}`}
        title={config.description}
      >
        {showIcon && <span className="mr-1">{config.icon}</span>}
        {config.label}
      </Badge>
    )
  }

  // Variante padrão (com background colorido)
  return (
    <div
      className={`
        inline-flex items-center gap-1 rounded-full border font-medium
        ${config.color} ${sizeClasses[size]} ${className}
        hover:shadow-sm transition-shadow duration-200
      `}
      title={config.description}
    >
      {showIcon && (
        <span className={size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'}>
          {config.icon}
        </span>
      )}
      <span>{config.label}</span>
    </div>
  )
}

// ✅ Componente auxiliar para mostrar múltiplas fontes
interface NewsSourcesListProps {
  sources: string[]
  maxDisplay?: number
  className?: string
  variant?: 'default' | 'outline' | 'compact'
  size?: 'sm' | 'md' | 'lg'
}

export const NewsSourcesList: React.FC<NewsSourcesListProps> = ({
  sources,
  maxDisplay = 2,
  className = '',
  variant = 'compact',
  size = 'sm',
}) => {
  const displaySources = sources.slice(0, maxDisplay)
  const remainingCount = sources.length - maxDisplay

  return (
    <div className={`flex items-center gap-1 flex-wrap ${className}`}>
      {displaySources.map((source, index) => (
        <NewsSourceBadge key={index} source={source} variant={variant} size={size} />
      ))}
      {remainingCount > 0 && (
        <Badge variant="outline" className="text-xs">
          +{remainingCount}
        </Badge>
      )}
    </div>
  )
}

// ✅ Componente especializado para Yahoo Finance
interface YahooFinanceBadgeProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showDescription?: boolean
}

export const YahooFinanceBadge: React.FC<YahooFinanceBadgeProps> = ({
  className = '',
  size = 'md',
  showDescription = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <NewsSourceBadge source="yahoo" size={size} variant="default" />
      {showDescription && (
        <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
          Gratuito & Confiável
        </span>
      )}
    </div>
  )
}
