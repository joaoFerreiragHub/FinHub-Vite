// components/noticias/NewsHeader.tsx

import React from 'react'
import { Calendar, RefreshCcw, Settings } from 'lucide-react'
import { Button } from '../ui/button'

interface NewsHeaderProps {
  onRefresh?: () => void
  onSettings?: () => void
  lastUpdate?: Date | null | undefined
}

export const NewsHeader: React.FC<NewsHeaderProps> = ({
  onRefresh,
  onSettings,
  lastUpdate
}) => {
  const formatLastUpdate = (date: Date | null | undefined) => {
    if (!date) return 'Nunca atualizado'

    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffMinutes < 1) return 'Atualizado agora mesmo'
    if (diffMinutes === 1) return 'Atualizado há 1 minuto'
    if (diffMinutes < 60) return `Atualizado há ${diffMinutes} minutos`

    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours === 1) return 'Atualizado há 1 hora'
    if (diffHours < 24) return `Atualizado há ${diffHours} horas`

    return `Atualizado em ${date.toLocaleDateString('pt-PT')}`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">📰 Notícias Financeiras</h1>
          <p className="text-muted-foreground mt-2">
            Mantém-te atualizado com as últimas notícias dos mercados financeiros
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{formatLastUpdate(lastUpdate)}</span>
          </div>

          <div className="flex gap-2">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="flex items-center gap-2"
              >
                <RefreshCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Atualizar</span>
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
