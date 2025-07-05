// components/noticias/NewsHeader.tsx

import React from 'react'
import { Calendar, RefreshCcw, Settings, AlertTriangle, CheckCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

interface NewsHeaderProps {
  lastUpdate?: Date | null | undefined
  onRefresh?: () => void
  onSettings?: () => void
  isLoading?: boolean
  isDataFresh?: boolean
  totalNews?: number // ✅ Adicionado
  filteredNews?: number // ✅ Adicionado
}

export const NewsHeader: React.FC<NewsHeaderProps> = ({
  lastUpdate,
  onRefresh,
  onSettings,
  isLoading = false,
  isDataFresh = true,
  totalNews = 0, // ✅ Adicionado
  filteredNews = 0, // ✅ Adicionado
}) => {
  const formatLastUpdate = (date: Date | null | undefined) => {
    if (!date) return 'Nunca atualizado'

    try {
      const now = new Date()
      const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

      if (diffMinutes < 1) return 'Atualizado agora mesmo'
      if (diffMinutes === 1) return 'Atualizado há 1 minuto'
      if (diffMinutes < 60) return `Atualizado há ${diffMinutes} minutos`

      const diffHours = Math.floor(diffMinutes / 60)
      if (diffHours === 1) return 'Atualizado há 1 hora'
      if (diffHours < 24) return `Atualizado há ${diffHours} horas`

      return `Atualizado em ${date.toLocaleDateString('pt-PT')}`
    } catch {
      return 'Data inválida'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Título e informações */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">📰 Notícias Financeiras</h1>

            {/* Status badge */}
            <Badge
              variant={isDataFresh ? 'default' : 'secondary'}
              className="flex items-center gap-1"
            >
              {isDataFresh ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <AlertTriangle className="w-3 h-3" />
              )}
              {isDataFresh ? 'Atualizado' : 'Desatualizado'}
            </Badge>

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RefreshCcw className="w-4 h-4 animate-spin" />
                <span>Atualizando...</span>
              </div>
            )}
          </div>

          {/* Descrição e metadados */}
          <div className="space-y-1">
            <p className="text-muted-foreground">
              Mantém-te atualizado com as últimas notícias dos mercados financeiros
            </p>

            {/* Contadores de notícias */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>
                {totalNews > 0 ? `${totalNews.toLocaleString()} notícias` : 'Sem notícias'}
              </span>

              {filteredNews !== totalNews && totalNews > 0 && (
                <span>• {filteredNews.toLocaleString()} filtradas</span>
              )}

              <span>• {formatLastUpdate(lastUpdate)}</span>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-3">
          {/* Info de última atualização (desktop) */}
          <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className={!isDataFresh ? 'text-orange-600' : ''}>
              {formatLastUpdate(lastUpdate)}
            </span>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-2">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">
                  {isLoading ? 'Atualizando...' : 'Atualizar'}
                </span>
              </Button>
            )}

            {onSettings && (
              <Button
                variant="outline"
                size="sm"
                onClick={onSettings}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Configurações</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
