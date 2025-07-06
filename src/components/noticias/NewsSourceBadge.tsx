import React from 'react'
import { Badge } from '../ui/badge'

interface NewsSourceBadgeProps {
  source: string
  className?: string
  showIcon?: boolean
  variant?: 'default' | 'outline' | 'compact'
  size?: 'sm' | 'md' | 'lg'
}

// ✅ Configuração específica para cada fonte
const sourceConfig = {
  'yahoo finance': {
    label: 'Yahoo Finance',
    icon: '📈',
    color:
      'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-200',
    description: 'Yahoo Finance - Notícias gratuitas e confiáveis',
  },
  yahoo: {
    label: 'Yahoo Finance',
    icon: '📈',
    color:
      'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-200',
    description: 'Yahoo Finance - Notícias gratuitas e confiáveis',
  },
  'financial modeling prep': {
    label: 'FMP',
    icon: '💼',
    color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200',
    description: 'Financial Modeling Prep - API Premium',
  },
  fmp: {
    label: 'FMP',
    icon: '💼',
    color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200',
    description: 'Financial Modeling Prep - API Premium',
  },
  'news api': {
    label: 'News API',
    icon: '📰',
    color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200',
    description: 'News API - Agregador global de notícias',
  },
  newsapi: {
    label: 'News API',
    icon: '📰',
    color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200',
    description: 'News API - Agregador global de notícias',
  },
  'alpha vantage': {
    label: 'Alpha Vantage',
    icon: '📊',
    color:
      'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200',
    description: 'Alpha Vantage - Dados com análise de sentimento',
  },
  alphavantage: {
    label: 'Alpha Vantage',
    icon: '📊',
    color:
      'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200',
    description: 'Alpha Vantage - Dados com análise de sentimento',
  },
  polygon: {
    label: 'Polygon',
    icon: '🔺',
    color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200',
    description: 'Polygon.io - Dados de mercado premium',
  },
  'polygon.io': {
    label: 'Polygon',
    icon: '🔺',
    color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200',
    description: 'Polygon.io - Dados de mercado premium',
  },
  marketaux: {
    label: 'MarketAux',
    icon: '📋',
    color: 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900 dark:text-teal-200',
    description: 'MarketAux - Agregador de notícias financeiras',
  },
  cryptopanic: {
    label: 'CryptoPanic',
    icon: '₿',
    color:
      'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200',
    description: 'CryptoPanic - Notícias de criptomoedas',
  },
  finnhub: {
    label: 'Finnhub',
    icon: '📈',
    color:
      'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900 dark:text-indigo-200',
    description: 'Finnhub - Dados financeiros em tempo real',
  },
}

export const NewsSourceBadge: React.FC<NewsSourceBadgeProps> = ({
  source,
  className = '',
  showIcon = true,
  variant = 'default',
  size = 'md',
}) => {
  // Normalizar nome da fonte para matching
  const sourceLower = source.toLowerCase().trim()

  // Tentar match exato primeiro, depois match parcial
  let config = sourceConfig[sourceLower as keyof typeof sourceConfig]

  // Se não encontrar match exato, tentar match parcial
  if (!config) {
    const partialMatch = Object.keys(sourceConfig).find(
      (key) => key.includes(sourceLower) || sourceLower.includes(key),
    )
    if (partialMatch) {
      config = sourceConfig[partialMatch as keyof typeof sourceConfig]
    }
  }

  // Fallback para fonte desconhecida
  if (!config) {
    config = {
      label: source,
      icon: '📄',
      color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200',
      description: source,
    }
  }

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
