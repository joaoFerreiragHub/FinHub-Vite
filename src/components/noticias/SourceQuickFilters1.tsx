import React from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

interface SourceQuickFiltersProps {
  activeSource?: string
  onSourceChange: (source: string) => void
  isLoading?: boolean
}

const sources = [
  { id: 'all', name: 'Todas', icon: '🌐' },
  { id: 'yahoo', name: 'Yahoo Finance', icon: '📈' },
  { id: 'fmp', name: 'FMP', icon: '💼' },
  { id: 'newsapi', name: 'News API', icon: '📰' },
  { id: 'alphavantage', name: 'Alpha Vantage', icon: '📊' },
]

export const SourceQuickFilters: React.FC<SourceQuickFiltersProps> = ({
  activeSource = 'all',
  onSourceChange,
  isLoading = false,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-sm font-medium text-muted-foreground mr-2">Fontes:</span>
      {sources.map((source) => (
        <Button
          key={source.id}
          variant={activeSource === source.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSourceChange(source.id)}
          disabled={isLoading}
          className="h-8"
        >
          <span className="mr-1">{source.icon}</span>
          {source.name}
          {activeSource === source.id && (
            <Badge variant="secondary" className="ml-2 h-4 text-xs">
              Ativo
            </Badge>
          )}
        </Button>
      ))}
    </div>
  )
}
